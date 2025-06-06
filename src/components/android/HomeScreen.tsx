'use client';

import React from 'react';
import { AppIcon } from './AppIcon';
import type { AppDefinition, AppId } from './AndroidMockup';

interface HomeScreenProps {
  apps: AppDefinition[];
  onAppClick: (appId: AppId) => void;
}

export function HomeScreen({ apps, onAppClick }: HomeScreenProps) {
  // Example: Define which apps are in the dock
  const dockAppIds: AppId[] = ['PHONE', 'MESSAGES', 'CHROME', 'CAMERA'];
  const dockApps = apps.filter(app => dockAppIds.includes(app.id));
  const homeScreenApps = apps.filter(app => !dockAppIds.includes(app.id));


  return (
    <div className="h-full flex flex-col bg-android-background p-4 overflow-y-auto">
      {/* Google Search Bar Placeholder */}
      <div className="mb-6 mt-2">
        <div className="bg-white/80 dark:bg-neutral-700/80 rounded-full h-12 flex items-center px-4 shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-500 dark:text-gray-400 text-sm">Search...</span>
        </div>
      </div>

      {/* Date and Weather Placeholder */}
      <div className="mb-8 text-center">
        <p className="text-5xl font-light text-android-primary-text">10:35</p>
        <p className="text-sm text-android-secondary-text">Tue, Jul 23 • Sunny, 28°C</p>
      </div>
      
      <div className="grid grid-cols-4 gap-x-4 gap-y-6 flex-grow content-start">
        {homeScreenApps.map((app) => (
          <AppIcon key={app.id} app={app} onClick={onAppClick} />
        ))}
      </div>

      {/* Dock */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/50">
        <div className="grid grid-cols-4 gap-x-2">
          {dockApps.map((app) => (
            <AppIcon key={app.id} app={app} onClick={onAppClick} />
          ))}
        </div>
      </div>
    </div>
  );
}
