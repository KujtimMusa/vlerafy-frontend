/**
 * Shop-Switcher Component
 * Ermöglicht Wechsel zwischen Demo-Shop und echten Shopify-Shops
 */
'use client';

import React, { useState } from 'react';
import { useShop, Shop } from '@/hooks/useShop';
import { API_URL } from '@/lib/api';
import { Store, Check } from 'lucide-react';

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
      s.id !== 999 && // Demo Shop ID explizit ausschließen
      s.type === 'shopify' // Nur Shopify Shops
    );
    
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
    s.id !== 999 // Demo Shop ID explizit ausschließen
  );
  
  // FIX: Filter echte Live Shops für Rendering (ohne Demo Shop!)
  const realLiveShops = liveShops.filter(s =>
    s.id !== 999 &&
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
    <div className={`shop-switcher ${className} relative`} style={{ borderTop: 'none', border: 'none' }}>
      {/* Header mit Buttons */}
      <div className="mb-4">
        <div className="text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
          Aktiver Shop
        </div>
        
        {/* Live/Demo Toggle Buttons */}
        <div className="flex gap-2 p-1 bg-slate-800 border border-gray-700 rounded-lg">
          {/* Live Button */}
          <button
            onClick={handleLiveMode}
            disabled={loading}
            className={`flex-1 px-4 py-2 font-medium transition-all rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              !isDemoMode 
                ? 'bg-slate-700 text-blue-400' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Live
          </button>
          
          {/* Demo Button */}
          <button
            onClick={handleDemoMode}
            disabled={loading || !demoShop}
            className={`flex-1 px-4 py-2 font-medium transition-all rounded ${
              loading || !demoShop ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isDemoMode 
                ? 'bg-slate-700 text-blue-400' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
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
            <div className="border p-3" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
              <div className="flex items-start gap-2">
                <span className="text-lg">🧪</span>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>
                    Demo-Modus Aktiv
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#cbd5e1' }}>
                    Du testest mit 20 synthetischen Produkten. Wechsle zu Live um echte Shopify-Daten zu nutzen.
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Shop Card */}
            <div className="border-2 border-green-500 p-4" style={{ backgroundColor: '#1e293b' }}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">🧪</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold" style={{ color: '#f1f5f9' }}>{demoShop.name}</div>
                    <div className="flex items-center gap-1">
                      <span className="text-green-600 font-medium text-sm">Aktiv</span>
                      <span className="text-green-600">✓</span>
                    </div>
                  </div>
                  <div className="text-sm mt-1" style={{ color: '#94a3b8' }}>
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
                className={`border-2 p-4 cursor-pointer transition-all ${
                  shop.is_active 
                    ? 'border-green-500' 
                    : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  backgroundColor: shop.is_active ? '#1e293b' : '#1e293b',
                }}
                onClick={async () => {
                  if (loading) return;
                  await handleSwitch(shop, false);
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Shop Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Shop Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-100 truncate">
                        {shop.name || 'Shopify Shop'}
                      </p>
                      {shop.is_active && (
                        <span className="px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 flex-shrink-0">
                          <span className="text-xs font-medium text-green-400">Aktiv</span>
                        </span>
                      )}
                    </div>
                    {shop.shop_url && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {shop.shop_url}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {shop.product_count || 0} Produkte • Verbunden via Shopify
                    </p>
                  </div>
                  
                  {/* Status Check */}
                  {shop.is_active && (
                    <div className="flex-shrink-0">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  )}
                </div>
              </div>
              ))
            ) : (
            // ─────────────────────────────────
            // FALL 2: Kein Shop installiert
            // ─────────────────────────────────
            <div className="border-2 border-gray-300 border-dashed p-6" style={{ backgroundColor: '#1e293b' }}>
              <div className="text-center">
                <div className="text-5xl mb-4">🏪</div>
                
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#f1f5f9' }}>
                  Shopify Shop verbinden
                </h3>
                
                <p className="text-sm mb-6" style={{ color: '#94a3b8' }}>
                  Installiere Vlerafy in deinem Shopify Store um automatisch Preis-Optimierungen zu erhalten.
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
                <div className="text-sm" style={{ color: '#94a3b8' }}>
                  Oder installiere Vlerafy direkt aus dem{' '}
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
