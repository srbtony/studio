'use client';

import { useState } from 'react';
import { AgentSelector, type Agent } from '@/components/co-pilot/agent-selector';
import { ChatView } from '@/components/co-pilot/chat-view';
import {
  BrainCircuit,
  ClipboardList,
  Palette,
  Accessibility,
  Code,
} from 'lucide-react';
import { UnityIcon } from '@/components/icons/unity-icon';


const agents: Agent[] = [
    { id: 'analyst', name: 'Analyst', icon: BrainCircuit, color: 'bg-cyan-900/40', avatarLabel: 'A' },
    { id: 'product-manager', name: 'Product Manager', icon: ClipboardList, color: 'bg-green-900/40', avatarLabel: 'PM' },
    { id: 'designer', name: 'Designer', icon: Palette, color: 'bg-yellow-900/40', avatarLabel: 'D' },
    { id: 'ux-designer', name: 'UX Designer', icon: Accessibility, color: 'bg-blue-900/40', avatarLabel: 'UX' },
    { id: 'software-developer', name: 'Software Developer', icon: Code, color: 'bg-orange-900/40', avatarLabel: 'S' },
    { id: 'unity-developer', name: 'Unity Developer', icon: UnityIcon, color: 'bg-gray-700/40', avatarLabel: 'U' },
];

export function CoPilotMode() {
    const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);

    return (
        <div className="flex flex-col gap-6">
            <AgentSelector agents={agents} selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} />
            <ChatView selectedAgent={selectedAgent} agents={agents} />
        </div>
    );
}
