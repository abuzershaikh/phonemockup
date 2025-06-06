
'use client';

import React from 'react';
import { AppScreen } from '../../AppScreen';
import type { AppId } from '../../AndroidMockup'; // AppId is now string
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Wifi, Smartphone, Router, Share2, Leaf, Shield, Lock, Network, ChevronRight, AlertTriangle } from 'lucide-react';

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  control?: React.ReactNode;
  onClick?: () => void;
  appId?: AppId; // string
  warning?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon: Icon, title, description, control, onClick, warning }) => (
  <button
    className={`w-full flex items-center space-x-4 p-3 hover:bg-gray-100 dark:hover:bg-neutral-700/50 rounded-lg transition-colors text-left ${onClick ? 'cursor-pointer' : 'cursor-default'} focus:outline-none focus:ring-2 focus:ring-accent`}
    onClick={onClick}
    disabled={!onClick && !control}
    aria-label={title}
  >
    <Icon className="w-6 h-6 text-primary flex-shrink-0" />
    <div className="flex-grow overflow-hidden">
      <p className="font-medium text-android-primary-text truncate">{title}</p>
      {description && <p className="text-xs text-android-secondary-text truncate">{description}</p>}
      {warning && <p className="text-xs text-yellow-500 dark:text-yellow-400 flex items-center"><AlertTriangle size={14} className="mr-1 inline-block" />{warning}</p>}
    </div>
    {control && <div className="flex-shrink-0">{control}</div>}
    {onClick && !control && <ChevronRight className="w-5 h-5 text-android-secondary-text flex-shrink-0" />}
  </button>
);

interface NetworkInternetSettingsAppProps {
  onNavigate: (appId: AppId) => void; // AppId is now string
  dataSaver: boolean;
  onDataSaverChange: (enabled: boolean) => void;
}

export function NetworkInternetSettingsApp({ onNavigate, dataSaver, onDataSaverChange }: NetworkInternetSettingsAppProps) {
  const [adaptiveConnectivity, setAdaptiveConnectivity] = React.useState(true);

  const settingsList: SettingItemProps[] = [
    {
      icon: Wifi,
      title: 'Internet',
      description: 'Wi-Fi, Ethernet, Mobile network',
      onClick: () => onNavigate('SETTINGS_NETWORK_INTERNET_DETAILS'),
      appId: 'SETTINGS_NETWORK_INTERNET_DETAILS',
    },
    {
      icon: Smartphone,
      title: 'Calls & SMS',
      description: 'Call preferences, SIMs',
      onClick: () => onNavigate('SETTINGS_NETWORK_CALLS_SMS'),
      appId: 'SETTINGS_NETWORK_CALLS_SMS',
    },
    {
      icon: Router,
      title: 'Hotspot & tethering',
      description: 'Share your internet connection',
      onClick: () => onNavigate('SETTINGS_NETWORK_HOTSPOT_TETHERING'),
      appId: 'SETTINGS_NETWORK_HOTSPOT_TETHERING',
    },
    {
      icon: Share2,
      title: 'Connection & sharing',
      description: 'Aeroplane mode, Nearby Share, Android Auto',
      onClick: () => onNavigate('SETTINGS_NETWORK_CONNECTION_SHARING'),
      appId: 'SETTINGS_NETWORK_CONNECTION_SHARING',
    },
    {
      icon: Leaf,
      title: 'Data Saver',
      description: dataSaver ? 'On' : 'Off',
      control: <Switch checked={dataSaver} onCheckedChange={onDataSaverChange} id="data-saver-switch" />,
    },
    {
      icon: Shield,
      title: 'VPN',
      description: 'Not connected',
      onClick: () => onNavigate('SETTINGS_NETWORK_VPN_OVERVIEW'),
      appId: 'SETTINGS_NETWORK_VPN_OVERVIEW',
    },
    {
      icon: Lock,
      title: 'Private DNS',
      description: 'Automatic',
      onClick: () => onNavigate('SETTINGS_NETWORK_PRIVATE_DNS_OVERVIEW'),
      appId: 'SETTINGS_NETWORK_PRIVATE_DNS_OVERVIEW',
    },
    {
      icon: Network,
      title: 'Adaptive connectivity',
      description: 'Extends battery by managing network connections',
      control: <Switch checked={adaptiveConnectivity} onCheckedChange={setAdaptiveConnectivity} id="adaptive-connectivity-switch" />,
    },
  ];

  return (
    <AppScreen appName="Network & internet">
      <div className="space-y-1 pb-4">
        {settingsList.map((item, index) => (
          <React.Fragment key={item.title}>
            <SettingItem {...item} />
            {(item.title === 'Connection & sharing' || item.title === 'Data Saver' || item.title === 'Private DNS') && <Separator className="my-1" />}
          </React.Fragment>
        ))}
      </div>
    </AppScreen>
  );
}
