'use client'

import React from 'react'

interface MVPConfidenceBreakdownProps {
  breakdown: {
    data_richness: number
    market_intelligence: number
    model_confidence: number
    product_maturity: number
    content_quality: number
  }
  details?: any
  overallConfidence?: number
  confidenceLabel?: string
}

// Tier order and labels with weights
const tiers = [
  { key: 'data_richness', label: 'Data Richness', weight: 35, color: 'bg-blue-500' },
  { key: 'market_intelligence', label: 'Market Intelligence', weight: 30, color: 'bg-green-500' },
  { key: 'product_maturity', label: 'Product Maturity', weight: 15, color: 'bg-purple-500' },
  { key: 'model_confidence', label: 'Model Confidence', weight: 10, color: 'bg-yellow-500' },
  { key: 'content_quality', label: 'Content Quality', weight: 10, color: 'bg-pink-500' },
]

export function MVPConfidenceBreakdown({ 
  breakdown, 
  details, 
  overallConfidence,
  confidenceLabel 
}: MVPConfidenceBreakdownProps) {
  if (!breakdown) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">MVP Confidence Breakdown (v2.0)</h4>
          <p className="text-xs text-gray-600 mt-1">
            Product-specific confidence scoring
          </p>
        </div>
        {overallConfidence !== undefined && (
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {(overallConfidence * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">
              {confidenceLabel || 'Overall'}
            </div>
          </div>
        )}
      </div>

      {/* Tier Breakdown */}
      <div className="space-y-3">
        {tiers.map(tier => {
          const score = breakdown[tier.key as keyof typeof breakdown] || 0
          const scorePercent = (score * 100).toFixed(1)
          const contribution = (score * tier.weight / 100).toFixed(1)
          
          return (
            <div key={tier.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${tier.color}`} />
                  <span className="font-medium text-gray-700">
                    {tier.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({tier.weight}%)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    Contribution: {contribution}%
                  </span>
                  <span className="font-semibold text-gray-900">
                    {scorePercent}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${tier.color}`}
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Details (if available) */}
      {details && (
        <details className="mt-4">
          <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
            View Detailed Breakdown
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        </details>
      )}
    </div>
  )
}
