import { spawn, ChildProcess } from 'child_process';
import { readFile } from 'fs/promises';
import { AgentBridge } from './agent-bridge';

export class LocalAgentBridge implements AgentBridge {
  private profiles = new Map<string, string>();
  private activeProcesses = new Set<ChildProcess>();

  async callAgent(agentName: string, message: string): Promise<string> {
    const profile = await this.getProfile(agentName);
    const prompt = `${profile}\n\nUser Query: ${message}`;
    
    return new Promise((resolve, reject) => {
      const child = spawn('q', ['chat', '--no-interactive', '--trust-all-tools'], { stdio: 'pipe' });
      this.activeProcesses.add(child);
      
      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      child.on('close', (code) => {
        this.activeProcesses.delete(child);
        if (code === 0) {
          resolve(this.parseResponse(output));
        } else {
          reject(new Error(`Local agent failed: ${errorOutput}`));
        }
      });

      child.stdin.write(prompt);
      child.stdin.end();
    });
  }

  private async getProfile(agentName: string): Promise<string> {
    if (!this.profiles.has(agentName)) {
      try {
        const profile = await readFile(`./profiles/${agentName}-profile.txt`, 'utf-8');
        this.profiles.set(agentName, profile);
      } catch {
        throw new Error(`Profile not found for agent: ${agentName}`);
      }
    }
    return this.profiles.get(agentName)!;
  }

  private parseResponse(output: string): string {
    // Clean up terminal output
    return output.replace(/\x1b\[[0-9;]*m/g, '').trim();
  }

  async cleanup(): Promise<void> {
    const killPromises = Array.from(this.activeProcesses).map(process => {
      return new Promise<void>((resolve) => {
        if (!process.killed) {
          process.kill('SIGTERM');
          setTimeout(() => {
            if (!process.killed) process.kill('SIGKILL');
            resolve();
          }, 5000);
        } else {
          resolve();
        }
      });
    });
    
    await Promise.all(killPromises);
    this.activeProcesses.clear();
  }
}