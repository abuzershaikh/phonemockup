
'use client';

import React from 'react';
import { AppScreen } from '../AppScreen';
import type { AppId } from '../AndroidMockup';
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
  Accessibility as AccessibilityIcon,
  MapPin,
  ShieldAlert,
  Globe2 as Globe
} from 'lucide-react';

interface SettingsItem {
  icon: React.ElementType;
  name: string;
  description: string;
  appId: AppId;
}

const settingsItems: SettingsItem[] = [
  { icon: Wifi, name: 'Network & internet', description: 'Wi-Fi, mobile, hotspot, VPN', appId: 'SETTINGS_NETWORK' },
  { icon: Bluetooth, name: 'Connected devices', description: 'Bluetooth, pairing, Cast, NFC', appId: 'SETTINGS_CONNECTED_DEVICES' },
  { icon: AppWindow, name: 'Apps', description: 'Permissions, default apps, app usage', appId: 'SETTINGS_APPS' },
  { icon: Bell, name: 'Notifications', description: 'Notification history, conversations, bubbles', appId: 'SETTINGS_NOTIFICATIONS' },
  { icon: BatteryCharging, name: 'Battery', description: 'Battery Saver, usage, percentage', appId: 'SETTINGS_BATTERY' },
  { icon: HardDrive, name: 'Storage', description: 'Device storage, manage storage', appId: 'SETTINGS_STORAGE' },
  { icon: Volume2, name: 'Sound & vibration', description: 'Volume, DND, haptics, ringtones', appId: 'SETTINGS_SOUND' },
  { icon: SunMedium, name: 'Display', description: 'Brightness, Dark theme, font size, screen timeout', appId: 'SETTINGS_DISPLAY' },
  { icon: Palette, name: 'Wallpaper & style', description: 'Change wallpaper, colors, app grid', appId: 'SETTINGS_WALLPAPER' },
  { icon: AccessibilityIcon, name: 'Accessibility', description: 'Vision, hearing, physical, interaction controls', appId: 'SETTINGS_ACCESSIBILITY' },
  { icon: Lock, name: 'Security & privacy', description: 'Screen lock, Find My Device, app security', appId: 'SETTINGS_SECURITY' },
  { icon: MapPin, name: 'Location', description: 'Location services, app access, emergency location', appId: 'SETTINGS_LOCATION' },
  { icon: ShieldAlert, name: 'Safety & emergency', description: 'Emergency SOS, medical info, crisis alerts', appId: 'SETTINGS_SAFETY' },
  { icon: UserCircle, name: 'Accounts', description: 'Google, work, personal, add account', appId: 'SETTINGS_ACCOUNTS' },
  { icon: Globe, name: 'System', description: 'Languages, gestures, time, backup, updates', appId: 'SETTINGS_SYSTEM' },
  { icon: Smartphone, name: 'About phone', description: 'Device name, Android version, IMEI, software info', appId: 'SETTINGS_ABOUT_PHONE' },
];

interface SettingsAppProps {
  onNavigate: (appId: AppId) => void;
}

export function SettingsApp({ onNavigate }: SettingsAppProps) {
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
              onClick={() => onNavigate(item.appId)}
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
