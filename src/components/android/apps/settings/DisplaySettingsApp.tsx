
'use client';

import React, { useState } from 'react';
import { AppScreen } from '../../AppScreen';
import type { AppId } from '../../AndroidMockup'; // AppId is now string
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SunMedium, Moon, Clock, CaseSensitive, Palette, Eye, Wand2, MonitorSmartphone, ChevronRight, ScreenShare, AlertTriangle } from 'lucide-react';

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  control?: React.ReactNode;
  onClick?: () => void;
  warning?: string;
  appId?: AppId; // string
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

interface DisplaySettingsAppProps {
  onNavigate: (appId: AppId) => void; // AppId is now string
}

export function DisplaySettingsApp({ onNavigate }: DisplaySettingsAppProps) {
  const [brightness, setBrightness] = useState(50);
  const [adaptiveBrightness, setAdaptiveBrightness] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const [nightLight, setNightLight] = useState(false);
  const [screenTimeout, setScreenTimeout] = useState('30 seconds');
  const [fontSize, setFontSize] = useState('Default');
  const [displaySize, setDisplaySize] = useState('Default');
  const [colors, setColors] = useState('Natural');
  const [screenSaver, setScreenSaver] = useState('Clock');

  const handleScreenTimeout = () => console.log('Open Screen Timeout settings');
  const handleFontSize = () => console.log('Open Font Size settings');
  const handleDisplaySize = () => console.log('Open Display Size settings');
  const handleColors = () => console.log('Open Color settings');
  const handleScreenSaver = () => console.log('Open Screen Saver settings');
  const handleLockScreen = () => console.log('Open Lock Screen settings');
  const handleWallpaperStyle = () => onNavigate('SETTINGS_WALLPAPER');


  return (
    <AppScreen appName="Display">
      <div className="space-y-2 pb-4">
        
        <div className="px-3 pt-2">
          <Label htmlFor="brightness-slider" className="text-sm font-medium text-android-primary-text">Brightness level</Label>
          <div className="flex items-center space-x-2 mt-1 mb-3">
            <SunMedium size={20} className="text-android-secondary-text" />
            <Slider
              id="brightness-slider"
              defaultValue={[brightness]}
              max={100}
              step={1}
              onValueChange={(value) => setBrightness(value[0])}
              className="w-full"
            />
          </div>
        </div>

        <SettingItem
          icon={Wand2}
          title="Adaptive brightness"
          description="Optimize brightness for available light"
          control={<Switch checked={adaptiveBrightness} onCheckedChange={setAdaptiveBrightness} id="adaptive-brightness-switch" />}
        />
        
        <Separator className="my-2" />

        <SettingItem
          icon={Palette}
          title="Wallpaper & style"
          description="Colors, themed icons, app grid"
          onClick={handleWallpaperStyle} 
          appId="SETTINGS_WALLPAPER"
        />

        <Separator className="my-2" />
        
        <p className="px-3 pt-2 pb-1 text-xs font-medium text-primary uppercase">Screen</p>
        <SettingItem
          icon={Moon}
          title="Dark theme"
          description={darkTheme ? "On" : "Off"}
          control={<Switch checked={darkTheme} onCheckedChange={setDarkTheme} id="dark-theme-switch" />}
        />
        <SettingItem
          icon={Eye}
          title="Night Light"
          description={nightLight ? `On, Schedule: Custom` : `Off`}
          control={<Switch checked={nightLight} onCheckedChange={setNightLight} id="night-light-switch" />}
          onClick={() => console.log("Open Night Light schedule settings")}
        />
        <SettingItem
          icon={Clock}
          title="Screen timeout"
          description={`After ${screenTimeout} of inactivity`}
          onClick={handleScreenTimeout}
        />
         <SettingItem
          icon={MonitorSmartphone}
          title="Lock screen"
          description="Privacy, add text on lock screen"
          onClick={handleLockScreen}
        />

        <Separator className="my-2" />
        <p className="px-3 pt-2 pb-1 text-xs font-medium text-primary uppercase">Display Size and Text</p>
         <SettingItem
          icon={CaseSensitive}
          title="Font size"
          description={fontSize}
          onClick={handleFontSize}
        />
        <SettingItem
          icon={MonitorSmartphone} 
          title="Display size"
          description={displaySize + (displaySize !== "Default" ? " (Non-standard)" : "")}
          warning={displaySize !== "Default" ? "Some apps may not display correctly" : undefined}
          onClick={handleDisplaySize}
        />
        <SettingItem
          icon={Palette} 
          title="Colors"
          description={colors}
          onClick={handleColors}
        />

        <Separator className="my-2" />
        <p className="px-3 pt-2 pb-1 text-xs font-medium text-primary uppercase">More Display Options</p>
         <SettingItem
          icon={ScreenShare} 
          title="Screen saver"
          description={screenSaver}
          onClick={handleScreenSaver}
        />

      </div>
    </AppScreen>
  );
}
