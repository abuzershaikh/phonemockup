
'use client';

import React, { useRef } from 'react';
import type { AppDefinition, AppId } from './AndroidMockup';
import Image from 'next/image';

interface AppIconProps {
  app: AppDefinition;
  onClick: (appId: AppId) => void;
  onLongPress?: (appId: AppId, targetRect: DOMRect) => void;
}

export function AppIcon({ app, onClick, onLongPress }: AppIconProps) {
  const IconComponent = app.icon;
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const isLongPressed = useRef(false);

  const handlePressStart = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    isLongPressed.current = false;
    const targetHtmlElement = event.currentTarget; // Capture target element synchronously

    if (onLongPress) {
      // Clear any existing timeout
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
      }

      longPressTimeout.current = setTimeout(() => {
        longPressTimeout.current = null; // Clear the timeout ID once it has run

        // Ensure the element is still valid and mounted before proceeding
        if (targetHtmlElement && document.body.contains(targetHtmlElement)) {
          const rect = targetHtmlElement.getBoundingClientRect();
          onLongPress(app.id, rect); // Pass the rect object
          isLongPressed.current = true; // Mark as long pressed
        } else {
          // If element is gone, still mark as long pressed to prevent click,
          // but don't try to open context menu.
          isLongPressed.current = true;
          console.warn('Long press target element was not in document when timeout fired.');
        }
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
    // isLongPressed.current will be reset by the next handlePressStart
  };

  const handleMouseLeave = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    // If mouse leaves, the long press is cancelled.
    // isLongPressed.current remains false (or its current state) until next press.
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
