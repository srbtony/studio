import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const { agentId } = params;
    
    // Construct file path
    const filePath = join(process.cwd(), 'src', 'data', 'demo-responses', `${agentId}-demo.txt`);
    
    // Read the file
    const content = await readFile(filePath, 'utf-8');
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error reading demo response file:', error);
    return new NextResponse('Demo response not found', { status: 404 });
  }
}