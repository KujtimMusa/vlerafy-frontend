'use client';

import ErrorBoundary from './ErrorBoundary';

/**
 * Client Component Wrapper für Error Boundary
 * Kann in Server Components verwendet werden
 */
export function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}








