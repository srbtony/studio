'use client';

import { useState, useEffect } from 'react';

// Custom CSS for natural bounce settling
const bounceSettleStyle = `
  @keyframes bounceSettle {
    0% { transform: scale(0); }
    20% { transform: scale(1.3); }
    40% { transform: scale(0.9); }
    60% { transform: scale(1.1); }
    80% { transform: scale(0.95); }
    90% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
  .bounce-settle {
    animation: bounceSettle 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
`;

interface LoadingAnimationProps {
  onComplete: () => void;
  children: React.ReactNode;
}

export function LoadingAnimation({ onComplete, children }: LoadingAnimationProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timeline = [
      { delay: 0, step: 1 },      // Show [Z]
      { delay: 700, step: 2 },    // Slide "Studio i"
      { delay: 1400, step: 3 },   // Pause
      { delay: 1700, step: 4 },   // Insert [a] with bounce
      { delay: 2700, step: 5 },   // Stay completed, bounce settles (1 second)
      { delay: 3700, step: 6 },   // Purple flash in (0.5 seconds)
      { delay: 4200, step: 7 },   // Purple flash out, show components (0.5 seconds)
    ];

    const timers = timeline.map(({ delay, step }) =>
      setTimeout(() => setStep(step), delay)
    );

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4700);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: bounceSettleStyle }} />
      <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Logo Animation - stays at center until purple flash */}
      <div className={`flex items-center gap-1 absolute top-1/2 left-1/2 transition-opacity duration-300 ${
        step >= 6 ? 'opacity-0' : 'opacity-100'
      }`} style={{ transform: 'translate(-50%, -50%) scale(3)' }}>
        {/* [Z] - matching header style */}
        <div className={`h-8 w-8 flex items-center justify-center bg-primary/20 rounded-lg border border-primary/30 overflow-hidden transition-all duration-800 ease-out ${
          step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
          <span className="text-3xl font-black text-primary italic transform -skew-x-12 leading-none">
            Z
          </span>
        </div>
        
        {/* Studio - slides from behind [Z] */}
        <div className={`text-2xl font-headline font-bold text-white tracking-tight transition-all duration-1000 ease-out ${
          step >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
        }`}>
          Studio
        </div>
        
        {/* [a] with natural bounce settle - matching header style */}
        <div className={`inline-block w-6 h-6 bg-primary border-2 border-primary rounded-sm flex items-center justify-center text-sm font-bold text-white italic ${
          step >= 4 ? 'opacity-100 bounce-settle' : 'opacity-0 scale-0'
        }`}>
          a
        </div>
        
        {/* i - slides with Studio from behind [Z] */}
        <div className={`text-2xl font-headline font-bold text-white tracking-tight transition-all duration-1000 ease-out ${
          step >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
        }`}>
          i
        </div>
      </div>
      
      {/* Purple Flash Overlay */}
      <div className={`fixed inset-0 bg-primary transition-opacity ${
        step === 6 ? 'duration-500 opacity-100' : step >= 7 ? 'duration-500 opacity-0' : 'opacity-0 duration-0'
      }`} />
      
      {/* Agent Selection Components - revealed after purple flash */}
      <div className={`fixed inset-0 transition-opacity duration-500 ${
        step >= 7 ? 'opacity-100' : 'opacity-0'
      }`}>
        {children}
      </div>
      </div>
    </>
  );
}