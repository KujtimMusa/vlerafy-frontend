import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true // Browser-Sprache automatisch erkennen
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude root path "/" - let app/page.tsx handle it
  if (pathname === '/') {
    return; // Skip i18n middleware for root, allow app/page.tsx redirect
  }
  
  // Exclude /dashboard from i18n middleware (direct route, no locale prefix)
  if (pathname.startsWith('/dashboard')) {
    return; // Skip i18n middleware for /dashboard
  }
  
  // Exclude /landing and /admin from i18n middleware (direct routes, no locale prefix)
  if (pathname.startsWith('/landing') || pathname.startsWith('/admin')) {
    return; // Skip i18n middleware for /landing and /admin
  }
  
  // Apply i18n middleware ONLY for locale routes
  return intlMiddleware(request);
}

export const config = {
  // Remove '/' from matcher, nur locale-specific routes
  // Root "/" wird NICHT gematcht, damit app/page.tsx den Redirect handhaben kann
  matcher: [
    '/(de|en)/:path*',
    '/((?!api|_next|_vercel|dashboard|landing|admin|.*\\..*).*)'
  ]
};

