
'use client';

import React from 'react';
import { AppScreen } from '../AppScreen';
import { 
  Wifi, 
  Bluetooth, 
  SunMedium, 
  Smartphone, 
  Bell, 
  Lock, 
  UserCircle,
  AppWindow,
  BatteryCharging,
  HardDrive,
  Volume2,
  Palette,
  Accessibility as AccessibilityIcon, // Renamed to avoid conflict with React.Accessibility
  MapPin,
  ShieldAlert,
  Globe2 as Globe // Using Globe2 as Globe might be a type/component
} from 'lucide-react';

const settingsItems = [
  { icon: Wifi, name: 'Network & internet', description: 'Wi-Fi, mobile, hotspot, VPN' },
  { icon: Bluetooth, name: 'Connected devices', description: 'Bluetooth, pairing, Cast, NFC' },
  { icon: AppWindow, name: 'Apps', description: 'Permissions, default apps, app usage' },
  { icon: Bell, name: 'Notifications', description: 'Notification history, conversations, bubbles' },
  { icon: BatteryCharging, name: 'Battery', description: 'Battery Saver, usage, percentage' },
  { icon: HardDrive, name: 'Storage', description: 'Device storage, manage storage' },
  { icon: Volume2, name: 'Sound & vibration', description: 'Volume, DND, haptics, ringtones' },
  { icon: SunMedium, name: 'Display', description: 'Brightness, Dark theme, font size, screen timeout' },
  { icon: Palette, name: 'Wallpaper & style', description: 'Change wallpaper, colors, app grid' },
  { icon: AccessibilityIcon, name: 'Accessibility', description: 'Vision, hearing, physical, interaction controls' },
  { icon: Lock, name: 'Security & privacy', description: 'Screen lock, Find My Device, app security' },
  { icon: MapPin, name: 'Location', description: 'Location services, app access, emergency location' },
  { icon: ShieldAlert, name: 'Safety & emergency', description: 'Emergency SOS, medical info, crisis alerts' },
  { icon: UserCircle, name: 'Accounts', description: 'Google, work, personal, add account' },
  { icon: Globe, name: 'System', description: 'Languages, gestures, time, backup, updates' },
  { icon: Smartphone, name: 'About phone', description: 'Device name, Android version, IMEI, software info' },
];

export function SettingsApp() {
  return (
    <AppScreen appName="Settings">
      <div className="space-y-1 pb-4">
        {settingsItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button 
              key={index} 
              className="w-full flex items-center space-x-4 p-3 hover:bg-gray-100 dark:hover:bg-neutral-700/50 rounded-lg transition-colors text-left focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={item.name}
            >
              <IconComponent className="w-6 h-6 text-primary flex-shrink-0" />
              <div className="flex-grow overflow-hidden">
                <p className="font-medium text-android-primary-text truncate">{item.name}</p>
                <p className="text-xs text-android-secondary-text truncate">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </AppScreen>
  );
}

