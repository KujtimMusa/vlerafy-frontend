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

  const handleSwitch = async (shop: Shop, useDemo: boolean) => {
    try {
      console.log(`[ShopSwitcher] Switching to shop ${shop.id}, demo: ${useDemo}`);
      await switchToShop(shop.id, useDemo);
      console.log('[ShopSwitcher] Shop switched successfully');
      // Success feedback wird über useShop Hook gehandhabt
    } catch (err) {
      console.error('[ShopSwitcher] Failed to switch shop:', err);
      // Error wird bereits in useShop gesetzt
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

  const demoShop = shops.find(s => s.type === 'demo');
  const liveShops = shops.filter(s => s.type === 'shopify');
  
  console.log('[ShopSwitcher] Render:', {
    shopsCount: shops.length,
    demoShop: demoShop?.name,
    liveShopsCount: liveShops.length,
    liveShops: liveShops.map(s => ({ id: s.id, name: s.name })),
    currentShop: currentShop?.name,
    isDemoMode
  });

  return (
    <div className={`shop-switcher ${className} relative`}>
      {/* Header with Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Shop</h3>
        
        <div className="flex items-center gap-2">
          <span className={`text-sm ${!isDemoMode ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
            Live
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDemoMode}
              onChange={async (e) => {
                if (loading) return;
                
                if (e.target.checked && demoShop) {
                  console.log('[ShopSwitcher] Toggle: Switching to Demo');
                  await handleSwitch(demoShop, true);
                } else if (!e.target.checked && liveShops.length > 0) {
                  console.log('[ShopSwitcher] Toggle: Switching to Live Shop', liveShops[0].id);
                  await handleSwitch(liveShops[0], false);
                } else {
                  console.warn('[ShopSwitcher] Toggle: No shop available for switch');
                }
              }}
              disabled={loading}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <span className={`text-sm ${isDemoMode ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            Demo
          </span>
        </div>
      </div>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-lg">🧪</span>
            <div>
              <p className="text-sm font-medium text-blue-900">Demo Mode Active</p>
              <p className="text-xs text-blue-700">
                You're testing with 20 synthetic products. Switch to Live to use real Shopify data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Shop Cards */}
      <div className="space-y-2">
        {/* Demo Shop Card */}
        {demoShop && (
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              isDemoMode 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:bg-gray-50'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !loading && handleSwitch(demoShop, true)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                  🧪
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{demoShop.name}</h4>
                  <p className="text-sm text-gray-600">
                    {demoShop.product_count} products • 90 days history
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  isDemoMode 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {isDemoMode ? 'Active' : 'Available'}
                </span>
                {isDemoMode && <span className="text-green-500 text-xl">✓</span>}
              </div>
            </div>
          </div>
        )}

        {/* Live Shopify Shops */}
        {liveShops.map(shop => (
          <div
            key={shop.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              !isDemoMode && shop.is_active 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:bg-gray-50'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={async () => {
              if (loading) {
                console.log('[ShopSwitcher] Shop card click: Loading, ignoring');
                return;
              }
              console.log('[ShopSwitcher] Shop card click:', shop.id, shop.name);
              try {
                await handleSwitch(shop, false);
                console.log('[ShopSwitcher] Shop card switch completed');
              } catch (err) {
                console.error('[ShopSwitcher] Shop card switch failed', err);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">
                  🏪
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{shop.name}</h4>
                  <p className="text-sm text-gray-600">
                    {shop.product_count} products • Connected via Shopify
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  !isDemoMode && shop.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {!isDemoMode && shop.is_active ? 'Active' : 'Available'}
                </span>
                {!isDemoMode && shop.is_active && (
                  <span className="text-green-500 text-xl">✓</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Live Shops - Call to Action */}
      {liveShops.length === 0 && (
        <div className="p-4 mt-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-700">
              Noch kein echter Shopify-Shop verbunden.
            </p>
            <input
              type="text"
              value={shopDomain}
              onChange={(e) => setShopDomain(e.target.value)}
              placeholder="dein-shop.myshopify.com"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleConnectShopify}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors w-full"
            >
              Shopify-Shop verbinden
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="text-sm text-gray-600">Switching...</div>
        </div>
      )}
    </div>
  );
}

