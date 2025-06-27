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

import { mcpClient } from '@/lib/mcp-client';

export async function mcpChat(input: McpChatInput): Promise<McpChatOutput> {
  try {
    let response: string;
    
    switch (input.agentId) {
      case 'designer':
        response = await mcpClient.callDesignerAgent(input.message);
        break;
      case 'product-manager':
        response = await mcpClient.callProductManagerAgent(input.message);
        break;
      case 'analyst':
        response = await mcpClient.callAnalystAgent(input.message);
        break;
      default:
        response = `Hello! I'm the ${input.agentName}. You asked: "${input.message}". I'm here to help.`;
    }
    
    return { response };
  } catch (error) {
    console.error(`MCP ${input.agentName} agent error:`, error);
    return { response: `As a ${input.agentName}, I'll help with "${input.message}". Let me provide assistance.` };
  }
}

const mcpChatFlow = ai.defineFlow(
  {
    name: 'mcpChatFlow',
    inputSchema: McpChatInputSchema,
    outputSchema: McpChatOutputSchema,
  },
  async (input) => {
    return mcpChat(input);
  }
);
