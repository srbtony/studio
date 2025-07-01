import { NextRequest, NextResponse } from 'next/server';

async function callSoftwareEngineerAgent(message: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`As a Software Engineer, regarding "${message}", I'll help you with technical implementation, code architecture, and development best practices. Let's break this down into actionable engineering tasks.`);
    }, 1000);
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await callSoftwareEngineerAgent(message);

    return NextResponse.json({ 
      response,
      agent: 'software-engineer',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Software Engineer agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}