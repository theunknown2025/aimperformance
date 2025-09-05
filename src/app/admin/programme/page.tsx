'use client';

import React from 'react';

export default function AdminProgrammePage() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion du Programme
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez les événements et le programme des Rencontres EXPORT
            </p>
          </div>
          
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Gestion du Programme
              </h3>
              <p className="text-gray-500">
                Interface de gestion du programme en cours de développement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
