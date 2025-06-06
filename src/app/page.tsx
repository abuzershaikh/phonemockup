
'use client';

import React, { useState, useRef } from 'react';
import { AndroidMockup } from '@/components/android/AndroidMockup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { Settings as SettingsIcon, MessageSquare, Folder, AppWindow } from 'lucide-react';

// AppId is now string
export interface AndroidMockupHandles {
  navigateToPath: (path: string[]) => Promise<void>;
  setDataSaverEnabled: (enabled: boolean) => Promise<void>;
  setAppIcon: (appId: string, iconUri: string) => Promise<void>;
  addApp: (appName: string, iconUri: string) => Promise<boolean>; // New method
  getCurrentScreen: () => string;
}

const MAX_FILES_PER_UPLOAD = 20;

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
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (!androidMockupRef.current) {
      setFeedbackMessage('Mockup not ready to add apps.');
      if(event.target) event.target.value = '';
      return;
    }

    if (files.length > MAX_FILES_PER_UPLOAD) {
      setFeedbackMessage(`You can select a maximum of ${MAX_FILES_PER_UPLOAD} image files at a time.`);
      if(event.target) event.target.value = '';
      return;
    }

    let addedCount = 0;
    let failedCount = 0;

    setFeedbackMessage(`Processing ${files.length} file(s)...`);

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        console.warn(`Skipping non-image file: ${file.name}`);
        failedCount++;
        continue;
      }
      
      const appName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

      const reader = new FileReader();
      const promise = new Promise<boolean>((resolve, reject) => {
        reader.onloadend = async () => {
          const dataUri = reader.result as string;
          try {
            const success = await androidMockupRef.current!.addApp(appName, dataUri);
            resolve(success);
          } catch (error) {
            console.error(`Error adding app ${appName}:`, error);
            reject(false);
          }
        };
        reader.onerror = () => {
            console.error(`Error reading file ${file.name}`);
            reject(false);
        }
        reader.readAsDataURL(file);
      });

      try {
        const success = await promise;
        if (success) {
          addedCount++;
        } else {
          failedCount++;
        }
      } catch {
        failedCount++;
      }
    }
    
    let finalMessage = '';
    if (addedCount > 0) {
        finalMessage += `${addedCount} app(s) added successfully. `;
    }
    if (failedCount > 0) {
        finalMessage += `${failedCount} app(s) failed to add (e.g., non-image, limit reached, or error).`;
    }
    if (addedCount === 0 && failedCount === 0) {
        finalMessage = 'No files were processed.';
    }
    setFeedbackMessage(finalMessage.trim());

    if(event.target) event.target.value = ''; // Reset file input
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
        multiple // Allow multiple files
      />

      <Button 
        variant="outline" 
        size="icon" 
        className="fixed top-4 right-16 z-50 bg-card hover:bg-accent text-foreground"
        aria-label="Open File Manager to add app icons"
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
              Click the Folder icon to add new apps with custom icons.
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
