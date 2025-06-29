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
        <div className="h-8 w-8 flex items-center justify-center bg-primary/20 rounded-lg border border-primary/30 overflow-hidden">
          <span className="text-3xl font-black text-primary italic transform -skew-x-12 leading-none">
            Z
          </span>
        </div>
        <h1 className="text-2xl font-headline font-bold text-white tracking-tight flex items-center gap-1">
          Studio 
          <span className="inline-block w-6 h-6 bg-primary border-2 border-primary rounded-sm flex items-center justify-center text-sm font-bold text-white italic">
            a
          </span>
          i
        </h1>
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
            'font-headline transition-colors duration-200 relative',
            activeMode === 'autopilot'
              ? 'bg-primary/20 text-white'
              : 'text-muted-foreground hover:bg-primary/10 hover:text-white'
          )}
        >
          Autopilot Mode
          <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-primary/20 text-primary/80 rounded-full">
            BETA
          </span>
        </Button>
      </nav>
    </header>
  );
}
