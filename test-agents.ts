import { AgentRouter } from './src/lib/agents/agent-router.js';

const router = new AgentRouter();

async function testAgents() {
  try {
    console.log('🚀 Testing Hybrid Agent System\n');

    // Test Product Manager (Local)
    console.log('📊 Testing Product Manager Agent (Local)...');
    const pmResponse = await router.callAgent('product_manager',
      'Analyze the impact of adding a daily login bonus feature on player retention and monetization'
    );
    console.log('PM Response:');
    console.log(pmResponse);
    console.log('\n' + '='.repeat(80) + '\n');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
  } finally {
    console.log('🧹 Cleaning up...');
    await router.cleanup();
    console.log('✅ Cleanup complete');
  }
}

testAgents();