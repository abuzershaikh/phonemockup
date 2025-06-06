'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from './StatusBar';
import { NavigationBar } from './NavigationBar';
import { HomeScreen } from './HomeScreen';
import { SettingsApp } from './apps/SettingsApp';
import { MessagesApp } from './apps/MessagesApp';
import { CameraApp } from './apps/CameraApp';
import { PlaceholderApp } from './apps/PlaceholderApp';
import { NotificationPanel, type Notification } from './NotificationPanel';
import { RecentsScreen } from './RecentsScreen';
import { MessageSquare, Settings, Camera, Phone, Chrome, Image as ImageIcon, Play } from 'lucide-react';

export type AppId = 'HOME' | 'SETTINGS' | 'MESSAGES' | 'CAMERA' | 'PHONE' | 'CHROME' | 'PHOTOS' | 'PLAY_STORE' | 'RECENTS';

export interface AppDefinition {
  id: AppId;
  name: string;
  icon: React.ElementType;
  bgColor?: string; // Optional background color for the icon tile
}

const initialApps: AppDefinition[] = [
  { id: 'PHONE', name: 'Phone', icon: Phone, bgColor: 'bg-green-500' },
  { id: 'MESSAGES', name: 'Messages', icon: MessageSquare, bgColor: 'bg-blue-500' },
  { id: 'CHROME', name: 'Chrome', icon: Chrome, bgColor: 'bg-yellow-400' },
  { id: 'CAMERA', name: 'Camera', icon: Camera, bgColor: 'bg-red-500' },
  { id: 'SETTINGS', name: 'Settings', icon: Settings, bgColor: 'bg-gray-500' },
  { id: 'PHOTOS', name: 'Photos', icon: ImageIcon, bgColor: 'bg-purple-500' },
  { id: 'PLAY_STORE', name: 'Play Store', icon: Play, bgColor: 'bg-teal-500' },
];


export function AndroidMockup() {
  const [currentScreen, setCurrentScreen] = useState<AppId>('HOME');
  const [navigationStack, setNavigationStack] = useState<AppId[]>(['HOME']);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', appIcon: MessageSquare, appName: 'Messages', title: 'John Doe', text: 'Hey, are you free tonight?', time: '5m ago' },
    { id: '2', appIcon: Settings, appName: 'System Update', title: 'Update available', text: 'New security patch ready to install.', time: '1h ago' },
  ]);
  const [recentApps, setRecentApps] = useState<AppId[]>([]);

  const navigateTo = useCallback((appId: AppId) => {
    if (appId === currentScreen && appId !== 'HOME') return;

    setCurrentScreen(appId);
    setNavigationStack(prev => {
      const newStack = [...prev, appId];
      // Limit stack size to avoid excessive memory use, e.g., 10
      return newStack.slice(Math.max(0, newStack.length - 10));
    });

    if (appId !== 'HOME' && appId !== 'RECENTS') {
        setRecentApps(prev => {
            const filtered = prev.filter(id => id !== appId);
            const newRecents = [appId, ...filtered];
            return newRecents.slice(0, 5); // Keep only last 5 recent apps
        });
    }
    setShowNotifications(false); // Close notifications on app change
  }, [currentScreen]);

  const goBack = useCallback(() => {
    if (showNotifications) {
      setShowNotifications(false);
      return;
    }
    setNavigationStack(prev => {
      if (prev.length <= 1) {
        setCurrentScreen('HOME'); // Or exit app, but here means go home
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
      goBack(); // Or navigate to previous app before recents
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
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen apps={initialApps} onAppClick={navigateTo} />;
      case 'SETTINGS':
        return <SettingsApp />;
      case 'MESSAGES':
        return <MessagesApp />;
      case 'CAMERA':
        return <CameraApp />;
      case 'RECENTS':
        return <RecentsScreen recentApps={recentApps.map(id => initialApps.find(app => app.id === id)).filter(Boolean) as AppDefinition[]} onAppClick={navigateTo} onClearApp={removeFromRecents} onClearAll={() => setRecentApps([])} />;
      case 'PHONE':
      case 'CHROME':
      case 'PHOTOS':
      case 'PLAY_STORE':
        return <PlaceholderApp appName={initialApps.find(app => app.id === currentScreen)?.name || 'App'} />;
      default:
        return <HomeScreen apps={initialApps} onAppClick={navigateTo} />;
    }
  };

  // Handle hardware back button (browser back)
  useEffect(() => {
    const handlePopState = () => {
      if (navigationStack.length > 1) {
        goBack();
      }
      // If already at home, default browser behavior takes over (or do nothing)
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [goBack, navigationStack.length]);


  return (
    <div className="w-[412px] h-[892px] bg-black rounded-4xl p-3 shadow-phone overflow-hidden flex flex-col relative">
      {/* Notch/Camera cutout area - purely visual */}
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
}
