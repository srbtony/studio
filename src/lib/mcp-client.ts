import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

class MCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;

  async connect() {
    if (this.client) return this.client;

    try {
      // Create transport for the designer_agent MCP server
      this.transport = new StdioClientTransport({
        command: 'uvx',
        args: ['mcp-proxy', 'http://127.0.0.1:7860/api/v1/mcp/project/5b174466-3968-481d-8f9b-77ddcc16da00/sse']
      });

      this.client = new Client({
        name: 'studio-client',
        version: '1.0.0'
      }, {
        capabilities: {}
      });

      await this.client.connect(this.transport);
      return this.client;
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      throw error;
    }
  }

  async callDesignerAgent(message: string): Promise<string> {
    try {
      const client = await this.connect();
      
      const result = await client.callTool({
        name: 'designer_agent',
        arguments: {
          input_value: message
        }
      });

      // Return the actual response content (index 1 contains the agent response)
      return result.content?.[1]?.text || result.content?.[0]?.text || 'No response from designer agent';
    } catch (error) {
      console.error('Designer agent call failed:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.transport) {
      await this.transport.close();
      this.transport = null;
      this.client = null;
    }
  }
}

export const mcpClient = new MCPClient();