
'use client';

import React from 'react';
import { AppScreen } from '../../AppScreen';
import type { AppId, AppDefinition } from '../../AndroidMockup'; // AppId is now string
import { ChevronRight, AppWindow } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface AppsSettingsAppProps {
  onNavigate: (appId: AppId) => void; // AppId is now string
  appDefinitions: AppDefinition[]; 
}

// System apps typically listed or having special App Info pages
const systemAppIdsForInfo: AppId[] = [
  'PHONE', 
  'MESSAGES', 
  'CHROME', 
  'CAMERA', 
  'SETTINGS', 
  'PHOTOS', 
  'PLAY_STORE',
  'MAPS',
  'YOUTUBE',
  'DRIVE',
  'GMAIL',
  'CALENDAR',
  'CLOCK',
  'CONTACTS',
  'CALCULATOR',
  'FILES',
  'KEEP_NOTES',
  'WEATHER',
  'PODCASTS',
  'GOOGLE_HOME',
  'MEET',
  'PRELOADED_NOTES',
  'PRELOADED_TRAVEL'
];

const getAppInfoScreenId = (appId: AppId): AppId | null => {
  // For system apps and user-added apps (which start with USER_APP_)
  if (systemAppIdsForInfo.includes(appId.toUpperCase()) || appId.startsWith('USER_APP_')) {
    return `SETTINGS_APP_INFO_${appId.toUpperCase()}`;
  }
  return null;
};

export function AppsSettingsApp({ onNavigate, appDefinitions }: AppsSettingsAppProps) {
  // List all apps that are not internal settings screens themselves
  const appsToList = appDefinitions.filter(
    appDef => !appDef.id.startsWith('SETTINGS_') || systemAppIdsForInfo.includes(appDef.id.toUpperCase()) || appDef.id.startsWith('USER_APP_')
  ).sort((a,b) => a.name.localeCompare(b.name)); // Sort alphabetically

  const userVisibleAppCount = appsToList.length;

  return (
    <AppScreen appName="Apps">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
            <Button variant="outline" className="w-full justify-start text-base" onClick={() => console.log("See all apps clicked")}>
                See all {userVisibleAppCount} apps 
            </Button>
        </div>
        
        <div className="p-4">
            <h2 className="text-sm font-medium text-primary mb-2">DEFAULT APPS</h2>
            <div className="space-y-1">
                <DefaultAppItem title="Home app" currentApp="Pixel Launcher" onClick={() => console.log("Change Home app")} />
                <DefaultAppItem title="Browser app" currentApp="Chrome" onClick={() => console.log("Change Browser app")} />
                <DefaultAppItem title="Phone app" currentApp="Phone" onClick={() => console.log("Change Phone app")} />
            </div>
        </div>

        <Separator />

        <div className="p-4">
            <h2 className="text-sm font-medium text-primary mb-2">APP LIST ({appsToList.length})</h2>
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${app.iconUri ? '' : (app.bgColor || 'bg-gray-200')} flex-shrink-0`}>
                      {app.iconUri ? (
                        <Image 
                            src={app.iconUri} 
                            alt={`${app.name} icon`} 
                            width={32} 
                            height={32} 
                            className="object-cover w-full h-full"
                            data-ai-hint="app icon"
                        />
                      ) : (
                        <AppIconComponent className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <p className="font-medium text-android-primary-text truncate">{app.name}</p>
                      {/* Simplified description */}
                      <p className="text-xs text-android-secondary-text truncate">App details</p> 
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

