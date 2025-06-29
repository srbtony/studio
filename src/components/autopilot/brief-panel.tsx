import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BriefPanelProps {
    onInitiate: () => void;
}

export function BriefPanel({ onInitiate }: BriefPanelProps) {
    return (
        <Card className="h-full bg-secondary/30 border-primary/10 flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline text-accent">Focus Area</CardTitle>
                <CardDescription>Define the focus area for the AI team.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <form className="flex-1 flex flex-col" onSubmit={(e) => { e.preventDefault(); onInitiate(); }}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="target-metric">The Target</Label>
                            <Textarea id="target-metric" placeholder="e.g. Analyse short term player data and pain-points" defaultValue="Analyse short term player data and pain-points" className="bg-background min-h-[80px] resize-none" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="feature-brief">Brief</Label>
                            <Textarea id="feature-brief" placeholder="Describe the task..." className="bg-background min-h-[300px] resize-none" defaultValue="Check last 7 days trend of all the important metrics and analyse CS tickets from players to identify any issue. Discuss internally to figure out how to best address any potential issues or any areas of improvement."/>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-semibold">Initiate AI Scrum</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
