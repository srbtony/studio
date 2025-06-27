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
    );
}
