'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { 
  Store, 
  Package, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/formatters'

interface KeyInsightsProps {
  strategyDetails: Array<{
    strategy: string
    recommended_price: number
    confidence: number
    reasoning: string
    competitor_context?: any
  }>
  marginAnalysis?: {
    is_safe: boolean
    margin: number
    warning: string | null
    message: string
    details: any
  } | null
  competitorData?: {
    avg: number
    min: number
    max: number
    prices: Array<{
      source: string
      price: number
    }>
  } | null
  warnings: Array<{
    type: string
    severity: string
    message: string
  }>
}

interface Insight {
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  icon: any
  title: string
  description: string
  details?: string
  color: string
  bgColor: string
  borderColor: string
}

export function KeyInsights({
  strategyDetails,
  marginAnalysis,
  competitorData,
  warnings
}: KeyInsightsProps) {
  const t = useTranslations('insights')
  const tMarket = useTranslations('market')
  
  // Generate and prioritize insights
  const insights = prioritizeInsights({
    strategyDetails,
    marginAnalysis,
    competitorData,
    warnings,
    t,
    tMarket
  })
  
  // Show top 3-4 insights
  const topInsights = insights.slice(0, 4)
  
  if (topInsights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center">
        <div className="mb-2 rounded-full bg-white p-3 shadow-sm">
          <Info className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-700">
          {t('no_insights')}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {t('no_insights_subtitle')}
        </p>
      </div>
    )
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        💡 {t('title')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topInsights.map((insight, idx) => (
          <InsightCard key={idx} insight={insight} />
        ))}
      </div>
    </div>
  )
}

// Individual insight card
function InsightCard({ insight }: { insight: Insight }) {
  const Icon = insight.icon
  
  return (
    <div className={`rounded-lg border-2 p-4 ${insight.bgColor} ${insight.borderColor}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${insight.color} bg-white bg-opacity-50`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1">
            {insight.title}
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            {insight.description}
          </p>
          {insight.details && (
            <p className="text-xs text-gray-600 font-medium">
              {insight.details}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Smart prioritization logic
function prioritizeInsights(data: {
  strategyDetails: any[]
  marginAnalysis?: any
  competitorData?: any
  warnings: any[]
  t: any
  tMarket: any
}): Insight[] {
  const { t, tMarket } = data
  const insights: Insight[] = []
  
  // PRIORITY 1: Critical margin warning
  if (data.marginAnalysis && !data.marginAnalysis.is_safe) {
    if (data.marginAnalysis.warning === 'BELOW_BREAK_EVEN') {
      insights.push({
        type: 'margin_critical',
        severity: 'critical',
        icon: AlertTriangle,
        title: `❌ ${t('below_breakeven')}`,
        description: data.marginAnalysis.message || t('breakeven_warning'),
        details: data.marginAnalysis.details?.break_even_price 
          ? `Break-even: ${formatCurrency(data.marginAnalysis.details.break_even_price)}`
          : undefined,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300'
      })
    } else if (data.marginAnalysis.warning === 'LOW_MARGIN') {
      insights.push({
        type: 'margin_low',
        severity: 'high',
        icon: AlertTriangle,
        title: `⚠️ ${t('margin_low')}`,
        description: `Margin: ${data.marginAnalysis.margin?.toFixed(1)}% (recommended: >20%)`,
        details: data.marginAnalysis.message,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300'
      })
    }
  }
  
  // PRIORITY 2: Healthy margin (show if no warnings)
  if (data.marginAnalysis?.is_safe && !data.marginAnalysis.warning) {
    insights.push({
      type: 'margin_healthy',
      severity: 'info',
      icon: CheckCircle,
      title: `💰 ${t('margin_protected')}`,
      description: `New margin: ${data.marginAnalysis.margin?.toFixed(1)}%`,
      details: data.marginAnalysis.details?.margin?.euro 
        ? `${formatCurrency(data.marginAnalysis.details.margin.euro)} per unit`
        : undefined,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300'
    })
  }
  
  // PRIORITY 3: Competitive positioning
  const competitiveStrategy = data.strategyDetails?.find((s: any) => s.strategy === 'competitive')
  if (competitiveStrategy && data.competitorData) {
    const position = competitiveStrategy.competitor_context?.position || 'UNKNOWN'
    const avgPrice = data.competitorData.avg
    const competitorCount = data.competitorData.prices?.length || 0
    
    let positionText = ''
    let severity: Insight['severity'] = 'medium'
    
    if (position === 'most_expensive') {
      positionText = t('most_expensive_desc')
      severity = 'high'
    } else if (position === 'above_average') {
      positionText = t('above_average_desc')
      severity = 'medium'
    } else if (position === 'average') {
      positionText = t('aligned_average_desc')
      severity = 'low'
    } else if (position === 'below_average') {
      positionText = t('below_average_desc')
      severity = 'low'
    } else if (position === 'cheapest') {
      positionText = t('cheapest_option_desc')
      severity = 'medium'
    }
    
    insights.push({
      type: 'competitive',
      severity,
      icon: Store,
      title: `🏪 ${t('market_position')}`,
      description: positionText,
      details: `${t('market_avg')}: ${formatCurrency(avgPrice)} • ${competitorCount} ${t('competitors_tracked')}`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300'
    })
  }
  
  // PRIORITY 4: Inventory insights
  const inventoryStrategy = data.strategyDetails?.find((s: any) => 
    s.strategy === 'inventory' || s.strategy?.includes('inventory') || s.strategy?.includes('stock')
  )
  if (inventoryStrategy) {
    const reasoning = inventoryStrategy.reasoning || ''
    
    if (reasoning.includes('Hoher Bestand') || reasoning.includes('High stock') || reasoning.includes('Überbestand')) {
      insights.push({
        type: 'inventory_high',
        severity: 'medium',
        icon: Package,
        title: `📦 ${t('inventory_alert')}`,
        description: t('inventory_high'),
        details: reasoning.substring(0, 100),
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300'
      })
    } else if (reasoning.includes('Niedriger Bestand') || reasoning.includes('Low stock') || reasoning.includes('Kritisch')) {
      insights.push({
        type: 'inventory_low',
        severity: 'medium',
        icon: Package,
        title: `📦 ${t('inventory_low')}`,
        description: t('limited_inventory'),
        details: reasoning.substring(0, 100),
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300'
      })
    }
  }
  
  // PRIORITY 5: Demand trends (only if meaningful data)
  const demandStrategy = data.strategyDetails?.find((s: any) => 
    s.strategy === 'demand' || s.strategy?.includes('demand')
  )
  if (demandStrategy && demandStrategy.confidence > 0.5) {
    const reasoning = demandStrategy.reasoning || ''
    const isGrowing = reasoning.includes('Wachstum') || reasoning.includes('Growth') || reasoning.includes('+')
    
    insights.push({
      type: 'demand',
      severity: 'low',
      icon: isGrowing ? TrendingUp : TrendingDown,
      title: isGrowing ? `📈 ${t('demand_growing')}` : `📉 ${t('demand_declining')}`,
      description: reasoning.substring(0, 80),
      color: isGrowing ? 'text-green-600' : 'text-gray-600',
      bgColor: isGrowing ? 'bg-green-50' : 'bg-gray-50',
      borderColor: isGrowing ? 'border-green-300' : 'border-gray-300'
    })
  }
  
  // Sort by severity
  const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 }
  insights.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
  
  return insights
}






