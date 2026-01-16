import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environment & Release
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "production",
  release: process.env.NEXT_PUBLIC_GIT_COMMIT_HASH || "unknown",
  
  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Session Replay (for debugging)
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of error sessions
  
  integrations: [
    new Sentry.BrowserTracing({
      // Trace all fetch/XHR requests
      traceFetch: true,
      traceXHR: true,
    }),
    new Sentry.Replay({
      maskAllText: true,  // Mask all text for privacy
      blockAllMedia: true, // Block all media
    }),
  ],
  
  // Ignore specific errors
  ignoreErrors: [
    "Non-Error promise rejection captured",
    "ResizeObserver loop limit exceeded",
    "ChunkLoadError", // Ignore chunk load errors (common in Next.js)
  ],
  
  // Before Send Hook
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request) {
      // Remove cookies, tokens, etc.
      if (event.request.cookies) {
        delete event.request.cookies;
      }
      if (event.request.headers) {
        // Remove sensitive headers
        const sensitiveHeaders = ['authorization', 'x-api-key', 'cookie'];
        sensitiveHeaders.forEach(header => {
          const headerLower = header.toLowerCase();
          Object.keys(event.request.headers).forEach(key => {
            if (key.toLowerCase() === headerLower) {
              event.request.headers[key] = '[Filtered]';
            }
          });
        });
      }
    }
    return event;
  },
});
