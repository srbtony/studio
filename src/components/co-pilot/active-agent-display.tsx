'use client';

import { useState } from 'react';
import type { Agent } from '@/lib/agents';
import { agents } from '@/lib/agents';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AgentSelector } from './agent-selector';
import { ChevronsUpDown } from 'lucide-react';

interface ActiveAgentDisplayProps {
  selectedAgent: Agent;
  onSelectAgent: (agent: Agent) => void;
}

export function ActiveAgentDisplay({ selectedAgent, onSelectAgent }: ActiveAgentDisplayProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const handleSelect = (agent: Agent) => {
    onSelectAgent(agent);
    setPopoverOpen(false);
  }

  const AgentIcon = selectedAgent.icon;

  return (
    <div className="flex items-center">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-3 text-lg border-primary/50 hover:bg-primary/10">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                         <AgentIcon className="h-5 w-5" />
                    </div>
                    <span className="font-headline text-white">{selectedAgent.name}</span>
                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
                <AgentSelector
                    agents={agents}
                    selectedAgent={selectedAgent}
                    onSelectAgent={handleSelect}
                    showTitle={false}
                    className="grid-cols-2"
                />
            </PopoverContent>
        </Popover>
        <p className="text-muted-foreground ml-4 hidden md:block">You are chatting with the {selectedAgent.name}. Click to switch.</p>
    </div>
  );
}
