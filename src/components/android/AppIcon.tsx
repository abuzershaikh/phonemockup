
'use client';

import React, { useRef } from 'react';
import type { AppDefinition, AppId } from './AndroidMockup'; 
import Image from 'next/image';

interface AppIconProps {
  app: AppDefinition;
  onClick: (appId: AppId) => void;
  onLongPress?: (appId: AppId, event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
}

export function AppIcon({ app, onClick, onLongPress }: AppIconProps) {
  const IconComponent = app.icon;
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const isLongPressed = useRef(false);
  const pressEventRef = useRef<React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement> | null>(null);

  const handlePressStart = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    isLongPressed.current = false;
    pressEventRef.current = event; // Store the event
    if (onLongPress) {
      longPressTimeout.current = setTimeout(() => {
        if (onLongPress && pressEventRef.current) { 
             onLongPress(app.id, pressEventRef.current);
        }
        isLongPressed.current = true;
      }, 500); 
    }
  };

  const handlePressEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    if (!isLongPressed.current) {
      onClick(app.id); 
    }
    pressEventRef.current = null; // Clear the stored event
  };

  const handleMouseLeave = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    isLongPressed.current = false; 
    pressEventRef.current = null; 
  };


  return (
    <button
      onClick={(e) => { 
        if (isLongPressed.current) {
            e.preventDefault(); 
        }
      }}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onMouseLeave={handleMouseLeave} 
      className="flex flex-col items-center justify-center space-y-1 p-2 rounded-lg w-20 h-24 text-center transition-transform active:scale-95 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={`Open ${app.name} app`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ${app.iconUri ? '' : (app.bgColor || 'bg-gray-200')}`}>
        {app.iconUri ? (
          <Image 
            src={app.iconUri} 
            alt={`${app.name} icon`} 
            width={48}
            height={48}
            className="object-cover w-full h-full"
            data-ai-hint="app icon"
          />
        ) : (
          <IconComponent className="w-6 h-6 text-white" />
        )}
      </div>
      <span className="text-xs text-android-primary-text truncate w-full">{app.name}</span>
    </button>
  );
}

