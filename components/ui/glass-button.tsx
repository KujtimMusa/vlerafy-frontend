'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  glow?: boolean;
  animated?: boolean;
}

export function GlassButton({ 
  children, 
  variant = 'primary',
  glow = false,
  animated = false,
  className,
  ...props
}: GlassButtonProps) {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'btn-primary text-white',
    ghost: 'btn-ghost text-text-primary'
  };

  const glowClass = glow ? (animated ? 'glow-purple-animated' : 'glow-purple') : '';

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], glowClass, className)}
      {...props}
    >
      {children}
    </button>
  );
}
