'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { ElementType } from 'react';

export interface Agent {
  id: string;
  name: string;
  icon: ElementType;
  color: string;
  avatarLabel: string;
}

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgent: Agent;
  onSelectAgent: (agent: Agent) => void;
}

export function AgentSelector({ agents, selectedAgent, onSelectAgent }: AgentSelectorProps) {
  return (
    <div>
      <h2 className="text-lg font-headline mb-4 text-white/80">Select an Agent:</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            onClick={() => onSelectAgent(agent)}
            className={cn(
              'cursor-pointer border-2 hover:border-primary transition-all duration-300 group',
              agent.color,
              selectedAgent.id === agent.id ? 'border-primary shadow-[0_0_15px_0px_hsl(var(--primary)/0.5)]' : 'border-transparent'
            )}
          >
            <CardContent className="p-4 flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-background flex items-center justify-center border-2 border-primary/20 group-hover:border-primary transition-all">
                <Image
                  src={`https://placehold.co/100x100/1a1a2e/be29ec.gif?text=${agent.avatarLabel}`}
                  alt={`${agent.name} animated portrait`}
                  width={96}
                  height={96}
                  className="rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                  data-ai-hint="futuristic robot"
                />
              </div>
              <p className="font-semibold text-center text-sm">{agent.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
