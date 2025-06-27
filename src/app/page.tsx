'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { CoPilotMode } from '@/components/modes/co-pilot-mode';
import { AutopilotMode } from '@/components/modes/autopilot-mode';

type Mode = 'co-pilot' | 'autopilot';

export default function Home() {
  const [mode, setMode] = useState<Mode>('co-pilot');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-primary/20 shadow-[0_0_25px_0_hsl(var(--primary)/0.2)]">
          <Header activeMode={mode} setMode={setMode} />
          <div className="p-4 md:p-6 min-h-[80vh]">
            {mode === 'co-pilot' && <CoPilotMode />}
            {mode === 'autopilot' && <AutopilotMode />}
          </div>
        </div>
      </main>
    </div>
  );
}
