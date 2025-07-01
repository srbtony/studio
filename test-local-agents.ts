import { AgentRouter } from './src/lib/agents/agent-router.js';

const router = new AgentRouter();

async function testLocalAgents() {
  try {
    console.log('🚀 Testing Local Agent System\n');

    // Test Designer (Local)
    console.log('🎨 Testing Designer Agent (Local)...');
    try {
      const designerResponse = await router.callAgent('designer',
        'Design a battle pass feature for our match-3 game'
      );
      console.log('✅ Designer Response:');
      console.log(designerResponse.substring(0, 200) + '...\n');
    } catch (error: any) {
      console.error('❌ Designer failed:', error.message);
    }

    // Test Product Manager (Local)
    console.log('📊 Testing Product Manager Agent (Local)...');
    try {
      const pmResponse = await router.callAgent('product_manager',
        'Analyze daily login bonus impact on retention'
      );
      console.log('✅ Product Manager Response:');
      console.log(pmResponse.substring(0, 200) + '...\n');
    } catch (error: any) {
      console.error('❌ Product Manager failed:', error.message);
    }

    console.log('='.repeat(80));

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
  } finally {
    console.log('🧹 Cleaning up...');
    await router.cleanup();
    console.log('✅ Cleanup complete');
  }
}

testLocalAgents();