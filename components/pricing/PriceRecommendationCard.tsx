'use client'

import React, { useState, useEffect } from 'react'
import { AlertTriangle, Clock, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ConfidenceIndicator } from './ConfidenceIndicator'
import { KeyInsights } from './KeyInsights'
import { ActionButtons } from './ActionButtons'
import { PriceRecommendationBreakdown } from '../PriceRecommendationBreakdown'
import { formatCurrency, formatPercentage, formatTimeAgo } from '@/lib/formatters'
import { generateRecommendationTexts } from '@/lib/recommendationTexts'

interface PriceRecommendationCardProps {
  recommendation: {
    product_id: string | number
    product_title?: string
    product_name?: string
    current_price: number
    recommended_price: number
    price_change?: number
    price_change_pct: number
    confidence: number
    reasoning: string | object
    
    // Strategy details
    strategy_details?: Array<{
      strategy: string
      recommended_price: number
      confidence: number
      reasoning: string
      competitor_context?: any
    }>
    
    // Margin analysis (optional)
    margin_analysis?: {
      is_safe: boolean
      margin: number
      warning: string | null
      message: string
      details: any
    }
    
    // Competitor data
    competitor_data?: {
      avg: number
      min: number
      max: number
      prices: Array<{
        source: string
        price: number
        title?: string
        url?: string
      }>
    }
    
    // Warnings
    warnings?: Array<{
      type: string
      severity: string
      message: string
    }>
    
    // Metadata
    created_at?: string
    generated_at?: string
    
    // Confidence Basis (NEW)
    confidence_basis?: {
      ml_models?: number
      competitor_count?: number
      sales_30d?: number
      margin_stable?: boolean
      margin_pct?: number | null
    }
    
    // SHAP Explanation (NEW)
    shap_explanation?: Array<{
      feature: string
      impact: number
      pct: number
    }>
    
    // Competitor Count (NEW)
    competitor_count?: number
  }
  
  onApply?: (price: number) => Promise<void>
  onDismiss?: () => void
  onRefresh?: () => Promise<void>
}

