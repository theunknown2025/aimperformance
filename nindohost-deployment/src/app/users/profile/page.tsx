'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaBuilding, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes
} from 'react-icons/fa';

interface UserData {
  id: number;
  companyName: string;
  companySize: string;
  address: string;
  representativeName: string;
  position: string;
  email: string;
  phone: string;
  selectedEvent: string;
  additionalInfo: string;
  isValidated: boolean;
  validatedAt: string | null;
  userPassword: string | null;
  createdAt: string;
  activities: Array<{ id: string; label: string; category: string }>;
}

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
      setEditedData(parsedData);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (editedData) {
      setUserData(editedData);
      sessionStorage.setItem('userData', JSON.stringify(editedData));
      setIsEditing(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        [field]: value
      });
    }
  };

  const getEventDetails = (eventId: string) => {
    const events = {
      casablanca: { name: 'Casablanca', date: '15 Septembre 2025', location: 'Casablanca, Maroc' },
      tanger: { name: 'Tanger', date: '22 Septembre 2025', location: 'Tanger, Maroc' },
      fes: { name: 'Fes', date: '29 Septembre 2025', location: 'Fes, Maroc' }
    };
    return events[eventId as keyof typeof events] || events.casablanca;
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  const eventDetails = getEventDetails(userData.selectedEvent);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
                <p className="text-gray-600">Gérez vos informations personnelles</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaEdit />
                  <span>Modifier</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <FaSave />
                    <span>Enregistrer</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <FaTimes />
                    <span>Annuler</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <FaUser className="text-green-500" />
                <span>Informations Personnelles</span>
              </h2>

              <div className="space-y-6">
                {/* Representative Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du représentant
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData?.representativeName || ''}
                      onChange={(e) => handleInputChange('representativeName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{userData.representativeName}</p>
                  )}
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData?.position || ''}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{userData.position}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    <FaEnvelope className="text-green-500" />
                    <span>Email</span>
                  </label>
                  <p className="text-gray-900 font-medium">{userData.email}</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    <FaPhone className="text-green-500" />
                    <span>Téléphone</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData?.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{userData.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-green-500" />
                    <span>Adresse</span>
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedData?.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{userData.address}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Company & Event Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Company Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FaBuilding className="text-green-500" />
                <span>Entreprise</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'entreprise
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData?.companyName || ''}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-sm">{userData.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taille de l'entreprise
                  </label>
                  {isEditing ? (
                    <select
                      value={editedData?.companySize || ''}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="1-10">1-10 employés</option>
                      <option value="11-50">11-50 employés</option>
                      <option value="51-200">51-200 employés</option>
                      <option value="201-500">201-500 employés</option>
                      <option value="500+">500+ employés</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium text-sm">{userData.companySize}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Event Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FaCalendarAlt className="text-green-500" />
                <span>Événement</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Événement sélectionné
                  </label>
                  <p className="text-green-600 font-semibold text-sm">{eventDetails.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <p className="text-gray-900 text-sm">{eventDetails.date}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lieu
                  </label>
                  <p className="text-gray-900 text-sm">{eventDetails.location}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    userData.isValidated 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {userData.isValidated ? 'Validée' : 'En attente'}
                  </span>
                </div>
              </div>
            </div>

            {/* Activities */}
            {userData.activities && userData.activities.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Activités sélectionnées
                </h3>
                <div className="space-y-2">
                  {userData.activities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{activity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
