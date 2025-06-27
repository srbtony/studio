'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AgentNode } from "./agent-node"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react";

interface ForgePanelProps {
    isScrumInitiated: boolean;
}

const agents = ['Analyst', 'Product Manager', 'Designer', 'UX Designer', 'Software Developer', 'Unity Developer'];

export function ForgePanel({ isScrumInitiated }: ForgePanelProps) {
    const [activeAgentIndex, setActiveAgentIndex] = useState(-1);

    useEffect(() => {
        if (isScrumInitiated) {
            setActiveAgentIndex(-1); // Reset on new initiation
            const interval = setInterval(() => {
                setActiveAgentIndex(prevIndex => {
                    if (prevIndex < agents.length -1) {
                        return prevIndex + 1;
                    }
                    clearInterval(interval);
                    return prevIndex;
                });
            }, 2000); // 2 seconds per agent step
            return () => clearInterval(interval);
        }
    }, [isScrumInitiated]);

    return (
        <Card className="h-full bg-secondary/30 border-primary/10">
            <CardHeader>
                <CardTitle className="font-headline text-accent">The Forge</CardTitle>
                <CardDescription>Visualizing the automated workflow.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {agents.map((agentName, index) => (
                         <div key={agentName} className="flex flex-col items-center">
                            <AgentNode 
                                name={agentName} 
                                status={
                                    activeAgentIndex === index ? "Working..." : 
                                    activeAgentIndex > index ? "Completed" : "Pending"
                                }
                                isGlowing={activeAgentIndex === index}
                            />
                            {index < agents.length - 1 && (
                                <ArrowRight className="my-2 h-8 w-8 text-primary/50 rotate-90" />
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
