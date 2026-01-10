'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, ArrowRight, ArrowLeft, Sparkles, RefreshCw, LayoutDashboard, Lightbulb } from 'lucide-react'
import { fetchProducts, syncProducts } from '@/lib/api'
import { ShopSwitcher } from '@/components/ShopSwitcher'
import { useShop } from '@/hooks/useShop'
import { Link } from '@/navigation'
import { usePathname } from 'next/navigation'

export default function ProductsPage() {
  const pathname = usePathname()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { currentShop, isDemoMode, refresh: refreshShop } = useShop()

  // Lade Produkte beim Shop-Wechsel
  useEffect(() => {
    if (!currentShop) {
      console.log('[ProductsPage] No current shop, skipping load')
      return
    }
    console.log('[ProductsPage] Shop changed, reloading products:', currentShop.name, 'isDemoMode:', isDemoMode)
    loadProducts()
  }, [currentShop?.id, isDemoMode])
  
  // Höre auf Shop-Wechsel Events (für sofortiges Reload)
  useEffect(() => {
    const handleShopSwitch = (event: CustomEvent) => {
      console.log('[ProductsPage] Shop switched event received:', event.detail)
      // Kurze Verzögerung, damit Shop-Context aktualisiert ist
      setTimeout(() => {
        loadProducts()
      }, 300)
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

  // Zähle Produkte mit Empfehlungen (für Anzeige)
  const productsWithRecommendations = products.filter((p: any) => 
    p.has_recommendation || p.recommendation_count > 0
  ).length

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0f172a' }}>
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      {/* Sidebar mit Shop-Switcher */}
      <aside className="w-80 border-r p-6 overflow-y-auto shadow-sm" style={{ background: 'linear-gradient(to bottom, #1e293b, #0f172a, #1e293b)', borderColor: '#334155' }}>
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-700">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            <span className="text-2xl">💡</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            PriceIQ
          </h2>
        </div>
        
        {/* Shop Switcher */}
        <div className="mb-6">
          <ShopSwitcher />
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1 px-3">
          <Link 
            href="/" 
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
              ${pathname === '/' || pathname === '/de' || pathname === '/en'
                ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-500 shadow-sm' 
                : 'text-gray-400 hover:bg-slate-800/50 hover:text-gray-200 border-l-4 border-transparent'
              }
            `}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link 
            href="/products" 
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
              ${pathname?.includes('/products')
                ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-500 shadow-sm' 
                : 'text-gray-400 hover:bg-slate-800/50 hover:text-gray-200 border-l-4 border-transparent'
              }
            `}
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">Produkte</span>
          </Link>
          
          <Link 
            href="/recommendations" 
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
              ${pathname?.includes('/recommendations')
                ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-500 shadow-sm' 
                : 'text-gray-400 hover:bg-slate-800/50 hover:text-gray-200 border-l-4 border-transparent'
              }
            `}
          >
            <Lightbulb className="w-5 h-5" />
            <span className="font-medium">Empfehlungen</span>
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 pl-8 pr-8 py-8 overflow-y-auto border-l border-gray-800/30">
        <div className="max-w-7xl mx-auto">
        {/* Page Header - Enhanced */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            {/* Left Side */}
            <div>
              <h1 className="text-5xl font-bold tracking-tight mb-3" style={{ color: '#f1f5f9' }}>
                Produkte
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2" style={{ color: '#94a3b8' }}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#334155' }}>
                    <Package className="h-4 w-4" />
                  </div>
                  <span className="text-lg font-medium">
                    {products.length} Produkte
                  </span>
                </div>
                
                {productsWithRecommendations > 0 && (
                  <>
                    <div className="h-4 w-px" style={{ backgroundColor: '#475569' }} />
                    <div className="flex items-center gap-2 text-purple-600">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <span className="text-lg font-semibold">
                        {productsWithRecommendations} mit AI-Empfehlungen
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Side - Buttons */}
            <div className="flex items-center gap-3">
              {currentShop && (
                <div className="flex items-center gap-2 px-5 py-3 border rounded-xl font-medium shadow-sm" style={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#cbd5e1' }}>
                  <span>{currentShop.name} {isDemoMode && '(Demo)'}</span>
                </div>
              )}
              {!isDemoMode && currentShop && currentShop.type === 'shopify' && (
                <button
                  onClick={handleSync}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Synchronisiere...' : 'Produkte synchronisieren'}
                </button>
              )}
              {isDemoMode && (
                <div className="flex items-center gap-2 px-5 py-3 border rounded-xl font-medium cursor-not-allowed" style={{ backgroundColor: '#334155', borderColor: '#475569', color: '#94a3b8' }}>
                  <RefreshCw className="h-4 w-4" />
                  <span>Demo-Mode: Keine Synchronisation möglich</span>
                </div>
              )}
              <Link
                href="/"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Zurück</span>
              </Link>
            </div>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="products-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-image" />
                <div className="skeleton-content">
                  <div className="skeleton-line" style={{ width: '80%', height: '20px' }} />
                  <div className="skeleton-line" style={{ width: '60%', height: '16px', marginTop: '16px' }} />
                  <div className="skeleton-line" style={{ width: '40%', height: '32px', marginTop: '20px' }} />
                  <div className="skeleton-line" style={{ width: '50%', height: '14px', marginTop: '16px' }} />
                  <div className="skeleton-line" style={{ width: '100%', height: '48px', marginTop: '20px', borderRadius: '12px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-6"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-pulse rounded-full bg-purple-300/30 blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-xl">
                <Package className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Keine Produkte gefunden
            </h3>
            {isDemoMode ? (
              <>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                  Demo-Shop: Produkte werden automatisch geladen. Falls keine angezeigt werden, prüfe die Browser-Console.
                </p>
                <button
                  onClick={() => loadProducts()}
                  className="btn-modern btn-primary"
                >
                  <RefreshCw className="h-4 w-4" />
                  Produkte neu laden
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                  Synchronisiere deine Produkte oder füge welche manuell hinzu.
                </p>
                <button
                  onClick={handleSync}
                  className="btn-modern btn-primary"
                >
                  <RefreshCw className="h-4 w-4" />
                  Produkte synchronisieren
                </button>
              </>
            )}
          </motion.div>
        ) : (
          <div className="products-grid">
            {products.map((product, index) => {
              const hasRecommendation = product.has_recommendation || product.recommendation_count > 0
              const inventory = product.inventory || product.inventory_quantity || 0
              
              // Bestimme Inventory-Level
              const getInventoryClass = (inv: number) => {
                if (inv < 10) return 'inventory-critical'
                if (inv < 30) return 'inventory-low'
                if (inv < 100) return 'inventory-good'
                return 'inventory-high'
              }

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`product-card ${hasRecommendation ? 'has-recommendation' : ''}`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* AI Badge - Only if has recommendation */}
                  {hasRecommendation && (
                    <div className="ai-badge">
                      <Sparkles className="ai-badge-icon" />
                      AI
                    </div>
                  )}

                  {/* Product Image Area */}
                  <div className="product-image-container">
                    <Package className="product-image-icon" />
                  </div>

                  {/* Product Content */}
                  <div className="product-content">
                    {/* Title */}
                    <h3 className="product-title">
                      {product.title}
                    </h3>

                    {/* Price Section */}
                    <div className="product-price-section">
                      <div className="product-price-main">
                        €{product.price?.toFixed(2) || '0.00'}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="product-price-label">Preis:</span>
                        <span className="product-price-original">
                          €{product.price?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>

                    {/* Inventory Badge */}
                    <div className={`inventory-badge ${getInventoryClass(inventory)}`}>
                      <Package className="inventory-icon h-4 w-4" />
                      <span>Lager: {inventory}</span>
                    </div>

                    {/* Recommendation Link */}
                    <Link
                      href={`/recommendations?product_id=${product.id}`}
                      className="recommendation-link"
                    >
                      <span>Preisempfehlungen anzeigen</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
        </div>
      </main>
    </div>
  )
}
