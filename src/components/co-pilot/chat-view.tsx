'use client';

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import type { Agent } from '@/lib/agents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader, Send, User, Forward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mcpChat } from '@/ai/flows/mcp-flow';
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Message {
  id: number;
  text: string;
  sender: 'user' | string; // agent.id or 'user'
  isForwarded?: boolean;
  forwardedFrom?: string; // agent.id of source agent
}

interface ChatViewProps {
  selectedAgent: Agent;
  agents: Agent[];
  onSwitchAgent?: (agent: Agent, message?: string, sourceAgent?: Agent) => void;
  pendingMessage?: string | null;
  pendingSourceAgent?: Agent | null;
  onPendingMessageSent?: () => void;
}

export function ChatView({ selectedAgent, agents, onSwitchAgent, pendingMessage, pendingSourceAgent, onPendingMessageSent }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editText, setEditText] = useState('');
  const [editTargetAgentId, setEditTargetAgentId] = useState<string>('');

  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const editViewRef = useRef<HTMLDivElement>(null);

  const getAgentDetails = (agentId: string): Agent | undefined => {
    return agents.find(a => a.id === agentId);
  };
  
  useEffect(() => {
    // Clear messages and show initial greeting from new agent
    setMessages([{ id: Date.now(), text: `Hello! I'm the ${selectedAgent.name}. How can I assist you today?`, sender: selectedAgent.id }]);
    setInput('');
    setEditingMessage(null);
  }, [selectedAgent]);
  
  // Separate effect for handling pending messages
  useEffect(() => {
    if (pendingMessage && selectedAgent) {
      // Add clean forwarded message with metadata
      const forwardedMessage: Message = {
        id: Date.now(),
        text: pendingMessage,
        sender: 'user',
        isForwarded: true,
        forwardedFrom: pendingSourceAgent?.id
      };
      setMessages(prev => [...prev, forwardedMessage]);
      
      const timer = setTimeout(async () => {
        // Send to agent but don't add duplicate user message
        setIsLoading(true);
        try {
          const result = await mcpChat({
            agentId: selectedAgent.id,
            agentName: selectedAgent.name,
            message: pendingMessage,
          });
          
          const agentResponse: Message = { 
            id: Date.now() + 1, 
            text: result.response, 
            sender: selectedAgent.id
          };
          
          setMessages(prev => [...prev, agentResponse]);
        } catch (error) {
          console.error(error);
          toast({
            variant: "destructive",
            title: "An error occurred",
            description: "Failed to get a response from the agent.",
          });
        } finally {
          setIsLoading(false);
        }
        onPendingMessageSent?.();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [pendingMessage, selectedAgent, pendingSourceAgent, onPendingMessageSent, toast]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  useEffect(() => {
    if (editingMessage && editViewRef.current) {
      editViewRef.current.scrollIntoView({ behavior: 'smooth' });
      const targetAgent = agents.find(a => a.id !== editingMessage.sender);
      if(targetAgent) setEditTargetAgentId(targetAgent.id);
    }
  }, [editingMessage, agents]);

  const doSend = useCallback(async (messageText: string, agent: Agent) => {
    if (messageText.trim() === '' || isLoading) return;
    
    setIsLoading(true);

    // Add user message to UI first for immediate feedback
    if(agent.id === selectedAgent.id) {
        const userMessage: Message = { id: Date.now(), text: messageText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
    }
    
    try {
      const result = await mcpChat({
        agentId: agent.id,
        agentName: agent.name,
        message: messageText,
      });

      const agentResponse: Message = { 
        id: Date.now() + 1, 
        text: result.response, 
        sender: agent.id
      };
      
      setMessages(prev => [...prev, agentResponse]);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get a response from the agent.",
      });
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I'm sorry, but I encountered an error. Please try again later.",
        sender: agent.id,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedAgent, toast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await doSend(input, selectedAgent);
    setInput('');
  };

  const handleForward = async (originalMessageText: string, targetAgent: Agent) => {
    if (onSwitchAgent) {
      // Switch to target agent's tab and auto-send message with source info
      onSwitchAgent(targetAgent, originalMessageText, selectedAgent);
    } else {
      // Fallback to current behavior if no switch handler
      const infoMessage: Message = { 
         id: Date.now(), 
         text: `You forwarded a message to ${targetAgent.name}.`, 
         sender: 'user'
      };
      setMessages(prev => [...prev, infoMessage]);
      await doSend(originalMessageText, targetAgent);
    }
  };

  const handleEditAndForward = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingMessage || !editTargetAgentId || !editText) return;
    
    const targetAgent = getAgentDetails(editTargetAgentId);
    if (!targetAgent) return;

    if (onSwitchAgent) {
      // Switch to target agent's tab and auto-send edited message with source info
      onSwitchAgent(targetAgent, editText, selectedAgent);
      setEditingMessage(null);
      setEditText('');
      setEditTargetAgentId('');
    } else {
      // Fallback to current behavior if no switch handler
      const infoMessage: Message = { 
          id: Date.now(), 
          text: `You are editing and forwarding a message to ${targetAgent.name}...`, 
          sender: 'user'
      };
      setMessages(prev => [...prev, infoMessage]);
      await doSend(editText, targetAgent);
      setEditingMessage(null);
      setEditText('');
      setEditTargetAgentId('');
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-[70vh] bg-secondary/30 rounded-lg border border-primary/10">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="flex flex-col gap-4">
          {messages.map((message) => {
            const agentDetail = getAgentDetails(message.sender);
            const AgentIcon = agentDetail?.icon;
            return (
              <div key={message.id} className={cn('flex items-end gap-2', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                {message.sender !== 'user' && agentDetail && AgentIcon && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-8 w-8 cursor-help">
                        <AvatarFallback className={cn(agentDetail.color, 'border border-primary/50')}>
                          <AgentIcon className="h-5 w-5 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{agentDetail.name}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <div className={cn('max-w-full p-3 rounded-lg shadow-md', message.sender === 'user' ? 'bg-[#2a2a3e] text-white rounded-br-none' : `${agentDetail?.color || 'bg-secondary'} text-white/90 rounded-bl-none`)}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.sender !== 'user' && (
                    <div className="flex items-center gap-2 mt-2 border-t border-white/10 pt-2">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-muted-foreground hover:bg-primary/20 hover:text-white">Forward To...</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {agents.filter(a => a.id !== message.sender).map(agent => (
                            <DropdownMenuItem key={agent.id} onClick={() => handleForward(message.text, agent)}>
                              {agent.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-muted-foreground hover:bg-primary/20 hover:text-white" onClick={() => { setEditingMessage(message); setEditText(message.text); }}>Edit & Forward</Button>
                    </div>
                  )}
                </div>
                {message.sender === 'user' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-8 w-8 cursor-help">
                        <AvatarFallback className={cn(
                          message.isForwarded && message.forwardedFrom 
                            ? getAgentDetails(message.forwardedFrom)?.color || 'bg-secondary'
                            : 'bg-secondary'
                        )}>
                          {message.isForwarded && message.forwardedFrom ? (
                            (() => {
                              const sourceAgent = getAgentDetails(message.forwardedFrom);
                              const SourceIcon = sourceAgent?.icon;
                              return SourceIcon ? <SourceIcon className="h-5 w-5 text-primary" /> : <User className="h-5 w-5 text-accent" />;
                            })()
                          ) : (
                            <User className="h-5 w-5 text-accent" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {message.isForwarded && message.forwardedFrom 
                          ? `Forwarded from ${getAgentDetails(message.forwardedFrom)?.name}`
                          : 'You'
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )
          })}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
               <Avatar className="h-8 w-8">
                <AvatarFallback className={cn(selectedAgent.color, 'border border-primary/50')}>
                  <Loader className="h-5 w-5 text-primary animate-spin" />
                </AvatarFallback>
              </Avatar>
              <div className={cn('max-w-md lg:max-w-2xl p-3 rounded-lg shadow-md', `${selectedAgent.color || 'bg-secondary'} text-white/90 rounded-bl-none`)}>
                  <p className="text-sm italic">Thinking...</p>
              </div>
            </div>
          )}
          </div>
        </ScrollArea>
      
      {editingMessage && (
        <div ref={editViewRef} className="p-4 border-y border-primary/10 bg-background/50">
          <form onSubmit={handleEditAndForward} className="space-y-3">
            <h3 className="text-sm font-semibold">Edit & Forward message from <span className="text-accent">{getAgentDetails(editingMessage.sender)?.name}</span></h3>
            <Textarea 
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="bg-background min-h-[100px]"
            />
            <div className="flex justify-between items-center">
              <Select onValueChange={setEditTargetAgentId} value={editTargetAgentId}>
                <SelectTrigger className="w-[200px] bg-background">
                  <SelectValue placeholder="Select agent..." />
                </SelectTrigger>
                <SelectContent>
                  {agents.filter(a => a.id !== editingMessage.sender).map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingMessage(null)}>Cancel</Button>
                <Button type="submit" disabled={isLoading || !editTargetAgentId}>
                  {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-primary/10 flex items-center gap-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Chat with the ${selectedAgent.name}...`}
          className="flex-1 bg-background focus:ring-accent"
          disabled={isLoading || !!editingMessage}
        />
        <Button type="submit" size="icon" className="bg-primary hover:bg-primary/80 shrink-0" disabled={isLoading || !!editingMessage}>
          {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          <span className="sr-only">Send</span>
        </Button>
        </form>
      </div>
    </TooltipProvider>
  );
}
