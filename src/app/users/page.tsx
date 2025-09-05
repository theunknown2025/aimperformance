'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaBuilding, 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaFileAlt,
  FaDownload
} from 'react-icons/fa';

interface User {
  id: number;
  companyName: string;
  representativeName: string;
  email: string;
  selectedEvent: string;
  activities: Array<{
    id: string;
    label: string;
    category: string;
  }>;
}

export default function UserSpace() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = sessionStorage.getItem('userData');
    console.log('Users page - userData from sessionStorage:', userData);
    
    if (!userData) {
      console.log('No user data found, redirecting to login');
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      console.log('User data parsed successfully:', user);
      setUser(user);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const getEventDetails = (eventId: string) => {
    const events = {
      casablanca: {
        name: 'Casablanca',
        date: '15 Septembre 2025',
        location: 'Casablanca, Maroc',
        documents: ['doc1.pdf', 'doc2.pdf', 'doc3.pdf']
      },
      tanger: {
        name: 'Tanger',
        date: '22 Septembre 2025',
        location: 'Tanger, Maroc',
        documents: ['doc1.pdf', 'doc2.pdf', 'doc3.pdf']
      },
      fes: {
        name: 'Fes',
        date: '29 Septembre 2025',
        location: 'Fes, Maroc',
        documents: ['doc1.pdf', 'doc2.pdf', 'doc3.pdf']
      }
    };
    
    return events[eventId as keyof typeof events] || events.casablanca;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  const eventDetails = getEventDetails(user.selectedEvent);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
          <p className="text-gray-600">Bienvenue dans votre espace personnel</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Informations de votre inscription
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <FaBuilding className="text-green-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Entreprise</p>
                    <p className="text-gray-900">{user.companyName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaUser className="text-green-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Représentant</p>
                    <p className="text-gray-900">{user.representativeName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaEnvelope className="text-green-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaCalendarAlt className="text-green-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Événement</p>
                    <p className="text-gray-900">{eventDetails.name} - {eventDetails.date}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-green-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lieu</p>
                    <p className="text-gray-900">{eventDetails.location}</p>
                  </div>
                </div>
              </div>
              
              {/* Activities */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Activités sélectionnées</h3>
                <div className="flex flex-wrap gap-2">
                  {user.activities.map((activity) => (
                    <span
                      key={activity.id}
                      className="inline-flex px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full"
                    >
                      {activity.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Documents */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Documents de l'événement
              </h2>
              
              <div className="space-y-4">
                {eventDetails.documents.map((doc: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <FaFileAlt className="text-gray-400 mr-3" />
                      <span className="text-gray-900">{doc}</span>
                    </div>
                    <a
                      href={`/docs/${doc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-800"
                    >
                      <FaDownload className="mr-1" />
                      Télécharger
                    </a>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="text-sm font-medium text-green-900 mb-2">
                  📋 Instructions importantes
                </h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Consultez tous les documents avant l'événement</li>
                  <li>• Apportez une pièce d'identité le jour de l'événement</li>
                  <li>• Arrivez 30 minutes avant le début de l'événement</li>
                  <li>• Contactez-nous en cas de question</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
