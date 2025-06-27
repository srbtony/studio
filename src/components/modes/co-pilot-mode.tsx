'use client';

import { useState } from 'react';
import { AgentSelector, type Agent } from '@/components/co-pilot/agent-selector';
import { ChatView } from '@/components/co-pilot/chat-view';

const agents: Agent[] = [
    { id: 'analyst', name: 'Analyst' },
    { id: 'product-manager', name: 'Product Manager' },
    { id: 'designer', name: 'Designer' },
    { id: 'ux-designer', name: 'UX Designer' },
    { id: 'software-developer', name: 'Software Developer' },
    { id: 'unity-developer', name: 'Unity Developer' },
];

export function CoPilotMode() {
    const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);

    return (
        <div className="flex flex-col gap-6">
            <AgentSelector agents={agents} selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} />
            <ChatView selectedAgent={selectedAgent} />
        </div>
    );
}
