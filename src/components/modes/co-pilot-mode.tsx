'use client';

import { useState, useEffect } from 'react';
import { AgentSelector } from '@/components/co-pilot/agent-selector';
import { ChatView } from '@/components/co-pilot/chat-view';
import { agents, defaultPrimaryColorHSL, type Agent } from '@/lib/agents';
import { ActiveAgentDisplay } from '@/components/co-pilot/active-agent-display';

export function CoPilotMode() {
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);
    const [pendingSourceAgent, setPendingSourceAgent] = useState<Agent | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        
        // Add transition for smooth color changes
        root.style.setProperty('transition', 'all 0.3s ease-in-out');
        
        if (selectedAgent) {
            root.style.setProperty('--primary', selectedAgent.primaryColorHSL);
        } else {
            // On initial load with no agent, ensure default color
            root.style.setProperty('--primary', defaultPrimaryColorHSL);
        }
        
        // Cleanup function to reset on unmount
        return () => {
             root.style.setProperty('--primary', defaultPrimaryColorHSL);
             root.style.removeProperty('transition');
        }
    }, [selectedAgent]);
    
    if (!selectedAgent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <AgentSelector agents={agents} onSelectAgent={setSelectedAgent} />
            </div>
        );
    }

    const handleSwitchAgent = async (agent: Agent, message?: string, sourceAgent?: Agent) => {
        if (message) {
            setPendingMessage(message);
            setPendingSourceAgent(sourceAgent || null);
        }
        
        // Start transition animation
        setIsTransitioning(true);
        
        // Small delay for smooth transition
        setTimeout(() => {
            setSelectedAgent(agent);
            setIsTransitioning(false);
        }, 300);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                <ActiveAgentDisplay selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} />
            </div>
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                <ChatView 
                    selectedAgent={selectedAgent} 
                    agents={agents} 
                    onSwitchAgent={handleSwitchAgent}
                    pendingMessage={pendingMessage}
                    pendingSourceAgent={pendingSourceAgent}
                    onPendingMessageSent={() => {
                        setPendingMessage(null);
                        setPendingSourceAgent(null);
                    }}
                />
            </div>
        </div>
    );
}
