import { NextRequest, NextResponse } from 'next/server';

async function callAnalystAgent(message: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`As an Analyst, I've analyzed your query: "${message}". Based on data patterns and metrics, I recommend conducting further research into user behavior and market trends to optimize decision-making.`);
    }, 1000);
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await callAnalystAgent(message);

    return NextResponse.json({ 
      response,
      agent: 'analyst',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analyst agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}