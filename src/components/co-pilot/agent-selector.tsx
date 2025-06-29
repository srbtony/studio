'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    <TooltipProvider delayDuration={1000}>
      <div>
        {showTitle && <h2 className="text-lg font-headline mb-4 text-white/80 text-center">Select an Agent to begin:</h2>}
        <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", className)}>
        {agents.map((agent) => (
          <Tooltip key={agent.id}>
            <TooltipTrigger asChild>
              <Card
                onClick={() => onSelectAgent(agent)}
                className={cn(
                  'cursor-pointer border-2 transition-all duration-300 group',
                  'bg-secondary/30',
                  selectedAgent?.id === agent.id ? 'border-primary shadow-[0_0_15px_0px_hsl(var(--primary)/0.5)]' : 'border-primary/20'
                )}
                style={{
                  '--agent-primary': agent.primaryColorHSL
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `hsl(${agent.primaryColorHSL})`;
                  e.currentTarget.style.boxShadow = `0 0 20px 0px hsl(${agent.primaryColorHSL} / 0.4)`;
                }}
                onMouseLeave={(e) => {
                  if (selectedAgent?.id !== agent.id) {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }
                }}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    agent.color,
                    "border-white/20 group-hover:border-white/50"
                  )}>
                    {agent.icon && (
                      <agent.icon className="h-8 w-8 text-white" />
                    )}
                    <span className="text-white font-bold text-lg">
                      {agent.avatarLabel}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{agent.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
