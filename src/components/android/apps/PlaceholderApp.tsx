'use client';

import React from 'react';
import { AppScreen } from '../AppScreen';
import { Construction } from 'lucide-react';

interface PlaceholderAppProps {
  appName: string;
}

export function PlaceholderApp({ appName }: PlaceholderAppProps) {
  return (
    <AppScreen appName={appName}>
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Construction size={64} className="text-primary mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-android-primary-text">Welcome to {appName}</h2>
        <p className="text-android-secondary-text">This app is currently under construction.</p>
        <p className="text-android-secondary-text">Check back later for updates!</p>
      </div>
    </AppScreen>
  );
}
