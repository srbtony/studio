'use server';
/**
 * @fileOverview A flow for interacting with MCP server agents.
 *
 * - mcpChat - A function that handles chatting with an MCP agent.
 * - McpChatInput - The input type for the mcpChat function.
 * - McpChatOutput - The return type for the mcpChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const McpChatInputSchema = z.object({
  agentId: z.string().describe('The ID of the agent to chat with.'),
  agentName: z.string().describe('The display name of the agent for the prompt.'),
  message: z.string().describe('The user message to the agent.'),
});
export type McpChatInput = z.infer<typeof McpChatInputSchema>;

const McpChatOutputSchema = z.object({
  response: z.string().describe("The agent's response."),
});
export type McpChatOutput = z.infer<typeof McpChatOutputSchema>;

export async function mcpChat(input: McpChatInput): Promise<McpChatOutput> {
  return mcpChatFlow(input);
}

// The URL for the MCP proxy. The `uvx mcp-proxy` command starts a local server,
// typically on this address, which then connects to the upstream SSE endpoint.
// Your app should talk to this proxy URL, not the direct SSE URL.
const MCP_PROXY_URL = 'http://127.0.0.1:8001/mcp';

const mcpChatFlow = ai.defineFlow(
  {
    name: 'mcpChatFlow',
    inputSchema: McpChatInputSchema,
    outputSchema: McpChatOutputSchema,
  },
  async (input) => {
    const finalMessage = `Requesting ${input.agentName} Agent to answer the following ... ${input.message}`;
    
    try {
      const response = await fetch(MCP_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The mcp-proxy expects a JSON body with a 'message' key.
        body: JSON.stringify({
            message: finalMessage,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('MCP Proxy Server Error:', errorText);
        throw new Error(
          `MCP Proxy Server responded with status ${response.status}: ${errorText}`
        );
      }
      
      const data = await response.json();

      // The langflow mcp-proxy can return the response in different structures.
      // We'll check for a few common patterns to be safe.
      if (data && typeof data.response === 'string') {
        return { response: data.response };
      }
      if (data && data.message && typeof data.message.text === 'string') {
        return { response: data.message.text };
      }
      if (data && data.result && typeof data.result.message === 'string') {
         return { response: data.result.message };
      }
       if (data && data.result && typeof data.result.output === 'string') {
        return { response: data.result.output };
      }
      
      // Fallback if the response format is totally unexpected
      console.warn('Unexpected MCP response format:', data);
      return { response: JSON.stringify(data) };

    } catch (error) {
      console.error('Failed to communicate with MCP proxy server', error);
      return {
        response:
          "Sorry, I couldn't connect to the agent. Please ensure the MCP proxy server (uvx mcp-proxy) is running and accessible at " + MCP_PROXY_URL,
      };
    }
  }
);
