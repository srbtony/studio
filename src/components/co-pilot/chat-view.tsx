'use client';

import { useState, useRef, useEffect } from 'react';
import type { Agent } from './agent-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  BrainCircuit,
  ClipboardList,
  Palette,
  Accessibility,
  Code,
  Send,
  User,
} from 'lucide-react';
import { UnityIcon } from '@/components/icons/unity-icon';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  text: string;
  sender: 'user' | string; // agent.id or 'user'
}

const agentDetails: { [key: string]: { icon: React.ElementType, color: string } } = {
  'analyst': { icon: BrainCircuit, color: 'bg-cyan-900/40' },
  'product-manager': { icon: ClipboardList, color: 'bg-green-900/40' },
  'designer': { icon: Palette, color: 'bg-yellow-900/40' },
  'ux-designer': { icon: Accessibility, color: 'bg-blue-900/40' },
  'software-developer': { icon: Code, color: 'bg-orange-900/40' },
  'unity-developer': { icon: UnityIcon, color: 'bg-gray-700/40' },
};

interface ChatViewProps {
  selectedAgent: Agent;
}

export function ChatView({ selectedAgent }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ id: Date.now(), text: `Hello! I'm the ${selectedAgent.name}. How can I assist you today?`, sender: selectedAgent.id }]);
    setInput('');
  }, [selectedAgent]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    const agentResponse: Message = { id: Date.now() + 1, text: `This is a simulated response from the ${selectedAgent.name} about "${input}". I am processing your request and will provide a detailed analysis shortly.`, sender: selectedAgent.id };
    
    setMessages(prev => [...prev, userMessage, agentResponse]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[60vh] bg-secondary/30 rounded-lg border border-primary/10">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4">
          {messages.map((message) => {
            const agentDetail = agentDetails[message.sender];
            const AgentIcon = agentDetail?.icon || BrainCircuit;
            return (
              <div key={message.id} className={cn('flex items-end gap-2', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                {message.sender !== 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={agentDetail?.color}>
                      <AgentIcon className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={cn('max-w-md lg:max-w-2xl p-3 rounded-lg shadow-md', message.sender === 'user' ? 'bg-[#2a2a3e] text-white rounded-br-none' : `${agentDetail?.color} text-white/90 rounded-bl-none`)}>
                  <p className="text-sm">{message.text}</p>
                  {message.sender !== 'user' && (
                    <div className="flex items-center gap-2 mt-2 border-t border-white/10 pt-2">
                      <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-muted-foreground hover:bg-primary/20 hover:text-white">Forward To...</Button>
                      <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-muted-foreground hover:bg-primary/20 hover:text-white">Edit & Forward</Button>
                    </div>
                  )}
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary">
                      <User className="h-5 w-5 text-accent" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
      <form onSubmit={handleSend} className="p-4 border-t border-primary/10 flex items-center gap-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Chat with the ${selectedAgent.name}...`}
          className="flex-1 bg-background focus:ring-accent"
        />
        <Button type="submit" size="icon" className="bg-primary hover:bg-primary/80 shrink-0">
          <Send className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
