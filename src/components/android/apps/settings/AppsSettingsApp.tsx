
'use client';

import React from 'react';
import { AppScreen } from '../../AppScreen';
import type { AppId, AppDefinition } from '../../AndroidMockup';
import { getAppDefinition } from '../../AndroidMockup'; // Helper to get app details
import { ChevronRight, AppWindow } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface AppsSettingsAppProps {
  onNavigate: (appId: AppId) => void;
  appDefinitions: AppDefinition[]; // Pass all app definitions
}

// Define which apps are considered "system" or primary apps for listing
const listedAppIds: AppId[] = [
  'PHONE', 
  'MESSAGES', 
  'CHROME', 
  'CAMERA', 
  'SETTINGS', 
  'PHOTOS', 
  'PLAY_STORE'
];

// Helper function to generate the App Info AppId
const getAppInfoScreenId = (appId: AppId): AppId | null => {
  const baseId = appId.replace('SETTINGS_', ''); // Remove SETTINGS_ prefix if any
  // Ensure we only try to create AppInfo for known apps
  if (listedAppIds.includes(appId as AppId) || listedAppIds.some(id => id.endsWith(baseId))) {
    return `SETTINGS_APP_INFO_${baseId.toUpperCase()}` as AppId;
  }
  return null;
};


export function AppsSettingsApp({ onNavigate, appDefinitions }: AppsSettingsAppProps) {
  const appsToList = listedAppIds
    .map(id => appDefinitions.find(appDef => appDef.id === id))
    .filter(Boolean) as AppDefinition[];

  return (
    <AppScreen appName="Apps">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
            <Button variant="outline" className="w-full justify-start text-base" onClick={() => console.log("See all apps clicked")}>
                See all {appDefinitions.filter(app => app.bgColor).length} apps 
                {/* Assuming apps with bgColor are user-facing apps */}
            </Button>
        </div>
        
        <div className="p-4">
            <h2 className="text-sm font-medium text-primary mb-2">DEFAULT APPS</h2>
            {/* Placeholder for default apps, could be a component later */}
            <div className="space-y-1">
                <DefaultAppItem title="Home app" currentApp="Pixel Launcher" onClick={() => console.log("Change Home app")} />
                <DefaultAppItem title="Browser app" currentApp="Chrome" onClick={() => console.log("Change Browser app")} />
                <DefaultAppItem title="Phone app" currentApp="Phone" onClick={() => console.log("Change Phone app")} />
            </div>
        </div>

        <Separator />

        <div className="p-4">
            <h2 className="text-sm font-medium text-primary mb-2">APP LIST</h2>
        </div>
        <ScrollArea className="flex-grow">
          <div className="space-y-0 px-1 pb-4">
            {appsToList.map((app, index) => {
              const AppIconComponent = app.icon;
              const appInfoScreenId = getAppInfoScreenId(app.id);

              return (
                <React.Fragment key={app.id}>
                  <button
                    className="w-full flex items-center space-x-4 p-3 hover:bg-gray-100 dark:hover:bg-neutral-700/50 rounded-lg transition-colors text-left focus:outline-none focus:ring-2 focus:ring-accent"
                    onClick={() => appInfoScreenId && onNavigate(appInfoScreenId)}
                    disabled={!appInfoScreenId}
                    aria-label={`App info for ${app.name}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${app.bgColor || 'bg-gray-200'} flex-shrink-0`}>
                      <AppIconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <p className="font-medium text-android-primary-text truncate">{app.name}</p>
                      <p className="text-xs text-android-secondary-text truncate">Version 1.0, 50 MB</p> 
                    </div>
                    {appInfoScreenId && <ChevronRight className="w-5 h-5 text-android-secondary-text flex-shrink-0" />}
                  </button>
                  {index < appsToList.length -1 && <Separator className="my-0 mx-3" />}
                </React.Fragment>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </AppScreen>
  );
}


interface DefaultAppItemProps {
    title: string;
    currentApp: string;
    onClick: () => void;
}

const DefaultAppItem: React.FC<DefaultAppItemProps> = ({ title, currentApp, onClick }) => (
    <button 
        onClick={onClick}
        className="w-full flex justify-between items-center py-2 px-1 text-left hover:bg-gray-100 dark:hover:bg-neutral-700/50 rounded-md"
    >
        <div>
            <p className="text-sm text-android-primary-text">{title}</p>
            <p className="text-xs text-android-secondary-text">{currentApp}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-android-secondary-text" />
    </button>
);
