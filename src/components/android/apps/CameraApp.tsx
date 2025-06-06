'use client';

import React from 'react';
import { AppScreen } from '../AppScreen';
import Image from 'next/image';
import { Camera as CameraIcon, RefreshCw, Settings } from 'lucide-react'; // Renamed to avoid conflict
import { Button } from '@/components/ui/button';


export function CameraApp() {
  return (
    <AppScreen appName="Camera" bgColor="bg-black" textColor="text-white" headerColor="bg-black/50">
      <div className="h-full flex flex-col items-center justify-between relative">
        {/* Viewfinder */}
        <div className="w-full flex-grow bg-neutral-800 relative overflow-hidden my-2 rounded-md">
          <Image 
            src="https://placehold.co/480x640.png" 
            alt="Camera viewfinder" 
            layout="fill" 
            objectFit="cover"
            data-ai-hint="city street" 
          />
          {/* Top controls overlay */}
          <div className="absolute top-2 right-2">
             <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" aria-label="Camera settings">
                <Settings size={20} />
            </Button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="w-full flex items-center justify-around py-4">
          <div className="w-12 h-12 rounded-md bg-neutral-700/50 overflow-hidden">
             {/* Thumbnail placeholder */}
             <Image src="https://placehold.co/64x64.png" alt="Last photo thumbnail" width={48} height={48} objectFit="cover" data-ai-hint="photo thumbnail" />
          </div>
          <Button variant="outline" size="icon" className="w-20 h-20 rounded-full border-4 border-white bg-white/30 hover:bg-white/50 active:bg-white/70" aria-label="Take photo">
            <CameraIcon size={36} className="text-white" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 w-12 h-12" aria-label="Switch camera">
            <RefreshCw size={24} />
          </Button>
        </div>
      </div>
    </AppScreen>
  );
}
