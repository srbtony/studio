'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import { BarChart3, Palette, User, Code, Gamepad2, Users, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ForgePanelProps {
    isScrumInitiated: boolean;
}

const agents = [
    { name: 'Analyst', icon: BarChart3, color: 'bg-blue-500' },
    { name: 'Product Manager', icon: Users, color: 'bg-green-500' },
    { name: 'Designer', icon: Palette, color: 'bg-yellow-500' },
    { name: 'UX Designer', icon: User, color: 'bg-purple-500' },
    { name: 'Software Developer', icon: Code, color: 'bg-red-500' },
    { name: 'Unity Developer', icon: Gamepad2, color: 'bg-orange-500' }
];

const meetingMinutes = [
    { speaker: 'Analyst', message: 'Based on the data, Day 7 retention dropped 15% last week. Main pain points are tutorial complexity and reward pacing.' },
    { speaker: 'Product Manager', message: 'We need to prioritize this. What\'s the quickest win we can implement?' },
    { speaker: 'Designer', message: 'I suggest simplifying the tutorial flow and adding visual progress indicators.' },
    { speaker: 'Analyst', message: 'Data shows users drop off at step 3 of tutorial. Can we reduce steps from 7 to 4?' },
    { speaker: 'UX Designer', message: 'Agreed. I\'ll create wireframes for a streamlined 4-step tutorial with better visual hierarchy.' },
    { speaker: 'Software Developer', message: 'Tutorial changes are feasible. Estimated 3 days for implementation.' },
    { speaker: 'Unity Developer', message: 'I can handle the reward system adjustments. Need 2 days for testing.' },
    { speaker: 'Product Manager', message: 'Perfect. Let\'s proceed with this approach. Timeline looks good for next sprint.' }
];

export function ForgePanel({ isScrumInitiated }: ForgePanelProps) {
    const [activeAgents, setActiveAgents] = useState<number[]>([]);
    const [visibleMinutes, setVisibleMinutes] = useState(0);
    const { toast } = useToast();

    useEffect(() => {
        if (isScrumInitiated) {
            setActiveAgents([]);
            setVisibleMinutes(0);
            
            // Simulate collaborative discussion
            const interval = setInterval(() => {
                setVisibleMinutes(prev => {
                    if (prev < meetingMinutes.length) {
                        const speakerIndex = agents.findIndex(a => a.name === meetingMinutes[prev].speaker);
                        setActiveAgents(current => {
                            if (!current.includes(speakerIndex)) {
                                return [...current, speakerIndex];
                            }
                            return current;
                        });
                        return prev + 1;
                    }
                    clearInterval(interval);
                    return prev;
                });
            }, 2000); // 2 seconds per message
            return () => clearInterval(interval);
        }
    }, [isScrumInitiated]);

    const handleCopyMinutes = async () => {
        const minutesText = meetingMinutes.slice(0, visibleMinutes)
            .map(minute => `${minute.speaker}: ${minute.message}`)
            .join('\n\n');
        
        try {
            await navigator.clipboard.writeText(minutesText);
            toast({
                title: "Copied to clipboard",
                description: "Meeting minutes have been copied successfully.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Copy failed",
                description: "Unable to copy to clipboard.",
            });
        }
    };

    return (
        <Card className="h-full bg-secondary/30 border-primary/10">
            <CardHeader>
                <CardTitle className="font-headline text-accent">The Scrum</CardTitle>
                <CardDescription>AI agents collaborating in real-time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Agent Avatars in Circular Layout */}
                <TooltipProvider>
                    <div className="relative h-56 w-full flex items-center justify-center">
                        <div className="relative w-40 h-40">
                            {agents.map((agent, index) => {
                                const angle = (index * 60) - 90; // 60 degrees apart, starting from top
                                const x = Math.cos(angle * Math.PI / 180) * 75; // Increased radius by 25%
                                const y = Math.sin(angle * Math.PI / 180) * 75;
                                const isActive = activeAgents.includes(index);
                                
                                return (
                                    <div
                                        key={agent.name}
                                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                        style={{
                                            left: `calc(50% + ${x}px)`,
                                            top: `calc(50% + ${y}px)`
                                        }}
                                    >
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Avatar className={cn(
                                                    "h-12 w-12 border-2 transition-all duration-500 cursor-help hover:scale-125",
                                                    isActive ? "border-primary shadow-lg scale-110" : "border-primary/30"
                                                )}>
                                                    <AvatarFallback className={cn(agent.color, "text-white")}>
                                                        <agent.icon className="h-6 w-6" />
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{agent.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </TooltipProvider>
                
                {/* Minutes of Meeting */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-primary">Minutes of Meeting</h4>
                        {visibleMinutes > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyMinutes}
                                className="h-6 px-2 text-xs text-primary/80 hover:text-primary hover:bg-primary/10"
                            >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                            </Button>
                        )}
                    </div>
                    <ScrollArea className="h-64 w-full border border-primary/20 rounded-md p-2 bg-background/50">
                        {!isScrumInitiated ? (
                            <p className="text-xs text-muted-foreground text-center py-8">
                                Initiate scrum to see discussion
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {meetingMinutes.slice(0, visibleMinutes).map((minute, index) => (
                                    <div key={index} className="text-xs">
                                        <span className="font-semibold text-primary">
                                            {minute.speaker}:
                                        </span>
                                        <span className="text-white/80 ml-1">
                                            {minute.message}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    )
}
