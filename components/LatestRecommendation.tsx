'use client'

import { useState, useEffect } from 'react'
import { getLatestRecommendation, generateRecommendation } from '@/lib/api'
import { applyRecommendedPrice } from '@/lib/shopifyService'
import { PriceRecommendationCard } from './pricing/PriceRecommendationCard'
import { EmptyAnalysisState } from './EmptyAnalysisState'
import { PriceRecommendationBreakdown } from './PriceRecommendationBreakdown'
import { useShop } from '@/hooks/useShop'

interface RecommendationData {
  id: number
  product_id: number
  product_name: string
  current_price: number
  recommended_price: number
  price_change_pct: number
  strategy: string
  confidence: number
  reasoning: string
  
  // Metrics
  demand_growth?: number | null
  days_of_stock?: number | null
  sales_7d?: number | null
  competitor_avg_price?: number | null
  
  // Price Story (Explainable AI)
  price_story?: {
    steps: Array<{
      step: number
      title: string
      explanation: string
      impact: number
      impact_pct: number
      confidence: number
      data_points: any
      reasoning: string
    }>
    total_impact: number
    total_impact_pct: number
    base_price: number
    recommended_price: number
    confidence: number
    summary: string
  }
  
  created_at: string
  applied_at?: string | null
}

interface LatestRecommendationProps {
  productId: number | string
}

