import { cn } from "@/lib/utils";
import { CheckCircle2, CircleDashed, Loader } from "lucide-react";

interface AgentNodeProps {
    name: string;
    status: 'Pending' | 'Working...' | 'Completed';
    isGlowing: boolean;
}

const statusIcons = {
    'Pending': <CircleDashed className="h-4 w-4 text-muted-foreground" />,
    'Working...': <Loader className="h-4 w-4 text-accent animate-spin" />,
    'Completed': <CheckCircle2 className="h-4 w-4 text-green-400" />,
}

export function AgentNode({ name, status, isGlowing }: AgentNodeProps) {
    return (
        <div className={cn(
            "w-full flex items-center justify-between p-3 rounded-lg border-2 bg-background/50 transition-all duration-300",
            isGlowing ? "border-primary animate-glow" : "border-primary/20",
        )}>
            <p className="font-semibold text-white">{name}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {statusIcons[status]}
                <span>{status}</span>
            </div>
        </div>
    )
}
