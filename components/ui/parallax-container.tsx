'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxContainerProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function ParallaxContainer({ 
  children, 
  className,
  intensity = 0.5 
}: ParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) * intensity * 0.01;
      const y = (e.clientY - centerY) * intensity * 0.01;

      setTransform({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className={cn('parallax-container', className)}
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }}
    >
      {children}
    </div>
  );
}
