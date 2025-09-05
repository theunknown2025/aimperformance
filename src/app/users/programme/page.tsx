'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserTie } from 'react-icons/fa';

const ProgrammePage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Programme</h1>
              <p className="text-gray-600">Planning détaillé de l'événement</p>
            </div>
          </div>
        </motion.div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-12 text-center"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCalendarAlt className="text-green-500 text-3xl" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Programme en cours de développement
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Le programme détaillé sera bientôt disponible. Vous pourrez consulter 
            le planning complet de l'événement avec tous les détails.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaClock className="text-blue-500 text-lg" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Planning détaillé</h3>
              <p className="text-sm text-gray-600">Horaires précis de chaque session</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaMapMarkerAlt className="text-purple-500 text-lg" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Localisation</h3>
              <p className="text-sm text-gray-600">Salles et lieux de réunion</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaUserTie className="text-orange-500 text-lg" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Intervenants</h3>
              <p className="text-sm text-gray-600">Présentateurs et modérateurs</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgrammePage;
