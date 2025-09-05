'use client';

import React from 'react';

export default function AdminMurPage() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion du Mur
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez le contenu et les publications du mur des utilisateurs
            </p>
          </div>
          
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Gestion du Mur
              </h3>
              <p className="text-gray-500">
                Interface de gestion du mur et des publications en cours de développement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
