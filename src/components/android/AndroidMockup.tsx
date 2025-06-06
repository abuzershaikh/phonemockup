
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
import { 
  MessageSquare, Settings, Camera, Phone, Chrome, Image as ImageIcon, Play, Wifi, Bluetooth, AppWindow, Bell, 
  BatteryCharging, HardDrive, Volume2, SunMedium, Palette, Accessibility, Lock, MapPin, ShieldAlert, 
  UserCircle, Globe, Smartphone, Share2, Router, Leaf, Network, Plane, Car, ScreenShare, Printer, 
  Link as LinkIcon, BarChart3, LockKeyhole, Shield as ShieldIcon, Info, StickyNote, Map, Youtube, FolderArchive,
  Mail, CalendarDays, ClockIcon, Users, Calculator, FolderOpen, NotebookPen, CloudSun, Podcast, Home as HomeIconLucide, Video
} from 'lucide-react';

// AppId is now a generic string to support dynamic app IDs
export type AppId = string;

export interface AppDefinition {
  id: AppId;
  name: string;
  icon: React.ElementType; // For Lucide icons or as a fallback
  iconUri?: string; // For custom image URIs
  bgColor?: string;
}

const initialAppsData: AppDefinition[] = [
  { id: 'PHONE', name: 'Phone', icon: Phone, bgColor: 'bg-green-500' },
  { id: 'MESSAGES', name: 'Messages', icon: MessageSquare, bgColor: 'bg-blue-500' },
  { id: 'CHROME', name: 'Chrome', icon: Chrome, bgColor: 'bg-yellow-400' },
  { id: 'CAMERA', name: 'Camera', icon: Camera, bgColor: 'bg-red-500' },
  { id: 'SETTINGS', name: 'Settings', icon: Settings, bgColor: 'bg-gray-500' },
  { id: 'PHOTOS', name: 'Photos', icon: ImageIcon, bgColor: 'bg-purple-500' },
  { id: 'PLAY_STORE', name: 'Play Store', icon: Play, bgColor: 'bg-teal-500' },
  { id: 'MAPS', name: 'Maps', icon: Map, bgColor: 'bg-green-600' },
  { id: 'YOUTUBE', name: 'YouTube', icon: Youtube, bgColor: 'bg-red-600' },
  { id: 'DRIVE', name: 'Drive', icon: FolderArchive, bgColor: 'bg-yellow-500' },
  { id: 'GMAIL', name: 'Gmail', icon: Mail, bgColor: 'bg-red-500' },
  { id: 'CALENDAR', name: 'Calendar', icon: CalendarDays, bgColor: 'bg-blue-400' },
  { id: 'CLOCK', name: 'Clock', icon: ClockIcon, bgColor: 'bg-indigo-500' },
  { id: 'CONTACTS', name: 'Contacts', icon: Users, bgColor: 'bg-orange-500' },
  { id: 'CALCULATOR', name: 'Calculator', icon: Calculator, bgColor: 'bg-gray-400' },
  { id: 'FILES', name: 'Files', icon: FolderOpen, bgColor: 'bg-sky-500' },
  { id: 'KEEP_NOTES', name: 'Keep Notes', icon: NotebookPen, bgColor: 'bg-amber-500' },
  { id: 'WEATHER', name: 'Weather', icon: CloudSun, bgColor: 'bg-blue-300' },
  { id: 'PODCASTS', name: 'Podcasts', icon: Podcast, bgColor: 'bg-purple-600' },
  { id: 'GOOGLE_HOME', name: 'Home', icon: HomeIconLucide, bgColor: 'bg-orange-400' },
  { id: 'MEET', name: 'Meet', icon: Video, bgColor: 'bg-green-400' },
  // Example preloaded apps with icons from public folder (using placeholders for demonstration)
  { 
    id: 'PRELOADED_NOTES', 
    name: 'My Notes', 
    icon: StickyNote, // Fallback Lucide icon
    iconUri: 'https://placehold.co/48x48.png?text=Notes', // Replace with '/app-icons/my_notes_icon.png'
    bgColor: 'bg-yellow-500' 
  },
  { 
    id: 'PRELOADED_TRAVEL', 
    name: 'Travel Planner', 
    icon: Map, // Fallback Lucide icon
    iconUri: 'https://placehold.co/48x48.png?text=Travel', // Replace with '/app-icons/travel_planner_icon.png'
    bgColor: 'bg-cyan-500' 
  },
  // Settings "apps" - these don't appear on home screen but are destinations for navigation
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
  { id: 'SETTINGS_APP_INFO_MAPS', name: 'App info: Maps', icon: Info },
  { id: 'SETTINGS_APP_INFO_YOUTUBE', name: 'App info: YouTube', icon: Info },
  { id: 'SETTINGS_APP_INFO_DRIVE', name: 'App info: Drive', icon: Info },
  { id: 'SETTINGS_APP_INFO_GMAIL', name: 'App info: Gmail', icon: Info },
  { id: 'SETTINGS_APP_INFO_CALENDAR', name: 'App info: Calendar', icon: Info },
  { id: 'SETTINGS_APP_INFO_CLOCK', name: 'App info: Clock', icon: Info },
  { id: 'SETTINGS_APP_INFO_CONTACTS', name: 'App info: Contacts', icon: Info },
  { id: 'SETTINGS_APP_INFO_CALCULATOR', name: 'App info: Calculator', icon: Info },
  { id: 'SETTINGS_APP_INFO_FILES', name: 'App info: Files', icon: Info },
  { id: 'SETTINGS_APP_INFO_KEEP_NOTES', name: 'App info: Keep Notes', icon: Info },
  { id: 'SETTINGS_APP_INFO_WEATHER', name: 'App info: Weather', icon: Info },
  { id: 'SETTINGS_APP_INFO_PODCASTS', name: 'App info: Podcasts', icon: Info },
  { id: 'SETTINGS_APP_INFO_GOOGLE_HOME', name: 'App info: Home', icon: Info },
  { id: 'SETTINGS_APP_INFO_MEET', name: 'App info: Meet', icon: Info },
];

