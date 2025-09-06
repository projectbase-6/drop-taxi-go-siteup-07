import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  hoverEffect?: boolean;
}

export function AnimatedCard({ 
  children, 
  delay = 0, 
  className,
  hoverEffect = true 
}: AnimatedCardProps) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        hoverEffect && 'hover:scale-105 hover:-translate-y-2 hover:shadow-lg',
        'will-change-transform',
        className
      )}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}