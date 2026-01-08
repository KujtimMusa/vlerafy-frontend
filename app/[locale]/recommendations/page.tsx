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
import { ChevronDown, ChevronUp, Info } from 'lucide-react'

function RecommendationsContent() {
  const searchParams = useSearchParams()
  const productIdParam = searchParams.get('product_id')
  const [productId, setProductId] = useState(productIdParam ? Number(productIdParam) : 1)
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [marginData, setMarginData] = useState<any>(null)
  const [showCostModal, setShowCostModal] = useState(false)
  const [productTitle, setProductTitle] = useState<string>('')
  
  // State für Accordion-Bereiche (welche sind geöffnet)
  const [openSections, setOpenSections] = useState<{
    margin: boolean
    price: boolean
    competitor: boolean
  }>({
    margin: false, // ✅ Alle standardmäßig zugeklappt
    price: false,
    competitor: false
  })

  // State für Info-Tooltips
  const [showInfoTooltip, setShowInfoTooltip] = useState<{
    margin: boolean
    price: boolean
    competitor: boolean
  }>({
    margin: false,
    price: false,
    competitor: false
  })

  const { isDemoMode, currentShop } = useShop()
  
  // Toggle-Funktion für Accordion-Bereiche
  const toggleSection = (section: 'margin' | 'price' | 'competitor') => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

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

  // Schließe Tooltips beim Klick außerhalb
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Prüfe ob Klick außerhalb der Info-Icons war
      if (!target.closest('.info-tooltip-button')) {
        setShowInfoTooltip({
          margin: false,
          price: false,
          competitor: false
        })
      }
    }

    if (showInfoTooltip.margin || showInfoTooltip.price || showInfoTooltip.competitor) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showInfoTooltip])

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
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Produkte
          </Link>
          <Link 
            href="/recommendations" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors bg-gray-100"
          >
            Empfehlungen
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
        {/* Header mit schönem Design */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">📊</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">Produkt-Analysen</h1>
                <p className="text-gray-600 text-sm">Vollständige Analyse für optimale Preisentscheidungen</p>
              </div>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              ← Zurück
            </Link>
          </div>
        </div>

              {/* Produktname - Schönes Design ohne Input */}
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {productTitle || `Produkt ${productId}`}
                    </h2>
                    {currentPrice > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        Aktueller Preis: <span className="font-semibold text-gray-900">{currentPrice.toFixed(2)} €</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ✅ SECTION 1: MARGIN ANALYSIS (Risk First!) */}
              {currentPrice > 0 && marginData && (
                <section className="mb-6">
                  <div className="relative">
                    <button
                      onClick={() => toggleSection('margin')}
                      className="w-full flex items-center justify-between p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">💰</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-900">Margen-Analyse</h2>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowInfoTooltip(prev => ({ ...prev, margin: !prev.margin }))
                              }}
                              className="relative info-tooltip-button"
                            >
                              <Info className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
                              {showInfoTooltip.margin && (
                                <div className="absolute left-0 bottom-full mb-2 w-80 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-xl z-50">
                                  <div className="font-semibold mb-2">Was passiert hier?</div>
                                  <p className="mb-2">
                                    Die Margen-Analyse zeigt dir, ob dein aktueller Preis über deinen Kosten liegt und wie viel Gewinn du pro Verkauf machst.
                                  </p>
                                  <p className="mb-2">
                                    <strong>Wichtig:</strong> Bevor du Preise änderst, solltest du immer prüfen, dass du nicht unter deine Kosten verkaufst!
                                  </p>
                                  <p>
                                    Hier kannst du auch Kosten für dein Produkt hinterlegen (Einkaufspreis, Versand, Verpackung, etc.).
                                  </p>
                                  <div className="absolute bottom-0 left-4 transform translate-y-full">
                                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                                  </div>
                                </div>
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Prüfe deine Kosten und Margen vor Preisänderungen
                          </p>
                        </div>
                      </div>
                      {openSections.margin ? (
                        <ChevronUp className="w-6 h-6 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-500" />
                      )}
                    </button>
                  </div>
                  
                  {openSections.margin && (
                    <div className="mt-4 bg-white rounded-lg border border-gray-200 p-6 transition-all duration-300 ease-in-out">
                      <MarginDisplay 
                        marginData={marginData || { has_cost_data: false }}
                        onAddCosts={() => setShowCostModal(true)}
                        onEditCosts={() => setShowCostModal(true)}
                      />
                    </div>
                  )}
                </section>
              )}

              {/* ✅ SECTION 2: PRICE RECOMMENDATION (Action!) */}
              <section className="mb-6">
                <div className="relative">
                  <button
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">💡</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-gray-900">Preisempfehlung</h2>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowInfoTooltip(prev => ({ ...prev, price: !prev.price }))
                            }}
                            className="relative info-tooltip-button"
                          >
                            <Info className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
                            {showInfoTooltip.price && (
                              <div className="absolute left-0 bottom-full mb-2 w-80 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-xl z-50">
                                <div className="font-semibold mb-2">Was passiert hier?</div>
                                <p className="mb-2">
                                  Unsere KI analysiert verschiedene Faktoren wie Nachfrage, Lagerbestand, Wettbewerbspreise und deine Kosten, um dir eine optimale Preisempfehlung zu geben.
                                </p>
                                  <p className="mb-2">
                                    <strong>Die Empfehlung berücksichtigt:</strong>
                                  </p>
                                  <ul className="list-disc list-inside mb-2 space-y-1">
                                    <li>Verkaufsdaten der letzten 30 Tage</li>
                                    <li>Aktuelle Preise deiner Konkurrenten</li>
                                    <li>Deine Lagerbestände</li>
                                    <li>Deine Kosten und Margen</li>
                                  </ul>
                                  <p>
                                    Du kannst die Empfehlung direkt anwenden oder erst die Details ansehen.
                                  </p>
                                  <div className="absolute bottom-0 left-4 transform translate-y-full">
                                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                                  </div>
                                </div>
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            KI-basierte Preisempfehlung basierend auf Marktdaten
                          </p>
                        </div>
                      </div>
                      {openSections.price ? (
                        <ChevronUp className="w-6 h-6 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-500" />
                      )}
                    </button>
                  </div>
                
                {openSections.price && (
                  <div className="mt-4 bg-white rounded-lg border border-gray-200 p-6 transition-all duration-300 ease-in-out">
                    <LatestRecommendation productId={productId} />
                  </div>
                )}
              </section>

              {/* ✅ SECTION 3: COMPETITOR ANALYSIS (Context Last!) */}
              {currentPrice > 0 && (
                <section className="mb-6">
                  <div className="relative">
                    <button
                      onClick={() => toggleSection('competitor')}
                      className="w-full flex items-center justify-between p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">🏪</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-900">Wettbewerbsanalyse</h2>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowInfoTooltip(prev => ({ ...prev, competitor: !prev.competitor }))
                              }}
                              className="relative info-tooltip-button"
                            >
                              <Info className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
                              {showInfoTooltip.competitor && (
                                <div className="absolute left-0 bottom-full mb-2 w-80 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-xl z-50">
                                  <div className="font-semibold mb-2">Was passiert hier?</div>
                                  <p className="mb-2">
                                    Die Wettbewerbsanalyse zeigt dir, wie dein Preis im Vergleich zu anderen Anbietern steht.
                                  </p>
                                  <p className="mb-2">
                                    <strong>Du siehst:</strong>
                                  </p>
                                  <ul className="list-disc list-inside mb-2 space-y-1">
                                    <li>Preise deiner Konkurrenten (Neuware, Gebraucht, etc.)</li>
                                    <li>Deine Marktposition (günstigster, teuerster, Durchschnitt)</li>
                                    <li>Durchschnittspreis und Preisspanne</li>
                                    <li>Datenqualität der Analyse</li>
                                  </ul>
                                  <p>
                                    Nutze diese Informationen, um deine Preise strategisch anzupassen.
                                  </p>
                                  <div className="absolute bottom-0 left-4 transform translate-y-full">
                                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                                  </div>
                                </div>
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Vergleiche deine Preise mit der Konkurrenz
                          </p>
                        </div>
                      </div>
                      {openSections.competitor ? (
                        <ChevronUp className="w-6 h-6 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-500" />
                      )}
                    </button>
                  </div>
                  
                  {openSections.competitor && (
                    <div className="mt-4 bg-white rounded-lg border border-gray-200 p-6 transition-all duration-300 ease-in-out">
                      <CompetitorAnalysis productId={productId} currentPrice={currentPrice} />
                    </div>
                  )}
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

