'use client';

import type { Dispatch, SetStateAction } from 'react';
import { LogoIcon } from '@/components/icons/logo-icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Mode = 'co-pilot' | 'autopilot';

interface HeaderProps {
  activeMode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
}

export function Header({ activeMode, setMode }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-primary/20">
      <div className="flex items-center gap-3">
        <LogoIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-headline font-bold text-white">AI Forge</h1>
      </div>
      <nav className="flex items-center gap-2 p-1 bg-background/50 rounded-lg border border-primary/10">
        <Button
          variant="ghost"
          onClick={() => setMode('co-pilot')}
          className={cn(
            'font-headline transition-colors duration-200',
            activeMode === 'co-pilot'
              ? 'bg-primary/20 text-white'
              : 'text-muted-foreground hover:bg-primary/10 hover:text-white'
          )}
        >
          Co-Pilot Mode
        </Button>
        <Button
          variant="ghost"
          onClick={() => setMode('autopilot')}
          className={cn(
            'font-headline transition-colors duration-200',
            activeMode === 'autopilot'
              ? 'bg-primary/20 text-white'
              : 'text-muted-foreground hover:bg-primary/10 hover:text-white'
          )}
        >
          Autopilot Mode
        </Button>
      </nav>
    </header>
  );
}
