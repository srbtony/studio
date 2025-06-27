'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { Agent } from '@/lib/agents';

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgent?: Agent;
  onSelectAgent: (agent: Agent) => void;
  showTitle?: boolean;
  className?: string;
}

export function AgentSelector({ agents, selectedAgent, onSelectAgent, showTitle = true, className }: AgentSelectorProps) {
  return (
    <div>
      {showTitle && <h2 className="text-lg font-headline mb-4 text-white/80 text-center">Select an Agent to begin:</h2>}
      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", className)}>
        {agents.map((agent) => (
          <Card
            key={agent.id}
            onClick={() => onSelectAgent(agent)}
            className={cn(
              'cursor-pointer border-2 hover:border-primary transition-all duration-300 group',
              'bg-secondary/30',
              selectedAgent?.id === agent.id ? 'border-primary shadow-[0_0_15px_0px_hsl(var(--primary)/0.5)]' : 'border-primary/20'
            )}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
