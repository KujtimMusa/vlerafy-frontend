'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  elevated?: boolean;
  gradient?: boolean;
}

export function GlassCard({ 
  children, 
  className,
  hover = true,
  elevated = false,
  gradient = false
}: GlassCardProps) {
  const baseClasses = 'rounded-2xl p-8 transition-all duration-300';
  const glassClass = gradient ? 'glass-gradient' : elevated ? 'glass-elevated' : 'glass';
  const hoverClass = hover ? 'card-3d hover-glow' : '';

  return (
    <div className={cn(baseClasses, glassClass, hoverClass, className)}>
      {children}
    </div>
  );
}
