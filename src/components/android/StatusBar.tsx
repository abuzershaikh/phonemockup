'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryFull, Signal, Bell } from 'lucide-react';

interface StatusBarProps {
  onToggleNotifications: () => void;
  notificationCount: number;
}

export function StatusBar({ onToggleNotifications, notificationCount }: StatusBarProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const intervalId = setInterval(updateClock, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div 
      className="h-10 bg-android-status-bar-bg text-android-foreground px-4 flex items-center justify-between text-sm sticky top-0 z-40 cursor-pointer"
      onClick={onToggleNotifications}
      role="button"
      tabIndex={0}
      aria-label="Toggle notifications panel"
    >
      <div className="flex items-center space-x-1">
        {notificationCount > 0 && <Bell size={14} className="text-blue-500" />}
        <span>{time}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Signal size={16} />
        <Wifi size={16} />
        <BatteryFull size={16} />
      </div>
    </div>
  );
}
