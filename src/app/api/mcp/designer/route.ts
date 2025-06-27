import { NextRequest, NextResponse } from 'next/server';

// Mock function to simulate MCP server call
// In a real implementation, this would call the actual MCP server
async function callDesignerAgent(message: string): Promise<string> {
  // Simulate the designer_agent MCP server response
  // This should be replaced with actual MCP server integration
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        `As a Senior Designer, I'll help you with that. For "${message}", I recommend focusing on user-centered design principles and considering the game's specific theme.`,
        `From a design perspective on "${message}", we should analyze competitor metrics and ensure our approach aligns with current industry standards.`,
        `Regarding "${message}", let me design a feature that respects the game's theme while incorporating insights from competitor analysis.`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      resolve(randomResponse);
    }, 1000);
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message, agentName } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Call the designer agent (simulated for now)
    const designerResponse = await callDesignerAgent(message);

    return NextResponse.json({ 
      response: designerResponse,
      agent: 'designer',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Designer agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}