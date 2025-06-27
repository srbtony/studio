import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Hybrid bridge that tries streaming first, falls back to MCP client
export class MCPBridge {
  private baseUrl = 'http://localhost:7860';
  private flowId = '5b174466-3968-481d-8f9b-77ddcc16da00';
  private mcpClient: Client | null = null;
  private mcpTransport: StdioClientTransport | null = null;

  async callAgent(agentName: string, message: string): Promise<string> {
    // Try streaming first
    try {
      return await this.tryStreaming(message);
    } catch (streamError) {
      console.log('Streaming failed, falling back to MCP client:', streamError.message);
      // Fall back to MCP client
      return await this.tryMCPClient(agentName, message);
    }
  }

  private async tryStreaming(message: string): Promise<string> {
    const initResponse = await fetch(`${this.baseUrl}/api/v1/run/${this.flowId}?stream=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input_value: message })
    });

    if (!initResponse.ok) {
      throw new Error(`HTTP ${initResponse.status}`);
    }

    const initData = await initResponse.json();
    const streamUrl = initData.outputs?.[0]?.outputs?.[0]?.artifacts?.stream_url;
    
    if (!streamUrl) {
      throw new Error('No stream URL');
    }

    return await this.streamResponse(streamUrl, initData.session_id);
  }

  private async tryMCPClient(agentName: string, message: string): Promise<string> {
    try {
      const client = await this.connectMCP();
      const result = await client.callTool({
        name: `${agentName}_agent`,
        arguments: { input_value: message }
      });
      return result.content?.[1]?.text || result.content?.[0]?.text || 'No response from MCP agent';
    } catch (error) {
      throw new Error(`MCP client failed: ${error.message}`);
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

  private async streamResponse(streamUrl: string, sessionId: string): Promise<string> {
    // Build full stream URL (matching reference code)
    const fullStreamUrl = `${this.baseUrl}${streamUrl}`;
    const params = new URLSearchParams({ session_id: sessionId });
    
    let fullResponse = '';

    try {
      const response = await fetch(`${fullStreamUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Stream HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim();
              const data = JSON.parse(jsonStr);
              if (data.chunk) {
                fullResponse += data.chunk;
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
      
      return fullResponse || 'No response received from stream';
    } catch (error) {
      console.error('Streaming error:', error);
      throw error;
    }
  }
}