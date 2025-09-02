'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  const [formData, setFormData] = useState({
    companyName: '',
    sector: '',
    companySize: '',
    address: '',
    representativeName: '',
    position: '',
    email: '',
    phone: '',
    selectedEvent: '',
    additionalInfo: '',
    acceptTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto text-gray-900"
      >
        <div className="p-6 text-gray-900">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Inscription à l&apos;Événement</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            Inscrivez votre entreprise aux Rencontres Régionales EXPORT. Remplissez le formulaire ci-dessous pour confirmer votre participation.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
            {/* Company Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Informations de l&apos;Entreprise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l&apos;entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secteur d&apos;activité *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.sector}
                    onChange={(e) => setFormData({...formData, sector: e.target.value})}
                  >
                    <option value="">Sélectionner</option>
                    <option value="textile">Textile</option>
                    <option value="habillement">Habillement</option>
                    <option value="cuir">Cuir</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille de l&apos;entreprise *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.companySize}
                    onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                  >
                    <option value="">Sélectionner</option>
                    <option value="micro">Micro (1-9 employés)</option>
                    <option value="petite">Petite (10-49 employés)</option>
                    <option value="moyenne">Moyenne (50-249 employés)</option>
                    <option value="grande">Grande (250+ employés)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Representative Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Informations du Représentant</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.representativeName}
                    onChange={(e) => setFormData({...formData, representativeName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#51b960]"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#51b960]"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Event Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Événement souhaité *
              </label>
              <div className="space-y-2">
                {[
                  { value: 'casablanca', label: 'Casablanca - 15 Septembre 2025' },
                  { value: 'tanger', label: 'Tanger - 22 Septembre 2025' },
                  { value: 'fes', label: 'Fes - 29 Septembre 2025' }
                ].map((event) => (
                  <label key={event.value} className="flex items-center">
                    <input
                      type="radio"
                      name="selectedEvent"
                      value={event.value}
                      checked={formData.selectedEvent === event.value}
                      onChange={(e) => setFormData({...formData, selectedEvent: e.target.value})}
                      className="mr-3"
                    />
                    <span className="text-gray-700">{event.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informations supplémentaires
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#51b960]"
                value={formData.additionalInfo}
                onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                placeholder="Décrivez vos attentes ou questions spécifiques..."
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                required
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                className="mt-1 mr-3"
              />
              <label className="text-sm text-gray-700">
                J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité *
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#51b960] text-white rounded-md hover:bg-[#45a050] font-medium"
              >
                S&apos;inscrire
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationModal;
