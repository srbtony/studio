// Unified agent interface
export interface AgentBridge {
  callAgent(agentName: string, message: string): Promise<string>;
  cleanup?(): Promise<void>;
}

// Agent routing configuration
export const AGENT_CONFIG = {
  analyst: 'mcp',
  designer: 'local',
  product_manager: 'local',
  software_developer: 'mcp'
} as const;

export type AgentName = keyof typeof AGENT_CONFIG;
export type BridgeType = typeof AGENT_CONFIG[AgentName];