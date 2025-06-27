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
        <Card className="h-full bg-secondary/30 border-primary/10">
            <CardHeader>
                <CardTitle className="font-headline text-accent">Start New Feature</CardTitle>
                <CardDescription>Define the goal for the AI team.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onInitiate(); }}>
                    <div className="space-y-2">
                        <Label htmlFor="target-metric">Target Metric</Label>
                        <Input id="target-metric" placeholder="e.g. Increase Day 7 Retention" defaultValue="Increase Day 7 Retention" className="bg-background" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="feature-brief">Brief</Label>
                        <Textarea id="feature-brief" placeholder="Describe the feature..." className="bg-background min-h-[200px]" defaultValue="Design a new daily reward system to encourage users to log in every day."/>
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-semibold">Initiate AI Scrum</Button>
                </form>
            </CardContent>
        </Card>
    )
}
