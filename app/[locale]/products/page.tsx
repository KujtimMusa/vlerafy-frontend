'use client'

import { useState, useEffect } from 'react'
import { fetchProducts, syncProducts } from '@/lib/api'
import { ShopSwitcher } from '@/components/ShopSwitcher'
import { useShop } from '@/hooks/useShop'
import { Link } from '@/navigation'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { currentShop, isDemoMode, refresh: refreshShop } = useShop()

  // Lade Produkte beim Shop-Wechsel
  useEffect(() => {
    if (currentShop) {
      console.log('[ProductsPage] Shop changed, reloading products:', currentShop.name, 'isDemoMode:', isDemoMode)
      loadProducts()
    }
  }, [currentShop?.id, isDemoMode])
  
  // Höre auf Shop-Wechsel Events (für sofortiges Reload)
  useEffect(() => {
    const handleShopSwitch = (event: CustomEvent) => {
      console.log('[ProductsPage] Shop switched event received:', event.detail)
      // Kurze Verzögerung, damit Shop-Context aktualisiert ist
      setTimeout(() => {
        loadProducts()
      }, 200)
    }
    
    window.addEventListener('shop-switched', handleShopSwitch as EventListener)
    return () => window.removeEventListener('shop-switched', handleShopSwitch as EventListener)
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      console.log('[ProductsPage] Loading products, currentShop:', currentShop?.name, 'isDemoMode:', isDemoMode)
      // Nutze Shop-Context (kein shop_id mehr nötig)
      const data = await fetchProducts()
      console.log('[ProductsPage] Products loaded:', data.length, 'products')
      setProducts(data || [])
    } catch (error) {
      console.error('[ProductsPage] Fehler beim Laden der Produkte:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    if (isDemoMode) {
      alert('Demo-Shop: Produkte können nicht synchronisiert werden. Nutze einen echten Shopify-Shop.')
      return
    }
    
    if (!currentShop || currentShop.type === 'demo') {
      alert('Bitte wähle einen echten Shopify-Shop aus!')
      return
    }
    
    setLoading(true)
    try {
      await syncProducts(currentShop.id)
      await loadProducts()
    } catch (error) {
      console.error('Fehler beim Synchronisieren:', error)
      alert('Fehler beim Synchronisieren. Prüfe die Konsole für Details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar mit Shop-Switcher */}
      <aside className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Dynamic Pricing</h2>
        
        {/* Shop Switcher */}
        <div className="mb-6">
          <ShopSwitcher />
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          <Link 
            href="/" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/products" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors bg-gray-100"
          >
            Products
          </Link>
          <Link 
            href="/recommendations" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Recommendations
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span>🧪</span>
              <span className="font-medium">Demo Mode Active</span>
              <span className="text-blue-600">
                • Testing with {currentShop?.product_count || 20} synthetic products
              </span>
            </div>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Produkte</h1>
          <div className="flex gap-4 items-center">
            {currentShop && (
              <div className="px-4 py-2 bg-gray-100 rounded text-gray-700 text-sm">
                {currentShop.name} {isDemoMode && '(Demo)'}
              </div>
            )}
            {!isDemoMode && currentShop && currentShop.type === 'shopify' && (
              <button
                onClick={handleSync}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Synchronisiere...' : 'Produkte synchronisieren'}
              </button>
            )}
            {isDemoMode && (
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                Demo-Mode: Keine Synchronisation möglich
              </div>
            )}
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Zurück
            </Link>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="text-center py-12 text-gray-600">Lade Produkte...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            {isDemoMode ? (
              <>
                <p className="text-gray-600 mb-4">
                  Demo-Shop: Produkte werden automatisch geladen. Falls keine angezeigt werden, prüfe die Browser-Console.
                </p>
                <button
                  onClick={() => loadProducts()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Produkte neu laden
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-4">Keine Produkte gefunden. Synchronisiere zuerst deine Produkte.</p>
                <button
                  onClick={handleSync}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Produkte synchronisieren
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="p-6 bg-white rounded-lg shadow border border-gray-200">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{product.title}</h3>
                <p className="text-gray-600 mb-2">Preis: <span className="font-semibold text-gray-900">€{product.price.toFixed(2)}</span></p>
                <p className="text-gray-600 mb-4">Lager: <span className="font-semibold text-gray-900">{product.inventory}</span></p>
                <Link
                  href={`/recommendations?product_id=${product.id}`}
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                  Preisempfehlungen anzeigen →
                </Link>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>
    </div>
  )
}

