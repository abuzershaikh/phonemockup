'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Notification } from './NotificationPanel';

interface NotificationItemProps {
  notification: Notification;
  onClear: (id: string) => void;
}

export function NotificationItem({ notification, onClear }: NotificationItemProps) {
  const AppSpecificIcon = notification.appIcon;
  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md p-3 rounded-xl shadow-md mb-2 flex items-start space-x-3 text-android-primary-text">
      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
        <AppSpecificIcon size={18} />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-xs font-semibold">{notification.appName}</span>
          <span className="text-xs text-android-secondary-text">{notification.time}</span>
        </div>
        <p className="text-sm font-medium">{notification.title}</p>
        <p className="text-xs text-android-secondary-text">{notification.text}</p>
      </div>
      <Button variant="ghost" size="icon" className="flex-shrink-0 w-6 h-6 text-android-secondary-text hover:text-red-500" onClick={() => onClear(notification.id)} aria-label="Clear notification">
        <X size={16} />
      </Button>
    </div>
  );
}
