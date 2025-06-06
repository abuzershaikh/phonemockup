'use client';

import React from 'react';
import { AppScreen } from '../AppScreen';
import { Wifi, Bluetooth, SunMedium, Smartphone, Bell, Lock, UserCircle, Info } from 'lucide-react';

const settingsItems = [
  { icon: Wifi, name: 'Network & internet', description: 'Wi-Fi, mobile, hotspot' },
  { icon: Smartphone, name: 'Connected devices', description: 'Bluetooth, pairing' },
  { icon: Bell, name: 'Notifications', description: 'Notification history, bubbles' },
  { icon: SunMedium, name: 'Display', description: 'Dark theme, font size' },
  { icon: Lock, name: 'Security & privacy', description: 'Screen lock, app security' },
  { icon: UserCircle, name: 'Accounts', description: 'Google, other accounts' },
  { icon: Info, name: 'About phone', description: 'Device name, Android version' },
];

export function SettingsApp() {
  return (
    <AppScreen appName="Settings">
      <div className="space-y-1">
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button 
              key={index} 
              className="w-full flex items-center space-x-4 p-3 hover:bg-gray-100 dark:hover:bg-neutral-700/50 rounded-lg transition-colors text-left focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={item.name}
            >
              <Icon className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium text-android-primary-text">{item.name}</p>
                <p className="text-xs text-android-secondary-text">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </AppScreen>
  );
}
