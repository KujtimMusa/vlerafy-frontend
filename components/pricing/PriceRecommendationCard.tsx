'use client'

import React, { useState, useEffect } from 'react'
import { AlertTriangle, Clock, ChevronDown, ChevronUp, RefreshCw, CheckCircle2, Lightbulb, Calculator } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ConfidenceIndicator } from './ConfidenceIndicator'
import { ActionButtons } from './ActionButtons'
import { PriceReasoningStory } from './PriceReasoningStory'
import { formatCurrency, formatPercentage, formatTimeAgo } from '@/lib/formatters'
import { generateRecommendationTexts } from '@/lib/recommendationTexts'
import { Recommendation } from '@/lib/types'

interface PriceRecommendationCardProps {
  recommendation: Partial<Recommendation> & {
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
    
    // NEW: Backend Fields
    id?: number
    status?: 'pending' | 'accepted' | 'rejected' | 'applied'
    strategy?: string
    ml_confidence?: number
    base_confidence?: number
    applied_at?: string | null
    applied_price?: number | null
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
  
  // Calculate derived values
  const displayedPrice = recommendation.recommended_price
  const displayedPriceChange = displayedPrice - recommendation.current_price
  const displayedPriceChangePct = (displayedPriceChange / recommendation.current_price) * 100
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
  
  // ✅ FIX: Ensure confidence is always valid (0-1 range) - like PriceReasoningStory.tsx
  const validConfidence = Math.max(0, Math.min(1, recommendation.confidence ?? 0.5))
  
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
    <div className="shadow-lg border overflow-hidden" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
      
      {/* Story-basierte Erklärung: Warum empfehlen wir X€? */}
      {recommendation.strategy_details && recommendation.strategy_details.length > 0 ? (
        <PriceReasoningStory
          recommendedPrice={displayedPrice}
          currentPrice={recommendation.current_price}
          strategyDetails={recommendation.strategy_details}
          competitorData={recommendation.competitor_data}
          productName={productTitle}
          productId={recommendation.product_id}
          confidence={recommendation.confidence}
          onApply={onApply ? handleApply : undefined}
          onDismiss={onDismiss}
          onRefresh={onRefresh ? handleRefresh : undefined}
          createdAt={timestamp}
        />
      ) : (
        /* Fallback für alte Struktur wenn keine strategy_details - MIT "KI ist X% sicher" Anzeige */
        <div className="p-6 pb-4" style={{ background: 'linear-gradient(to bottom right, #1e293b, #0f172a)' }}>
          
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1" style={{ color: '#f1f5f9' }}>
                {productTitle}
              </h2>
              <p className="text-xs" style={{ color: '#94a3b8' }}>
                {t('product_id')}: {recommendation.product_id}
              </p>
            </div>
          </div>
          
          {/* Headline */}
          {recommendationTexts.headline && (
            <div className="mb-6">
              <p className="text-base font-medium" style={{ color: '#f1f5f9' }}>
                {recommendationTexts.headline}
              </p>
            </div>
          )}
          
          {/* ✅ "KI ist X% sicher" Section (wie in PriceReasoningStory) */}
          <div className="mb-6" style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: '#f1f5f9',
                margin: 0
              }}>
                Unsere KI ist {Math.round(validConfidence * 100)}% sicher
              </h3>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8' }}>Sicherheitswert</span>
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#10b981' }}>
                  {Math.round(validConfidence * 100)}%
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: '#1e293b', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div 
                  style={{ 
                    width: `${validConfidence * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
            
            {/* Reasoning Text */}
            {reasoningText && (
              <div style={{ 
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#1e293b',
                borderRadius: '8px',
                border: '1px solid #334155'
              }}>
                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                  {typeof reasoningText === 'string' ? reasoningText : JSON.stringify(reasoningText)}
                </p>
              </div>
            )}
          </div>
          
          {/* ✅ "Wieso dieser Preis?" Section */}
          <div className="mb-6" style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}>
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: '#f1f5f9',
                margin: 0
              }}>
                💡 Warum empfehlen wir {formatCurrency(displayedPrice)}?
              </h3>
            </div>
            
            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '16px' }}>
              {recommendationTexts.headline || recommendationTexts.confidence || 'Unsere KI hat mehrere Marktfaktoren analysiert, um diesen Preis zu empfehlen.'}
            </p>
            
            {/* Was analysiert wurde */}
            <div style={{ 
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#1e293b',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                📊 Was analysiert unsere KI?
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Echte Verkaufsdaten aus deinem Shopify-Shop</span>
                </li>
                <li style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Aktuelle Preise deiner 5-10 wichtigsten Konkurrenten</span>
                </li>
                <li style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>4 spezialisierte Machine-Learning-Modelle</span>
                </li>
                <li style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Deine eingetragenen Kosten und bisherigen Margen</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* ✅ "Wie ergibt sich der Preis?" Section */}
          <div className="mb-6" style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}>
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: '#f1f5f9',
                margin: 0
              }}>
                🧮 Wie wird {priceChange > 0 ? '+' : ''}{formatCurrency(Math.abs(priceChange))} berechnet?
              </h3>
            </div>
            
            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '16px' }}>
              Der empfohlene Preis basiert auf einer gewichteten Analyse mehrerer Faktoren. Jeder Faktor wird basierend auf seiner Datenqualität unterschiedlich stark gewichtet.
            </p>
            
            {/* Preisberechnung Details */}
            <div style={{ 
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#1e293b',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#f1f5f9' }}>Aktueller Preis:</strong> {formatCurrency(recommendation.current_price)}
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#f1f5f9' }}>Empfohlener Preis:</strong> {formatCurrency(displayedPrice)}
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#f1f5f9' }}>Preisänderung:</strong> 
                  <span style={{ color: priceChange > 0 ? '#10b981' : '#f59e0b', marginLeft: '8px' }}>
                    {priceChange > 0 ? '+' : ''}{formatCurrency(priceChange)} ({priceChange > 0 ? '+' : ''}{Math.abs(displayedPriceChangePct).toFixed(1)}%)
                  </span>
                </div>
                {recommendation.strategy && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #334155' }}>
                    <strong style={{ color: '#f1f5f9' }}>Hauptstrategie:</strong> {recommendation.strategy}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Price Comparison - ✅ FIX: Gleiche Größe mit grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            
            {/* Current Price */}
            <div className="flex flex-col justify-between p-4 border rounded-lg" style={{ 
              backgroundColor: '#0f172a', 
              borderColor: '#475569',
              minHeight: '120px' // ✅ Gleiche Höhe
            }}>
              <p className="text-xs uppercase tracking-wide mb-2 font-medium" style={{ color: '#94a3b8' }}>
                {t('current')}
              </p>
              <p className="text-3xl font-bold" style={{ color: '#f1f5f9' }}>
                {formatCurrency(recommendation.current_price)}
              </p>
            </div>
            
            {/* Recommended Price */}
            <div className="flex flex-col justify-between p-4 border-2 rounded-lg" style={{
              backgroundColor: isCriticalWarning ? '#7f1d1d' : hasMarginWarning ? '#78350f' : '#064e3b',
              borderColor: isCriticalWarning ? '#ef4444' : hasMarginWarning ? '#f59e0b' : '#10b981',
              minHeight: '120px' // ✅ Gleiche Höhe
            }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wide font-medium" style={{
                  color: isCriticalWarning ? '#fca5a5' : hasMarginWarning ? '#fbbf24' : '#86efac'
                }}>
                  {t('recommended')}
                </p>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                  backgroundColor: isCriticalWarning ? 'rgba(252, 165, 165, 0.2)' : 
                                   hasMarginWarning ? 'rgba(251, 191, 36, 0.2)' : 
                                   'rgba(16, 185, 129, 0.2)',
                  color: isCriticalWarning ? '#fca5a5' : hasMarginWarning ? '#fbbf24' : '#86efac'
                }}>
                  ⭐ EMPFOHLEN
                </span>
              </div>
              <p className="text-3xl font-bold" style={{
                color: isCriticalWarning ? '#fca5a5' : hasMarginWarning ? '#fbbf24' : '#86efac'
              }}>
                {formatCurrency(displayedPrice)}
              </p>
              {/* Price Change */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-medium" style={{
                  color: priceChange > 0 ? '#10b981' : priceChange < 0 ? '#f59e0b' : '#94a3b8'
                }}>
                  {priceChange > 0 ? '↑' : priceChange < 0 ? '↓' : '='} {formatCurrency(Math.abs(priceChange))} 
                  ({priceChange > 0 ? '+' : ''}{Math.abs(displayedPriceChangePct).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
          
          {/* Price Change Indicator */}
          <div className="flex items-center justify-center mb-4">
            {noChange ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: '#334155' }}>
                <span className="font-medium" style={{ color: '#94a3b8' }}>{t('no_change')}</span>
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
          
          {/* Confidence Box */}
          <div className="mt-6 px-6">
            <ConfidenceIndicator 
              confidence={validConfidence}
              reasoning={recommendationTexts.confidence}
              compact={false}
              confidenceBasis={recommendation.confidence_basis}
            />
          </div>
        </div>
      )}

      {/* Action Buttons - Fallback wenn keine strategy_details */}
      {(!recommendation.strategy_details || recommendation.strategy_details.length === 0) && (onApply || onDismiss) && (
        <ActionButtons
          recommendedPrice={displayedPrice}
          onApply={handleApply}
          onDismiss={onDismiss || (() => {})}
          isApplying={isApplying}
          isDisabled={isCriticalWarning}
          marginAnalysis={recommendation.margin_analysis}
        />
      )}
      
      {/* ==========================================
          CRITICAL WARNINGS (if any)
          ========================================== */}
      
      {isCriticalWarning && (
        <div className="px-6 py-4 border-t" style={{ backgroundColor: '#7f1d1d', borderColor: '#ef4444' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#fca5a5' }} />
            <div>
              <h4 className="font-semibold mb-1" style={{ color: '#f1f5f9' }}>{t('critical_warning')}</h4>
              {recommendation.warnings?.filter(w => w.severity === 'HIGH' || w.severity === 'high').map((warning, idx) => (
                <p key={idx} className="text-sm mb-2" style={{ color: '#fca5a5' }}>
                  {warning.message}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* ==========================================
          FOOTER - Metadata
          ========================================== */}
      
      <div className="px-6 py-3 border-t flex items-center justify-between" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
        <div className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
          <Clock className="w-4 h-4" />
          <span>
            {formatTimeAgo(timestamp)}
          </span>
        </div>
        
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
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






