'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, ArrowRight, ArrowLeft, Sparkles, RefreshCw, LayoutDashboard, Lightbulb, Check, Store, ChevronDown } from 'lucide-react'
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
        <div className="px-4 pt-6 pb-4 border-b border-gray-800/30">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative group cursor-pointer">
              {/* Icon mit Premium Glow */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/40 group-hover:scale-105">
                <span className="text-xl">💡</span>
              </div>
              {/* Subtle Glow Background */}
              <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white tracking-tight leading-none">
                PriceIQ
              </h2>
              <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mt-0.5">
                Pricing Intelligence
              </p>
            </div>
          </div>
          
          {/* Shop Switcher */}
          <div className="mb-5">
            <ShopSwitcher />
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1 px-2">
          {/* Navigation Label */}
          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </p>
          </div>
          
          {/* Dashboard Link */}
          <Link 
            href="/" 
            className={`
              group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              ${pathname === '/' || pathname === '/de' || pathname === '/en'
                ? 'bg-blue-500/10 text-blue-400 shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/50'
              }
            `}
          >
            <div className={`
              p-1.5 rounded-md transition-colors
              ${pathname === '/' || pathname === '/de' || pathname === '/en'
                ? 'bg-blue-500/20' 
                : 'bg-slate-800/50 group-hover:bg-slate-800'
              }
            `}>
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Dashboard</span>
            
            {/* Active Indicator */}
            {(pathname === '/' || pathname === '/de' || pathname === '/en') && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"></div>
            )}
          </Link>
          
          {/* Products Link */}
          <Link 
            href="/products" 
            className={`
              group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              ${pathname?.includes('/products')
                ? 'bg-blue-500/10 text-blue-400 shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/50'
              }
            `}
          >
            <div className={`
              p-1.5 rounded-md transition-colors
              ${pathname?.includes('/products')
                ? 'bg-blue-500/20' 
                : 'bg-slate-800/50 group-hover:bg-slate-800'
              }
            `}>
              <Package className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Produkte</span>
            
            {pathname?.includes('/products') && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"></div>
            )}
          </Link>
          
          {/* Recommendations Link */}
          <Link 
            href="/recommendations" 
            className={`
              group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              ${pathname?.includes('/recommendations')
                ? 'bg-blue-500/10 text-blue-400 shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/50'
              }
            `}
          >
            <div className={`
              p-1.5 rounded-md transition-colors
              ${pathname?.includes('/recommendations')
                ? 'bg-blue-500/20' 
                : 'bg-slate-800/50 group-hover:bg-slate-800'
              }
            `}>
              <Lightbulb className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Empfehlungen</span>
            
            {pathname?.includes('/recommendations') && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"></div>
            )}
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="space-y-8">
        {/* Page Header - Premium */}
        <div className="mb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-4" aria-label="Breadcrumb">
            <span className="text-xs font-medium text-slate-500">PriceIQ</span>
            <svg className="w-3 h-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-xs font-semibold text-slate-300">Produkte</span>
          </nav>
          
          {/* Title Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                <Package className="w-6 h-6 text-white" />
              </div>
              
              {/* Title + Counter */}
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Produkte
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  {products.length} Produkte synchronisiert
                  {productsWithRecommendations > 0 && (
                    <span className="ml-2 text-purple-400">
                      • {productsWithRecommendations} mit AI-Empfehlungen
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            {/* Shop Switcher */}
            {currentShop && (
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-sm font-medium text-slate-200 hover:text-white transition-colors">
                <Store className="w-4 h-4" />
                <span>{currentShop.name} {isDemoMode && '(Demo)'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            
            {/* Demo Mode Indicator */}
            {isDemoMode && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-xs font-semibold text-orange-400">
                  Demo-Mode: Keine Synchronisation
                </span>
              </div>
            )}
            
            {/* Sync Button */}
            {!isDemoMode && currentShop && currentShop.type === 'shopify' && (
              <button
                onClick={handleSync}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Synchronisiere...' : 'Produkte synchronisieren'}
              </button>
            )}
            
            {/* Spacer */}
            <div className="flex-1" />
            
            {/* Back Button */}
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück</span>
            </Link>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6 animate-pulse">
                <div className="aspect-[4/3] rounded-xl bg-slate-700/50 mb-5" />
                <div className="h-6 bg-slate-700/50 rounded mb-4" />
                <div className="h-8 bg-slate-700/50 rounded mb-3" />
                <div className="h-10 bg-slate-700/50 rounded" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">
              Keine Produkte gefunden
            </h3>
            {isDemoMode ? (
              <>
                <p className="text-sm text-slate-400 text-center max-w-md mb-6">
                  Demo-Shop: Produkte werden automatisch geladen. Falls keine angezeigt werden, prüfe die Browser-Console.
                </p>
                <button
                  onClick={() => loadProducts()}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg transition-all"
                >
                  <RefreshCw className="h-4 w-4 inline mr-2" />
                  Produkte neu laden
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-400 text-center max-w-md mb-6">
                  Es wurden noch keine Produkte synchronisiert. Verbinde deinen Shop, um Produkte zu importieren.
                </p>
                <button
                  onClick={handleSync}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg transition-all"
                >
                  <RefreshCw className="h-4 w-4 inline mr-2" />
                  Shop verbinden
                </button>
              </>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product, index) => {
              const hasRecommendation = product.has_recommendation || product.recommendation_count > 0
              const inventory = product.inventory || product.inventory_quantity || 0
              const currentPrice = product.price?.toFixed(2) || '0.00'
              
              // Bestimme Inventory-Level
              const getInventoryBadge = (inv: number) => {
                if (inv < 10) {
                  return {
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/20',
                    text: 'text-red-400',
                    label: 'Kritisch'
                  }
                }
                if (inv < 30) {
                  return {
                    bg: 'bg-orange-500/10',
                    border: 'border-orange-500/20',
                    text: 'text-orange-400',
                    label: 'Niedrig'
                  }
                }
                if (inv < 100) {
                  return {
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/20',
                    text: 'text-green-400',
                    label: 'Gut'
                  }
                }
                return {
                  bg: 'bg-slate-500/10',
                  border: 'border-slate-500/20',
                  text: 'text-slate-400',
                  label: 'Hoch'
                }
              }

              const inventoryBadge = getInventoryBadge(inventory)

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative"
                >
                  {/* Premium Card Container */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-slate-600/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
                    {/* Decorative Glow (subtle) */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* AI Badge - Only if has recommendation */}
                    {hasRecommendation && (
                      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs font-semibold text-purple-400">AI</span>
                      </div>
                    )}

                    {/* Image Placeholder - DARK THEME */}
                    <div className="relative mb-5 aspect-[4/3] rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 flex items-center justify-center overflow-hidden group-hover:border-slate-500/50 transition-colors">
                      {/* Icon */}
                      <div className="relative z-10">
                        <Package className="w-16 h-16 text-slate-500 group-hover:text-slate-400 transition-colors" strokeWidth={1.5} />
                      </div>
                      {/* Subtle Pattern Background */}
                      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 space-y-4">
                      {/* Product Title */}
                      <h3 className="text-lg font-semibold text-slate-100 line-clamp-2 group-hover:text-white transition-colors min-h-[3.5rem]">
                        {product.title}
                      </h3>

                      {/* Price Section - IMPROVED */}
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Aktueller Preis
                        </p>
                        <div className="flex items-baseline gap-3">
                          {/* Current Price */}
                          <span className="text-3xl font-bold text-white">
                            €{currentPrice}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge - PREMIUM STYLE */}
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${inventoryBadge.bg} ${inventoryBadge.border} group-hover:opacity-80 transition-opacity`}>
                          <Check className={`w-3.5 h-3.5 ${inventoryBadge.text}`} />
                          <span className={`text-xs font-semibold ${inventoryBadge.text}`}>
                            {inventoryBadge.label} ({inventory})
                          </span>
                        </div>
                        
                        {/* Optional: "Empfohlen" Badge */}
                        {hasRecommendation && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs font-semibold text-blue-400">
                              Empfohlen
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CTA Button - PREMIUM GLOW */}
                      <Link
                        href={`/recommendations?product_id=${product.id}`}
                        className="group/btn relative w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <span>Preisempfehlungen anzeigen</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
          )}
          </div>
        </div>
      </main>
    </div>
  )
}
