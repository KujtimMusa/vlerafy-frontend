'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradient({ children, className }: AnimatedGradientProps) {
  return (
    <div className={cn('gradient-mesh absolute inset-0 -z-10', className)}>
      {children}
    </div>
  );
}
