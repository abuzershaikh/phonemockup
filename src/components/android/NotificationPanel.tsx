'use client';

import React from 'react';
import { NotificationItem } from './NotificationItem';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface Notification {
  id: string;
  appIcon: React.ElementType;
  appName: string;
  title: string;
  text: string;
  time: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClearNotification: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export function NotificationPanel({ notifications, onClearNotification, onClearAll, onClose }: NotificationPanelProps) {
  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-50 flex flex-col">
      <div 
        className="h-10 flex items-center justify-end px-4"
        onClick={onClose}
        role="button"
        tabIndex={0}
        aria-label="Close notifications panel"
      >
        <X size={24} className="text-white/70 hover:text-white cursor-pointer" />
      </div>
      <div className="flex-grow p-3 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg">No new notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} onClear={onClearNotification} />
          ))
        )}
      </div>
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-700/30">
          <Button 
            variant="ghost" 
            className="w-full text-primary hover:bg-primary/10" 
            onClick={onClearAll}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
