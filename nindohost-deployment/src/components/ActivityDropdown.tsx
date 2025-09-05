'use client';

import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaSearch, FaTimes } from 'react-icons/fa';
import { ActivityOption, activityOptions, activityCategories } from '../data/activityOptions';

interface ActivityDropdownProps {
  selectedActivities: ActivityOption[];
  onActivitiesChange: (activities: ActivityOption[]) => void;
  placeholder?: string;
  maxSelections?: number;
}

const ActivityDropdown = ({ 
  selectedActivities, 
  onActivitiesChange, 
  placeholder = "Sélectionner les activités...",
  maxSelections = 3 
}: ActivityDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter activities based on search term
  const filteredActivities = activityOptions.filter(activity =>
    activity.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group activities by category
  const groupedActivities = activityCategories.reduce((acc, category) => {
    const categoryActivities = filteredActivities.filter(activity => activity.category === category);
    if (categoryActivities.length > 0) {
      acc[category] = categoryActivities;
    }
    return acc;
  }, {} as Record<string, ActivityOption[]>);

  const handleActivityToggle = (activity: ActivityOption) => {
    const isSelected = selectedActivities.some(selected => selected.id === activity.id);
    
    if (isSelected) {
      // Remove activity
      onActivitiesChange(selectedActivities.filter(selected => selected.id !== activity.id));
    } else {
      // Add activity (if under max limit)
      if (selectedActivities.length < maxSelections) {
        onActivitiesChange([...selectedActivities, activity]);
      }
    }
  };

  const removeActivity = (activityId: string) => {
    onActivitiesChange(selectedActivities.filter(activity => activity.id !== activityId));
  };

  const isActivitySelected = (activityId: string) => {
    return selectedActivities.some(activity => activity.id === activityId);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected activities display */}
      <div 
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1 min-h-[20px]">
            {selectedActivities.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              selectedActivities.map(activity => (
                <span
                  key={activity.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                >
                  {activity.label}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeActivity(activity.id);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes size={12} />
                  </button>
                </span>
              ))
            )}
          </div>
          <FaChevronDown 
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
          {/* Search bar */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une activité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Activities list */}
          <div className="max-h-60 overflow-y-auto">
            {Object.entries(groupedActivities).map(([category, activities]) => (
              <div key={category}>
                <div className="px-3 py-2 bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-200">
                  {category}
                </div>
                {activities.map(activity => (
                  <div
                    key={activity.id}
                    className={`px-3 py-2 hover:bg-gray-50 cursor-pointer ${
                      isActivitySelected(activity.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleActivityToggle(activity)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isActivitySelected(activity.id)}
                        onChange={() => handleActivityToggle(activity)}
                        className="mr-3"
                        disabled={!isActivitySelected(activity.id) && selectedActivities.length >= maxSelections}
                      />
                      <span className={`text-sm ${
                        !isActivitySelected(activity.id) && selectedActivities.length >= maxSelections 
                          ? 'text-gray-400' 
                          : 'text-gray-700'
                      }`}>
                        {activity.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Selection limit info */}
          {selectedActivities.length >= maxSelections && (
            <div className="px-3 py-2 bg-yellow-50 border-t border-gray-200">
              <p className="text-xs text-yellow-700">
                Maximum {maxSelections} sélection(s) autorisée(s)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityDropdown;
