import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-in' | 'slide-up';
  delay?: number;
  duration?: number;
  className?: string;
  triggerOnce?: boolean;
}

export function AnimatedSection({ 
  children, 
  animation = 'fade-up', 
  delay = 0, 
  duration = 0.6,
  className,
  triggerOnce = true 
}: AnimatedSectionProps) {
  const { elementRef, isVisible } = useScrollAnimation({ triggerOnce });

  const animationClasses = {
    'fade-up': 'animate-scroll-fade-up',
    'fade-down': 'animate-scroll-fade-down', 
    'fade-left': 'animate-scroll-fade-left',
    'fade-right': 'animate-scroll-fade-right',
    'scale-in': 'animate-scroll-scale-in',
    'slide-up': 'animate-scroll-slide-up'
  };

  const initialClasses = {
    'fade-up': 'translate-y-8 opacity-0',
    'fade-down': '-translate-y-8 opacity-0',
    'fade-left': 'translate-x-8 opacity-0', 
    'fade-right': '-translate-x-8 opacity-0',
    'scale-in': 'scale-95 opacity-0',
    'slide-up': 'translate-y-12 opacity-0'
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all ease-out',
        isVisible ? 'translate-y-0 translate-x-0 scale-100 opacity-100' : initialClasses[animation],
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
}