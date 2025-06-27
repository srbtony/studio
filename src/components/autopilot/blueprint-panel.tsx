'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

interface BlueprintPanelProps {
    isScrumInitiated: boolean;
}

const blueprintSections = [
    { id: 'blueprint-title', title: 'Title', content: 'Daily Reward System' },
    { id: 'blueprint-narrative', title: 'Narrative', content: 'To boost daily active users and improve long-term retention, we will introduce a compelling daily reward system. Players will receive increasingly valuable rewards for logging in consecutively, creating a strong incentive to return to the game each day.' },
    { id: 'blueprint-mechanics', title: 'Mechanics', content: '1. A 7-day login calendar UI.\n2. Rewards include soft currency, hard currency, and exclusive items.\n3. A special grand prize for completing a 7-day streak.\n4. The streak resets if a day is missed.' },
    { id: 'blueprint-code', title: 'Code Snippet (C# for Unity)', content: `public class DailyRewardManager : MonoBehaviour\n{\n    public int consecutiveDays = 0;\n    public DateTime lastLoginDate;\n\n    public void PlayerLogin()\n    {\n        if (DateTime.Now.Date == lastLoginDate.AddDays(1).Date)\n        {\n            consecutiveDays++;\n        }\n        else if (DateTime.Now.Date > lastLoginDate.AddDays(1).Date)\n        {\n            consecutiveDays = 1; // Reset streak\n        }\n        lastLoginDate = DateTime.Now.Date;\n        GrantReward(consecutiveDays);\n    }\n\n    void GrantReward(int day)\n    {\n        // Logic to grant reward based on day\n        Debug.Log($"Reward for day {day} granted!");\n    }\n}` },
];

export function BlueprintPanel({ isScrumInitiated }: BlueprintPanelProps) {
    const [visibleSections, setVisibleSections] = useState<number>(0);

    useEffect(() => {
        if (isScrumInitiated) {
            setVisibleSections(0);
            const interval = setInterval(() => {
                setVisibleSections(prev => {
                    if (prev < blueprintSections.length) {
                        return prev + 1;
                    }
                    clearInterval(interval);
                    return prev;
                })
            }, 3000); // 3 seconds per section
            return () => clearInterval(interval);
        }
    }, [isScrumInitiated]);
    
    return (
        <Card className="h-full bg-secondary/30 border-primary/10">
            <CardHeader>
                <CardTitle className="font-headline text-accent">Feature Blueprint</CardTitle>
                <CardDescription>The final output document.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[65vh] pr-4">
                    {!isScrumInitiated ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Initiate AI Scrum to generate blueprint.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {blueprintSections.slice(0, visibleSections).map(section => (
                                <div key={section.id} id={section.id}>
                                    <h3 className="text-lg font-headline text-primary mb-2">{section.title}</h3>
                                    {section.id === 'blueprint-code' ? (
                                        <pre className="bg-background p-4 rounded-md overflow-x-auto">
                                            <code className="font-code text-accent text-sm">{section.content}</code>
                                        </pre>
                                    ) : (
                                        <p className="text-white/80 whitespace-pre-wrap">{section.content}</p>
                                    )}
                                </div>
                            ))}
                            {visibleSections < blueprintSections.length && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-headline text-primary mb-2"><Skeleton className="h-6 w-1/3" /></h3>
                                    <Skeleton className="h-20 w-full" />
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
