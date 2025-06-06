'use client';

import React from 'react';
import { AppScreen } from '../AppScreen';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const messages = [
  { id: '1', name: 'Alice Wonderland', message: 'See you at the tea party!', time: '10:30 AM', unread: 2, avatar: 'https://placehold.co/40x40.png?text=AW' },
  { id: '2', name: 'Bob The Builder', message: 'Can we fix it? Yes we can!', time: '9:15 AM', unread: 0, avatar: 'https://placehold.co/40x40.png?text=BB' },
  { id: '3', name: 'Charlie Brown', message: 'Good grief! Lost my kite again.', time: 'Yesterday', unread: 0, avatar: 'https://placehold.co/40x40.png?text=CB' },
  { id: '4', name: 'Diana Prince', message: 'Wondering about dinner plans...', time: 'Sun', unread: 1, avatar: 'https://placehold.co/40x40.png?text=DP' },
];

export function MessagesApp() {
  return (
    <AppScreen appName="Messages">
      <div className="space-y-2 relative h-full">
        {messages.map((msg) => (
          <button 
            key={msg.id} 
            className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-neutral-700/50 rounded-lg transition-colors text-left focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label={`Conversation with ${msg.name}`}
          >
            <Avatar>
              <AvatarImage src={msg.avatar} alt={msg.name} data-ai-hint="profile avatar" />
              <AvatarFallback>{msg.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <p className={`font-medium text-android-primary-text ${msg.unread > 0 ? 'font-bold' : ''}`}>{msg.name}</p>
                <span className={`text-xs ${msg.unread > 0 ? 'text-primary font-semibold' : 'text-android-secondary-text'}`}>{msg.time}</span>
              </div>
              <p className={`text-sm truncate ${msg.unread > 0 ? 'text-android-primary-text font-semibold' : 'text-android-secondary-text'}`}>{msg.message}</p>
            </div>
            {msg.unread > 0 && (
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">{msg.unread}</div>
            )}
          </button>
        ))}
        <div className="absolute bottom-4 right-4">
          <Button size="lg" className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg" aria-label="New message">
            <PlusCircle size={28} className="text-primary-foreground" />
          </Button>
        </div>
      </div>
    </AppScreen>
  );
}
