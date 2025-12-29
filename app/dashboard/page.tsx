'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

/**
 * Dashboard Redirect Handler Content
 * Wrapped in Suspense für useSearchParams()
 */
function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading');

  useEffect(() => {
    try {
      const shopId = searchParams.get('shop_id');
      const installed = searchParams.get('installed');
      const mode = searchParams.get('mode');

      console.log('[Dashboard] Received params:', { shopId, installed, mode });

      if (shopId) {
        // Speichere shop_id in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('shop_id', shopId);
          localStorage.setItem('current_shop_id', shopId);
          
          // Speichere auch mode, falls vorhanden (default: 'live' für Shopify)
          localStorage.setItem('shop_mode', mode || 'live');
          
          console.log('[Dashboard] Saved to localStorage:', {
            shop_id: shopId,
            current_shop_id: shopId,
            mode: mode || 'live'
          });

          // Dispatche Event, damit useShop reagiert
          window.dispatchEvent(new CustomEvent('shop-switched', {
            detail: { 
              shopId: parseInt(shopId), 
              installed: installed === 'true',
              mode: mode || 'live'
            }
          }));

          setStatus('redirecting');

          // Kurze Verzögerung, dann redirect zur Root-Route
          // Nutze replace statt push, damit Browser-History sauber bleibt
          setTimeout(() => {
            // Redirect zur Root-Route (ohne Query-Parameter)
            router.replace('/');
          }, 300);
        } else {
          // Server-side: Direkt redirect
          router.replace('/');
        }
      } else {
        // Keine shop_id → direkt zu Root
        console.log('[Dashboard] No shop_id found, redirecting to root');
        router.replace('/');
      }
    } catch (error) {
      console.error('[Dashboard] Error processing redirect:', error);
      setStatus('error');
      
      // Bei Fehler: Trotzdem zu Root redirecten (nach kurzer Verzögerung)
      setTimeout(() => {
        router.replace('/');
      }, 1000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Lade Shop...</p>
          </>
        )}
        {status === 'redirecting' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Shop geladen, weiterleiten...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <p className="text-gray-600 mb-2">Fehler beim Laden des Shops</p>
            <p className="text-sm text-gray-500">Weiterleitung...</p>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Dashboard Redirect Handler
 * 
 * Diese Route wird vom Backend nach OAuth-Installation aufgerufen:
 * /dashboard?shop_id=1&installed=true
 * 
 * Sie speichert shop_id in localStorage und redirectet dann zur Root-Route.
 * 
 * Wrapped in Suspense für useSearchParams() (Next.js 13+ Requirement)
 */
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}


