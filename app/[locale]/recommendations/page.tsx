'use client'

import { useState, useEffect, Suspense } from 'react'
import { Link } from '@/navigation'
import { useSearchParams, usePathname } from 'next/navigation'
import { ShopSwitcher } from '@/components/ShopSwitcher'
import { useShop } from '@/hooks/useShop'
import LatestRecommendation from '@/components/LatestRecommendation'
import { CompetitorAnalysis } from '@/components/CompetitorAnalysis'
import { MarginDisplay } from '@/components/margin/MarginDisplay'
import { CostInputModal } from '@/components/margin/CostInputModal'
import { fetchProducts, calculateMargin, saveProductCosts } from '@/lib/api'
import { ChevronDown, ChevronUp, Info, Package, DollarSign, BarChart, ShoppingCart, ArrowLeft, LayoutDashboard, Lightbulb } from 'lucide-react'
import '../../styles/recommendations.css'

function RecommendationsContent() {
  const pathname = usePathname()
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
    <div className="min-h-screen flex recommendations-page" style={{ backgroundColor: '#0f172a' }}>
      {/* Sidebar mit Shop-Switcher */}
      <aside className="w-80 border-r p-6 overflow-y-auto shadow-sm" style={{ background: 'linear-gradient(to bottom, #1e293b, #0f172a, #1e293b)', borderColor: '#334155' }}>
        <div className="mb-6 px-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800/50">
            <div className="relative group">
              {/* Icon Container mit Glow */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/40 group-hover:scale-105">
                <span className="text-2xl">💡</span>
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white tracking-tight mb-0.5">
                PriceIQ
              </h2>
              <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">
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
        {/* Page Header */}
        <div className="recommendations-header">
          <div className="header-icon-container">
            <div className="header-main-icon">
              <BarChart className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="header-title">Produkt-Analysen</h1>
              <p className="header-subtitle">
                Vollständige Analyse für optimale Preisentscheidungen
              </p>
            </div>
          </div>
          
          {/* Product Info Card */}
          <div className="product-info-card">
            <div className="product-icon">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div className="product-details">
              <h2>{productTitle || `Produkt ${productId}`}</h2>
              {currentPrice > 0 && (
                <p className="product-price-display">
                  Aktueller Preis: <strong>{currentPrice.toFixed(2)} €</strong>
                </p>
              )}
            </div>
            <Link
              href="/"
              className="back-button ml-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück
            </Link>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* ✅ SECTION 1: MARGIN ANALYSIS (Risk First!) */}
          {currentPrice > 0 && marginData && (
            <div className="collapsible-card">
                  <div 
                    className="collapsible-header"
                    onClick={() => toggleSection('margin')}
                  >
                    <div className="section-icon icon-margin">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <div className="section-content">
                      <h3 className="section-title">
                        Margen-Analyse
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowInfoTooltip(prev => ({ ...prev, margin: !prev.margin }))
                          }}
                          className="info-tooltip-button"
                        >
                          <Info className="w-4 h-4 transition-colors" style={{ color: '#94a3b8' }} />
                          {showInfoTooltip.margin && (
                            <div className="info-tooltip-content">
                              <h4>Was passiert hier?</h4>
                              <p>
                                Die Margen-Analyse zeigt dir, ob dein aktueller Preis über deinen Kosten liegt und wie viel Gewinn du pro Verkauf machst.
                              </p>
                              <p>
                                <strong>Wichtig:</strong> Bevor du Preise änderst, solltest du immer prüfen, dass du nicht unter deine Kosten verkaufst!
                              </p>
                              <p>
                                Hier kannst du auch Kosten für dein Produkt hinterlegen (Einkaufspreis, Versand, Verpackung, etc.).
                              </p>
                            </div>
                          )}
                        </button>
                      </h3>
                      <p className="section-subtitle">
                        Prüfe deine Kosten und Margen vor Preisänderungen
                      </p>
                    </div>
                    {openSections.margin ? (
                      <ChevronUp className="chevron-arrow" />
                    ) : (
                      <ChevronDown className="chevron-arrow" />
                    )}
                  </div>
                  
                  {openSections.margin && (
                    <div className="px-8 pb-6">
                      <MarginDisplay 
                        marginData={marginData || { has_cost_data: false }}
                        onAddCosts={() => setShowCostModal(true)}
                        onEditCosts={() => setShowCostModal(true)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ✅ SECTION 2: PRICE RECOMMENDATION (Action!) */}
              <div className="collapsible-card">
                  <div 
                    className="collapsible-header"
                    onClick={() => toggleSection('price')}
                  >
                    <div className="section-icon icon-recommendation">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <div className="section-content">
                      <h3 className="section-title">
                        Preisempfehlung
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowInfoTooltip(prev => ({ ...prev, price: !prev.price }))
                          }}
                          className="info-tooltip-button"
                        >
                          <Info className="w-4 h-4 transition-colors" style={{ color: '#94a3b8' }} />
                          {showInfoTooltip.price && (
                            <div className="info-tooltip-content">
                              <h4>Was passiert hier?</h4>
                              <p>
                                Unsere KI analysiert verschiedene Faktoren wie Nachfrage, Lagerbestand, Wettbewerbspreise und deine Kosten, um dir eine optimale Preisempfehlung zu geben.
                              </p>
                              <p>
                                <strong>Die Empfehlung berücksichtigt:</strong>
                              </p>
                              <ul>
                                <li>Verkaufsdaten der letzten 30 Tage</li>
                                <li>Aktuelle Preise deiner Konkurrenten</li>
                                <li>Deine Lagerbestände</li>
                                <li>Deine Kosten und Margen</li>
                              </ul>
                              <p>
                                Du kannst die Empfehlung direkt anwenden oder erst die Details ansehen.
                              </p>
                            </div>
                          )}
                        </button>
                      </h3>
                      <p className="section-subtitle">
                        KI-basierte Preisempfehlung basierend auf Marktdaten
                      </p>
                    </div>
                    {openSections.price ? (
                      <ChevronUp className="chevron-arrow" />
                    ) : (
                      <ChevronDown className="chevron-arrow" />
                    )}
                  </div>
                
                  {openSections.price && (
                    <div className="px-8 pb-6">
                      <div className="rounded-lg border p-6 transition-all duration-300 ease-in-out" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
                        <LatestRecommendation productId={productId} />
                      </div>
                    </div>
                  )}
              </div>

              {/* ✅ SECTION 3: COMPETITOR ANALYSIS (Context Last!) */}
              {currentPrice > 0 && (
                <div className="collapsible-card">
                    <div 
                      className="collapsible-header"
                      onClick={() => toggleSection('competitor')}
                    >
                      <div className="section-icon icon-competitor">
                        <ShoppingCart className="h-8 w-8 text-white" />
                      </div>
                      <div className="section-content">
                        <h3 className="section-title">
                          Wettbewerbsanalyse
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowInfoTooltip(prev => ({ ...prev, competitor: !prev.competitor }))
                            }}
                            className="info-tooltip-button"
                          >
                            <Info className="w-4 h-4 transition-colors" style={{ color: '#94a3b8' }} />
                            {showInfoTooltip.competitor && (
                              <div className="info-tooltip-content">
                                <h4>Was passiert hier?</h4>
                                <p>
                                  Die Wettbewerbsanalyse zeigt dir, wie dein Preis im Vergleich zu anderen Anbietern steht.
                                </p>
                                <p>
                                  <strong>Du siehst:</strong>
                                </p>
                                <ul>
                                  <li>Preise deiner Konkurrenten (Neuware, Gebraucht, etc.)</li>
                                  <li>Deine Marktposition (günstigster, teuerster, Durchschnitt)</li>
                                  <li>Durchschnittspreis und Preisspanne</li>
                                  <li>Datenqualität der Analyse</li>
                                </ul>
                                <p>
                                  Nutze diese Informationen, um deine Preise strategisch anzupassen.
                                </p>
                              </div>
                            )}
                          </button>
                        </h3>
                        <p className="section-subtitle">
                          Vergleiche deine Preise mit der Konkurrenz
                        </p>
                      </div>
                      {openSections.competitor ? (
                        <ChevronUp className="chevron-arrow" />
                      ) : (
                        <ChevronDown className="chevron-arrow" />
                      )}
                    </div>
                  
                    {openSections.competitor && (
                      <div className="px-8 pb-6">
                        <div className="rounded-lg border p-6 transition-all duration-300 ease-in-out" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
                          <CompetitorAnalysis productId={productId} currentPrice={currentPrice} />
                        </div>
                      </div>
                    )}
            </div>
          )}
        </div>
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

