
'use client';

import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { StatusBar } from './StatusBar';
import { NavigationBar } from './NavigationBar';
import { HomeScreen } from './HomeScreen';
import { SettingsApp } from './apps/SettingsApp';
import { MessagesApp } from './apps/MessagesApp';
import { CameraApp } from './apps/CameraApp';
import { PlaceholderApp } from './apps/PlaceholderApp';
import { DisplaySettingsApp } from './apps/settings/DisplaySettingsApp';
import { NetworkInternetSettingsApp } from './apps/settings/NetworkInternetSettingsApp';
import { ConnectionSharingSettingsApp } from './apps/settings/ConnectionSharingSettingsApp';
import { AppsSettingsApp } from './apps/settings/AppsSettingsApp';
import { NotificationPanel, type Notification } from './NotificationPanel';
import { RecentsScreen } from './RecentsScreen';
import { MessageSquare, Settings, Camera, Phone, Chrome, Image as ImageIcon, Play, Wifi, Bluetooth, AppWindow, Bell, BatteryCharging, HardDrive, Volume2, SunMedium, Palette, Accessibility, Lock, MapPin, ShieldAlert, UserCircle, Globe, Smartphone, Share2, Router, Leaf, Network, Plane, Car, ScreenShare, Printer, Link as LinkIcon, BarChart3, LockKeyhole, Shield as ShieldIcon, Info } from 'lucide-react';
import type { AndroidMockupHandles } from '@/app/page'; // Import the interface

export type AppId = 
  | 'HOME' 
  | 'SETTINGS' 
  | 'MESSAGES' 
  | 'CAMERA' 
  | 'PHONE' 
  | 'CHROME' 
  | 'PHOTOS' 
  | 'PLAY_STORE' 
  | 'RECENTS'
  | 'SETTINGS_NETWORK'
  | 'SETTINGS_CONNECTED_DEVICES'
  | 'SETTINGS_APPS'
  | 'SETTINGS_NOTIFICATIONS'
  | 'SETTINGS_BATTERY'
  | 'SETTINGS_STORAGE'
  | 'SETTINGS_SOUND'
  | 'SETTINGS_DISPLAY'
  | 'SETTINGS_WALLPAPER'
  | 'SETTINGS_ACCESSIBILITY'
  | 'SETTINGS_SECURITY'
  | 'SETTINGS_LOCATION'
  | 'SETTINGS_SAFETY'
  | 'SETTINGS_ACCOUNTS'
  | 'SETTINGS_SYSTEM'
  | 'SETTINGS_ABOUT_PHONE'
  | 'SETTINGS_NETWORK_INTERNET_DETAILS'
  | 'SETTINGS_NETWORK_CALLS_SMS'
  | 'SETTINGS_NETWORK_HOTSPOT_TETHERING'
  | 'SETTINGS_NETWORK_VPN_OVERVIEW'
  | 'SETTINGS_NETWORK_PRIVATE_DNS_OVERVIEW'
  | 'SETTINGS_NETWORK_CONNECTION_SHARING'
  | 'SETTINGS_CS_PERSONAL_HOTSPOT'
  | 'SETTINGS_CS_VPN'
  | 'SETTINGS_CS_PRIVATE_DNS'
  | 'SETTINGS_CS_ANDROID_AUTO'
  | 'SETTINGS_CS_SCREENCAST'
  | 'SETTINGS_CS_PRINT'
  | 'SETTINGS_APP_INFO_PHONE'
  | 'SETTINGS_APP_INFO_MESSAGES'
  | 'SETTINGS_APP_INFO_CHROME'
  | 'SETTINGS_APP_INFO_CAMERA'
  | 'SETTINGS_APP_INFO_SETTINGS'
  | 'SETTINGS_APP_INFO_PHOTOS'
  | 'SETTINGS_APP_INFO_PLAY_STORE';

export interface AppDefinition {
  id: AppId;
  name: string;
  icon: React.ElementType;
  bgColor?: string;
}

