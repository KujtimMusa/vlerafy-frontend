'use client'

import { useState, useEffect, useMemo } from 'react'
import { fetchProducts, syncProducts } from '@/lib/api'
import { formatCurrency } from '@/lib/formatters'
import { ShopSwitcher } from '@/components/ShopSwitcher'
import { useShop } from '@/hooks/useShop'
import { Link } from '@/navigation'
import { 
  Search, 
  X, 
  Grid, 
  List, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Info, 
  Zap, 
  Download, 
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface Product {
  id: number
  title: string
  price: number
  cost?: number
  inventory: number
  inventory_quantity?: number
  category?: string
  sales30d?: number
  recommendation?: any
  potential?: number
  margin?: number
}

type FilterType = 'Alle' | 'Kritisch' | 'Optimierbar' | 'Optimal'
type SortType = 'name' | 'price' | 'margin' | 'inventory' | 'potential'
type ViewMode = 'cards' | 'table'

const STATUS_COLORS = {
  optimal: {
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-200',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-700',
    dot: 'bg-green-500'
  },
  warning: {
    bg: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-500'
  },
  critical: {
    bg: 'from-red-50 to-rose-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500'
  },
  optimizable: {
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500'
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('Alle')
  const [sortBy, setSortBy] = useState<SortType>('name')
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
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
  
  // Höre auf Shop-Wechsel Events
  useEffect(() => {
    const handleShopSwitch = (event: CustomEvent) => {
      console.log('[ProductsPage] Shop switched event received:', event.detail)
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
      const data = await fetchProducts()
      console.log('[ProductsPage] Products loaded:', data.length, 'products')
      
      // Berechne Marge für Produkte mit Kosten
      const productsWithMargin = data.map((product: any) => {
        if (product.cost && product.price) {
          const margin = ((product.price - product.cost) / product.price) * 100
          return { ...product, margin }
        }
        return product
      })
      
      setProducts(productsWithMargin || [])
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

  // Helper: Produkt-Status bestimmen
  const getProductStatus = (product: Product): keyof typeof STATUS_COLORS => {
    const inventory = product.inventory_quantity || product.inventory || 0
    
    if (inventory === 0) return 'critical'
    if (product.margin !== undefined) {
      if (product.margin < 0) return 'critical'
      if (product.margin < 15) return 'warning'
    }
    if (inventory < 10) return 'warning'
    if (product.recommendation || product.potential) return 'optimizable'
    return 'optimal'
  }

  // Filter & Sortierung
  const filteredAndSorted = useMemo(() => {
    let filtered = products

    // Suche
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter
    if (activeFilter === 'Kritisch') {
      filtered = filtered.filter(p => getProductStatus(p) === 'critical')
    } else if (activeFilter === 'Optimierbar') {
      filtered = filtered.filter(p => getProductStatus(p) === 'optimizable' || p.recommendation)
    } else if (activeFilter === 'Optimal') {
      filtered = filtered.filter(p => getProductStatus(p) === 'optimal')
    }

    // Sortierung
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        case 'margin':
          return (b.margin || 0) - (a.margin || 0)
        case 'inventory':
          return (b.inventory_quantity || b.inventory || 0) - (a.inventory_quantity || a.inventory || 0)
        case 'potential':
          return (b.potential || 0) - (a.potential || 0)
        case 'name':
        default:
          return a.title.localeCompare(b.title)
      }
    })

    return filtered
  }, [products, searchTerm, activeFilter, sortBy])

  // Summary Stats
  const summaryStats = useMemo(() => {
    const total = products.length
    const withCosts = products.filter(p => p.cost).length
    const critical = products.filter(p => getProductStatus(p) === 'critical').length
    const warning = products.filter(p => getProductStatus(p) === 'warning').length
    const optimizable = products.filter(p => getProductStatus(p) === 'optimizable').length
    
    // Durchschnittliche Marge
    const productsWithMargin = products.filter(p => p.margin !== undefined && p.margin !== null)
    const avgMargin = productsWithMargin.length > 0
      ? productsWithMargin.reduce((sum, p) => sum + (p.margin || 0), 0) / productsWithMargin.length
      : 0

    // Total Potential
    const totalPotential = products.reduce((sum, p) => sum + (p.potential || 0), 0)
    const recsCount = products.filter(p => p.recommendation || p.potential).length

    return {
      total,
      withCosts,
      critical,
      warning,
      optimizable,
      avgMargin,
      totalPotential,
      recsCount
    }
  }, [products])

  const getFilterCount = (filter: FilterType): number => {
    switch (filter) {
      case 'Kritisch':
        return summaryStats.critical
      case 'Optimierbar':
        return summaryStats.optimizable
      case 'Optimal':
        return products.filter(p => getProductStatus(p) === 'optimal').length
      default:
        return 0
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200 p-6 overflow-y-auto shadow-sm">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            <span className="text-2xl">💡</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            PriceIQ
          </h2>
        </div>
        
        <div className="mb-6">
          <ShopSwitcher />
        </div>
        
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
            Produkte
          </Link>
          <Link 
            href="/recommendations" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Empfehlungen
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Hero Bar - Sticky */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Title + Count */}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Produkte
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredAndSorted.length} von {summaryStats.total} Produkten
                </p>
              </div>

              {/* Right: Quick Actions */}
              <div className="flex gap-3">
                {!isDemoMode && currentShop && currentShop.type === 'shopify' && (
                  <button
                    onClick={handleSync}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all hover:shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    {loading ? 'Synchronisiere...' : 'Synchronisieren'}
                  </button>
                )}
                <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <Link
                  href="/"
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all flex items-center gap-2"
                >
                  ← Zurück
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {products.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Stat Card 1 - Produkte */}
              <div className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50 border-2 border-blue-100 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-2xl group-hover:bg-blue-400/20 transition-all"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                      📦
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 font-medium">Produkte</div>
                      <div className="text-3xl font-bold text-gray-900">{summaryStats.total}</div>
                    </div>
                  </div>
                  
                  {/* Mini Trend */}
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-green-600 font-medium">Synchronisiert</span>
                  </div>
                </div>
              </div>

              {/* Stat Card 2 - Marge */}
              <div className="group relative bg-gradient-to-br from-green-50 via-white to-green-50 border-2 border-green-100 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/10 rounded-full blur-2xl group-hover:bg-green-400/20 transition-all"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                      💰
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 font-medium">Ø Marge</div>
                      <div className="text-3xl font-bold text-gray-900">
                        {summaryStats.avgMargin > 0 ? `${summaryStats.avgMargin.toFixed(1)}%` : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {summaryStats.avgMargin > 0 && (
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                        style={{ width: `${Math.min(summaryStats.avgMargin, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Stat Card 3 - Kritisch */}
              <div className="group relative bg-gradient-to-br from-red-50 via-white to-red-50 border-2 border-red-100 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-400/10 rounded-full blur-2xl group-hover:bg-red-400/20 transition-all"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                      🔴
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 font-medium">Kritisch</div>
                      <div className="text-3xl font-bold text-gray-900">{summaryStats.critical}</div>
                    </div>
                  </div>
                  
                  {summaryStats.critical > 0 && (
                    <div className="text-xs text-red-600 font-medium">
                      Sofortiges Handeln erforderlich!
                    </div>
                  )}
                </div>
              </div>

              {/* Stat Card 4 - Potenzial */}
              <div className="group relative bg-gradient-to-br from-purple-50 via-white to-purple-50 border-2 border-purple-100 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl group-hover:bg-purple-400/20 transition-all"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                      💡
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 font-medium">Potenzial</div>
                      <div className="text-3xl font-bold text-gray-900">
                        {summaryStats.totalPotential > 0 
                          ? `€${Math.round(summaryStats.totalPotential).toLocaleString('de-DE')}` 
                          : '€0'}
                      </div>
                    </div>
                  </div>
                  
                  {summaryStats.recsCount > 0 && (
                    <div className="text-xs text-purple-600 font-medium">
                      +{summaryStats.recsCount} Empfehlungen verfügbar
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar - Glassmorphism */}
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Produkte durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Filter Chips */}
              <div className="flex gap-2 flex-wrap">
                {(['Alle', 'Kritisch', 'Optimierbar', 'Optimal'] as FilterType[]).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      activeFilter === filter
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {filter}
                    {filter !== 'Alle' && (
                      <span className="ml-2 text-xs opacity-75">
                        ({getFilterCount(filter)})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="name">📝 Name</option>
                <option value="price">💶 Preis</option>
                <option value="margin">💰 Marge</option>
                <option value="inventory">📦 Lager</option>
                <option value="potential">⚡ Potenzial</option>
              </select>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'cards' ? 'bg-white shadow-sm' : ''
                  }`}
                  title="Karten-Ansicht"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'table' ? 'bg-white shadow-sm' : ''
                  }`}
                  title="Tabellen-Ansicht"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/Table */}
        {loading && products.length === 0 ? (
          <div className="text-center py-12 text-gray-600">Lade Produkte...</div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Keine Produkte gefunden</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || activeFilter !== 'Alle' 
                ? 'Versuche einen anderen Filter oder Suchbegriff.'
                : 'Synchronisiere zuerst deine Produkte.'}
            </p>
            {(searchTerm || activeFilter !== 'Alle') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setActiveFilter('Alle')
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        ) : viewMode === 'cards' ? (
          <div className="max-w-7xl mx-auto px-6 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSorted.map(product => {
                const status = getProductStatus(product)
                const colors = STATUS_COLORS[status]
                const inventory = product.inventory_quantity || product.inventory || 0
                
                return (
                  <div 
                    key={product.id}
                    className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {/* Status Indicator */}
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className={`${colors.badge} px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5`}>
                        <div className={`w-2 h-2 ${colors.dot} rounded-full animate-pulse`}></div>
                        {status === 'optimal' && 'Optimal'}
                        {status === 'warning' && 'Achtung'}
                        {status === 'critical' && 'Kritisch'}
                        {status === 'optimizable' && 'Optimierbar'}
                      </div>
                    </div>

                    {/* Header */}
                    <div className={`bg-gradient-to-br ${colors.bg} p-6 rounded-t-2xl border-b-2 ${colors.border}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.title}
                      </h3>
                      
                      {/* Quick Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4 text-gray-600" />
                          <span className={`font-medium ${
                            inventory > 20 ? 'text-green-600' :
                            inventory > 0 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {inventory} Lager
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                      {/* Price Section */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Verkaufspreis</div>
                          <div className="text-3xl font-bold text-gray-900">
                            {formatCurrency(product.price)}
                          </div>
                        </div>
                        
                        {product.cost && product.margin !== undefined && (
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">Marge</div>
                            <div className={`text-2xl font-bold ${
                              product.margin > 30 ? 'text-green-600' :
                              product.margin > 15 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {product.margin.toFixed(1)}%
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Margin Bar */}
                      {product.cost && product.margin !== undefined && (
                        <div className="relative">
                          <div className="flex justify-between text-xs text-gray-600 mb-2">
                            <span>Kosten {formatCurrency(product.cost)}</span>
                            <span>Gewinn {formatCurrency(product.price - product.cost)}</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${
                                product.margin > 30 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                                product.margin > 15 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                                'bg-gradient-to-r from-red-400 to-red-600'
                              }`}
                              style={{ width: `${Math.min(product.margin, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Recommendation Badge */}
                      {product.potential && product.potential > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl shadow-lg">
                              💡
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-gray-600 font-medium">Optimierungspotenzial</div>
                              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                +{formatCurrency(product.potential)}/Monat
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <Link 
                          href={`/recommendations?product_id=${product.id}`}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white transition-all group"
                          title="Kosten"
                        >
                          <DollarSign className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                          <span className="text-xs text-gray-600 group-hover:text-blue-600">Kosten</span>
                        </Link>
                        
                        <Link 
                          href={`/recommendations?product_id=${product.id}`}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white transition-all group"
                          title="Wettbewerber"
                        >
                          <Search className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                          <span className="text-xs text-gray-600 group-hover:text-blue-600">Markt</span>
                        </Link>
                        
                        <Link 
                          href={`/recommendations?product_id=${product.id}`}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white transition-all group"
                          title="Details"
                        >
                          <Info className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                          <span className="text-xs text-gray-600 group-hover:text-blue-600">Details</span>
                        </Link>
                      </div>
                      
                      <Link href={`/recommendations?product_id=${product.id}`}>
                        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                          <Zap className="w-5 h-5" />
                          Preisempfehlungen anzeigen
                        </button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          // Table View (später implementieren)
          <div className="max-w-7xl mx-auto px-6 pb-12">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Produkt</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Preis</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marge</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lager</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSorted.map(product => {
                    const status = getProductStatus(product)
                    const colors = STATUS_COLORS[status]
                    const inventory = product.inventory_quantity || product.inventory || 0
                    
                    return (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className={`${colors.badge} px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5`}>
                            <div className={`w-2 h-2 ${colors.dot} rounded-full`}></div>
                            {status === 'optimal' && 'Optimal'}
                            {status === 'warning' && 'Achtung'}
                            {status === 'critical' && 'Kritisch'}
                            {status === 'optimizable' && 'Optimierbar'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{product.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{formatCurrency(product.price)}</div>
                        </td>
                        <td className="px-6 py-4">
                          {product.margin !== undefined ? (
                            <div className={`font-bold ${
                              product.margin > 30 ? 'text-green-600' :
                              product.margin > 15 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {product.margin.toFixed(1)}%
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${
                            inventory > 20 ? 'text-green-600' :
                            inventory > 0 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {inventory}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/recommendations?product_id=${product.id}`}>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                              Anzeigen
                            </button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
