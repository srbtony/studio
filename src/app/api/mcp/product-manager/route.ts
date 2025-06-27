import { NextRequest, NextResponse } from 'next/server';

async function callProductManagerAgent(message: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`As a Product Manager, regarding "${message}", I'll prioritize this based on user impact and business value. Let's define clear requirements and success metrics for implementation.`);
    }, 1000);
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await callProductManagerAgent(message);

    return NextResponse.json({ 
      response,
      agent: 'product-manager',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Product Manager agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}