'use client';

import React from 'react';
import type { AppDefinition } from './AndroidMockup'; // Use AppDefinition from AndroidMockup

interface AppIconProps {
  app: AppDefinition;
  onClick: (appId: AppDefinition['id']) => void;
}

export function AppIcon({ app, onClick }: AppIconProps) {
  const IconComponent = app.icon;
  return (
    <button
      onClick={() => onClick(app.id)}
      className="flex flex-col items-center justify-center space-y-1 p-2 rounded-lg w-20 h-24 text-center transition-transform active:scale-95 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={`Open ${app.name} app`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${app.bgColor || 'bg-gray-200'}`}>
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      <span className="text-xs text-android-primary-text truncate w-full">{app.name}</span>
    </button>
  );
}
