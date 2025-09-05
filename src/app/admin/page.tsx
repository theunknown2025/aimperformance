'use client';

import { useState, useEffect } from 'react';
import { SavedRegistration } from '../../lib/registrationService';

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<SavedRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [validatingId, setValidatingId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchRegistrations();
    }
  }, [mounted]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching registrations...');
      
      // Add a small delay to ensure the component is fully mounted
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await fetch('/api/registrations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setRegistrations(data.registrations);
      } else {
        throw new Error(data.error || 'Erreur lors du chargement');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setError('Erreur de connexion au serveur. Vérifiez que le serveur est en cours d\'exécution.');
      } else {
        setError(error instanceof Error ? error.message : 'Erreur lors du chargement');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (registrationId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir valider cette inscription ? Un email sera envoyé à l\'utilisateur.')) {
      return;
    }

    try {
      setValidatingId(registrationId);
      
      const response = await fetch('/api/validate-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registrationId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la validation');
      }

      // Refresh the registrations list
      await fetchRegistrations();
      
      if (data.registration && data.registration.userPassword) {
        console.log('=== GENERATED PASSWORD ===');
        console.log('Email:', data.registration.email);
        console.log('Password:', data.registration.userPassword);
        console.log('==========================');
      }
      
      alert(`Inscription validée avec succès ! ${data.emailSent ? 'Email envoyé.' : 'Erreur lors de l\'envoi de l\'email.'}`);
      
    } catch (error) {
      console.error('Validation error:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la validation');
    } finally {
      setValidatingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des inscriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchRegistrations}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des Inscriptions
            </h1>
            <p className="text-gray-600 mt-1">
              {registrations.length} inscription(s) au total
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Représentant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Événement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activités
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {registration.companyName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {registration.companySize}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {registration.representativeName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {registration.position}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {registration.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {registration.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {registration.selectedEvent}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {registration.activities.map((activity) => (
                          <span
                            key={activity.id}
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                          >
                            {activity.label}
                          </span>
                        ))}
                      </div>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       {formatDate(registration.createdAt.toString())}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       {registration.isValidated ? (
                         <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                           Validée
                         </span>
                       ) : (
                         <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                           En attente
                         </span>
                       )}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                       {!registration.isValidated && (
                         <button
                           onClick={() => handleValidate(registration.id)}
                           disabled={validatingId === registration.id}
                           className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50"
                         >
                           {validatingId === registration.id ? 'Validation...' : 'Valider'}
                         </button>
                       )}
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {registrations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune inscription trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
