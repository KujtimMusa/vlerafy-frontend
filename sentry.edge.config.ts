import * as Sentry from "@sentry/nextjs";

// Same config as server, but for Edge Runtime
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.ENVIRONMENT || "production",
  release: process.env.GIT_COMMIT_HASH || "unknown",
  tracesSampleRate: 0.1,
  
  // Before Send Hook
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request && event.request.headers) {
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
    return event;
  },
});
