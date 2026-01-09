'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/navigation'
import { ShopSwitcher } from '@/components/ShopSwitcher'
import { useShop } from '@/hooks/useShop'
import { getDashboardStats } from '@/lib/api'
import { motion } from 'framer-motion'
import { ModernCard } from '@/components/ui/modern-card'
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
      <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto space-y-8">
          {loading || shopLoading ? (
            <div className="text-center py-12 text-gray-600">Lade Dashboard...</div>
          ) : stats ? (
            <>
              {/* Page Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                  Dashboard
                </h1>
                <p className="text-lg text-gray-600">
                  Willkommen zurück! Hier ist deine Übersicht.
                </p>
              </motion.div>

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
  const { total, product_count, recommendation_count, avg_per_product } = stats.missed_revenue

  if (product_count === 0) return null

  const percentIncrease = total > 0 ? Math.round((total / (total * 0.3)) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 p-8 shadow-xl"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10" />
      
      <div className="relative flex items-start gap-6">
        {/* Icon with glow effect */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-white/30 blur-xl" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <AlertCircle className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <h2 className="text-2xl font-bold text-white">
              Du verlierst aktuell Geld!
            </h2>
          </div>
          <p className="text-sm text-red-50">
            {product_count} {product_count === 1 ? 'Produkt hat' : 'Produkte haben'} suboptimale Preise
            {recommendation_count && recommendation_count !== product_count && (
              <span className="ml-2 text-red-100">
                ({recommendation_count} Empfehlungen verfügbar)
              </span>
            )}
          </p>

          {/* Revenue Potential Card with Glassmorphism */}
          <ModernCard variant="glass" className="relative overflow-hidden mt-6">
            {/* Background gradient accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Potenzial diesen Monat
                  </p>
                  <div className="flex items-baseline gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-green-600 font-semibold">
                      +{percentIncrease}% mehr Umsatz möglich
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Amount with animated counter */}
              <div className="space-y-2">
                <motion.div
                  className="flex items-baseline gap-2"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Plus className="h-8 w-8 text-green-600" />
                  <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {formatCurrency(total)}
                  </span>
                </motion.div>
                <p className="text-sm text-gray-600">
                  mehr Umsatz möglich
                </p>
              </div>
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Produkte</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {product_count} mit Potenzial
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Ø pro Produkt</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(avg_per_product)}/Monat
                  </p>
                </div>
              </div>
              
              {/* CTA Button */}
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Target className="h-5 w-5" />
                  Produkte optimieren
                </motion.button>
              </Link>
            </div>
          </ModernCard>
        </div>
      </div>
    </motion.div>
  )
}

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
              <h3 className="text-xl font-bold text-gray-900">
                Deine Optimierungs-Reise
              </h3>
              <p className="text-sm text-gray-600">
                {config.name}
              </p>
            </div>
          </div>
          
          {/* XP Display */}
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {points}/{next_level_points}
            </p>
            <p className="text-xs text-gray-600">Punkte</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{Math.round(progress)}% zum nächsten Level</span>
            {points_needed && points_needed > 0 && (
              <span className="font-semibold text-purple-600">Noch {points_needed} Punkte</span>
            )}
          </div>
          
          <div className="relative h-3 overflow-hidden rounded-full bg-gray-200">
            {/* Animated gradient progress */}
            <motion.div
              className={`h-full bg-gradient-to-r ${config.color} animate-gradient`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </div>
        </div>
        
        {/* Achievement Cards */}
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((achievement, idx) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col items-center gap-2 rounded-xl p-4 transition-all hover:scale-105 ${
                achievement.completed
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
                  : "bg-gray-50 border-2 border-gray-200 opacity-60"
              }`}
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
              <p className="text-xs text-center font-medium text-gray-700">
                {achievement.label}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Next Steps */}
        {pending_steps && pending_steps.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              Noch zu erledigen:
            </p>
            
            {pending_steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={getActionHref(step.action)}>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-semibold text-sm">
                      {step.points}
                    </div>
                    <p className="flex-1 text-sm text-gray-700">{step.text}</p>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </ModernCard>
  )
}

function QuickActions({ stats }: { stats: DashboardStats }) {
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
      <h3 className="text-2xl font-bold mb-6 text-gray-900">⚡ Schnellaktionen</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, idx) => {
          const IconComponent = action.icon
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
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
                      <h4 className="text-2xl font-bold text-gray-900">
                        {formatNumber(action.value)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {action.title}
                      </p>
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
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
            </motion.div>
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
      <div className="border-b border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Nächste Schritte
          </h3>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8 space-y-4">
        {/* Urgent CTA Box */}
        {urgentStep && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 p-6"
          >
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300/20 rounded-full blur-3xl" />
            
            <div className="relative space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 shadow-md">
                  <Flame className="h-4 w-4 text-white animate-pulse" />
                </div>
                <p className="text-sm font-semibold text-orange-900">
                  {urgentStep.title}
                </p>
              </div>
              
              <p className="text-sm text-orange-800">
                {urgentStep.description}
              </p>
              
              <Link href={urgentStep.href}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {urgentStep.action}
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Other Steps */}
        {otherSteps.length > 0 && (
          <div className="space-y-3">
            {otherSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={step.href}>
                  <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-blue-50 border-2 border-blue-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex-1">
                      <div className="font-semibold mb-1 text-gray-900">{step.title}</div>
                      <p className="text-sm text-gray-700 mb-2">{step.description}</p>
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        {step.action} <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </ModernCard>
  )
}