const MAX_USER_APPS = 20;

export interface AndroidMockupHandles {
  navigateToPath: (path: AppId[]) => Promise<void>;
  setDataSaverEnabled: (enabled: boolean) => Promise<void>;
  setAppIcon: (appId: AppId, iconUri: string) => Promise<void>;
  addApp: (appName: string, iconUri: string) => Promise<boolean>;
  getCurrentScreen: () => AppId;
}

export const AndroidMockup = forwardRef<AndroidMockupHandles, {}>((props, ref) => {
  const [currentScreen, setCurrentScreen] = useState<AppId>('HOME');
  const [navigationStack, setNavigationStack] = useState<AppId[]>(['HOME']);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', appIcon: MessageSquare, appName: 'Messages', title: 'John Doe', text: 'Hey, are you free tonight?', time: '5m ago' },
    { id: '2', appIcon: Settings, appName: 'System Update', title: 'Update available', text: 'New security patch ready to install.', time: '1h ago' },
  ]);
  const [recentApps, setRecentApps] = useState<AppId[]>([]);
  const [dataSaverEnabled, setDataSaverEnabledInternal] = useState(false);
  const [appsState, setAppsState] = useState<AppDefinition[]>(initialAppsData);
  const [userAppIdCounter, setUserAppIdCounter] = useState(0);

  const getAppDefinition = useCallback((appId: AppId): AppDefinition | undefined => {
    return appsState.find(app => app.id === appId);
  }, [appsState]);

  const navigateTo = useCallback((appId: AppId) => {
    if (currentScreen === appId && appId !== 'HOME') return;

    setCurrentScreen(appId);
    setNavigationStack(prev => {
      const newStack = [...prev, appId];
      if (newStack.length > 15) {
        const homeIndex = newStack.indexOf('HOME');
        const essentialBase = homeIndex !== -1 ? newStack.slice(0, homeIndex + 1) : ['HOME'];
        return [...essentialBase, ...newStack.slice(newStack.length - 10)];
      }
      return newStack;
    });

    // Add to recents only if it's a main app, not HOME, RECENTS, or any SETTINGS_ screen
    const isMainApp = !['HOME', 'RECENTS'].includes(appId) &&
                      !appId.startsWith('SETTINGS_') &&
                      (getAppDefinition(appId)?.bgColor || appId.startsWith('USER_APP_') || appId.startsWith('PRELOADED_'));

    if (isMainApp) {
        setRecentApps(prev => {
            const filtered = prev.filter(id => id !== appId);
            const newRecents = [appId, ...filtered];
            return newRecents.slice(0, 5); 
        });
    }
    setShowNotifications(false); 
  }, [currentScreen, appsState, getAppDefinition]);

  useImperativeHandle(ref, () => ({
    navigateToPath: async (path: AppId[]) => {
      for (const appId of path) {
        navigateTo(appId);
        await new Promise(resolve => setTimeout(resolve, 700)); 
      }
    },
    setDataSaverEnabled: async (enabled: boolean) => {
      setDataSaverEnabledInternal(enabled);
      await new Promise(resolve => setTimeout(resolve, 100));
    },
    setAppIcon: async (appId: AppId, iconUri: string) => {
      setAppsState(prevApps => 
        prevApps.map(app => 
          app.id === appId ? { ...app, iconUri: iconUri, icon: ImageIcon } : app
        )
      );
      await new Promise(resolve => setTimeout(resolve, 100));
    },
    addApp: async (appName: string, iconUri: string): Promise<boolean> => {
      const currentUserAppsCount = appsState.filter(app => app.id.startsWith('USER_APP_')).length;
      if (currentUserAppsCount >= MAX_USER_APPS) {
        console.warn(`Max user apps (${MAX_USER_APPS}) reached. Cannot add ${appName}.`);
        return false;
      }

      const newAppId = `USER_APP_${userAppIdCounter}`;
      setUserAppIdCounter(prev => prev + 1);

      const newApp: AppDefinition = {
        id: newAppId,
        name: appName,
        iconUri: iconUri,
        icon: AppWindow, // Default Lucide icon for user apps
        bgColor: 'bg-slate-500', // Default background color
      };
      
      // Add App Info screen for the new user app
      const newUserAppInfo: AppDefinition = {
        id: `SETTINGS_APP_INFO_${newAppId.toUpperCase()}`,
        name: `App info: ${appName}`,
        icon: Info,
      };

      setAppsState(prevApps => [...prevApps, newApp, newUserAppInfo]);
      return true;
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
        return <HomeScreen apps={appsState} onAppClick={navigateTo} />;
      case 'SETTINGS':
        return <SettingsApp onNavigate={navigateTo} />;
      case 'MESSAGES':
        return <MessagesApp />;
      case 'CAMERA':
        return <CameraApp />;
      case 'RECENTS':
        return <RecentsScreen recentApps={recentApps.map(id => getAppDefinition(id)).filter(Boolean) as AppDefinition[]} onAppClick={navigateTo} onClearApp={removeFromRecents} onClearAll={() => setRecentApps([])} />;
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
        return <AppsSettingsApp onNavigate={navigateTo} appDefinitions={appsState} />;
      // Placeholder cases for system apps and specific settings screens
      case 'PHONE':
      case 'CHROME':
      case 'PHOTOS':
      case 'PLAY_STORE':
      case 'MAPS':
      case 'YOUTUBE':
      case 'DRIVE':
      case 'GMAIL':
      case 'CALENDAR':
      case 'CLOCK':
      case 'CONTACTS':
      case 'CALCULATOR':
      case 'FILES':
      case 'KEEP_NOTES':
      case 'WEATHER':
      case 'PODCASTS':
      case 'GOOGLE_HOME':
      case 'MEET':
      case 'PRELOADED_NOTES': 
      case 'PRELOADED_TRAVEL': 
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
        return <PlaceholderApp appName={appName} />;
      default:
        // Handle App Info screens for system, settings, user, and preloaded apps
        if (currentScreen.startsWith('SETTINGS_APP_INFO_')) {
          const potentialAppId = currentScreen.substring('SETTINGS_APP_INFO_'.length);
          const targetAppDef = getAppDefinition(potentialAppId) || appsState.find(app => app.id.toUpperCase() === potentialAppId);
          return <PlaceholderApp appName={targetAppDef ? `App info: ${targetAppDef.name}` : `App Info: ${potentialAppId.replace(/_/g, ' ')}`} />;
        }
        // Handle User Apps and Preloaded Apps directly (if they were to be "opened")
        if (currentScreen.startsWith('USER_APP_') || currentScreen.startsWith('PRELOADED_')) {
           return <PlaceholderApp appName={appName} />;
        }
        // Fallback for other settings screens not yet explicitly defined
        if (currentScreen.startsWith('SETTINGS_')) {
          return <PlaceholderApp appName={appName || `Settings: ${currentScreen.replace('SETTINGS_', '')}`} />;
        }
        return <HomeScreen apps={appsState} onAppClick={navigateTo} />;
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
  
  // More robust key for screen content re-render
  const screenContentKey = `${currentScreen}-${appsState.length}-${appsState.map(a => a.iconUri).join('_')}`;

  return (
    <div className="w-[412px] h-[892px] bg-black rounded-4xl p-3 shadow-phone overflow-hidden flex flex-col relative">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-lg z-50"></div>
      
      <div className="flex-grow bg-android-background rounded-[2rem] overflow-hidden flex flex-col relative">
        <StatusBar onToggleNotifications={toggleNotificationPanel} notificationCount={notifications.length} />
        <div className="flex-grow overflow-y-auto relative screen-content" key={screenContentKey}>
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

