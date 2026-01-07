'use client'

import { useState, useEffect, Suspense } from 'react'
import { Link } from '@/navigation'
import { useSearchParams } from 'next/navigation'
import { ShopSwitcher } from '@/components/ShopSwitcher'
import { useShop } from '@/hooks/useShop'
import LatestRecommendation from '@/components/LatestRecommendation'
import { CompetitorAnalysis } from '@/components/CompetitorAnalysis'
import { MarginDisplay } from '@/components/margin/MarginDisplay'
import { CostInputModal } from '@/components/margin/CostInputModal'
import { fetchProducts, calculateMargin, saveProductCosts } from '@/lib/api'

function RecommendationsContent() {
  const searchParams = useSearchParams()
  const productIdParam = searchParams.get('product_id')
  const [productId, setProductId] = useState(productIdParam ? Number(productIdParam) : 1)
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [marginData, setMarginData] = useState<any>(null)
  const [showCostModal, setShowCostModal] = useState(false)
  const [productTitle, setProductTitle] = useState<string>('')

  const { isDemoMode, currentShop } = useShop()

  // Lade Produkt-Preis und Margin-Daten
  useEffect(() => {
    if (!productId || !currentShop) {
      console.log('[RecommendationsPage] Missing productId or currentShop, skipping load')
      return
    }
    
    const loadProductData = async () => {
      try {
        console.log('[RecommendationsPage] Loading product data:', { productId, shopId: currentShop.id, isDemoMode })
        const products = await fetchProducts() // Backend nutzt ShopContext
        
        // Debug: Log product types
        console.log('[RecommendationsPage] Products received:', products.length, 'First ID type:', typeof products[0]?.id)
        console.log('[RecommendationsPage] Searching for:', productId, 'Type:', typeof productId)
        
        // WICHTIG: Loose comparison für Type-Mismatch (String vs Number)
        const product = products.find((p: any) => String(p.id) === String(productId))
        
        if (!product) {
          console.error('[RecommendationsPage] Product not found in current shop', { 
            productId, 
            productIdType: typeof productId,
            currentShop, 
            productsCount: products.length,
            availableIds: products.slice(0, 5).map((p: any) => ({ id: p.id, idType: typeof p.id }))
          })
          setMarginData({ has_cost_data: false, error: `Produkt ${productId} nicht im aktuellen Shop gefunden. Bitte Shop wechseln oder Produkt-ID prüfen.` })
          setCurrentPrice(0)
          setProductTitle(`Product ${productId} (nicht gefunden)`)
          return
        }
        
        console.log('[RecommendationsPage] Product found:', { id: product.id, title: product.title, price: product.price })
        
        setCurrentPrice(product.price || 0)
        setProductTitle(product.title || product.name || `Product ${productId}`)
        
        // Lade Margin-Daten wenn Preis vorhanden
        if (product.price && product.price > 0) {
          try {
            const margin = await calculateMargin(productId.toString(), product.price)
            setMarginData(margin)
          } catch (error) {
            // Keine Kostendaten vorhanden - das ist OK
            setMarginData({ has_cost_data: false })
          }
        }
      } catch (error) {
        console.error('[RecommendationsPage] Fehler beim Laden der Produktdaten:', error)
        setMarginData({ has_cost_data: false, error: 'Fehler beim Laden der Produktdaten.' })
      }
    }
    
    loadProductData()
  }, [productId, currentShop?.id, isDemoMode])
  
  // Höre auf Shop-Wechsel Events
  useEffect(() => {
    const handleShopSwitch = (event: CustomEvent) => {
      console.log('[RecommendationsPage] Shop switched event received:', event.detail)
      // Reload product data when shop changes
      if (productId) {
        setTimeout(() => {
          const loadProductData = async () => {
            try {
              const products = await fetchProducts()
              // WICHTIG: Loose comparison für Type-Mismatch (String vs Number)
              const product = products.find((p: any) => String(p.id) === String(productId))
              if (product) {
                console.log('[RecommendationsPage] Product reloaded after shop switch:', { id: product.id, title: product.title, price: product.price })
                setCurrentPrice(product.price || 0)
                setProductTitle(product.title || product.name || `Product ${productId}`)
              } else {
                setMarginData({ has_cost_data: false, error: `Produkt ${productId} nicht im neuen Shop gefunden.` })
              }
            } catch (error) {
              console.error('[RecommendationsPage] Error reloading product after shop switch:', error)
            }
          }
          loadProductData()
        }, 300)
      }
    }
    
    window.addEventListener('shop-switched', handleShopSwitch as EventListener)
    return () => window.removeEventListener('shop-switched', handleShopSwitch as EventListener)
  }, [productId])

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
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Products
          </Link>
          <Link 
            href="/recommendations" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors bg-gray-100"
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
          <h1 className="text-4xl font-bold text-gray-900">Preisempfehlungen</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Zurück
          </Link>
        </div>

              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <label className="block mb-2 font-semibold text-gray-900">Produkt ID:</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={productId}
                    onChange={(e) => setProductId(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-900 bg-white"
                    min="1"
                  />
                </div>
              </div>

              {/* ✅ SECTION 1: MARGIN ANALYSIS (Risk First!) */}
              {currentPrice > 0 && marginData && (
                <section className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">💰</span>
                    <h2 className="text-2xl font-bold text-gray-900">Margen-Analyse</h2>
                  </div>
                  <MarginDisplay 
                    marginData={marginData || { has_cost_data: false }}
                    onAddCosts={() => setShowCostModal(true)}
                  />
                </section>
              )}

              {/* ✅ SECTION 2: PRICE RECOMMENDATION (Action!) */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">💡</span>
                  <h2 className="text-2xl font-bold text-gray-900">Preisempfehlung</h2>
                </div>
                <LatestRecommendation productId={productId} />
              </section>

              {/* ✅ SECTION 3: COMPETITOR ANALYSIS (Context Last!) */}
              {currentPrice > 0 && (
                <section className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🏪</span>
                    <h2 className="text-2xl font-bold text-gray-900">Wettbewerbsanalyse</h2>
                  </div>
                  <CompetitorAnalysis productId={productId} currentPrice={currentPrice} />
                </section>
              )}
        </div>
      </main>

      {/* Cost Input Modal */}
      <CostInputModal
        isOpen={showCostModal}
        onClose={() => setShowCostModal(false)}
        productId={productId.toString()}
        productTitle={productTitle || `Product ${productId}`}
        currentPrice={currentPrice}
        shopId={currentShop?.id?.toString() || 'demo'}
        onSave={async (costData) => {
          try {
            await saveProductCosts(productId.toString(), costData)
            setShowCostModal(false)
            
            // Reload margin data
            if (currentPrice > 0) {
              const margin = await calculateMargin(productId.toString(), currentPrice)
              setMarginData(margin)
            }
          } catch (error) {
            console.error('Fehler beim Speichern der Kosten:', error)
            throw error
          }
        }}
      />
    </div>
  )
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8">Lade...</div>}>
      <RecommendationsContent />
    </Suspense>
  )
}

