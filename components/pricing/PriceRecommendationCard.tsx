'use client'

import React, { useState } from 'react'
import { AlertTriangle, Clock, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ConfidenceIndicator } from './ConfidenceIndicator'
import { KeyInsights } from './KeyInsights'
import { DetailedBreakdown } from './DetailedBreakdown'
import { CompetitorPositionSlider } from './CompetitorPositionSlider'
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
  
  const [showDetails, setShowDetails] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Calculate derived values
  const priceChange = recommendation.price_change ?? (recommendation.recommended_price - recommendation.current_price)
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
      await onApply(recommendation.recommended_price)
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
            </p>
            <p className={`text-3xl font-bold ${
              isCriticalWarning ? 'text-red-900' :
              hasMarginWarning ? 'text-orange-900' :
              'text-green-900'
            }`}>
              {formatCurrency(recommendation.recommended_price)}
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
                ({recommendation.price_change_pct > 0 ? '+' : ''}
                {formatPercentage(recommendation.price_change_pct)})
              </span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        {(onApply || onDismiss) && (
          <ActionButtons
            recommendedPrice={recommendation.recommended_price}
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
        
        {/* Warum diese Empfehlung - Bullet Points */}
        {recommendationTexts.bulletPoints.length > 0 && (
          <div className="mt-4 rounded-lg bg-white px-4 py-3 text-sm text-gray-700 border border-gray-200">
            <p className="font-medium mb-2 text-gray-900">{t('why_recommendation')}</p>
            <ul className="list-disc list-inside space-y-1">
              {recommendationTexts.bulletPoints.map((bullet, idx) => (
                <li key={idx} className="text-gray-700">{bullet}</li>
              ))}
            </ul>
          </div>
        )}
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
          KEY INSIGHTS
          ========================================== */}
      
      <div className="p-6 border-t border-gray-200">
        <KeyInsights
          strategyDetails={recommendation.strategy_details || []}
          marginAnalysis={recommendation.margin_analysis}
          competitorData={recommendation.competitor_data}
          warnings={recommendation.warnings || []}
        />
        
        {/* Insights Text */}
        {recommendationTexts.insights && (
          <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-6 text-center">
            <p className="text-sm font-medium text-gray-700">
              {recommendationTexts.insights}
            </p>
          </div>
        )}
      </div>
      
      {/* ==========================================
          COMPETITOR POSITIONING
          ========================================== */}
      
      {recommendation.competitor_data && (
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌐</span>
                <span className="text-sm font-medium text-gray-800">{tMarket('comparison')}</span>
              </div>
              <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
                {tMarket('competitors', { count: recommendation.competitor_data.prices?.length || 0 })}
              </span>
            </div>
            <CompetitorPositionSlider
              competitorData={recommendation.competitor_data}
              yourPrice={recommendation.recommended_price}
            />
          </div>
        </div>
      )}
      
      {/* ==========================================
          COLLAPSIBLE: DETAILED BREAKDOWN
          ========================================== */}
      
      <div className="border-t border-gray-200">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-sm"
        >
          <span className="font-medium text-gray-600 flex items-center gap-1">
            {showDetails ? (
              <>
                <ChevronUp className="w-3 h-3" />
                {t('hide_details')}
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                {t('show_details')}
              </>
            )}
          </span>
        </button>
        
        {showDetails && (
          <div className="px-6 pb-6">
            <DetailedBreakdown
              strategyDetails={recommendation.strategy_details || []}
              marginAnalysis={recommendation.margin_analysis}
              competitorData={recommendation.competitor_data}
              shapExplanation={recommendation.shap_explanation}
              recommendedPrice={recommendation.recommended_price}
            />
          </div>
        )}
      </div>
      
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






