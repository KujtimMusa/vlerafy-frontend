import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true // Browser-Sprache automatisch erkennen
});

export default function middleware(request: NextRequest) {
  // Exclude /dashboard from i18n middleware (direct route, no locale prefix)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return; // Skip i18n middleware for /dashboard
  }
  
  // Exclude /landing and /admin from i18n middleware (direct routes, no locale prefix)
  if (request.nextUrl.pathname.startsWith('/landing') || 
      request.nextUrl.pathname.startsWith('/admin')) {
    return; // Skip i18n middleware for /landing and /admin
  }
  
  // Apply i18n middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for API routes, static files, dashboard, landing, admin, etc.
  matcher: ['/', '/(de|en)/:path*', '/((?!api|_next|_vercel|dashboard|landing|admin|.*\\..*).*)']
};

