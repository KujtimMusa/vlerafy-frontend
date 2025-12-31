'use client'

import { useState, useEffect } from 'react'
import { getLatestRecommendation, generateRecommendation } from '@/lib/api'
import { applyRecommendedPrice } from '@/lib/shopifyService'
import { PriceRecommendationCard } from './pricing/PriceRecommendationCard'
import { PriceStoryExplainer } from './explainability/PriceStoryExplainer'
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
      console.log('[LatestRecommendation] Loading recommendation for product:', productIdNum)
      const data = await getLatestRecommendation(productIdNum)
      console.log('[LatestRecommendation] API Response:', data)
      
      if (data.recommendations && data.recommendations.length > 0) {
        const rec = data.recommendations[0]
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
        
        console.log('[LatestRecommendation] Setting recommendation:', rec)
        setRecommendation(rec)
      } else {
        console.log('[LatestRecommendation] No recommendations found')
        setRecommendation(null)
      }
    } catch (err: any) {
      console.error('[LatestRecommendation] Error loading recommendation:', err)
      console.error('[LatestRecommendation] Error details:', err.response || err.message)
      setError(err.message || 'Fehler beim Laden der Empfehlung')
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
      await generateRecommendation(productIdNum)
      
      // Reload nach Generierung
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Lade Empfehlung...</div>
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
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-4">
          Noch keine Empfehlung für dieses Produkt vorhanden.
        </p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
        >
          {generating ? 'Generiere...' : 'Empfehlung generieren'}
        </button>
      </div>
    )
  }

  // Transform recommendation data to new format
  const reasoning = recommendation.reasoning
  const reasoningObj = typeof reasoning === 'object' && reasoning !== null ? reasoning : {}
  const strategies = (reasoningObj as any).strategies || {}
  
  // Extract strategy_details array from strategies object
  const strategyDetails = Object.entries(strategies).map(([strategy, data]: [string, any]) => ({
    strategy,
    recommended_price: data?.price || data?.recommended_price || recommendation.recommended_price,
    confidence: data?.confidence || 0.5,
    reasoning: data?.reasoning || '',
    competitor_context: data?.competitor_context || data?.competitive?.competitor_context
  }))
  
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
      
      {/* Price Story Explainer - zeigt warum dieser Preis empfohlen wird */}
      {recommendation.price_story && (
        <div className="mt-6">
          <PriceStoryExplainer priceStory={recommendation.price_story} />
        </div>
      )}
    </div>
  )
}

