'use client'

import React from 'react'
import { formatCurrency } from '@/lib/formatters'

interface CompetitorPositionSliderProps {
  competitorData: {
    avg: number
    min: number
    max: number
    prices: Array<{
      source: string
      price: number
    }>
  }
  yourPrice: number
}

export function CompetitorPositionSlider({
  competitorData,
  yourPrice
}: CompetitorPositionSliderProps) {
  
  const { min, max, avg, prices } = competitorData
  
  // Calculate position percentage
  const range = max - min
  const yourPosition = range > 0 ? ((yourPrice - min) / range) * 100 : 50
  
  // Determine position label
  const positionLabel = 
    yourPrice <= min ? 'Cheapest' :
    yourPrice >= max ? 'Most expensive' :
    yourPrice < avg ? 'Below average' :
    yourPrice > avg ? 'Above average' :
    'Market average'
  
  // Sort competitors by price
  const sortedCompetitors = [...prices].sort((a, b) => a.price - b.price)
  
  return (
    <div className="space-y-4">
      
      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
        <span>🏪</span>
        <span>Market Comparison</span>
      </h4>
      
      {/* Visual Slider */}
      <div className="relative pt-2 pb-6">
        
        {/* Track */}
        <div className="relative h-3 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-full">
          
          {/* Average marker */}
          {range > 0 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 bg-gray-400 h-full"
              style={{ left: `${((avg - min) / range) * 100}%` }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap">
                Ø
              </div>
            </div>
          )}
          
          {/* Your position marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
            style={{ left: `${Math.max(5, Math.min(95, yourPosition))}%` }}
          >
            <div className="relative">
              <div className="w-6 h-6 bg-blue-600 border-4 border-white rounded-full shadow-lg" />
              <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                  You: {formatCurrency(yourPrice)}
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Range labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span className="font-medium">
            Cheapest: {formatCurrency(min)}
          </span>
          <span className="font-medium">
            Most: {formatCurrency(max)}
          </span>
        </div>
        
      </div>
      
      {/* Position description */}
      <div className="text-center">
        <p className="text-sm font-semibold text-rose-600 mb-1">
          Your position: <span className="font-bold">{positionLabel}</span>
        </p>
        <p className="text-xs text-gray-500">
          Market average: {formatCurrency(avg)}
        </p>
      </div>
      
      {/* Competitor list */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Competitors:
        </p>
        <div className="space-y-1.5">
          {sortedCompetitors.slice(0, 5).map((competitor, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between text-sm py-1.5 px-3 bg-white rounded border border-purple-100"
            >
              <span className="text-gray-700 font-medium">
                • {competitor.source}
              </span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(competitor.price)}
              </span>
              {competitor.price === min && (
                <span className="ml-2 text-xs text-green-600 font-medium">
                  (cheapest)
                </span>
              )}
              {competitor.price === max && (
                <span className="ml-2 text-xs text-red-600 font-medium">
                  (most expensive)
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}