const initialApps: AppDefinition[] = [
  { id: 'PHONE', name: 'Phone', icon: Phone, bgColor: 'bg-green-500' },
  { id: 'MESSAGES', name: 'Messages', icon: MessageSquare, bgColor: 'bg-blue-500' },
  { id: 'CHROME', name: 'Chrome', icon: Chrome, bgColor: 'bg-yellow-400' },
  { id: 'CAMERA', name: 'Camera', icon: Camera, bgColor: 'bg-red-500' },
  { id: 'SETTINGS', name: 'Settings', icon: Settings, bgColor: 'bg-gray-500' },
  { id: 'PHOTOS', name: 'Photos', icon: ImageIcon, bgColor: 'bg-purple-500' },
  { id: 'PLAY_STORE', name: 'Play Store', icon: Play, bgColor: 'bg-teal-500' },
  { id: 'SETTINGS_NETWORK', name: 'Network & internet', icon: Wifi },
  { id: 'SETTINGS_CONNECTED_DEVICES', name: 'Connected devices', icon: Bluetooth },
  { id: 'SETTINGS_APPS', name: 'Apps', icon: AppWindow },
  { id: 'SETTINGS_NOTIFICATIONS', name: 'Notifications', icon: Bell },
  { id: 'SETTINGS_BATTERY', name: 'Battery', icon: BatteryCharging },
  { id: 'SETTINGS_STORAGE', name: 'Storage', icon: HardDrive },
  { id: 'SETTINGS_SOUND', name: 'Sound & vibration', icon: Volume2 },
  { id: 'SETTINGS_DISPLAY', name: 'Display', icon: SunMedium },
  { id: 'SETTINGS_WALLPAPER', name: 'Wallpaper & style', icon: Palette },
  { id: 'SETTINGS_ACCESSIBILITY', name: 'Accessibility', icon: Accessibility },
  { id: 'SETTINGS_SECURITY', name: 'Security & privacy', icon: Lock },
  { id: 'SETTINGS_LOCATION', name: 'Location', icon: MapPin },
  { id: 'SETTINGS_SAFETY', name: 'Safety & emergency', icon: ShieldAlert },
  { id: 'SETTINGS_ACCOUNTS', name: 'Accounts', icon: UserCircle },
  { id: 'SETTINGS_SYSTEM', name: 'System', icon: Globe },
  { id: 'SETTINGS_ABOUT_PHONE', name: 'About phone', icon: Smartphone },
  { id: 'SETTINGS_NETWORK_CONNECTION_SHARING', name: 'Connection & sharing', icon: Share2 },
  { id: 'SETTINGS_NETWORK_INTERNET_DETAILS', name: 'Internet Details', icon: Wifi },
  { id: 'SETTINGS_NETWORK_CALLS_SMS', name: 'Calls & SMS Settings', icon: Smartphone },
  { id: 'SETTINGS_NETWORK_HOTSPOT_TETHERING', name: 'Hotspot & tethering Settings', icon: Router },
  { id: 'SETTINGS_NETWORK_VPN_OVERVIEW', name: 'VPN Settings', icon: ShieldIcon },
  { id: 'SETTINGS_NETWORK_PRIVATE_DNS_OVERVIEW', name: 'Private DNS Settings', icon: LockKeyhole },
  { id: 'SETTINGS_CS_PERSONAL_HOTSPOT', name: 'Personal Hotspot Settings', icon: Router },
  { id: 'SETTINGS_CS_VPN', name: 'VPN Details (Connection & Sharing)', icon: ShieldIcon },
  { id: 'SETTINGS_CS_PRIVATE_DNS', name: 'Private DNS Details (Connection & Sharing)', icon: LockKeyhole },
  { id: 'SETTINGS_CS_ANDROID_AUTO', name: 'Android Auto Settings', icon: Car },
  { id: 'SETTINGS_CS_SCREENCAST', name: 'Screencast Settings', icon: ScreenShare },
  { id: 'SETTINGS_CS_PRINT', name: 'Print Settings', icon: Printer },
  { id: 'SETTINGS_APP_INFO_PHONE', name: 'App info: Phone', icon: Info },
  { id: 'SETTINGS_APP_INFO_MESSAGES', name: 'App info: Messages', icon: Info },
  { id: 'SETTINGS_APP_INFO_CHROME', name: 'App info: Chrome', icon: Info },
  { id: 'SETTINGS_APP_INFO_CAMERA', name: 'App info: Camera', icon: Info },
  { id: 'SETTINGS_APP_INFO_SETTINGS', name: 'App info: Settings', icon: Info },
  { id: 'SETTINGS_APP_INFO_PHOTOS', name: 'App info: Photos', icon: Info },
  { id: 'SETTINGS_APP_INFO_PLAY_STORE', name: 'App info: Play Store', icon: Info },
];

