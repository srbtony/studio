import { DEMO_CONFIG } from '@/config/demo-config';
import { readFile } from 'fs/promises';
import { join } from 'path';

class DemoResponseService {
  private responseCache: Map<string, string> = new Map();

  private async loadAgentResponse(agentId: string): Promise<string> {
    // Check cache first
    if (this.responseCache.has(agentId)) {
      return this.responseCache.get(agentId)!;
    }

    try {
      // Read the demo response file directly
      const filePath = join(process.cwd(), 'src', 'data', 'demo-responses', `${agentId}-demo.txt`);
      const content = await readFile(filePath, 'utf-8');
      
      // Cache the response
      this.responseCache.set(agentId, content);
      
      return content;
    } catch (error) {
      console.error(`Error loading demo response for ${agentId}:`, error);
      return `Hello! I'm the ${agentId} agent. This is a demo response.`;
    }
  }

  private getRandomThinkingTime(): number {
    const { min, max } = DEMO_CONFIG.thinkingTime;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getResponse(agentId: string, message: string): Promise<string> {
    // Simulate thinking time
    const thinkingTime = this.getRandomThinkingTime();
    await this.delay(thinkingTime);
    
    // Return the demo response
    return await this.loadAgentResponse(agentId);
  }
}

export const demoResponseService = new DemoResponseService();