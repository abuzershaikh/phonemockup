
'use client';

import React, { useState, useRef } from 'react';
import { AndroidMockup, type AppId } from '@/components/android/AndroidMockup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { Settings as SettingsIcon, MessageSquare, Folder } from 'lucide-react';

export interface AndroidMockupHandles {
  navigateToPath: (path: AppId[]) => Promise<void>;
  setDataSaverEnabled: (enabled: boolean) => Promise<void>;
  setAppIcon: (appId: AppId, iconUri: string) => Promise<void>;
  getCurrentScreen: () => AppId;
}

export default function Home() {
  const [command, setCommand] = useState('');
  const androidMockupRef = useRef<AndroidMockupHandles>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const executeCommand = async () => {
    if (!androidMockupRef.current) {
      setFeedbackMessage('Mockup not ready.');
      return;
    }

    const normalizedCommand = command.trim().toLowerCase();
    setFeedbackMessage(`Executing: ${command}...`);

    if (normalizedCommand === 'turn data saver on') {
      try {
        await androidMockupRef.current.navigateToPath(['SETTINGS', 'SETTINGS_NETWORK']);
        await androidMockupRef.current.setDataSaverEnabled(true);
        setFeedbackMessage('Data Saver turned ON.');
      } catch (error) {
        console.error("Error executing command:", error);
        setFeedbackMessage('Failed to execute command.');
      }
    } else if (normalizedCommand === 'turn data saver off') {
      try {
        await androidMockupRef.current.navigateToPath(['SETTINGS', 'SETTINGS_NETWORK']);
        await androidMockupRef.current.setDataSaverEnabled(false);
        setFeedbackMessage('Data Saver turned OFF.');
      } catch (error) {
        console.error("Error executing command:", error);
        setFeedbackMessage('Failed to execute command.');
      }
    } else {
      setFeedbackMessage(`Unknown command: "${command}"`);
    }
    setCommand(''); // Clear input after execution
  };

  const handleFileManagerClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && androidMockupRef.current) {
      if (!file.type.startsWith('image/')) {
        setFeedbackMessage('Please select an image file.');
        if(event.target) event.target.value = ''; // Reset file input
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        try {
          // For this example, we'll change the Messages app icon.
          // In a real app, you'd have a way to select which app to change.
          await androidMockupRef.current?.setAppIcon('MESSAGES', dataUri);
          setFeedbackMessage(`Selected image "${file.name}" and updated Messages app icon.`);
        } catch (error) {
          console.error("Error setting app icon:", error);
          setFeedbackMessage('Failed to set app icon.');
        }
      };
      reader.readAsDataURL(file);
    }
     if(event.target) event.target.value = ''; // Reset file input to allow selecting the same file again
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <main className="flex-1 flex items-center justify-center p-4 relative">
        <AndroidMockup ref={androidMockupRef} />
      </main>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelected} 
        style={{ display: 'none' }} 
        accept="image/*"
      />

      <Button 
        variant="outline" 
        size="icon" 
        className="fixed top-4 right-16 z-50 bg-card hover:bg-accent text-foreground"
        aria-label="Open File Manager to change app icon"
        onClick={handleFileManagerClick}
      >
        <Folder className="h-5 w-5" />
      </Button>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="fixed top-4 right-4 z-50 bg-card hover:bg-accent text-foreground"
            aria-label="Open Command Panel"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[350px] sm:w-[400px] bg-card text-card-foreground flex flex-col">
          <SheetHeader>
            <SheetTitle className="text-foreground">Command Panel</SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Enter commands to interact with the Android mockup.
              Try: "turn data saver on" or "turn data saver off".
              Click the Folder icon to change the Messages app icon.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-grow py-4 space-y-4">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                placeholder="e.g., turn data saver on"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    executeCommand();
                  }
                }}
                className="bg-background text-foreground border-input"
              />
              <Button type="submit" onClick={executeCommand} variant="secondary">Execute</Button>
            </div>
            {feedbackMessage && (
              <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{feedbackMessage}</p>
            )}
          </div>
          <SheetFooter>
            {/* Optional footer content */}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
