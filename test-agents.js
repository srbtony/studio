import { AgentRouter } from './src/lib/agents/agent-router.js';

const router = new AgentRouter();

async function testAgents() {
  try {
    console.log('🚀 Testing Hybrid Agent System\n');

    // Test Designer (Local)
    console.log('🎨 Testing Designer Agent (Local)...');
    const designerResponse = await router.callAgent('designer', 
      'Design a streak-based feature that increases player retention by rewarding consecutive wins'
    );
    console.log('Designer Response:', designerResponse.substring(0, 200) + '...\n');

    // Test Product Manager (Local)  
    console.log('📊 Testing Product Manager Agent (Local)...');
    const pmResponse = await router.callAgent('product_manager',
      'Analyze the impact of adding a daily login bonus feature on player retention and monetization'
    );
    console.log('PM Response:', pmResponse.substring(0, 200) + '...\n');

    // Test Analyst (MCP)
    console.log('📈 Testing Analyst Agent (MCP)...');
    const analystResponse = await router.callAgent('analyst',
      'What are the current retention trends for new players in their first week?'
    );
    console.log('Analyst Response:', analystResponse.substring(0, 200) + '...\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    console.log('🧹 Cleaning up...');
    await router.cleanup();
    console.log('✅ Cleanup complete');
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await router.cleanup();
  process.exit(0);
});

testAgents();