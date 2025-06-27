import { MCPBridge } from '../mcp-bridge';
import { LocalAgentBridge } from './local-agent-bridge';
import { AgentBridge, AGENT_CONFIG, AgentName } from './agent-bridge';

export class AgentRouter {
  private mcpBridge = new MCPBridge();
  private localBridge = new LocalAgentBridge();

  async callAgent(agentName: AgentName, message: string): Promise<string> {
    const bridgeType = AGENT_CONFIG[agentName];
    const bridge = this.getBridge(bridgeType);
    return bridge.callAgent(agentName, message);
  }

  private getBridge(type: 'mcp' | 'local'): AgentBridge {
    return type === 'mcp' ? this.mcpBridge : this.localBridge;
  }

  async cleanup(): Promise<void> {
    await Promise.all([
      this.mcpBridge.cleanup(),
      this.localBridge.cleanup()
    ]);
  }
}