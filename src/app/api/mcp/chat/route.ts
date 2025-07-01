import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { agentId, agentName, message } = await request.json();
    
    if (!message || !agentId) {
      return NextResponse.json({ error: 'Message and agentId are required' }, { status: 400 });
    }

    // Generate dynamic responses based on agent and message
    let response = '';
    
    if (agentId === 'designer') {
      response = generateDesignerResponse(message);
    } else if (agentId === 'analyst') {
      response = `As an Analyst, I've analyzed "${message}". Based on data patterns and user behavior metrics, I recommend conducting A/B tests and monitoring key performance indicators to optimize this feature.`;
    } else if (agentId === 'product-manager') {
      response = `As a Product Manager for "${message}", I'll prioritize this based on user impact and business value. Let's define clear requirements, success metrics, and a roadmap for implementation.`;
    } else if (agentId === 'software-developer') {
      response = `As a Software Developer for "${message}", I'll help with technical implementation, code architecture, and development best practices. Let's break this down into actionable development tasks.`;
    } else {
      response = `Hello! I'm the ${agentName}. Regarding "${message}", I'm here to provide specialized assistance in my domain.`;
    }

    return NextResponse.json({ 
      response,
      agentId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('MCP Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}

function generateDesignerResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('battle pass')) {
    return `# Battle Pass Design Strategy

## Core Mechanics
- **Progressive Tiers**: 100 levels with free and premium tracks
- **Seasonal Rotation**: 3-month cycles with unique themes
- **Challenge Integration**: Daily/weekly missions for XP acceleration

## Visual Design
- Clean tier visualization with progress indicators
- Reward preview system with 3D asset rotation
- Mobile-optimized UI with intuitive navigation
- Dark theme with accent colors matching game aesthetic

## Monetization Balance
- Premium pass at $9.99 price point
- Tier skip options (1-10 levels)
- Exclusive cosmetics and emotes
- Fair free-to-play progression (30% of rewards)

## Engagement Features
- FOMO elements with limited-time rewards
- Social sharing for milestone achievements
- Prestige system for dedicated players

This design maximizes player retention while maintaining ethical monetization practices.`;
  }
  
  if (lowerMessage.includes('ui') || lowerMessage.includes('interface')) {
    return `# UI/UX Design Solution

## Design Principles
- **Clarity**: Clear visual hierarchy and intuitive navigation
- **Consistency**: Unified design system across all screens
- **Accessibility**: WCAG 2.1 AA compliance with proper contrast ratios
- **Performance**: Optimized for 60fps on mobile devices

## Key Components
- Responsive grid system for multiple screen sizes
- Interactive feedback with micro-animations
- Progressive disclosure to reduce cognitive load
- Touch-friendly controls with 44px minimum tap targets

## Implementation Strategy
- Component-based architecture for scalability
- Design tokens for consistent styling
- User testing and iteration cycles
- Performance monitoring and optimization

This approach ensures a polished, user-friendly interface that enhances the overall game experience.`;
  }
  
  if (lowerMessage.includes('monetization') || lowerMessage.includes('revenue')) {
    return `# Monetization Strategy Design

## Revenue Streams
- **Battle Pass**: Seasonal premium content ($9.99)
- **Cosmetic Store**: Character skins, emotes, effects
- **Convenience Items**: XP boosters, time savers
- **Limited Offers**: Special bundles and promotions

## Player-Friendly Approach
- No pay-to-win mechanics
- Generous free content to build trust
- Clear value proposition for purchases
- Respect for player time and investment

## Optimization Tactics
- A/B testing for pricing and offers
- Personalized recommendations based on play style
- Seasonal events to drive engagement
- Community feedback integration

This strategy balances revenue generation with player satisfaction for long-term success.`;
  }
  
  return `# Design Analysis: ${message}

## Initial Assessment
As a Senior Designer, I'll approach "${message}" with a user-centered design methodology, considering both aesthetic appeal and functional requirements.

## Design Process
1. **Research Phase**: Understanding user needs and market trends
2. **Ideation**: Brainstorming creative solutions
3. **Prototyping**: Creating testable design concepts
4. **Iteration**: Refining based on feedback and testing

## Key Considerations
- User experience optimization
- Visual consistency with game theme
- Technical feasibility and performance
- Accessibility and inclusivity
- Competitive analysis and differentiation

## Next Steps
I recommend conducting user research and creating wireframes to validate the design direction before moving to high-fidelity mockups.

Would you like me to dive deeper into any specific aspect of this design challenge?`;
}