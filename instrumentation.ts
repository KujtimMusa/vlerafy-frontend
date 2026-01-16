/**
 * Next.js Instrumentation Hook
 * 
 * This file is automatically loaded by Next.js when experimental.instrumentationHook is enabled.
 * It initializes Sentry for server-side and edge runtime.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side (Node.js runtime)
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime (middleware, edge API routes)
    await import('./sentry.edge.config');
  }
}
