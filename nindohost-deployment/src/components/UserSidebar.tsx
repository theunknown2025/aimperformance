'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaComments, 
  FaNewspaper, 
  FaCalendarAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';

interface UserSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onToggle }) => {
  const router = useRouter();
  const pathname = usePathname();

  console.log('UserSidebar rendered:', { isOpen, pathname });

  const menuItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: FaUser,
      path: '/users/profile'
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: FaComments,
      path: '/users/chat'
    },
    {
      id: 'mur',
      label: 'Forum',
      icon: FaNewspaper,
      path: '/users/mur'
    },
    {
      id: 'programme',
      label: 'Programme',
      icon: FaCalendarAlt,
      path: '/users/programme'
    }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:z-auto md:shadow-none md:flex-shrink-0 md:transform-none`}
        style={{ minWidth: '320px' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaUser className="text-xl" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Espace Utilisateur</h2>
                <p className="text-sm opacity-90">Rencontres EXPORT</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="md:hidden text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                }`}
              >
                <Icon className={`text-lg ${active ? 'text-white' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-2 w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>


      </motion.div>
    </>
  );
};

export default UserSidebar;
