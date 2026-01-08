'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/navigation'
import { ShopSwitcher } from '@/components/ShopSwitcher'
import { useShop } from '@/hooks/useShop'
import { getDashboardStats } from '@/lib/api'
import { 
  TrendingUp, 
  AlertCircle, 
  Package, 
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Trophy
} from 'lucide-react'

interface DashboardStats {
  products_count: number
  recommendations_pending: number
  products_with_recommendations?: number
  recommendations_applied: number
  missed_revenue: {
    total: number
    product_count: number
    recommendation_count?: number
    avg_per_product: number
  }
  progress: {
    level: string
    points: number
    next_level_points: number
    completed_steps: string[]
  }
  next_steps: Array<{
    urgent: boolean
    title: string
    description: string
    action: string
    href: string
  }>
}

/**
 * Formatiert Zahlen mit deutschem Format (Tausender-Trennung)
 * 7205470 → "7.205.470"
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 0
  }).format(num)
}

/**
 * Formatiert Geldbeträge mit Euro-Symbol
 * 7205470 → "7.205.470 €"
 */
function formatCurrency(num: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0  // Keine Cents bei großen Zahlen
  }).format(num)
}

export default function Home() {
  const { currentShop, isDemoMode, shops, loading: shopLoading, switchToShop } = useShop()
  const searchParams = useSearchParams()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Auto-Switch nach OAuth Installation (aus URL oder localStorage)
  useEffect(() => {
    // Prüfe zuerst URL-Parameter
    const shopId = searchParams?.get('shop_id')
    const mode = searchParams?.get('mode')
    const installed = searchParams?.get('installed')
    
    if (shopId && mode === 'live' && installed === 'true') {
      console.log('[Home] Auto-switching to installed shop from URL:', shopId)
      switchToShop(parseInt(shopId), false)
      
      // Clean URL (entferne Query-Parameter)
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', window.location.pathname)
      }
      return
    }
    
    // Fallback: Prüfe localStorage (falls /dashboard bereits shop_id gespeichert hat)
    if (typeof window !== 'undefined' && !shopId) {
      const storedShopId = localStorage.getItem('current_shop_id')
      const storedMode = localStorage.getItem('shop_mode')
      
      if (storedShopId && !currentShop) {
        console.log('[Home] Auto-switching to shop from localStorage:', storedShopId)
        const shopIdNum = parseInt(storedShopId)
        const useDemo = storedMode === 'demo'
        
        if (!isNaN(shopIdNum)) {
          switchToShop(shopIdNum, useDemo).catch((err) => {
            console.error('[Home] Error switching to shop from localStorage:', err)
          })
        }
      }
    }
  }, [searchParams, switchToShop, currentShop])

  // Lade Dashboard Stats
  useEffect(() => {
    if (!currentShop || shopLoading) return
    
    setLoading(true)
    getDashboardStats()
      .then(data => {
        console.log('Dashboard stats:', data)
        setStats(data)
      })
      .catch(err => {
        console.error('Error loading stats:', err)
        setStats(null)
      })
      .finally(() => setLoading(false))
  }, [currentShop?.id, isDemoMode, shopLoading])

  // Höre auf Shop-Wechsel Events (für sofortiges Reload)
  useEffect(() => {
    const handleShopSwitch = (event: CustomEvent) => {
      console.log('[Home] Shop switched event received:', event.detail)
      // Kurze Verzögerung, damit Shop-Context aktualisiert ist
      setTimeout(() => {
        setLoading(true)
        getDashboardStats()
          .then(data => {
            console.log('[Home] Dashboard stats reloaded after shop switch:', data)
            setStats(data)
          })
          .catch(err => {
            console.error('[Home] Error reloading stats after shop switch:', err)
            setStats(null)
          })
          .finally(() => setLoading(false))
      }, 300)
    }
    
    window.addEventListener('shop-switched', handleShopSwitch as EventListener)
    return () => window.removeEventListener('shop-switched', handleShopSwitch as EventListener)
  }, [])

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
            className="block px-4 py-2 text-gray-700 rounded-lg bg-gray-100 transition-colors"
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
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Empfehlungen
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {loading || shopLoading ? (
            <div className="text-center py-12 text-gray-600">Lade Dashboard...</div>
          ) : stats ? (
            <>
              {/* 1. MISSED REVENUE HERO */}
              <MissedRevenueHero stats={stats} />

              {/* 2. TRUST LADDER */}
              <TrustLadder stats={stats} />

              {/* 3. QUICK ACTIONS */}
              <QuickActions stats={stats} />

              {/* 4. NEXT STEPS */}
              <NextSteps stats={stats} />
            </>
          ) : (
            <div className="text-center py-12 text-red-600">
              Fehler beim Laden der Dashboard-Daten
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// SUB-COMPONENTS

function MissedRevenueHero({ stats }: { stats: DashboardStats }) {
  const { total, product_count, recommendation_count } = stats.missed_revenue

  if (product_count === 0) return null

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 p-8 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-red-900 mb-2">
            💸 Du verlierst aktuell Geld!
          </h2>
          <p className="text-red-800 mb-6">
            {/* ✅ FIXED: Zeige Produkt-Anzahl, nicht Recommendation-Anzahl */}
            {product_count} {product_count === 1 ? 'Produkt hat' : 'Produkte haben'} suboptimale Preise.
            {recommendation_count && recommendation_count !== product_count && (
              <span className="text-sm text-red-700 ml-2">
                ({recommendation_count} Empfehlungen verfügbar)
              </span>
            )}
          </p>

          {/* Big Number */}
          <div className="bg-white rounded-lg border-2 border-green-300 p-6 mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                POTENZIAL DIESEN MONAT
              </div>
              <div className="text-5xl font-bold text-green-600 mb-2">
                {/* ✅ FIXED: Formatiere mit Tausender-Trennung */}
                + {formatCurrency(total)}
              </div>
              <div className="text-gray-600">
                mehr Umsatz möglich
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span>•</span>
                <span>
                  <strong>{product_count}</strong> {product_count === 1 ? 'Produkt' : 'Produkte'} mit Optimierungspotenzial
                </span>
              </li>
              {recommendation_count && recommendation_count !== product_count && (
                <li className="flex items-center gap-2">
                  <span>•</span>
                  <span>
                    <strong>{recommendation_count}</strong> Preisempfehlungen insgesamt
                  </span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <span>•</span>
                <span>
                  Ø <strong>{formatCurrency(total / product_count)}</strong> pro Produkt/Monat
                </span>
              </li>
            </ul>
          </div>

          {/* ✅ FIXED: Link zu /products statt /recommendations */}
          <Link href="/products">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Package className="w-5 h-5" />
              Produkte optimieren
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function TrustLadder({ stats }: { stats: DashboardStats }) {
  const { level, points, next_level_points, completed_steps } = stats.progress
  const progress = (points / next_level_points) * 100

  const levelConfig: Record<string, { name: string; color: string }> = {
    bronze: { name: '🥉 Bronze - Anfänger', color: 'from-orange-400 to-orange-600' },
    silver: { name: '🥈 Silber - Fortgeschritten', color: 'from-gray-300 to-gray-500' },
    gold: { name: '🥇 Gold - Profi', color: 'from-yellow-400 to-yellow-600' },
    platinum: { name: '💎 Platin - Experte', color: 'from-purple-400 to-purple-600' },
  }

  const config = levelConfig[level] || levelConfig.bronze

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Deine Optimierungs-Reise
      </h3>

      <div className="mb-6">
        <div className="text-lg font-semibold mb-3">
          {config.name}
        </div>

        <div className="relative">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {Math.round(progress)}% zum nächsten Level ({points}/{next_level_points} Punkte)
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {completed_steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3 text-green-700">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickActions({ stats }: { stats: DashboardStats }) {
  const actions = [
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Produkte',
      value: stats.products_count,  // ✅ Alle Produkte (20)
      description: 'synchronisiert',
      href: '/products',
      color: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Empfehlungen',
      value: stats.recommendations_pending,  // ✅ Alle Recommendations (166)
      description: 'ausstehend',
      href: '/recommendations',
      color: 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Umgesetzt',
      value: stats.recommendations_applied,  // ✅ Angewendete Recs
      description: 'Empfehlungen',
      href: '/recommendations',
      color: 'from-green-50 to-green-100 border-green-200 text-green-700',
    },
  ]

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-4">⚡ Schnellaktionen</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, idx) => (
          <Link key={idx} href={action.href}>
            <div className={`bg-gradient-to-br ${action.color} border-2 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer`}>
              <div className="mb-4">{action.icon}</div>
              <h4 className="font-bold text-lg mb-1">{action.title}</h4>
              {/* ✅ FIXED: Formatiere große Zahlen */}
              <div className="text-3xl font-bold mb-2">
                {formatNumber(action.value)}
              </div>
              <div className="text-sm opacity-80">{action.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function NextSteps({ stats }: { stats: DashboardStats }) {
  if (stats.next_steps.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-bold mb-4">📌 Nächste Schritte</h3>

      <div className="space-y-3">
        {stats.next_steps.map((step, idx) => (
          <div 
            key={idx}
            className={`${step.urgent ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} border-2 rounded-lg p-4`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-semibold mb-2">{step.title}</div>
                <p className="text-sm text-gray-700 mb-3">{step.description}</p>
                <Link href={step.href}>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    {step.action} <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