export const getAppDefinition = (appId: AppId): AppDefinition | undefined => {
    return initialApps.find(app => app.id === appId);
};

export const AndroidMockup = forwardRef<AndroidMockupHandles, {}>((props, ref) => {
  const [currentScreen, setCurrentScreen] = useState<AppId>('HOME');
  const [navigationStack, setNavigationStack] = useState<AppId[]>(['HOME']);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', appIcon: MessageSquare, appName: 'Messages', title: 'John Doe', text: 'Hey, are you free tonight?', time: '5m ago' },
    { id: '2', appIcon: Settings, appName: 'System Update', title: 'Update available', text: 'New security patch ready to install.', time: '1h ago' },
  ]);
  const [recentApps, setRecentApps] = useState<AppId[]>([]);

  // Lifted state for Data Saver
  const [dataSaverEnabled, setDataSaverEnabledInternal] = useState(false);

  const navigateTo = useCallback((appId: AppId) => {
    if (appId === currentScreen && appId !== 'HOME') return;

    setCurrentScreen(appId);
    setNavigationStack(prev => {
      const newStack = [...prev, appId];
      // Simple stack depth management
      if (newStack.length > 15) {
        const homeIndex = newStack.indexOf('HOME');
        const essentialBase = homeIndex !== -1 ? newStack.slice(0, homeIndex + 1) : ['HOME'];
        return [...essentialBase, ...newStack.slice(newStack.length - 10)];
      }
      return newStack;
    });

    if (appId !== 'HOME' && appId !== 'RECENTS' && !appId.startsWith('SETTINGS_')) {
        setRecentApps(prev => {
            const filtered = prev.filter(id => id !== appId);
            const newRecents = [appId, ...filtered];
            return newRecents.slice(0, 5); 
        });
    }
    setShowNotifications(false); 
  }, [currentScreen]);

  // Expose methods via useImperativeHandle
  useImperativeHandle(ref, () => ({
    navigateToPath: async (path: AppId[]) => {
      for (const appId of path) {
        navigateTo(appId);
        // Wait for screen transition to be somewhat visible
        await new Promise(resolve => setTimeout(resolve, 700)); 
      }
    },
    setDataSaverEnabled: async (enabled: boolean) => {
      setDataSaverEnabledInternal(enabled);
      // Ensure the UI updates if on the correct screen
      if(currentScreen === 'SETTINGS_NETWORK') {
        // No direct action needed here if NetworkInternetSettingsApp re-renders with new prop
      }
      await new Promise(resolve => setTimeout(resolve, 100)); // small delay for state to propagate
    },
    getCurrentScreen: () => currentScreen,
  }));

  const goBack = useCallback(() => {
    if (showNotifications) {
      setShowNotifications(false);
      return;
    }
    setNavigationStack(prev => {
      if (prev.length <= 1) {
        setCurrentScreen('HOME'); 
        return ['HOME'];
      }
      const newStack = prev.slice(0, -1);
      setCurrentScreen(newStack[newStack.length - 1]);
      return newStack;
    });
  }, [showNotifications]);

  const goHome = useCallback(() => {
    setCurrentScreen('HOME');
    setNavigationStack(['HOME']);
    setShowNotifications(false);
  }, []);

  const toggleRecents = useCallback(() => {
    if (currentScreen === 'RECENTS') {
      goBack(); 
    } else {
      navigateTo('RECENTS');
    }
    setShowNotifications(false);
  }, [currentScreen, navigateTo, goBack]);

  const toggleNotificationPanel = useCallback(() => {
    setShowNotifications(prev => !prev);
  }, []);

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const removeFromRecents = (appId: AppId) => {
    setRecentApps(prev => prev.filter(id => id !== appId));
  };

  const renderScreen = () => {
    const appDefinition = getAppDefinition(currentScreen);
    const appName = appDefinition?.name || 'App';

    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen apps={initialApps.filter(app => ['PHONE', 'MESSAGES', 'CHROME', 'CAMERA', 'SETTINGS', 'PHOTOS', 'PLAY_STORE'].includes(app.id))} onAppClick={navigateTo} />;
      case 'SETTINGS':
        return <SettingsApp onNavigate={navigateTo} />;
      case 'MESSAGES':
        return <MessagesApp />;
      case 'CAMERA':
        return <CameraApp />;
      case 'RECENTS':
        return <RecentsScreen recentApps={recentApps.map(id => initialApps.find(app => app.id === id)).filter(Boolean) as AppDefinition[]} onAppClick={navigateTo} onClearApp={removeFromRecents} onClearAll={() => setRecentApps([])} />;
      case 'SETTINGS_DISPLAY':
        return <DisplaySettingsApp onNavigate={navigateTo} />;
      case 'SETTINGS_NETWORK':
        return <NetworkInternetSettingsApp 
                  onNavigate={navigateTo} 
                  dataSaver={dataSaverEnabled} 
                  onDataSaverChange={setDataSaverEnabledInternal} 
                />;
      case 'SETTINGS_NETWORK_CONNECTION_SHARING':
        return <ConnectionSharingSettingsApp onNavigate={navigateTo} />;
      case 'SETTINGS_APPS':
        return <AppsSettingsApp onNavigate={navigateTo} appDefinitions={initialApps} />;
      case 'PHONE':
      case 'CHROME':
      case 'PHOTOS':
      case 'PLAY_STORE':
      case 'SETTINGS_CONNECTED_DEVICES':
      case 'SETTINGS_NOTIFICATIONS':
      case 'SETTINGS_BATTERY':
      case 'SETTINGS_STORAGE':
      case 'SETTINGS_SOUND':
      case 'SETTINGS_WALLPAPER':
      case 'SETTINGS_ACCESSIBILITY':
      case 'SETTINGS_SECURITY':
      case 'SETTINGS_LOCATION':
      case 'SETTINGS_SAFETY':
      case 'SETTINGS_ACCOUNTS':
      case 'SETTINGS_SYSTEM':
      case 'SETTINGS_ABOUT_PHONE':
      case 'SETTINGS_NETWORK_INTERNET_DETAILS':
      case 'SETTINGS_NETWORK_CALLS_SMS':
      case 'SETTINGS_NETWORK_HOTSPOT_TETHERING':
      case 'SETTINGS_NETWORK_VPN_OVERVIEW':
      case 'SETTINGS_NETWORK_PRIVATE_DNS_OVERVIEW':
      case 'SETTINGS_CS_PERSONAL_HOTSPOT':
      case 'SETTINGS_CS_VPN':
      case 'SETTINGS_CS_PRIVATE_DNS':
      case 'SETTINGS_CS_ANDROID_AUTO':
      case 'SETTINGS_CS_SCREENCAST':
      case 'SETTINGS_CS_PRINT':
      case 'SETTINGS_APP_INFO_PHONE':
      case 'SETTINGS_APP_INFO_MESSAGES':
      case 'SETTINGS_APP_INFO_CHROME':
      case 'SETTINGS_APP_INFO_CAMERA':
      case 'SETTINGS_APP_INFO_SETTINGS':
      case 'SETTINGS_APP_INFO_PHOTOS':
      case 'SETTINGS_APP_INFO_PLAY_STORE':
        return <PlaceholderApp appName={appName} />;
      default:
        if (currentScreen.startsWith('SETTINGS_')) {
          return <PlaceholderApp appName={appName || `Settings: ${currentScreen.replace('SETTINGS_', '')}`} />;
        }
        return <HomeScreen apps={initialApps.filter(app => ['PHONE', 'MESSAGES', 'CHROME', 'CAMERA', 'SETTINGS', 'PHOTOS', 'PLAY_STORE'].includes(app.id))} onAppClick={navigateTo} />;
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (navigationStack.length > 1) {
        goBack();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [goBack, navigationStack.length]);

  return (
    <div className="w-[412px] h-[892px] bg-black rounded-4xl p-3 shadow-phone overflow-hidden flex flex-col relative">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-lg z-50"></div>
      
      <div className="flex-grow bg-android-background rounded-[2rem] overflow-hidden flex flex-col relative">
        <StatusBar onToggleNotifications={toggleNotificationPanel} notificationCount={notifications.length} />
        <div className="flex-grow overflow-y-auto relative screen-content" key={currentScreen}>
          {renderScreen()}
        </div>
        <NavigationBar onHome={goHome} onBack={goBack} onRecents={toggleRecents} />
        
        {showNotifications && (
          <div className={`absolute inset-x-0 top-0 h-full z-30 ${showNotifications ? 'animate-notification-panel-show' : 'animate-notification-panel-hide'}`}>
            <NotificationPanel
              notifications={notifications}
              onClearNotification={clearNotification}
              onClearAll={clearAllNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
});

AndroidMockup.displayName = 'AndroidMockup';
