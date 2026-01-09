'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Link } from '@/navigation'
import { ShopSwitcher } from '@/components/ShopSwitcher'
import { useShop } from '@/hooks/useShop'
import { getDashboardStats } from '@/lib/api'
// import { motion } from 'framer-motion' // Removed due to build issues
import { ModernCard } from '@/components/ui/modern-card'
import MissedRevenueHero from '@/components/dashboard/MissedRevenueHero'
import { 
  TrendingUp, 
  AlertCircle, 
  Package, 
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Trophy,
  Sparkles,
  Info,
  Target,
  Zap,
  Flame,
  Plus
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
    points_needed?: number
    completed_steps: string[]
    pending_steps?: Array<{
      text: string
      points: number
      action: string
    }>
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
  const router = useRouter()
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
    <div className="min-h-screen flex" style={{ backgroundColor: '#0f172a' }}>
      {/* Sidebar mit Shop-Switcher */}
      <aside className="w-80 border-r p-6 overflow-y-auto shadow-sm" style={{ background: 'linear-gradient(to bottom, #1e293b, #0f172a, #1e293b)', borderColor: '#334155' }}>
        <div className="flex items-center gap-3 mb-8 pb-6 border-b" style={{ borderColor: '#334155' }}>
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
            className="block px-4 py-2 rounded-lg transition-colors"
            style={{ color: '#cbd5e1', backgroundColor: '#334155' }}
          >
            Dashboard
          </Link>
          <Link 
            href="/products" 
            className="block px-4 py-2 rounded-lg transition-colors"
            style={{ color: '#cbd5e1' }}
          >
            Produkte
          </Link>
          <Link 
            href="/recommendations" 
            className="block px-4 py-2 rounded-lg transition-colors"
            style={{ color: '#cbd5e1' }}
          >
            Empfehlungen
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto" style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b)' }}>
        <div className="max-w-7xl mx-auto space-y-8">
          {loading || shopLoading ? (
            <div className="text-center py-12" style={{ color: '#94a3b8' }}>Lade Dashboard...</div>
          ) : stats ? (
            <>
              {/* Page Header */}
              <div className="space-y-2 animate-fade-in">
                <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#f1f5f9' }}>
                  Dashboard
                </h1>
                <p className="text-lg" style={{ color: '#94a3b8' }}>
                  Willkommen zurück! Hier ist deine Übersicht.
                </p>
              </div>

              {/* 1. MISSED REVENUE HERO */}
              <MissedRevenueHero 
                missedRevenue={stats.missed_revenue.total}
                productCount={stats.missed_revenue.product_count}
                onOptimizeClick={() => router.push('/products')}
              />

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

function TrustLadder({ stats }: { stats: DashboardStats }) {
  const { level, points, next_level_points, points_needed, completed_steps, pending_steps } = stats.progress
  const progress = (points / next_level_points) * 100

  const levelConfig: Record<string, { name: string; color: string; shortName: string }> = {
    bronze: { name: '🥉 Bronze - Anfänger', color: 'from-orange-400 to-orange-600', shortName: 'Anfänger' },
    silver: { name: '🥈 Silber - Fortgeschritten', color: 'from-gray-300 to-gray-500', shortName: 'Fortgeschritten' },
    gold: { name: '🥇 Gold - Profi', color: 'from-yellow-400 to-yellow-600', shortName: 'Profi' },
    platinum: { name: '💎 Platin - Experte', color: 'from-purple-400 to-purple-600', shortName: 'Experte' },
  }

  const config = levelConfig[level] || levelConfig.bronze
  const nextLevel = level === 'bronze' ? 'silver' : level === 'silver' ? 'gold' : 'platinum'
  const nextLevelName = levelConfig[nextLevel]?.shortName || 'nächstes Level'

  const getActionHref = (action: string) => {
    switch (action) {
      case 'products':
        return '/products'
      case 'recommendations':
        return '/recommendations'
      default:
        return '/'
    }
  }

  // Achievement icons (simplified)
  const achievements = [
    { id: 1, icon: '📦', label: 'Produkte', completed: completed_steps.some(s => s.includes('Produkt')) },
    { id: 2, icon: '💡', label: 'Empfehlungen', completed: completed_steps.some(s => s.includes('Empfehlung')) },
    { id: 3, icon: '✅', label: 'Umsetzung', completed: completed_steps.some(s => s.includes('Umsetzung')) },
  ]

  return (
    <ModernCard variant="gradient" className="relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />
      
      <div className="relative p-8 space-y-6">
        {/* Header with trophy icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>
                Deine Optimierungs-Reise
              </h3>
              <p className="text-sm" style={{ color: '#94a3b8' }}>
                {config.name}
              </p>
            </div>
          </div>
          
          {/* XP Display */}
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>
              {points}/{next_level_points}
            </p>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Punkte</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: '#94a3b8' }}>{Math.round(progress)}% zum nächsten Level</span>
            {points_needed && points_needed > 0 && (
              <span className="font-semibold text-purple-600">Noch {points_needed} Punkte</span>
            )}
          </div>
          
          <div className="relative h-3 overflow-hidden rounded-full" style={{ backgroundColor: '#475569' }}>
            {/* Animated gradient progress */}
            <div
              className={`h-full bg-gradient-to-r ${config.color} animate-gradient`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </div>
        </div>
        
        {/* Achievement Cards */}
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((achievement, idx) => (
            <div
              key={achievement.id}
              className={`relative flex flex-col items-center gap-2 rounded-xl p-4 transition-all hover:scale-105 animate-fade-in ${
                achievement.completed
                  ? "border-2 opacity-100"
                  : "border-2 opacity-60"
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {achievement.completed && (
                <div className="absolute -top-2 -right-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow-lg">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
              
              <div className={`text-3xl ${achievement.completed && "animate-bounce"}`}>
                {achievement.icon}
              </div>
              <p className="text-xs text-center font-medium" style={{ color: '#cbd5e1' }}>
                {achievement.label}
              </p>
            </div>
          ))}
        </div>
        
        {/* Next Steps */}
        {pending_steps && pending_steps.length > 0 && (
          <div className="space-y-3 pt-4 border-t" style={{ borderColor: '#334155' }}>
            <p className="text-sm font-medium" style={{ color: '#f1f5f9' }}>
              Noch zu erledigen:
            </p>
            
            {pending_steps.map((step, idx) => (
              <div
                key={idx}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <Link href={getActionHref(step.action)}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-purple-300 hover:shadow-md transition-all cursor-pointer" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm" style={{ backgroundColor: '#7c3aed', color: '#fff' }}>
                      {step.points}
                    </div>
                    <p className="flex-1 text-sm" style={{ color: '#cbd5e1' }}>{step.text}</p>
                    <ArrowRight className="h-4 w-4" style={{ color: '#94a3b8' }} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModernCard>
  )
}

const QuickActions = ({ stats }: { stats: DashboardStats }) => {
  const actions = [
    {
      icon: Package,
      title: 'Produkte',
      value: stats.products_count,
      description: 'synchronisiert',
      href: '/products',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/0 to-blue-600/0',
      hoverBgGradient: 'from-blue-500/5 to-blue-600/10',
      textColor: 'text-blue-600',
    },
    {
      icon: Lightbulb,
      title: 'Empfehlungen',
      value: stats.recommendations_pending,
      description: 'ausstehend',
      href: '/recommendations',
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-500/0 to-orange-600/0',
      hoverBgGradient: 'from-yellow-500/5 to-orange-600/10',
      textColor: 'text-orange-600',
    },
    {
      icon: TrendingUp,
      title: 'Umgesetzt',
      value: stats.recommendations_applied,
      description: 'Empfehlungen',
      href: '/recommendations',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-500/0 to-emerald-600/0',
      hoverBgGradient: 'from-green-500/5 to-emerald-600/10',
      textColor: 'text-green-600',
    },
  ]

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6" style={{ color: '#f1f5f9' }}>⚡ Schnellaktionen</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, idx) => {
          const IconComponent = action.icon
          return (
            <div
              key={idx}
              className="hover:-translate-y-1 hover:scale-105 transition-all duration-300"
            >
              <Link href={action.href}>
                <ModernCard className={`relative overflow-hidden group`}>
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} group-hover:bg-gradient-to-br ${action.hoverBgGradient} transition-all duration-300`} />
                  
                  <div className="relative p-6 space-y-4">
                    {/* Icon */}
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-2">
                      <h4 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>
                        {formatNumber(action.value)}
                      </h4>
                      <p className="text-sm" style={{ color: '#94a3b8' }}>
                        {action.title}
                      </p>
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs" style={{ backgroundColor: '#334155', color: '#94a3b8' }}>
                        {action.description}
                      </div>
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className={`flex items-center gap-2 ${action.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <span className="text-sm font-medium">Alle anzeigen</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </ModernCard>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function NextSteps({ stats }: { stats: DashboardStats }) {
  if (stats.next_steps.length === 0) return null

  const urgentStep = stats.next_steps.find(s => s.urgent)
  const otherSteps = stats.next_steps.filter(s => !s.urgent)

  return (
    <ModernCard variant="glass" className="relative overflow-hidden">
      {/* Header with icon */}
      <div className="border-b px-8 py-6" style={{ borderColor: '#334155', background: 'linear-gradient(to right, #1e293b, #0f172a)' }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>
            Nächste Schritte
          </h3>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8 space-y-4">
        {/* Urgent CTA Box */}
        {urgentStep && (
          <div className="relative overflow-hidden border-2 p-6 animate-fade-in" style={{ background: 'linear-gradient(to right, #1e293b, #0f172a)', borderColor: '#f59e0b' }}>
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300/20 rounded-full blur-3xl" />
            
            <div className="relative space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 shadow-md">
                  <Flame className="h-4 w-4 text-white animate-pulse" />
                </div>
                <p className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>
                  {urgentStep.title}
                </p>
              </div>
              
              <p className="text-sm" style={{ color: '#cbd5e1' }}>
                {urgentStep.description}
              </p>
              
              <Link href={urgentStep.href}>
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
                  {urgentStep.action}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Other Steps */}
        {otherSteps.length > 0 && (
          <div className="space-y-3">
            {otherSteps.map((step, idx) => (
              <div
                key={idx}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <Link href={step.href}>
                  <div className="flex items-start justify-between gap-4 p-4 border-2 hover:shadow-md transition-all cursor-pointer" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
                    <div className="flex-1">
                      <div className="font-semibold mb-1" style={{ color: '#f1f5f9' }}>{step.title}</div>
                      <p className="text-sm mb-2" style={{ color: '#cbd5e1' }}>{step.description}</p>
                      <div className="text-sm font-medium flex items-center gap-1" style={{ color: '#60a5fa' }}>
                        {step.action} <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModernCard>
  )
}
