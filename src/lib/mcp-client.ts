import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { MCPBridge } from './mcp-bridge';

class MCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private bridge = new MCPBridge();

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
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
          logging: {}
        }
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
      return await this.bridge.callAgent('designer', message);
    } catch (error) {
      console.error('Designer agent call failed:', error);
      throw error;
    }
  }

  async callProductManagerAgent(message: string): Promise<string> {
    try {
      return await this.bridge.callAgent('product_manager', message);
    } catch (error) {
      console.error('Product Manager agent call failed:', error);
      throw error;
    }
  }

  async callAnalystAgent(message: string): Promise<string> {
    try {
      return await this.bridge.callAgent('analyst', message);
    } catch (error) {
      console.error('Analyst agent call failed:', error);
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