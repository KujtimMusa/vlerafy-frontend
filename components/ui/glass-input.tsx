'use client';

import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function GlassInput({ className, error, ...props }: GlassInputProps) {
  return (
    <input
      className={cn(
        'input-glass w-full',
        error && 'border-red-500/50 focus:border-red-500 focus:shadow-red-500/20',
        className
      )}
      {...props}
    />
  );
}
