
'use client';

import React, { useState } from 'react';
import { AppScreen } from '../../AppScreen';
import type { AppId } from '../../AndroidMockup'; // AppId is now string
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plane, Router, Shield, Lock, Car, ScreenShare, Printer, Link as LinkIcon, ChevronRight, AlertTriangle } from 'lucide-react';

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  control?: React.ReactNode;
  onClick?: () => void;
  appId?: AppId; // string 
  subLabel?: string;
  warning?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon: Icon, title, description, subLabel, control, onClick, warning }) => (
  <button
    className={`w-full flex items-center space-x-4 p-3 hover:bg-gray-100 dark:hover:bg-neutral-700/50 rounded-lg transition-colors text-left ${onClick ? 'cursor-pointer' : 'cursor-default'} focus:outline-none focus:ring-2 focus:ring-accent`}
    onClick={onClick}
    disabled={!onClick && !control}
    aria-label={title}
  >
    <Icon className="w-6 h-6 text-primary flex-shrink-0" />
    <div className="flex-grow overflow-hidden">
      <div className="flex justify-between items-center">
        <p className="font-medium text-android-primary-text truncate">{title}</p>
        {subLabel && !control && !onClick && <span className="text-sm text-android-secondary-text pr-2">{subLabel}</span>}
      </div>
      {description && <p className="text-xs text-android-secondary-text truncate">{description}</p>}
      {warning && <p className="text-xs text-yellow-500 dark:text-yellow-400 flex items-center"><AlertTriangle size={14} className="mr-1 inline-block" />{warning}</p>}
    </div>
    {control && <div className="flex-shrink-0">{control}</div>}
    {onClick && !control && (
        <div className="flex items-center">
            {subLabel && <span className="text-sm text-android-secondary-text mr-1">{subLabel}</span>}
            <ChevronRight className="w-5 h-5 text-android-secondary-text flex-shrink-0" />
        </div>
    )}
  </button>
);

interface ConnectionSharingSettingsAppProps {
  onNavigate: (appId: AppId) => void; // AppId is now string
}

export function ConnectionSharingSettingsApp({ onNavigate }: ConnectionSharingSettingsAppProps) {
  const [aeroplaneMode, setAeroplaneMode] = useState(false);
  const [quickDeviceConnect, setQuickDeviceConnect] = useState(true);

  const settingsList: SettingItemProps[] = [
    {
      icon: Plane,
      title: 'Aeroplane mode',
      control: <Switch checked={aeroplaneMode} onCheckedChange={setAeroplaneMode} id="aeroplane-mode-switch" />,
    },
    {
      icon: Router,
      title: 'Personal hotspot',
      onClick: () => onNavigate('SETTINGS_CS_PERSONAL_HOTSPOT'),
      appId: 'SETTINGS_CS_PERSONAL_HOTSPOT',
    },
  ];

  const otherConnections: SettingItemProps[] = [
    {
      icon: Shield,
      title: 'VPN',
      onClick: () => onNavigate('SETTINGS_CS_VPN'),
      appId: 'SETTINGS_CS_VPN',
    },
    {
      icon: Lock,
      title: 'Private DNS',
      onClick: () => onNavigate('SETTINGS_CS_PRIVATE_DNS'),
      appId: 'SETTINGS_CS_PRIVATE_DNS',
    },
    {
      icon: Car,
      title: 'Android Auto',
      description: 'Use apps on your car display.',
      onClick: () => onNavigate('SETTINGS_CS_ANDROID_AUTO'),
      appId: 'SETTINGS_CS_ANDROID_AUTO',
    },
  ];

  const sharingFeatures: SettingItemProps[] = [
     {
      icon: ScreenShare,
      title: 'Screencast',
      onClick: () => onNavigate('SETTINGS_CS_SCREENCAST'),
      appId: 'SETTINGS_CS_SCREENCAST',
    },
    {
      icon: Printer,
      title: 'Print',
      subLabel: 'On', 
      onClick: () => onNavigate('SETTINGS_CS_PRINT'),
      appId: 'SETTINGS_CS_PRINT',
    },
    {
      icon: LinkIcon,
      title: 'Quick device connect',
      description: 'Discover and connect to nearby devices quickly.',
      control: <Switch checked={quickDeviceConnect} onCheckedChange={setQuickDeviceConnect} id="quick-device-connect-switch" />,
    },
  ];

  return (
    <AppScreen appName="Connection & sharing">
      <div className="space-y-1 pb-4">
        <div className="bg-card dark:bg-neutral-800/30 rounded-xl shadow-sm mb-3">
            {settingsList.map((item, index) => (
            <React.Fragment key={item.title}>
                <SettingItem {...item} />
                {index < settingsList.length - 1 && <Separator className="mx-4 my-0" />}
            </React.Fragment>
            ))}
        </div>
        
        <div className="bg-card dark:bg-neutral-800/30 rounded-xl shadow-sm mb-3">
            {otherConnections.map((item, index) => (
                <React.Fragment key={item.title}>
                    <SettingItem {...item} />
                    {index < otherConnections.length - 1 && <Separator className="mx-4 my-0" />}
                </React.Fragment>
            ))}
        </div>

        <div className="bg-card dark:bg-neutral-800/30 rounded-xl shadow-sm">
            {sharingFeatures.map((item, index) => (
                <React.Fragment key={item.title}>
                    <SettingItem {...item} />
                    {index < sharingFeatures.length - 1 && <Separator className="mx-4 my-0" />}
                </React.Fragment>
            ))}
        </div>
      </div>
    </AppScreen>
  );
}
