'use client'

import { useState, useEffect, useMemo } from 'react'
import { fetchProducts, syncProducts, generateRecommendation } from '@/lib/api'
import { ShopSwitcher } from '@/components/ShopSwitcher'
import { useShop } from '@/hooks/useShop'
import { ProductTable, Product } from '@/components/products/product-table'
import { ProductFilters } from '@/components/products/product-filters'
import { BulkActionsToolbar } from '@/components/products/bulk-actions-toolbar'
import { CommandPalette } from '@/components/command/command-palette'
import { Button } from '@/components/ui/button'
import { Sparkles, RefreshCw, Plus, Download } from 'lucide-react'
import { Link } from '@/navigation'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({})
  const [activeFilter, setActiveFilter] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
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
    } catch (error) {
      console.error('[ProductsPage] Fehler beim Laden der Produkte:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Transform products to table format
  const transformedProducts = useMemo(() => {
    return products.map((p: any) => {
      const cost = p.cost || 0
      const price = p.price || 0
      const marginPct = cost && price ? ((price - cost) / price * 100) : 0
      const inventory = p.inventory_quantity || p.inventory || 0
      
      const product: Product = {
        id: p.id,
        shopify_product_id: p.shopify_product_id || String(p.id),
        title: p.title || 'Unbekanntes Produkt',
        price: price,
        cost: cost,
        inventory_quantity: inventory,
        inventory: inventory,
        category: p.category,
        vendor: p.vendor,
        image_url: p.image_url,
        recommended_price: p.recommended_price,
        ml_confidence: (p.ml_confidence || 0) * 100, // Convert to percentage
        margin_pct: marginPct,
        inventory_level: inventory < 10 ? "critical" : inventory < 30 ? "low" : inventory < 100 ? "good" : "high",
        has_recommendation: !!p.recommended_price,
        sales_trend: p.sales_trend || "stable",
        trend_value: p.trend_value || 0,
        sales_7d: p.sales_7d || 0,
      }
      
      return product
    })
  }, [products])

  // Apply filters and search
  useEffect(() => {
    let filtered = [...transformedProducts]
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.shopify_product_id.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
      )
    }
    
    // Apply active filter
    if (activeFilter) {
      switch (activeFilter) {
        case "ai":
          filtered = filtered.filter(p => p.has_recommendation)
          break
        case "lowStock":
          filtered = filtered.filter(p => p.inventory_level === "critical" || p.inventory_level === "low")
          break
        case "trending":
          filtered = filtered.filter(p => p.sales_trend === "up")
          break
        case "lowMargin":
          filtered = filtered.filter(p => (p.margin_pct || 0) < 20)
          break
      }
    }
    
    setFilteredProducts(filtered)
  }, [transformedProducts, searchQuery, activeFilter])

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

  // Bulk action handlers
  const handleApplyAI = async () => {
    const selectedCount = Object.keys(selectedRows).length
    alert(`AI Preise werden auf ${selectedCount} Produkte angewendet...`)
    // TODO: Implement bulk apply API call
  }

  const handleBulkEdit = () => {
    alert('Bulk-Bearbeitung wird geöffnet...')
    // TODO: Open bulk edit dialog
  }

  const handleApplyDiscount = () => {
    alert('Rabatt-Dialog wird geöffnet...')
    // TODO: Open discount dialog
  }

  const handleExport = () => {
    alert('Export wird gestartet...')
    // TODO: Implement export
  }

  const handleGenerateAll = async () => {
    alert('Empfehlungen werden für alle Produkte generiert...')
    // TODO: Implement bulk generate API call
  }

  // Count filters
  const aiCount = transformedProducts.filter(p => p.has_recommendation).length
  
  const lowStockCount = products.filter((p: any) => {
    const inv = p.inventory_quantity || p.inventory || 0
    return inv < 30
  }).length
  
  const trendingCount = 0 // TODO: Calculate from sales data
  
  const lowMarginCount = products.filter((p: any) => {
    const cost = p.cost || 0
    const price = p.price || 0
    const margin = cost && price ? ((price - cost) / price * 100) : 0
    return margin < 20 && margin > 0
  }).length

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar mit Shop-Switcher */}
      <aside className="w-80 bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200 p-6 overflow-y-auto shadow-sm">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            <span className="text-2xl">💡</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            PriceIQ
          </h2>
        </div>
        
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
          {/* Command Palette */}
          <CommandPalette />

          {/* Page Header */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Produkte</h1>
                <p className="text-gray-500 mt-1">
                  {products.length} Produkte - {aiCount} mit AI Empfehlungen
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!isDemoMode && currentShop && currentShop.type === 'shopify' && (
                  <Button variant="outline" onClick={handleSync} disabled={loading}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Shopify synchronisieren
                  </Button>
                )}
                <Button 
                  onClick={handleGenerateAll}
                  className="gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <Sparkles className="h-4 w-4" />
                  Alle Empfehlungen generieren
                </Button>
              </div>
            </div>

            {/* Filters */}
            <ProductFilters
              onFilterChange={setActiveFilter}
              onSearchChange={setSearchQuery}
              aiCount={aiCount}
              lowStockCount={lowStockCount}
              trendingCount={trendingCount}
              lowMarginCount={lowMarginCount}
            />
          </div>

          {/* Table */}
          {loading && products.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-gray-500">Lade Produkte...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              {isDemoMode ? (
                <>
                  <p className="text-gray-600 mb-4">
                    Demo-Shop: Produkte werden automatisch geladen. Falls keine angezeigt werden, prüfe die Browser-Console.
                  </p>
                  <Button onClick={() => loadProducts()}>
                    Produkte neu laden
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">Keine Produkte gefunden. Synchronisiere zuerst deine Produkte.</p>
                  <Button onClick={handleSync}>
                    Produkte synchronisieren
                  </Button>
                </>
              )}
            </div>
          ) : (
            <ProductTable 
              data={filteredProducts} 
              onRowSelectionChange={setSelectedRows}
            />
          )}

          {/* Bulk Actions Toolbar */}
          <BulkActionsToolbar
            selectedCount={Object.keys(selectedRows).length}
            onClearSelection={() => setSelectedRows({})}
            onApplyAI={handleApplyAI}
            onBulkEdit={handleBulkEdit}
            onApplyDiscount={handleApplyDiscount}
            onExport={handleExport}
          />
        </div>
      </main>
    </div>
  )
}
