'use client';

import { useState, useEffect } from 'react';
import { AgentSelector } from '@/components/co-pilot/agent-selector';
import { ChatView } from '@/components/co-pilot/chat-view';
import { agents, defaultPrimaryColorHSL, type Agent } from '@/lib/agents';
import { ActiveAgentDisplay } from '@/components/co-pilot/active-agent-display';

export function CoPilotMode() {
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

    useEffect(() => {
        const root = document.documentElement;
        
        if (selectedAgent) {
            root.style.setProperty('--primary', selectedAgent.primaryColorHSL);
        } else {
            // On initial load with no agent, ensure default color
            root.style.setProperty('--primary', defaultPrimaryColorHSL);
        }
        
        // Cleanup function to reset on unmount
        return () => {
             root.style.setProperty('--primary', defaultPrimaryColorHSL);
        }
    }, [selectedAgent]);
    
    if (!selectedAgent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <AgentSelector agents={agents} onSelectAgent={setSelectedAgent} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <ActiveAgentDisplay selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} />
            <ChatView selectedAgent={selectedAgent} agents={agents} />
        </div>
    );
}
