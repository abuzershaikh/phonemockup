'use client';

import React from 'react';

interface AppScreenProps {
  appName: string;
  children: React.ReactNode;
  bgColor?: string; // Optional background color for the app screen
  textColor?: string; // Optional text color
  headerColor?: string; // Optional header background color
}

export function AppScreen({ 
  appName, 
  children, 
  bgColor = 'bg-android-background', 
  textColor = 'text-android-primary-text',
  headerColor = 'bg-android-background' 
}: AppScreenProps) {
  return (
    <div className={`h-full flex flex-col ${bgColor} ${textColor} overflow-hidden`}>
      <header className={`p-4 ${headerColor} border-b border-gray-200 dark:border-gray-700/50 sticky top-0 z-10`}>
        <h1 className="text-xl font-medium">{appName}</h1>
      </header>
      <main className="flex-grow overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
}
