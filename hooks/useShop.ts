/**
 * React Hook für Shop-Context
 * Verwaltet aktiven Shop und Demo-Mode
 */
import { useEffect, useState } from 'react';
import { getCurrentShop, getAvailableShops, switchShop } from '@/lib/api';

export interface Shop {
  id: number;
  name: string;
  type: 'shopify' | 'demo';
  shop_url: string | null;
  product_count: number;
  is_active: boolean;
}

export interface ShopContext {
  currentShop: Shop | null;
  isDemoMode: boolean;
  shops: Shop[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  switchToShop: (shopId: number, useDemo: boolean) => Promise<void>;
}

export function useShop(): ShopContext {
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCurrentShop = async () => {
    try {
      setError(null);
      const data = await getCurrentShop();
      console.log('[useShop] getCurrentShop response:', data);
      setCurrentShop(data.shop);
      setIsDemoMode(data.is_demo_mode || false);
      console.log('[useShop] Current shop updated:', data.shop?.name, 'isDemoMode:', data.is_demo_mode);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Laden des Shops');
      console.error('[useShop] Error loading current shop:', err);
    }
  };

  const loadShops = async (preserveDemoMode: boolean = false) => {
    try {
      setError(null);
      const data = await getAvailableShops();
      console.log('[useShop] getAvailableShops response:', data);
      
      // DEBUG: Prüfe auf doppelte Shops
      const shopsArray = data.shops || [];
      const demoShops = shopsArray.filter((s: Shop) => s.type === 'demo');
      if (demoShops.length > 1) {
        console.warn('[useShop] ⚠️ BACKEND GIBT MEHRERE DEMO SHOPS ZURÜCK:', demoShops.map((s: Shop) => ({ id: s.id, name: s.name })));
      }
      
      // Entferne doppelte Demo Shops (behalte nur den ersten)
      const uniqueShops = shopsArray.reduce((acc: Shop[], shop: Shop) => {
        if (shop.type === 'demo') {
          // Prüfe ob bereits ein Demo Shop im Array ist
          const hasDemo = acc.some(s => s.type === 'demo');
          if (!hasDemo) {
            acc.push(shop);
          } else {
            console.warn('[useShop] ⚠️ Doppelten Demo Shop entfernt:', shop.name);
          }
        } else {
          acc.push(shop);
        }
        return acc;
      }, []);
      
      setShops(uniqueShops);
      
      // WICHTIG: Nur isDemoMode setzen, wenn preserveDemoMode false ist
      if (!preserveDemoMode) {
        setIsDemoMode(data.is_demo_mode || false);
      }
      
      // Finde aktiven Shop basierend auf active_shop_id und is_demo_mode
      const activeShopId = data.active_shop_id;
      const isDemo = preserveDemoMode ? isDemoMode : (data.is_demo_mode || false);
      
      let activeShop = null;
      if (isDemo) {
        activeShop = data.shops?.find((s: Shop) => s.type === 'demo') || null;
      } else {
        // Für Live-Shop: Suche nach active_shop_id (ignoriere is_active Flag)
        // WICHTIG: Demo Shop (ID 999) explizit ausschließen!
        activeShop = data.shops?.find((s: Shop) => 
          s.id === activeShopId && 
          s.type === 'shopify' && 
          s.id !== 999  // Demo Shop explizit ausschließen
        ) || null;
        // Fallback: Erster Live-Shop (ohne Demo Shop)
        if (!activeShop && data.shops) {
          activeShop = data.shops.find((s: Shop) => 
            s.type === 'shopify' && 
            s.id !== 999  // Demo Shop explizit ausschließen
          ) || null;
        }
      }
      
      // Fallback: Nutze is_active Flag
      if (!activeShop && data.shops) {
        activeShop = data.shops.find((s: Shop) => s.is_active) || null;
      }
      
      // Fallback: Erster Shop in Liste
      if (!activeShop && data.shops && data.shops.length > 0) {
        activeShop = data.shops[0];
        console.warn('[useShop] Using first shop as fallback:', activeShop.name);
      }
      
      setCurrentShop(activeShop);
      console.log('[useShop] Active shop set to:', activeShop?.name || 'null', 'isDemoMode:', isDemo);
      
      // WICHTIG: Setze loading auf false nach erfolgreichem Laden
      setLoading(false);
      
    } catch (err: any) {
      const errorMsg = err.message || 'Fehler beim Laden der Shops';
      setError(errorMsg);
      console.error('Error loading shops:', err);
      // Setze Demo-Shop als Fallback
      if (shops.length === 0) {
        setShops([{
          id: 999,
          name: 'Demo Shop',
          type: 'demo' as const,
          shop_url: null,
          product_count: 20,
          is_active: true
        }]);
        setCurrentShop({
          id: 999,
          name: 'Demo Shop',
          type: 'demo' as const,
          shop_url: null,
          product_count: 20,
          is_active: true
        });
        setIsDemoMode(true);
      }
      // WICHTIG: Setze loading auf false auch bei Fehler
      setLoading(false);
    }
  };

  const refresh = async (preserveDemoMode: boolean = false) => {
    try {
      // Lade zuerst Shops (enthält active_shop_id und is_demo_mode)
      // preserveDemoMode=true verhindert, dass isDemoMode überschrieben wird
      await loadShops(preserveDemoMode);
      console.log('[useShop] Refresh completed');
    } catch (err) {
      console.error('[useShop] Error during refresh:', err);
      // Sicherstellen, dass loading auf false gesetzt wird
      setLoading(false);
    }
  };

  const switchToShop = async (shopId: number, useDemo: boolean) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`[useShop] Switching to shop ${shopId}, demo: ${useDemo}`);
      
