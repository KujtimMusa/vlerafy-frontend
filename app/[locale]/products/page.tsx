'use client'

import { useState, useEffect, useMemo } from 'react'
import { fetchProducts, syncProducts, getRecommendations, calculateMargin, hasCostData } from '@/lib/api'
import { formatCurrency, formatPercentage } from '@/lib/formatters'
import { ShopSwitcher } from '@/components/ShopSwitcher'
import { useShop } from '@/hooks/useShop'
import { Link } from '@/navigation'
import { 
  Package, 
  DollarSign, 
  AlertCircle, 
  TrendingUp, 
  Lightbulb,
  Search,
  Filter,
  ArrowUpDown,
  Info,
  CheckCircle2,
  XCircle
} from 'lucide-react'

interface Product {
  id: number
  title: string
  price: number
  cost?: number
  inventory: number
  category?: string
}

interface ProductWithDetails extends Product {
  margin?: number
  hasRecommendation?: boolean
  recommendationPotential?: number
  status: 'optimal' | 'warning' | 'critical'
  hasCostData?: boolean
}

type FilterType = 'all' | 'critical' | 'optimizable' | 'optimal'
type SortType = 'name' | 'price' | 'margin' | 'inventory' | 'potential'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [productsWithDetails, setProductsWithDetails] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('name')
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
      setProducts(data || [])
      
      // Lade Details für alle Produkte (Margin, Recommendations)
      await loadProductDetails(data || [])
    } catch (error) {
      console.error('[ProductsPage] Fehler beim Laden der Produkte:', error)
      setProducts([])
      setProductsWithDetails([])
    } finally {
      setLoading(false)
    }
  }

  const loadProductDetails = async (products: Product[]) => {
    const detailsPromises = products.map(async (product) => {
      const details: ProductWithDetails = {
        ...product,
        status: 'optimal',
        hasCostData: false,
        hasRecommendation: false
      }

      // Prüfe ob Kosten vorhanden
      try {
        const hasCost = await hasCostData(product.id.toString())
        details.hasCostData = hasCost
        
        if (hasCost) {
          // Berechne Marge
          try {
            const marginData = await calculateMargin(product.id.toString(), product.price)
            if (marginData.margin) {
              details.margin = marginData.margin.percent
              
              // Status basierend auf Marge
              if (marginData.margin.percent < 0) {
                details.status = 'critical'
              } else if (marginData.margin.percent < 15) {
                details.status = 'warning'
              } else {
                details.status = 'optimal'
              }
            }
          } catch (e) {
            console.warn(`Could not calculate margin for product ${product.id}:`, e)
          }
        }
      } catch (e) {
        console.warn(`Could not check cost data for product ${product.id}:`, e)
      }

      // Prüfe ob Empfehlung vorhanden
      try {
        const recs = await getRecommendations(product.id)
        if (recs.recommendations && recs.recommendations.length > 0) {
          details.hasRecommendation = true
          const latestRec = recs.recommendations[0]
          if (latestRec.recommended_price && latestRec.current_price) {
            const priceDiff = latestRec.recommended_price - latestRec.current_price
            // Schätze Potenzial (vereinfacht: 5 Verkäufe/Monat)
            details.recommendationPotential = priceDiff * 5
          }
          
          // Wenn Empfehlung vorhanden, aber Status noch optimal → warning
          if (details.status === 'optimal') {
            details.status = 'optimizable'
          }
        }
      } catch (e) {
        // Keine Empfehlung vorhanden - OK
      }

      // Status basierend auf Lagerbestand
      if (product.inventory === 0) {
        details.status = 'critical'
      } else if (product.inventory < 10 && details.status === 'optimal') {
        details.status = 'warning'
      }

      return details
    })

    const details = await Promise.all(detailsPromises)
    setProductsWithDetails(details)
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

  // Filter & Sortierung
  const filteredAndSorted = useMemo(() => {
    let filtered = productsWithDetails

    // Suche
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter
    if (filter === 'critical') {
      filtered = filtered.filter(p => p.status === 'critical')
    } else if (filter === 'optimizable') {
      filtered = filtered.filter(p => p.hasRecommendation || p.status === 'warning')
    } else if (filter === 'optimal') {
      filtered = filtered.filter(p => p.status === 'optimal')
    }

    // Sortierung
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        case 'margin':
          return (b.margin || 0) - (a.margin || 0)
        case 'inventory':
          return b.inventory - a.inventory
        case 'potential':
          return (b.recommendationPotential || 0) - (a.recommendationPotential || 0)
        case 'name':
        default:
          return a.title.localeCompare(b.title)
      }
    })

    return filtered
  }, [productsWithDetails, searchQuery, filter, sortBy])

  // Summary Stats
  const summaryStats = useMemo(() => {
    const total = productsWithDetails.length
    const withCosts = productsWithDetails.filter(p => p.hasCostData).length
    const critical = productsWithDetails.filter(p => p.status === 'critical').length
    const withRecommendations = productsWithDetails.filter(p => p.hasRecommendation).length
    
    // Durchschnittliche Marge
    const productsWithMargin = productsWithDetails.filter(p => p.margin !== undefined)
    const avgMargin = productsWithMargin.length > 0
      ? productsWithMargin.reduce((sum, p) => sum + (p.margin || 0), 0) / productsWithMargin.length
      : 0

    return {
      total,
      withCosts,
      critical,
      withRecommendations,
      avgMargin
    }
  }, [productsWithDetails])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'optimizable':
        return 'bg-blue-500'
      default:
        return 'bg-green-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'optimizable':
        return <Lightbulb className="w-5 h-5 text-blue-600" />
      default:
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
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
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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

          {/* Summary Cards */}
          {productsWithDetails.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Produkte</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{summaryStats.total}</div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Ø Marge</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {summaryStats.avgMargin > 0 ? `${summaryStats.avgMargin.toFixed(1)}%` : 'N/A'}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-600">Kritisch</span>
                </div>
                <div className="text-2xl font-bold text-red-600">{summaryStats.critical}</div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Empfehlungen</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{summaryStats.withRecommendations}</div>
              </div>
            </div>
          )}

          {/* Filter & Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Produkte durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterType)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Alle</option>
                  <option value="critical">Kritisch</option>
                  <option value="optimizable">Optimierbar</option>
                  <option value="optimal">Optimal</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price">Preis</option>
                  <option value="margin">Marge</option>
                  <option value="inventory">Lagerbestand</option>
                  <option value="potential">Potenzial</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">
                {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'Produkt' : 'Produkte'}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading && products.length === 0 ? (
            <div className="text-center py-12 text-gray-600">Lade Produkte...</div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">Keine Produkte gefunden</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || filter !== 'all' 
                  ? 'Versuche einen anderen Filter oder Suchbegriff.'
                  : 'Synchronisiere zuerst deine Produkte.'}
              </p>
              {(searchQuery || filter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilter('all')
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Product Card Component
function ProductCard({ product }: { product: ProductWithDetails }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'optimizable':
        return 'bg-blue-500'
      default:
        return 'bg-green-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'optimizable':
        return <Lightbulb className="w-5 h-5 text-blue-600" />
      default:
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition-all">
      {/* Header mit Status */}
      <div className="flex items-start justify-between p-4 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-3 h-3 rounded-full ${getStatusColor(product.status)}`} />
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {product.title}
            </h3>
          </div>
          {product.category && (
            <p className="text-sm text-gray-500">{product.category}</p>
          )}
        </div>
        
        {product.hasRecommendation && (
          <span className="text-2xl" title="Empfehlung verfügbar">💡</span>
        )}
      </div>

      {/* Body - Preise & Marge */}
      <div className="p-4 space-y-3">
        {/* Aktueller Preis */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Verkaufspreis</span>
          <span className="text-xl font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Kosten & Marge (wenn vorhanden) */}
        {product.cost && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Kosten</span>
              <span className="text-sm text-gray-700">
                {formatCurrency(product.cost)}
              </span>
            </div>
            
            {/* Marge Highlight */}
            {product.margin !== undefined && (
              <div className={`flex justify-between items-center p-2 rounded ${
                product.margin > 30 ? 'bg-green-50' : 
                product.margin > 15 ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <span className="text-sm font-medium">Marge</span>
                <span className="text-lg font-bold">
                  {product.margin.toFixed(1)}%
                </span>
              </div>
            )}
          </>
        )}

        {/* Lagerbestand */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-600">Lagerbestand</span>
          <span className={`text-sm font-medium ${
            product.inventory > 20 ? 'text-green-600' :
            product.inventory > 0 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {product.inventory} Einheiten
          </span>
        </div>

        {/* Potenzial (wenn Empfehlung) */}
        {product.hasRecommendation && product.recommendationPotential && (
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            <div className="text-xs text-blue-700 mb-1">Optimierungspotenzial</div>
            <div className="text-lg font-bold text-blue-900">
              +{formatCurrency(product.recommendationPotential)}/Monat
            </div>
          </div>
        )}
      </div>

      {/* Footer - Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        {/* Primary Button */}
        <Link href={`/recommendations?product_id=${product.id}`}>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Preisempfehlungen
          </button>
        </Link>

        {/* Secondary Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Link href={`/recommendations?product_id=${product.id}`}>
            <button 
              className="w-full px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm flex items-center justify-center gap-1"
              title="Kosten bearbeiten"
            >
              <DollarSign className="w-4 h-4" />
              Kosten
            </button>
          </Link>
          
          <Link href={`/recommendations?product_id=${product.id}`}>
            <button 
              className="w-full px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm flex items-center justify-center gap-1"
              title="Wettbewerber"
            >
              <Search className="w-4 h-4" />
              Markt
            </button>
          </Link>
          
          <Link href={`/recommendations?product_id=${product.id}`}>
            <button 
              className="w-full px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm flex items-center justify-center gap-1"
              title="Details"
            >
              <Info className="w-4 h-4" />
              Info
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