export default function LatestRecommendation({ productId }: LatestRecommendationProps) {
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { currentShop, isDemoMode } = useShop()

  const loadLatestRecommendation = async () => {
    if (!productId) return
    
    // Konvertiere productId zu number falls nötig
    const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : productId
    if (isNaN(productIdNum)) {
      setError('Ungültige Produkt-ID')
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      console.log('[LatestRecommendation] 🔄 Generating FRESH recommendation for product:', productIdNum)
      // ALWAYS generate fresh - never use cached!
      const data = await generateRecommendation(productIdNum)
      console.log('[LatestRecommendation] ✅ Fresh recommendation generated:', data)
      
      // Response structure from POST /generate is different:
      // { success: true, recommendation: {...} }
      const rec = data.recommendation || data
      
      if (rec) {
        console.log('[LatestRecommendation] Recommendation data:', rec)
        
        // Stelle sicher, dass alle erforderlichen Felder vorhanden sind
        if (!rec.product_name) {
          rec.product_name = data.product_name || `Product ${rec.product_id}`
        }
        if (!rec.current_price && data.current_price) {
          rec.current_price = data.current_price
        }
        
        // Parse reasoning falls es ein JSON-String ist
        let reasoningParsed = rec.reasoning
        if (typeof rec.reasoning === 'string') {
          try {
            reasoningParsed = JSON.parse(rec.reasoning)
          } catch {
            // Nicht JSON, behalte als String
            reasoningParsed = rec.reasoning
          }
        }
        rec.reasoning = reasoningParsed
        
        console.log('[LatestRecommendation] ✅ Setting fresh recommendation:', rec)
        setRecommendation(rec)
      } else {
        console.log('[LatestRecommendation] No recommendation in response')
        setRecommendation(null)
      }
    } catch (err: any) {
      console.error('[LatestRecommendation] Error generating recommendation:', err)
      console.error('[LatestRecommendation] Error details:', err.response || err.message)
      setError(err.message || 'Fehler beim Generieren der Empfehlung')
      setRecommendation(null)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!productId) {
      alert('Bitte wähle eine Produkt-ID aus!')
      return
    }
    
    // Konvertiere productId zu number falls nötig
    const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : productId
    if (isNaN(productIdNum)) {
      alert('Ungültige Produkt-ID')
      return
    }
    
    setGenerating(true)
    setError(null)
    try {
      console.log('[LatestRecommendation] 🔄 Manual refresh requested')
      // Reload generates fresh recommendation
      await loadLatestRecommendation()
    } catch (err: any) {
      console.error('[LatestRecommendation] Error generating recommendation:', err)
      setError(err.message || 'Fehler beim Generieren der Empfehlung')
    } finally {
      setGenerating(false)
    }
  }

  const handleApplyPrice = async (price: number) => {
    if (!productId) {
      alert('Bitte wähle eine Produkt-ID aus!')
      return
    }
    
    // Demo Mode: Keine echte Shopify Integration
    if (isDemoMode) {
      alert('Demo Mode: Preis kann nicht auf Shopify angewendet werden.')
      return
    }
    
    if (!currentShop?.id) {
      alert('Kein Shop ausgewählt. Bitte wähle einen Shop aus.')
      return
    }
    
    // Konvertiere productId zu number falls nötig
    const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : productId
    if (isNaN(productIdNum)) {
      alert('Ungültige Produkt-ID')
      return
    }
    
    try {
      console.log('[LatestRecommendation] Applying price:', { productIdNum, price, shopId: currentShop.id })
      
      const result = await applyRecommendedPrice({
        product_id: productIdNum,
        recommended_price: price
      })
      
      console.log('[LatestRecommendation] Price applied successfully:', result)
      
      // Erfolgsmeldung
      alert(`Preis erfolgreich auf Shopify aktualisiert: €${result.new_price.toFixed(2)}`)
      
      // Reload Recommendation um aktualisierten Preis zu sehen
      await loadLatestRecommendation()
      
    } catch (err: any) {
      console.error('[LatestRecommendation] Error applying price:', err)
      alert(`Fehler beim Anwenden des Preises: ${err.message || 'Unbekannter Fehler'}`)
      throw err
    }
  }

  useEffect(() => {
    loadLatestRecommendation()
  }, [productId])

  if (loading || generating) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div className="text-gray-600 text-center">
          <p className="font-medium">Analysiere aktuelle Marktdaten...</p>
          <p className="text-sm text-gray-500 mt-1">
            Prüfe Wettbewerber, analysiere 90 Tage Verkaufsdaten...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">{error}</p>
        <button
          onClick={loadLatestRecommendation}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }

  if (!recommendation) {
    return (
      <EmptyAnalysisState
        productId={productId}
        competitorCount={0}
        salesDataDays={0}
        onRunAnalysis={handleGenerate}
      />
    )
  }

  // Check for invalid confidence (empty state)
  const hasInvalidConfidence = !recommendation.confidence || 
    recommendation.confidence === -Infinity || 
    recommendation.confidence < 0 ||
    isNaN(recommendation.confidence)
  
  const competitorCount = recommendation.competitor_avg_price ? 1 : 0
  const salesDataDays = recommendation.sales_7d ? 7 : 0

  if (hasInvalidConfidence || (competitorCount === 0 && salesDataDays < 7)) {
    return (
      <EmptyAnalysisState
        productId={productId}
        competitorCount={competitorCount}
        salesDataDays={salesDataDays}
        onRunAnalysis={handleGenerate}
      />
    )
  }

  // Transform recommendation data to new format
  const reasoning = recommendation.reasoning
  const reasoningObj = typeof reasoning === 'object' && reasoning !== null ? reasoning : {}
  const strategies = (reasoningObj as any).strategies || {}
  
  // Extract strategy_details array - prefer from API response, fallback to reasoning.strategies
  let strategyDetails: any[] = []
  
  // First, try to get from API response (new format)
  if ((recommendation as any).strategy_details && Array.isArray((recommendation as any).strategy_details)) {
    strategyDetails = (recommendation as any).strategy_details
  } else if ((recommendation as any).strategyDetails && Array.isArray((recommendation as any).strategyDetails)) {
    strategyDetails = (recommendation as any).strategyDetails
  } else {
    // Fallback: Extract from strategies object (old format)
    strategyDetails = Object.entries(strategies).map(([strategy, data]: [string, any]) => ({
      strategy,
      recommended_price: data?.price || data?.recommended_price || recommendation.recommended_price,
      confidence: data?.confidence || 0.5,
      reasoning: data?.reasoning || '',
      competitor_context: data?.competitor_context || data?.competitive?.competitor_context
    }))
  }
  
  // Build competitor_data from available fields
  const competitorContext = strategies.competitive?.competitor_context || strategies.competitive?.competitor_context
  const competitorData = recommendation.competitor_avg_price ? {
    avg: recommendation.competitor_avg_price,
    min: competitorContext?.min_price || recommendation.competitor_avg_price * 0.9,
    max: competitorContext?.max_price || recommendation.competitor_avg_price * 1.1,
    prices: competitorContext?.sources?.map((source: string, idx: number) => ({
      source,
      price: recommendation.competitor_avg_price! * (0.9 + (idx * 0.05)) // Estimate
    })) || []
  } : undefined
  
  const transformedRecommendation = {
    product_id: recommendation.product_id,
    product_name: recommendation.product_name,
    current_price: recommendation.current_price,
    recommended_price: recommendation.recommended_price,
    price_change: recommendation.recommended_price - recommendation.current_price,
    price_change_pct: recommendation.price_change_pct,
    confidence: recommendation.confidence,
    reasoning: typeof reasoning === 'string' ? reasoning : (reasoningObj as any).summary || JSON.stringify(reasoningObj),
    strategy_details: strategyDetails.length > 0 ? strategyDetails : undefined,
    competitor_data: competitorData,
    created_at: recommendation.created_at,
    generated_at: recommendation.created_at
  }

  return (
    <div className="space-y-6">
      <PriceRecommendationCard
        recommendation={transformedRecommendation}
        onRefresh={handleGenerate}
        onDismiss={() => {}}
        onApply={handleApplyPrice}
      />
      
      {/* Price Recommendation Breakdown - Alternative detailed view */}
      {recommendation && (
        <div className="mt-6">
          <PriceRecommendationBreakdown
            currentPrice={recommendation.current_price}
            recommendedPrice={recommendation.recommended_price}
            factors={{
              competitorAdjustment: (recommendation.competitor_avg_price || 0) - recommendation.current_price,
              demandAdjustment: (recommendation.demand_growth || 0) * recommendation.current_price * 0.1,
              inventoryAdjustment: recommendation.days_of_stock ? (recommendation.days_of_stock < 15 ? -recommendation.current_price * 0.05 : 0) : 0
            }}
            averageCompetitorPrice={recommendation.competitor_avg_price ?? undefined}
            demandGrowth={recommendation.demand_growth ?? 0}
            daysOfStock={recommendation.days_of_stock ?? 0}
            onApply={handleApplyPrice}
            onKeep={() => {}}
          />
        </div>
      )}
    </div>
  )
}