      const result = await switchShop(shopId, useDemo);
      console.log('[useShop] Switch API response:', result);
      
      // WICHTIG: Setze State SOFORT nach erfolgreichem API-Call
      setIsDemoMode(useDemo);
      
      // Finde den neuen Shop in der Liste
      let newShop = shops.find((s: Shop) => s.id === shopId);
      
      // Falls Shop nicht in Liste, lade Shops neu und suche dort
      if (!newShop) {
        console.warn('[useShop] Shop nicht in Liste gefunden, lade Shops neu...');
        const shopsData = await getAvailableShops();
        newShop = shopsData.shops?.find((s: Shop) => s.id === shopId) || null;
        
        // Aktualisiere shops State
        setShops(shopsData.shops || []);
      }
      
      if (newShop) {
        setCurrentShop(newShop);
        console.log('[useShop] Optimistic update: currentShop =', newShop.name, 'isDemoMode =', useDemo);
      } else {
        console.error('[useShop] Shop nicht gefunden! shopId:', shopId);
        // Fallback: Nutze Shop aus API-Response
        if (result.active_shop) {
          const fallbackShop: Shop = {
            id: result.active_shop.id,
            name: result.active_shop.name,
            type: result.active_shop.type as 'shopify' | 'demo',
            shop_url: null,
            product_count: 0,
            is_active: true
          };
          setCurrentShop(fallbackShop);
          console.log('[useShop] Using shop from API response:', fallbackShop.name);
        }
      }
      
      // Aktualisiere localStorage SOFORT
      if (typeof window !== 'undefined') {
        localStorage.setItem('current_shop_id', shopId.toString());
        localStorage.setItem('shop_mode', useDemo ? 'demo' : 'live');
      }
      
      // Trigger app-wide refresh event SOFORT
      window.dispatchEvent(new CustomEvent('shop-switched', { 
        detail: { shopId, useDemo, mode: useDemo ? 'demo' : 'live' } 
      }));
      console.log('[useShop] shop-switched event dispatched');
      
      // WICHTIG: setLoading(false) SOFORT nach API-Call
      setLoading(false);
      
      // Reload data (asynchron im Hintergrund, blockiert UI nicht)
      // WICHTIG: preserveDemoMode=true verhindert, dass refresh() isDemoMode überschreibt
      refresh(true).then(() => {
        console.log('[useShop] Data refreshed after switch');
        // Stelle sicher, dass isDemoMode korrekt bleibt
        setIsDemoMode(useDemo);
      }).catch((err) => {
        console.error('[useShop] Error during refresh:', err);
        // Auch bei Fehler: isDemoMode beibehalten
        setIsDemoMode(useDemo);
      });
      
      return;
    } catch (err: any) {
      console.error('[useShop] Error switching shop:', err);
      setError(err.message || 'Fehler beim Wechseln des Shops');
      setLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    // Prüfe localStorage für shop_id beim Mount
    if (typeof window !== 'undefined') {
      const storedShopId = localStorage.getItem('current_shop_id');
      const storedMode = localStorage.getItem('shop_mode');
      
      if (storedShopId) {
        console.log('[useShop] Found shop_id in localStorage:', storedShopId);
        const shopIdNum = parseInt(storedShopId);
        const useDemo = storedMode === 'demo';
        
        // Wenn shop_id vorhanden, switch zu diesem Shop
        if (!isNaN(shopIdNum)) {
          console.log('[useShop] Auto-switching to shop from localStorage:', shopIdNum, 'demo:', useDemo);
          switchToShop(shopIdNum, useDemo).catch((err) => {
            console.error('[useShop] Error auto-switching shop:', err);
            // Bei Fehler: Normal refresh
            refresh();
          });
          return;
        }
      }
    }
    
    // Load on mount (wenn keine shop_id in localStorage)
    refresh();

    // Listen for shop switch events
    const handleShopSwitch = (event: CustomEvent) => {
      console.log('[useShop] shop-switched event received:', event.detail);
      // Wenn shop_id im Event, speichere es
      if (event.detail?.shopId && typeof window !== 'undefined') {
        localStorage.setItem('current_shop_id', event.detail.shopId.toString());
        const mode = event.detail.mode || (event.detail.useDemo ? 'demo' : 'live');
        localStorage.setItem('shop_mode', mode);
        
        // WICHTIG: Setze State SOFORT, ohne auf refresh() zu warten
        const useDemo = mode === 'demo';
        setIsDemoMode(useDemo);
        
        // Finde Shop in aktueller Liste
        const switchedShop = shops.find((s: Shop) => s.id === event.detail.shopId);
        if (switchedShop) {
          setCurrentShop(switchedShop);
          console.log('[useShop] Shop updated from event:', switchedShop.name, 'demo:', useDemo);
        }
      }
      
      // Refresh mit preserveDemoMode=true, damit isDemoMode nicht überschrieben wird
      refresh(true).then(() => {
        // Stelle sicher, dass isDemoMode korrekt bleibt
        if (event.detail?.useDemo !== undefined) {
          setIsDemoMode(event.detail.useDemo);
        }
      });
    };

    window.addEventListener('shop-switched', handleShopSwitch as EventListener);
    return () => window.removeEventListener('shop-switched', handleShopSwitch as EventListener);
  }, []);

  return {
    currentShop,
    isDemoMode,
    shops,
    loading,
    error,
    refresh,
    switchToShop
  };
}

