'use client'

/**
 * Combined Price Recommendation + Margin Analysis Component
 * THE KILLER INTEGRATION - Shows both pricing and margin in one view
 */

import React, { useState } from 'react'
import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

interface PriceRecommendationWithMarginProps {
  recommendation: {
    current_price: number
    recommended_price: number
    price_change: number
    price_change_pct: number
    confidence: number
    reasoning: string
    
    // Margin analysis
    margin_analysis?: {
      is_safe: boolean
      margin: number
      warning: string | null
      message: string
      current_margin?: number
      recommended_margin?: number
      margin_change?: number
      details?: {
        margin?: {
          euro: number
        }
        break_even_price?: number
        recommended_min_price?: number
      }
    }
  }
  onApply: () => Promise<void>
  onDismiss: () => void
}

export function PriceRecommendationWithMargin({
  recommendation,
  onApply,
  onDismiss
}: PriceRecommendationWithMarginProps) {
  
  const [isApplying, setIsApplying] = useState(false)
  
  const marginAnalysis = recommendation.margin_analysis
  const hasMarginData = marginAnalysis && marginAnalysis.is_safe !== undefined
  
  const priceIncrease = recommendation.price_change > 0
  const priceDecrease = recommendation.price_change < 0
  
  const handleApply = async () => {
    setIsApplying(true)
    try {
      await onApply()
    } catch (error) {
      console.error('Failed to apply price:', error)
    } finally {
      setIsApplying(false)
    }
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      
      {/* Price Recommendation Section */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Preisempfehlung
        </h3>
        
        {/* Price Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Aktuell</p>
            <p className="text-2xl font-bold text-gray-900">
              €{recommendation.current_price.toFixed(2)}
            </p>
          </div>
          
          <div className={`rounded-lg p-4 border-2 ${
            !hasMarginData || marginAnalysis.is_safe
              ? 'bg-green-50 border-green-300'
              : 'bg-orange-50 border-orange-300'
          }`}>
            <p className={`text-xs font-medium mb-1 ${
              !hasMarginData || marginAnalysis.is_safe ? 'text-green-700' : 'text-orange-700'
            }`}>
              Empfohlen
            </p>
            <p className={`text-2xl font-bold ${
              !hasMarginData || marginAnalysis.is_safe ? 'text-green-900' : 'text-orange-900'
            }`}>
              €{recommendation.recommended_price.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Change Indicator */}
        <div className="flex items-center justify-center mb-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            priceIncrease ? 'bg-blue-100' : 'bg-orange-100'
          }`}>
            <span className="text-xl">
              {priceIncrease ? '📈' : '📉'}
            </span>
            <span className={`font-bold ${
              priceIncrease ? 'text-blue-700' : 'text-orange-700'
            }`}>
              {recommendation.price_change > 0 ? '+' : ''}
              €{Math.abs(recommendation.price_change).toFixed(2)}
              {' '}
              ({recommendation.price_change_pct > 0 ? '+' : ''}
              {recommendation.price_change_pct.toFixed(1)}%)
            </span>
          </div>
        </div>
        
        {/* Confidence */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>Confidence:</span>
          <span className="font-semibold">{(recommendation.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
      
      {/* Margin Check Section */}
      {hasMarginData ? (
        <div className={`p-6 border-t-2 ${
          marginAnalysis.is_safe && !marginAnalysis.warning
            ? 'bg-green-50 border-green-200'
            : marginAnalysis.warning === 'BELOW_BREAK_EVEN'
            ? 'bg-red-50 border-red-200'
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-900">
              💰 Margin-Check
            </h3>
          </div>
          
          {/* Margin Comparison */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Aktuelle Marge</p>
              <p className="text-xl font-bold text-gray-900">
                {marginAnalysis.current_margin?.toFixed(1) || 'N/A'}%
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Neue Marge</p>
              <p className={`text-xl font-bold ${
                marginAnalysis.recommended_margin && marginAnalysis.recommended_margin >= 20
                  ? 'text-green-600'
                  : 'text-orange-600'
              }`}>
                {marginAnalysis.recommended_margin?.toFixed(1) || 'N/A'}%
              </p>
            </div>
          </div>
          
          {/* Margin Change */}
          {marginAnalysis.margin_change !== undefined && (
            <div className="flex items-center justify-center mb-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                marginAnalysis.margin_change >= 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {marginAnalysis.margin_change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-semibold">
                  {marginAnalysis.margin_change >= 0 ? '+' : ''}
                  {marginAnalysis.margin_change.toFixed(1)}% Marge
                </span>
              </div>
            </div>
          )}
          
          {/* Status Messages */}
          <div className="space-y-2 text-sm">
            {marginAnalysis.warning === 'BELOW_BREAK_EVEN' ? (
              <div className="flex items-start gap-2 p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900">❌ Unter Break-Even!</p>
                  <p className="text-red-800 mt-1">{marginAnalysis.message}</p>
                  {marginAnalysis.details?.break_even_price && (
                    <p className="text-red-700 mt-1 text-xs">
                      Break-Even: €{marginAnalysis.details.break_even_price.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ) : marginAnalysis.warning === 'LOW_MARGIN' ? (
              <div className="flex items-start gap-2 p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-orange-900">⚠️ Niedrige Marge</p>
                  <p className="text-orange-800 mt-1">{marginAnalysis.message}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    ✅ Über Break-Even
                    {marginAnalysis.details?.break_even_price && (
                      <span className="ml-1 text-xs">
                        (+€{(recommendation.recommended_price - marginAnalysis.details.break_even_price).toFixed(2)})
                      </span>
                    )}
                  </span>
                </div>
                
                {marginAnalysis.recommended_margin && marginAnalysis.recommended_margin >= 20 && (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">✅ Über Mindestmarge (20%)</span>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Margin per Unit */}
          {marginAnalysis.details?.margin?.euro && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">Marge pro Verkauf:</p>
              <p className="text-lg font-bold text-green-600">
                €{marginAnalysis.details.margin.euro.toFixed(2)}
              </p>
            </div>
          )}
          
        </div>
      ) : (
        // No margin data available
        <div className="p-6 bg-yellow-50 border-t-2 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">Keine Kostendaten hinterlegt</p>
              <p className="text-sm text-yellow-800 mt-1">
                Hinterlege Produktkosten, um Margen zu berechnen und Preise sicher zu optimieren.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="p-6 bg-gray-50 border-t grid grid-cols-2 gap-3">
        <button
          onClick={onDismiss}
          disabled={isApplying}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 font-medium"
        >
          Dismiss
        </button>
        <button
          onClick={handleApply}
          disabled={isApplying || (hasMarginData && marginAnalysis.warning === 'BELOW_BREAK_EVEN')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
        >
          {isApplying ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Anwenden...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Apply €{recommendation.recommended_price.toFixed(2)}</span>
            </>
          )}
        </button>
      </div>
      
    </div>
  )
}











