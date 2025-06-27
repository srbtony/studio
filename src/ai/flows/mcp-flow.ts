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

// NOTE: This URL is based on the provided configuration.
// The '/sse' suffix is removed, and a '/chat' endpoint is assumed for POST requests.
const MCP_SERVER_URL =
  'http://127.0.0.1:7860/api/v1/mcp/project/5b174466-3968-481d-8f9b-77ddcc16da00/chat';

const mcpChatFlow = ai.defineFlow(
  {
    name: 'mcpChatFlow',
    inputSchema: McpChatInputSchema,
    outputSchema: McpChatOutputSchema,
  },
  async (input) => {
    const finalMessage = `Requesting ${input.agentName} Agent to answer the following ... ${input.message}`;
    
    try {
      const response = await fetch(MCP_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            agentId: input.agentId,
            message: finalMessage,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('MCP Server Error:', errorText);
        throw new Error(
          `MCP Server responded with status ${response.status}: ${errorText}`
        );
      }
      
      const data = await response.json();

      // Assuming the server returns a JSON with a 'response' field.
      if (typeof data.response === 'string') {
        return { response: data.response };
      }
      
      // Fallback if the response format is unexpected
      return { response: JSON.stringify(data) };

    } catch (error) {
      console.error('Failed to communicate with MCP server', error);
      return {
        response:
          "Sorry, I couldn't connect to the agent. Please ensure the MCP server is running and accessible.",
      };
    }
  }
);
