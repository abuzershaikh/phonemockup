
'use client';

import React, { useRef } from 'react';
import type { AppDefinition, AppId } from './AndroidMockup'; // Use AppDefinition from AndroidMockup

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
      }, 500); // 500ms for long press
    }
  };

  const handlePressEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    if (!isLongPressed.current) {
      onClick(app.id); // Existing short click behavior
    }
    // Reset for next interaction
    // isLongPressed.current = false; // This reset is implicitly handled by next pressStart
  };

  const handleMouseLeave = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    isLongPressed.current = false; // Ensure long press is cancelled if mouse leaves
  };


  return (
    <button
      onClick={(e) => { // Modify onClick to only fire if not a long press
        if (isLongPressed.current) {
            e.preventDefault(); // Prevent click if long press occurred
        } else {
            // onClick(app.id); // This is handled by handlePressEnd now
        }
      }}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onMouseLeave={handleMouseLeave} // Cancel long press if mouse leaves button area
      className="flex flex-col items-center justify-center space-y-1 p-2 rounded-lg w-20 h-24 text-center transition-transform active:scale-95 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={`Open ${app.name} app`}
      // onContextMenu={(e) => { // Alternative for desktop testing
      //   e.preventDefault();
      //   if (onLongPress) onLongPress(app.id);
      // }}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${app.bgColor || 'bg-gray-200'}`}>
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      <span className="text-xs text-android-primary-text truncate w-full">{app.name}</span>
    </button>
  );
}

