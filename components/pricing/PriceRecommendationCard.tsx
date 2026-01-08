'use client'

import React, { useState } from 'react'
import { ConfidenceIndicator } from './ConfidenceIndicator'
import { ActionButtons } from './ActionButtons'
import { formatCurrency } from '@/lib/formatters'

interface PriceRecommendationCardProps {
  recommendation: {
    product_id?: number
    product_name?: string
    current_price: number
    recommended_price: number
    price_change?: number
    price_change_pct: number
    confidence: number
    reasoning?: string
    strategy_details?: any[]
    competitor_data?: any
    margin_analysis?: any
    created_at?: string
    generated_at?: string
    confidence_basis?: any
  }
  onApply?: (price: number) => Promise<void>
  onDismiss?: () => void
  onRefresh?: () => void
}

export function PriceRecommendationCard({
  recommendation,
  onApply,
  onDismiss,
  onRefresh
}: PriceRecommendationCardProps) {
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = async () => {
    if (!onApply) return
    setIsApplying(true)
    try {
      await onApply(recommendation.recommended_price)
    } catch (error) {
      console.error('Error applying recommendation:', error)
    } finally {
      setIsApplying(false)
    }
  }

  const priceChange = recommendation.price_change || (recommendation.recommended_price - recommendation.current_price)
  const isIncrease = priceChange > 0
  const isDecrease = priceChange < 0

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {recommendation.product_name || 'Produkt'}
          </h2>
          <ConfidenceIndicator 
            confidence={recommendation.confidence}
            compact={true}
            confidenceBasis={recommendation.confidence_basis}
          />
        </div>

        {/* Price Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Aktuell</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(recommendation.current_price)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-300">
            <div className="text-sm text-gray-600 mb-1">Empfohlen</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(recommendation.recommended_price)}
            </div>
          </div>
        </div>

        {/* Price Change Badge */}
        <div className="flex items-center gap-2">
          <div className={`px-4 py-2 rounded-lg font-bold ${
            isIncrease ? 'bg-green-100 text-green-700' :
            isDecrease ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {isIncrease ? '+' : ''}{formatCurrency(priceChange)} ({isIncrease ? '+' : ''}{recommendation.price_change_pct.toFixed(1)}%)
          </div>
        </div>
      </div>

      {/* Confidence Box */}
      <div className="mt-6 px-6">
        <ConfidenceIndicator
          confidence={recommendation.confidence}
          reasoning={recommendation.reasoning}
          compact={false}
          confidenceBasis={recommendation.confidence_basis}
        />
      </div>

      {/* Action Buttons */}
      {(onApply || onDismiss) && (
        <div className="p-6 border-t border-gray-200">
          <ActionButtons
            recommendedPrice={recommendation.recommended_price}
            onApply={handleApply}
            onDismiss={onDismiss || (() => {})}
            isApplying={isApplying}
            isDisabled={false}
            marginAnalysis={recommendation.margin_analysis}
          />
        </div>
      )}
    </div>
  )
}
