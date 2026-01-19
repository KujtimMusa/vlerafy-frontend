const createNextIntlPlugin = require('next-intl/plugin');
const { withSentryConfig } = require("@sentry/nextjs");

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable instrumentation hook for Sentry
  experimental: {
    instrumentationHook: true,
  },
}

// Wrap with Sentry config (only if SENTRY_ORG is set)
const sentryWebpackPluginOptions = {
  // Sentry Webpack Plugin Options
  silent: true, // Suppress logs during build
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT || "vlerafy-frontend",
  
  // Upload source maps (only if org is set)
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  
  // Only enable if SENTRY_ORG is set
  dryRun: !process.env.SENTRY_ORG,
};

module.exports = withSentryConfig(
  withNextIntl(nextConfig),
  sentryWebpackPluginOptions,
  {
    // Additional Sentry options
    hideSourceMaps: true,
  }
);
