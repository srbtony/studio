import { LangflowClient } from '@datastax/langflow-client';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { AgentBridge, AGENT_CONFIG, AgentName } from './agents/agent-bridge';

// MCP bridge for agents with DB access
export class MCPBridge implements AgentBridge {
  private localBridge: any = null;
  private langflowClient: LangflowClient;
  private flowId = '5b174466-3968-481d-8f9b-77ddcc16da00';
  private mcpClient: Client | null = null;
  private mcpTransport: StdioClientTransport | null = null;

  constructor() {
    this.langflowClient = new LangflowClient({
      baseUrl: 'http://localhost:7860'
    });
  }

  async callAgent(agentName: string, message: string): Promise<string> {
    // Check if this agent should use local bridge
    const agentConfig = AGENT_CONFIG[agentName as AgentName];
    if (agentConfig === 'local') {
      // Check if we're in a server environment
      if (typeof window === 'undefined') {
        if (!this.localBridge) {
          const { LocalAgentBridge } = await import('./agents/local-agent-bridge');
          this.localBridge = new LocalAgentBridge();
        }
        return await this.localBridge.callAgent(agentName, message);
      } else {
        // Fallback for client-side - shouldn't happen in server actions
        throw new Error('Local agents can only run on server side');
      }
    }
    
    // Use MCP for agents configured for MCP (like analyst)
    return await this.tryMCPClient(agentName, message);
  }

  private async tryLangflowStreaming(message: string): Promise<string> {
    try {
      console.log('Attempting actual LangFlow streaming...');
      
      const flow = this.langflowClient.flow(this.flowId);
      const stream = await flow.stream({
        inputs: {
          input_value: message
        }
      } as any);
      
      console.log('Stream object:', stream);
      let fullResponse = '';
      let chunkCount = 0;
      
      // Actually stream the response
      for await (const chunk of stream as any) {
        chunkCount++;
        console.log(`Chunk ${chunkCount}:`, chunk);
        
        // Handle different chunk formats
        if (chunk?.outputs?.[0]?.outputs?.[0]?.results?.message?.text) {
          fullResponse += chunk.outputs[0].outputs[0].results.message.text;
        } else if (chunk?.chunk) {
          fullResponse += chunk.chunk;
        } else if (chunk?.text) {
          fullResponse += chunk.text;
        } else if (typeof chunk === 'string') {
          fullResponse += chunk;
        }
      }
      
      console.log(`Streamed ${chunkCount} chunks, total length: ${fullResponse.length}`);
      return fullResponse || 'No response from stream';
    } catch (error: any) {
      console.error('LangFlow streaming error:', error);
      throw error;
    }
  }

  private async tryMCPClient(agentName: string, message: string): Promise<string> {
    try {
      const client = await this.connectMCP();
      
      // Append hidden length limit instruction
      //const enhancedMessage = `${message} .Strictly limit the Output to have less than 2001 characters, while ensuring all crucial details are conveyed`;
      const enhancedMessage = message;
      
      const result = await client.callTool({
        name: `${agentName}_agent`,
        arguments: { input_value: enhancedMessage }
      });
      
      return (result.content as any)?.[1]?.text || (result.content as any)?.[0]?.text || 'No response from MCP agent';
    } catch (error: any) {
      throw new Error(`MCP client failed: ${error?.message || error}`);
    }
  }

  private async connectMCP(): Promise<Client> {
    if (this.mcpClient) return this.mcpClient;

    this.mcpTransport = new StdioClientTransport({
      command: 'uvx',
      args: ['mcp-proxy', 'http://127.0.0.1:7860/api/v1/mcp/project/5b174466-3968-481d-8f9b-77ddcc16da00/sse']
    });

    this.mcpClient = new Client({
      name: 'studio-client',
      version: '1.0.0'
    }, {
      capabilities: { tools: {}, resources: {}, prompts: {}, logging: {} }
    });

    await this.mcpClient.connect(this.mcpTransport);
    return this.mcpClient;
  }

  async cleanup(): Promise<void> {
    if (this.localBridge) {
      await this.localBridge.cleanup();
    }
    if (this.mcpClient) {
      await this.mcpClient.close();
      this.mcpClient = null;
    }
    if (this.mcpTransport) {
      await this.mcpTransport.close();
      this.mcpTransport = null;
    }
  }
}