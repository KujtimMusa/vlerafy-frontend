/**
 * Shop-Switcher Component
 * Ermöglicht Wechsel zwischen Demo-Shop und echten Shopify-Shops
 */
'use client';

import React, { useState } from 'react';
import { useShop, Shop } from '@/hooks/useShop';
import { API_URL } from '@/lib/api';

interface ShopSwitcherProps {
  className?: string;
}

export function ShopSwitcher({ className = '' }: ShopSwitcherProps) {
  const { shops, currentShop, isDemoMode, loading, error, switchToShop, refresh } = useShop();
  const [shopDomain, setShopDomain] = useState('');

  const handleSwitch = async (shop: Shop | null, useDemo: boolean) => {
    if (!shop && !useDemo) {
      // Live Mode ohne Shop - nur isDemoMode auf false setzen
      // Das wird durch die Buttons gehandhabt
      return;
    }
    
    if (!shop) return;
    
    try {
      console.log(`[ShopSwitcher] Switching to shop ${shop.id}, demo: ${useDemo}`);
      await switchToShop(shop.id, useDemo);
      console.log('[ShopSwitcher] Shop switched successfully');
    } catch (err) {
      console.error('[ShopSwitcher] Failed to switch shop:', err);
    }
  };

  const handleConnectShopify = () => {
    const raw = shopDomain.trim();
    if (!raw) {
      alert('Bitte gib deine Shopify-Domain ein, z.B. dein-shop.myshopify.com');
      return;
    }
    if (!raw.includes('.')) {
      alert('Bitte gib eine vollständige Domain ein, z.B. dein-shop.myshopify.com');
      return;
    }

    const url = `${API_URL}/auth/shopify/install?shop=${encodeURIComponent(raw)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleLiveMode = async () => {
    console.log('[ShopSwitcher] 🔘 Live Button clicked');
    
    // FIX: Filter Demo Shop nochmal explizit raus
    const realLiveShops = shops.filter(s => 
      s.type === 'shopify' && 
      s.id !== 999 && // Demo Shop ID explizit ausschließen
      s.type !== 'demo' // Sicherheitscheck
    );
    
    console.log('[ShopSwitcher] liveShops (all):', liveShops.map(s => ({ id: s.id, name: s.name, type: s.type })));
    console.log('[ShopSwitcher] realLiveShops (filtered):', realLiveShops.map(s => ({ id: s.id, name: s.name, type: s.type })));
    
    if (realLiveShops.length > 0) {
      console.log('[ShopSwitcher] → Switching to real shop:', realLiveShops[0].name);
      await handleSwitch(realLiveShops[0], false);
    } else {
      console.log('[ShopSwitcher] → No real shops, showing connect card');
      // WICHTIG: Zeige Connect Card
      // isDemoMode muss false bleiben aber keine Shop-Karte
      if (demoShop) {
        try {
          console.log('[ShopSwitcher] Switching to Live Mode (no shop installed)');
          await switchToShop(demoShop.id, false); // Backend erkennt dass Shop nicht existiert
        } catch (err) {
          console.error('[ShopSwitcher] Error switching to Live Mode:', err);
          // Falls das fehlschlägt, lade Shops neu
          await refresh();
        }
      }
    }
  };

  const handleDemoMode = async () => {
    const demoShop = shops.find(s => s.type === 'demo');
    if (demoShop) {
      await handleSwitch(demoShop, true);
    }
  };

  if (loading && shops.length === 0) {
    return (
      <div className={`shop-switcher ${className}`}>
        <div className="p-4 text-center text-gray-500">Lade Shops...</div>
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (error && shops.length === 0) {
    return (
      <div className={`shop-switcher ${className}`}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium mb-2">Fehler beim Laden der Shops</p>
          <p className="text-xs text-red-500">{error}</p>
          <button
            onClick={() => refresh()}
            className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  const demoShop = shops.find(s => s.type === 'demo' || s.id === 999);
  
  // FIX: Filter echte Live Shops - Demo Shop (ID 999) explizit ausschließen
  const liveShops = shops.filter(s => 
    s.type === 'shopify' && 
    s.id !== 999 && // Demo Shop ID explizit ausschließen
    s.type !== 'demo' // Sicherheitscheck
  );
  
  // FIX: Filter echte Live Shops für Rendering (ohne Demo Shop!)
  const realLiveShops = liveShops.filter(s =>
    s.id !== 999 &&
    s.type !== 'demo' &&
    s.type === 'shopify'
  );
  
  // DEBUG: Prüfe auf doppelte Demo Shops
  const demoShops = shops.filter(s => s.type === 'demo' || s.id === 999);
  if (demoShops.length > 1) {
    console.warn('[ShopSwitcher] ⚠️ MEHRERE DEMO SHOPS GEFUNDEN:', demoShops.map(s => ({ id: s.id, name: s.name, type: s.type })));
  }
  
  // DEBUG: Prüfe ob Demo Shop fälschlicherweise in liveShops ist
  const demoInLiveShops = liveShops.find(s => s.id === 999 || s.type === 'demo');
  if (demoInLiveShops) {
    console.error('[ShopSwitcher] ❌ BUG: Demo Shop in liveShops gefunden!', demoInLiveShops);
  }
  
  console.log('[ShopSwitcher] Render:', {
    shopsCount: shops.length,
    shops: shops.map(s => ({ id: s.id, name: s.name, type: s.type })),
    demoShop: demoShop ? { id: demoShop.id, name: demoShop.name, type: demoShop.type } : null,
    demoShopsCount: demoShops.length,
    liveShopsCount: liveShops.length,
    liveShops: liveShops.map(s => ({ id: s.id, name: s.name, type: s.type })),
    currentShop: currentShop ? { id: currentShop.id, name: currentShop.name, type: currentShop.type } : null,
    isDemoMode,
    demoInLiveShops: demoInLiveShops ? 'BUG!' : 'OK'
  });

  return (
    <div className={`shop-switcher ${className} relative`}>
      {/* Header mit Buttons */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Aktiver Shop
        </div>
        
        {/* Live/Demo Toggle Buttons */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {/* Live Button */}
          <button
            onClick={handleLiveMode}
            disabled={loading}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
              !isDemoMode 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Live
          </button>
          
          {/* Demo Button */}
          <button
            onClick={handleDemoMode}
            disabled={loading || !demoShop}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
              isDemoMode 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            } ${loading || !demoShop ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Demo
          </button>
        </div>
      </div>

      {/* Shop Cards - Conditional Rendering */}
      {isDemoMode ? (
        // ═════════════════════════════════════
        // DEMO MODE
        // ═════════════════════════════════════
        demoShop && (
          <div className="space-y-2">
            {/* Demo Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">🧪</span>
                <div>
                  <div className="font-semibold text-blue-900 text-sm">
                    Demo-Modus Aktiv
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    Du testest mit 20 synthetischen Produkten. Wechsle zu Live um echte Shopify-Daten zu nutzen.
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Shop Card */}
            <div className="border-2 border-green-500 bg-green-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🧪</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">{demoShop.name}</div>
                    <div className="flex items-center gap-1">
                      <span className="text-green-600 font-medium text-sm">Aktiv</span>
                      <span className="text-green-600">✓</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {demoShop.product_count} Produkte • 90 Tage Verlauf
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        // ═════════════════════════════════════
        // LIVE MODE
        // ═════════════════════════════════════
        <div className="space-y-2">
          {realLiveShops.length > 0 ? (
            // ─────────────────────────────────
            // FALL 1: Shopify Shop ist installiert
            // ─────────────────────────────────
            realLiveShops.map((shop) => (
              <div
                key={shop.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  shop.is_active 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={async () => {
                  if (loading) return;
                  await handleSwitch(shop, false);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🏪</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {shop.name || shop.shop_url || 'Shopify Shop'}
                        </div>
                        {shop.shop_url && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {shop.shop_url}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`font-medium text-sm ${
                          shop.is_active ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {shop.is_active ? 'Aktiv' : 'Verfügbar'}
                        </span>
                        {shop.is_active && (
                          <span className="text-green-600">✓</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      {shop.product_count || 0} Produkte • Verbunden via Shopify
                    </div>
                  </div>
                </div>
              </div>
              ))
            ) : (
            // ─────────────────────────────────
            // FALL 2: Kein Shop installiert
            // ─────────────────────────────────
            <div className="border-2 border-gray-300 border-dashed rounded-lg p-6 bg-gray-50">
              <div className="text-center">
                <div className="text-5xl mb-4">🏪</div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Shopify Shop verbinden
                </h3>
                
                <p className="text-sm text-gray-600 mb-6">
                  Installiere PriceIQ in deinem Shopify Store um automatisch Preis-Optimierungen zu erhalten.
                </p>
                
                {/* Install Method 1: Direkt Domain eingeben */}
                <div className="max-w-sm mx-auto space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="dein-shop.myshopify.com"
                    value={shopDomain}
                    onChange={(e) => setShopDomain(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleConnectShopify();
                      }
                    }}
                  />
                  <button
                    onClick={handleConnectShopify}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Shop verbinden
                  </button>
                </div>
                
                {/* Install Method 2: Shopify App Store Link */}
                <div className="text-sm text-gray-500">
                  Oder installiere PriceIQ direkt aus dem{' '}
                  <a 
                    href="https://apps.shopify.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Shopify App Store
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="text-sm text-gray-600">Wechselt...</div>
        </div>
      )}
    </div>
  );
}
