import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN, // Server-side DSN
  environment: process.env.ENVIRONMENT || "production",
  release: process.env.GIT_COMMIT_HASH || "unknown",
  tracesSampleRate: 0.1,
  
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
  
  // Ignore specific errors
  ignoreErrors: [
    "Non-Error promise rejection captured",
  ],
  
  // Before Send Hook
  beforeSend(event, hint) {
    // Filter sensitive data
    const request = event.request;
    if (request && request.headers) {
      const headers = request.headers;
      const sensitiveHeaders = ['authorization', 'x-api-key', 'cookie'];
      sensitiveHeaders.forEach(header => {
        const headerLower = header.toLowerCase();
        Object.keys(headers).forEach(key => {
          if (key.toLowerCase() === headerLower) {
            headers[key] = '[Filtered]';
          }
        });
      });
    }
    return event;
  },
});
