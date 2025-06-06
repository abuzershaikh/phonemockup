
'use client';

import React, { useRef } from 'react';
import type { AppDefinition } from './AndroidMockup'; 
import Image from 'next/image'; // Import next/image for optimized images

interface AppIconProps {
  app: AppDefinition;
  onClick: (appId: AppDefinition['id']) => void;
  onLongPress?: (appId: AppDefinition['id']) => void;
}

export function AppIcon({ app, onClick, onLongPress }: AppIconProps) {
  const IconComponent = app.icon;
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const isLongPressed = useRef(false);

  const handlePressStart = () => {
    isLongPressed.current = false;
    if (onLongPress) {
      longPressTimeout.current = setTimeout(() => {
        onLongPress(app.id);
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
  };

  const handleMouseLeave = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    isLongPressed.current = false; 
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
            width={48} // Match div size
            height={48} // Match div size
            className="object-cover w-full h-full" // Ensure it fills the circle
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
