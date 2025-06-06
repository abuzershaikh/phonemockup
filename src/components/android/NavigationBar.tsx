'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { HomeIcon } from './icons/HomeIcon';
import { BackIcon } from './icons/BackIcon';
import { RecentsIcon } from './icons/RecentsIcon';

interface NavigationBarProps {
  onHome: () => void;
  onBack: () => void;
  onRecents: () => void;
}

export function NavigationBar({ onHome, onBack, onRecents }: NavigationBarProps) {
  const iconStyle = "w-6 h-6 text-android-nav-bar-buttons group-active:scale-90 transition-transform";

  return (
    <div className="h-14 bg-android-nav-bar-bg flex items-center justify-around sticky bottom-0 z-20 border-t border-gray-700/20">
      <Button variant="ghost" size="icon" onClick={onBack} className="group w-20 h-full rounded-none flex-1 hover:bg-white/10 active:bg-white/20" aria-label="Back">
        <BackIcon className={iconStyle} />
      </Button>
      <Button variant="ghost" size="icon" onClick={onHome} className="group w-20 h-full rounded-none flex-1 hover:bg-white/10 active:bg-white/20" aria-label="Home">
        <HomeIcon className={iconStyle} />
      </Button>
      <Button variant="ghost" size="icon" onClick={onRecents} className="group w-20 h-full rounded-none flex-1 hover:bg-white/10 active:bg-white/20" aria-label="Recent apps">
        <RecentsIcon className={iconStyle} />
      </Button>
    </div>
  );
}