export function PriceRecommendationCard({
  recommendation,
  onApply,
  onDismiss,
  onRefresh
}: PriceRecommendationCardProps) {
  const t = useTranslations('pricing')
  const tCommon = useTranslations('common')
  const tMarket = useTranslations('market')
  
  const [isApplying, setIsApplying] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState<string>('balanced')
  
  // Calculate recommended price based on selected strategy
  const getRecommendedPrice = () => {
    if (selectedStrategy === 'balanced') {
      return recommendation.recommended_price // Use weighted average
    }
    
    // Use specific strategy price
    const strategy = recommendation.strategy_details?.find(
      (s: any) => s.strategy === selectedStrategy
    )
    
    return strategy?.recommended_price || recommendation.recommended_price
  }
  
  const displayedPrice = getRecommendedPrice()
  const displayedPriceChange = displayedPrice - recommendation.current_price
  const displayedPriceChangePct = (displayedPriceChange / recommendation.current_price) * 100
  
  // Helper function for strategy descriptions
  const getStrategyDescription = (strategy: string): string => {
    const descriptions: Record<string, string> = {
      'balanced': t('strategy_balanced_description'),
      'competitive': t('strategy_competitive_description'),
      'demand': t('strategy_demand_description'),
      'inventory': t('strategy_inventory_description'),
      'cost': t('strategy_cost_description')
    }
    
    return descriptions[strategy] || descriptions['balanced']
  }
  
  // Calculate derived values (use displayedPrice for consistency)
  const priceChange = displayedPriceChange
  const priceIncrease = priceChange > 0
  const priceDecrease = priceChange < 0
  const noChange = priceChange === 0
  
  const hasMarginWarning = recommendation.margin_analysis && !recommendation.margin_analysis.is_safe
  const isCriticalWarning = recommendation.warnings?.some(w => w.severity === 'HIGH' || w.severity === 'high')
  
  // Generiere UI-Texte aus Recommendation-Daten
  const recommendationTexts = generateRecommendationTexts({
    product_title: recommendation.product_title || recommendation.product_name,
    product_name: recommendation.product_name,
    current_price: recommendation.current_price,
    recommended_price: recommendation.recommended_price,
    price_change_pct: recommendation.price_change_pct,
    confidence: recommendation.confidence,
    strategies: extractStrategies(recommendation),
    competitor_context: extractCompetitorContext(recommendation),
    ml_predictions: extractMLPredictions(recommendation),
    margin: recommendation.margin_analysis ? {
      is_safe: recommendation.margin_analysis.is_safe,
      margin_pct: recommendation.margin_analysis.margin || 0
    } : undefined,
    has_insights: recommendation.warnings && recommendation.warnings.length > 0
  })
  
  // Normalize reasoning (für Fallback)
  const reasoningText = recommendationTexts.confidence
  
  // Handle actions
  const handleApply = async () => {
    if (!onApply) return
    setIsApplying(true)
    try {
      await onApply(displayedPrice) // Use displayedPrice (selected strategy)
    } catch (error) {
      console.error('Failed to apply price:', error)
    } finally {
      setIsApplying(false)
    }
  }
  
  const handleRefresh = async () => {
    if (!onRefresh) return
    setIsRefreshing(true)
    try {
      await onRefresh()
    } catch (error) {
      console.error('Failed to refresh:', error)
    } finally {
      setIsRefreshing(false)
    }
  }
  
  const productTitle = recommendation.product_title || recommendation.product_name || `Product ${recommendation.product_id}`
  const timestamp = recommendation.generated_at || recommendation.created_at || new Date().toISOString()
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      
      {/* ==========================================
          HERO SECTION - Main Decision
          ========================================== */}
      
      <div className="p-6 pb-4 bg-gradient-to-br from-blue-50 to-white">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {productTitle}
            </h2>
            <p className="text-xs text-gray-500">
              {t('product_id')}: {recommendation.product_id}
            </p>
          </div>
          
          {/* Confidence Badge */}
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
            {Math.round(recommendation.confidence * 100)}% {t('confidence')}
          </span>
        </div>
        
        {/* Headline */}
        {recommendationTexts.headline && (
          <div className="mb-6">
            <p className="text-base font-medium text-gray-900">
              {recommendationTexts.headline}
            </p>
          </div>
        )}
        
        {/* Price Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-4">
          
          {/* Current Price */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1 font-medium">{t('current')}</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(recommendation.current_price)}
            </p>
          </div>
          
          {/* Recommended Price */}
          <div className={`rounded-lg p-4 border-2 ${
            isCriticalWarning ? 'bg-red-50 border-red-300' :
            hasMarginWarning ? 'bg-orange-50 border-orange-300' :
            'bg-green-50 border-green-300'
          }`}>
            <p className={`text-sm font-medium mb-1 ${
              isCriticalWarning ? 'text-red-700' :
              hasMarginWarning ? 'text-orange-700' :
              'text-green-700'
            }`}>
              {t('recommended')}
              {selectedStrategy !== 'balanced' && (
                <span className="ml-2 text-xs font-normal">
                  ({t('using_strategy').replace('{strategy}', t(`strategy_${selectedStrategy}`))})
                </span>
              )}
            </p>
            <p className={`text-3xl font-bold ${
              isCriticalWarning ? 'text-red-900' :
              hasMarginWarning ? 'text-orange-900' :
              'text-green-900'
            }`}>
              {formatCurrency(displayedPrice)}
            </p>
          </div>
        </div>
        
        {/* Price Change Indicator */}
        <div className="flex items-center justify-center mb-4">
          {noChange ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <span className="text-gray-600 font-medium">{t('no_change')}</span>
            </div>
          ) : (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              priceIncrease ? 'bg-blue-100' : 'bg-orange-100'
            }`}>
              <span className="text-2xl">
                {priceIncrease ? '📈' : '📉'}
              </span>
              <span className={`text-lg font-bold ${
                priceIncrease ? 'text-blue-700' : 'text-orange-700'
              }`}>
                {priceChange > 0 ? '+' : ''}
                {formatCurrency(priceChange)}
              </span>
              <span className={`text-lg font-semibold ${
                priceIncrease ? 'text-blue-600' : 'text-orange-600'
              }`}>
                ({displayedPriceChangePct > 0 ? '+' : ''}
                {formatPercentage(displayedPriceChangePct)})
              </span>
            </div>
          )}
        </div>
        
        {/* NEW: Enhanced Calculation Breakdown Panel with Visual Weighting */}
        {recommendation.strategy_details && recommendation.strategy_details.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300">
            <h4 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
              <span>🧮</span>
              Wie wird {priceChange > 0 ? '+' : ''}{formatCurrency(priceChange)} berechnet?
            </h4>
            
            {/* Explanation */}
            <p className="text-xs text-indigo-800 mb-4 leading-relaxed">
              Die Empfehlung ist ein <strong>gewichteter Durchschnitt</strong>, NICHT die Summe. 
              Jede Strategie wird mit ihrer <strong>Confidence gewichtet</strong>.
            </p>

            {/* Step 1: Individual Strategy Prices */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-indigo-900 mb-2">
                1️⃣ Einzelne Strategien-Empfehlungen:
              </p>
              <div className="space-y-1.5">
                {recommendation.strategy_details.map((strategy: any, idx: number) => {
                  const impact = strategy.recommended_price - recommendation.current_price
                  
                  const icons: Record<string, string> = {
                    'competitive': '🏪',
                    'demand': '📊',
                    'inventory': '📦',
                    'cost': '💰'
                  }
                  
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 px-3 bg-white/60 rounded">
                      <span className="text-gray-700">
                        {icons[strategy.strategy] || '⚖️'} {t(`strategy_${strategy.strategy}`)} ({(strategy.confidence * 100).toFixed(0)}%)
                      </span>
                      <span className="font-mono font-bold text-gray-900">
                        {impact > 0 ? '+' : ''}{formatCurrency(impact)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Weighting Calculation with Visual Bars */}
            <div className="mb-4 p-3 bg-white/80 rounded-lg border border-indigo-200">
              <p className="text-xs font-semibold text-indigo-900 mb-3">
                2️⃣ Gewichtete Beiträge (Confidence × Basis-Gewicht):
              </p>
              <div className="space-y-2.5">
                {recommendation.strategy_details.map((strategy: any, idx: number) => {
                  const baseWeights: Record<string, number> = {
                    'competitive': 0.35,
                    'demand': 0.40,
                    'inventory': 0.25,
                    'cost': 0.25
                  }
                  
                  const baseWeight = baseWeights[strategy.strategy] || 0.1
                  const effectiveWeight = baseWeight * strategy.confidence
                  
                  // Calculate total weight for normalization
                  const totalWeight = (recommendation.strategy_details || []).reduce((sum: number, s: any) => {
                    const bw = baseWeights[s.strategy] || 0.1
                    return sum + (bw * s.confidence)
                  }, 0)
                  
                  const normalizedWeight = effectiveWeight / totalWeight
                  const impact = strategy.recommended_price - recommendation.current_price
                  const weightedContribution = impact * normalizedWeight
                  
                  return (
                    <div key={idx}>
                      {/* Formula */}
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-indigo-700 font-medium">
                          {t(`strategy_${strategy.strategy}`)}:
                        </span>
                        <span className="font-mono text-indigo-900">
                          {(baseWeight * 100).toFixed(0)}% × {(strategy.confidence * 100).toFixed(0)}% = 
                          <strong className="ml-1 text-indigo-600">{(normalizedWeight * 100).toFixed(1)}%</strong>
                        </span>
                      </div>
                      
                      {/* Visual Bar + Result */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-500"
                            style={{ width: `${normalizedWeight * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-indigo-900 tabular-nums min-w-[70px] text-right">
                          = {weightedContribution > 0 ? '+' : ''}{formatCurrency(weightedContribution)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step 3: Final Sum */}
            <div className="p-4 bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 rounded-xl border-2 border-indigo-400 shadow-sm">
              <p className="text-xs font-semibold text-indigo-900 mb-2">
                3️⃣ Finale Summe (Gewichteter Durchschnitt):
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-800 font-medium">
                  Summe aller gewichteten Beiträge
                </span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-indigo-900 tabular-nums">
                    {priceChange > 0 ? '+' : ''}{formatCurrency(priceChange)}
                  </div>
                  <div className="text-xs text-indigo-700 mt-1">
                    ({formatPercentage(displayedPriceChangePct)})
                  </div>
                </div>
              </div>
            </div>

            {/* Info Callout */}
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-300">
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">💡</span>
                <p className="text-xs text-yellow-900 leading-relaxed">
                  <strong>Warum nicht die einfache Summe?</strong> Weil Strategien unterschiedlich zuverlässig sind. 
                  Wettbewerb mit 98% Confidence hat deutlich mehr Einfluss als Nachfrage mit nur 75% Confidence. 
                  Die gewichtete Berechnung verhindert, dass unsichere Daten zu starken Einfluss haben.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* NEW: Interactive Strategy Selector */}
        {recommendation.strategy_details && recommendation.strategy_details.length > 1 && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('strategy_selector_label')}
            </label>
            
            <select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="balanced">
                ⚖️ {t('strategy_balanced')} ({t('standard')})
              </option>
              
              {recommendation.strategy_details.map((strategy: any) => {
                const impact = strategy.recommended_price - recommendation.current_price
                const impactPct = ((impact / recommendation.current_price) * 100).toFixed(1)
                
                const icons: Record<string, string> = {
                  'competitive': '🏪',
                  'demand': '📊',
                  'inventory': '📦',
                  'cost': '💰'
                }
                
                return (
                  <option key={strategy.strategy} value={strategy.strategy}>
                    {icons[strategy.strategy] || '⚖️'} {t(`strategy_${strategy.strategy}`)} 
                    ({strategy.confidence > 0 ? (strategy.confidence * 100).toFixed(0) : 0}% {t('confidence')}) 
                    → {impact > 0 ? '+' : ''}{impactPct}%
                  </option>
                )
              })}
            </select>
            
            {/* Strategy Description */}
            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-800 leading-relaxed">
                {getStrategyDescription(selectedStrategy)}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {(onApply || onDismiss) && (
          <ActionButtons
            recommendedPrice={displayedPrice}
            onApply={handleApply}
            onDismiss={onDismiss || (() => {})}
            isApplying={isApplying}
            isDisabled={isCriticalWarning}
            marginAnalysis={recommendation.margin_analysis}
          />
        )}
        
      </div>
      
      {/* ==========================================
          CONFIDENCE SECTION
          ========================================== */}
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <ConfidenceIndicator 
          confidence={recommendation.confidence}
          reasoning={recommendationTexts.confidence}
          compact={false}
          confidenceBasis={recommendation.confidence_basis}
        />
      </div>
      
      {/* ==========================================
          CRITICAL WARNINGS (if any)
          ========================================== */}
      
      {isCriticalWarning && (
        <div className="px-6 py-4 bg-red-50 border-t border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">{t('critical_warning')}</h4>
              {recommendation.warnings?.filter(w => w.severity === 'HIGH' || w.severity === 'high').map((warning, idx) => (
                <p key={idx} className="text-sm text-red-800 mb-2">
                  {warning.message}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* ==========================================
          KEY INSIGHTS (Only show if insights exist)
          ========================================== */}
      
      {recommendation.strategy_details && recommendation.strategy_details.length > 0 && (
        <div className="p-6 border-t border-gray-200">
          <KeyInsights
            strategyDetails={recommendation.strategy_details || []}
            marginAnalysis={recommendation.margin_analysis}
            competitorData={recommendation.competitor_data}
            warnings={recommendation.warnings || []}
          />
        </div>
      )}
      
      
      {/* ==========================================
          FOOTER - Metadata
          ========================================== */}
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>
            {formatTimeAgo(timestamp)}
          </span>
        </div>
        
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{tCommon('refresh')}</span>
          </button>
        )}
      </div>
      
    </div>
  )
}

// Helper-Funktionen zum Extrahieren der Datenstruktur
function extractStrategies(recommendation: any) {
  if (recommendation.strategy_details && Array.isArray(recommendation.strategy_details)) {
    const strategies: any = {}
    recommendation.strategy_details.forEach((detail: any) => {
      strategies[detail.strategy] = {
        price: detail.recommended_price,
        confidence: detail.confidence,
        strategy: detail.strategy,
        reasoning: detail.reasoning || ''
      }
    })
    return strategies
  }
  
  // Fallback: Aus reasoning parsen
  const reasoning = recommendation.reasoning
  if (typeof reasoning === 'object' && reasoning?.strategies) {
    return reasoning.strategies
  }
  
  return undefined
}

function extractCompetitorContext(recommendation: any) {
  if (recommendation.competitor_data) {
    const data = recommendation.competitor_data
    // Berechne Position basierend auf avg, min, max
    const yourPrice = recommendation.recommended_price
    let position = 'unknown'
    
    if (data.avg) {
      if (yourPrice >= data.max * 0.95) {
        position = 'most_expensive'
      } else if (yourPrice <= data.min * 1.05) {
        position = 'cheapest'
      } else if (yourPrice > data.avg * 1.1) {
        position = 'above_average'
      } else if (yourPrice < data.avg * 0.9) {
        position = 'below_average'
      } else {
        position = 'average'
      }
    }
    
    return {
      position,
      avg_price: data.avg || 0,
      min_price: data.min || 0,
      max_price: data.max || 0,
      price_diff_pct: data.avg ? ((yourPrice - data.avg) / data.avg) * 100 : 0,
      competitor_count: data.prices?.length || 0
    }
  }
  
  return undefined
}

function extractMLPredictions(recommendation: any) {
  // Prüfe ob ML-Daten in reasoning vorhanden sind
  const reasoning = recommendation.reasoning
  if (typeof reasoning === 'object' && reasoning?.ml_predictions) {
    return reasoning.ml_predictions
  }
  
  return undefined
}






