
'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { AppDefinition, AppId } from './AndroidMockup';
import { Button } from '@/components/ui/button';

interface RecentsScreenProps {
  recentApps: AppDefinition[];
  onAppClick: (appId: AppId) => void;
  onClearApp: (appId: AppId) => void;
  onClearAll: () => void;
}

export function RecentsScreen({ recentApps, onAppClick, onClearApp, onClearAll }: RecentsScreenProps) {
  return (
    <div className={`absolute inset-0 bg-black/50 backdrop-blur-md z-40 flex flex-col p-4 items-center justify-end text-white ${recentApps.length > 0 ? 'animate-recents-show' : 'animate-recents-hide'}`}>
      <div className="w-full max-w-md space-y-3 overflow-y-auto max-h-[70vh] mb-4">
        {recentApps.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No recent apps</p>
        ) : (
          recentApps.map((app) => {
            const AppIconComponent = app.icon;
            return (
              <div
                key={app.id}
                className="bg-neutral-700/80 rounded-lg p-3 flex items-center space-x-3 shadow-lg cursor-pointer transition-all hover:bg-neutral-600/80 active:scale-95"
                onClick={() => onAppClick(app.id)}
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center overflow-hidden ${app.iconUri ? '' : (app.bgColor || 'bg-gray-500')}`}>
                  {app.iconUri ? (
                     <Image 
                        src={app.iconUri} 
                        alt={`${app.name} icon`} 
                        width={40} 
                        height={40} 
                        className="object-cover w-full h-full"
                        data-ai-hint="app icon"
                      />
                  ) : (
                    <AppIconComponent className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{app.name}</p>
                   <div className="w-full h-16 bg-neutral-600 rounded mt-1 flex items-center justify-center text-xs text-neutral-400" data-ai-hint="app preview">
                     App Preview
                   </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearApp(app.id);
                  }}
                  aria-label={`Close ${app.name}`}
                >
                  <X size={18} />
                </Button>
              </div>
            );
          })
        )}
      </div>
      {recentApps.length > 0 && (
        <Button 
          variant="secondary" 
          onClick={onClearAll}
          className="bg-neutral-600 hover:bg-neutral-500 text-white"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
