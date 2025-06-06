
'use client';

import React, { useState, useRef } from 'react';
import { AppIcon } from './AppIcon';
import type { AppDefinition, AppId } from './AndroidMockup';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Info, Trash2, Share2, Pencil } from 'lucide-react';

interface HomeScreenProps {
  apps: AppDefinition[];
  onAppClick: (appId: AppId) => void;
}

const DOCK_APP_IDS: AppId[] = ['PHONE', 'MESSAGES', 'CHROME', 'CAMERA'];

interface ContextMenuItemProps {
  icon: React.ElementType;
  text: string;
  onClick: () => void;
  className?: string;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ icon: Icon, text, onClick, className }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 py-2.5 px-3 hover:bg-muted rounded-lg text-left text-sm text-popover-foreground",
      className
    )}
  >
    <Icon className="w-5 h-5 text-muted-foreground" />
    <span>{text}</span>
  </button>
);

export function HomeScreen({ apps, onAppClick }: HomeScreenProps) {
  const dockApps = apps.filter(app => DOCK_APP_IDS.includes(app.id));
  const homeScreenApps = apps.filter(app => 
    !DOCK_APP_IDS.includes(app.id) && 
    !app.id.startsWith('SETTINGS_')
  );

  const [longPressedApp, setLongPressedApp] = useState<AppDefinition | null>(null);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const popoverTriggerRef = useRef<HTMLDivElement>(null);

  const handleAppLongPress = (appId: AppId, event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    const app = apps.find(a => a.id === appId);
    if (app && popoverTriggerRef.current) {
      const targetElement = event.currentTarget as HTMLElement;
      const rect = targetElement.getBoundingClientRect();
      
      // Position the invisible trigger. PopoverContent will anchor relative to this.
      // Adjustments might be needed based on Popover's default positioning behavior.
      // For instance, if PopoverContent opens 'bottom', trigger top should be icon's bottom.
      // This places trigger at the center of the icon for `side="bottom", align="center"`
      popoverTriggerRef.current.style.top = `${rect.top + rect.height / 2}px`;
      popoverTriggerRef.current.style.left = `${rect.left + rect.width / 2}px`;
      popoverTriggerRef.current.style.width = `0px`;
      popoverTriggerRef.current.style.height = `0px`;
      
      setLongPressedApp(app);
      setIsContextMenuOpen(true);
    }
  };

  const handleNavigateToAppInfo = () => {
    if (!longPressedApp) return;
    const appInfoScreenId = `SETTINGS_APP_INFO_${longPressedApp.id.toUpperCase()}`;
    onAppClick(appInfoScreenId);
    closeContextMenu();
  };

  const closeContextMenu = () => {
    setIsContextMenuOpen(false);
    // Delay clearing longPressedApp to allow Popover to fade out if needed
    setTimeout(() => setLongPressedApp(null), 150); 
  };

  return (
    <>
      <div 
        className={`h-full flex flex-col bg-android-background p-4 overflow-y-auto transition-filter duration-150 ${isContextMenuOpen ? 'blur-md' : ''}`}
      >
        {/* Google Search Bar Placeholder */}
        <div className={`mb-6 mt-2 ${isContextMenuOpen ? 'pointer-events-none' : ''}`}>
          <div className="bg-white/80 dark:bg-neutral-700/80 rounded-full h-12 flex items-center px-4 shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-500 dark:text-gray-400 text-sm">Search...</span>
          </div>
        </div>

        {/* Date and Weather Placeholder */}
        <div className={`mb-8 text-center ${isContextMenuOpen ? 'pointer-events-none' : ''}`}>
          <p className="text-5xl font-light text-android-primary-text">10:35</p>
          <p className="text-sm text-android-secondary-text">Tue, Jul 23 • Sunny, 28°C</p>
        </div>
        
        <div className={`grid grid-cols-4 gap-x-4 gap-y-6 flex-grow content-start ${isContextMenuOpen ? 'pointer-events-none' : ''}`}>
          {homeScreenApps.map((app) => (
            <AppIcon key={app.id} app={app} onClick={onAppClick} onLongPress={handleAppLongPress} />
          ))}
        </div>

        {/* Dock */}
        <div className={`mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/50 ${isContextMenuOpen ? 'pointer-events-none' : ''}`}>
          <div className="grid grid-cols-4 gap-x-2">
            {dockApps.map((app) => (
              <AppIcon key={app.id} app={app} onClick={onAppClick} onLongPress={handleAppLongPress} />
            ))}
          </div>
        </div>
      </div>

      {/* Popover for Context Menu. It's outside the blurred div. */}
      <Popover open={isContextMenuOpen} onOpenChange={setIsContextMenuOpen}>
        <PopoverTrigger ref={popoverTriggerRef} style={{ position: 'fixed', opacity: 0, pointerEvents: 'none' }} />
        {longPressedApp && (
          <PopoverContent 
            className="w-56 bg-card p-1.5 shadow-xl rounded-2xl border"
            side="top"
            align="center"
            sideOffset={10}
            onOpenAutoFocus={(e) => e.preventDefault()} // Prevents focus stealing, allows outside clicks
            onInteractOutside={closeContextMenu} // Handles clicks outside the popover
          >
            <ContextMenuItem icon={Info} text="App info" onClick={handleNavigateToAppInfo} />
            <ContextMenuItem icon={Trash2} text="Uninstall" onClick={() => { console.log('Uninstall:', longPressedApp.name); closeContextMenu(); }} />
            <ContextMenuItem icon={Share2} text="Share" onClick={() => { console.log('Share:', longPressedApp.name); closeContextMenu(); }} />
            <ContextMenuItem icon={Pencil} text="Edit" onClick={() => { console.log('Edit:', longPressedApp.name); closeContextMenu(); }} />
          </PopoverContent>
        )}
      </Popover>
    </>
  );
}

// Helper cn function if not already globally available in this file context (it usually is via imports)
// import { type ClassValue, clsx } from "clsx"
// import { twMerge } from "tailwind-merge"
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
