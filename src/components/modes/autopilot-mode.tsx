'use client';

import { BriefPanel } from '@/components/autopilot/brief-panel';
import { ForgePanel } from '@/components/autopilot/forge-panel';
import { BlueprintPanel } from '@/components/autopilot/blueprint-panel';
import { useState } from 'react';

export function AutopilotMode() {
    const [isScrumInitiated, setIsScrumInitiated] = useState(false);
    
    const handleInitiate = () => {
        setIsScrumInitiated(false);
        // Timeout to allow state to reset before re-triggering effects
        setTimeout(() => setIsScrumInitiated(true), 100);
    };

    return (
        <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-bold bg-primary/20 text-primary/80 rounded-full">
                        BETA
                    </span>
                    <h3 className="text-lg font-semibold text-primary/90">Autopilot Mode</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                    This feature is currently in development. Some functionality may be limited or experimental.
                </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <BriefPanel onInitiate={handleInitiate} />
                </div>
                <div className="lg:col-span-1">
                    <ForgePanel isScrumInitiated={isScrumInitiated} />
                </div>
                <div className="lg:col-span-1">
                    <BlueprintPanel isScrumInitiated={isScrumInitiated} />
                </div>
            </div>
        </div>
    );
}
