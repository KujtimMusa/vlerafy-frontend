'use client'

import React from 'react'
import { TrendingUp, Store, Package, DollarSign, Info } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/formatters'

interface DetailedBreakdownProps {
  strategyDetails: Array<{
    strategy: string
    recommended_price: number
    confidence: number
    reasoning: string
    weight?: number
    competitor_context?: any
  }>
  marginAnalysis?: {
    is_safe: boolean
    margin: number
    warning: string | null
    message: string
    details?: any
  } | null
  competitorData?: {
    avg: number
    min: number
    max: number
    prices: Array<{
      source: string
      price: number
      title?: string
      url?: string
    }>
  } | null
}

export function DetailedBreakdown({
  strategyDetails,
  marginAnalysis,
  competitorData
}: DetailedBreakdownProps) {
  
  const strategyConfig: Record<string, { icon: any; label: string; color: string; defaultWeight: number }> = {
    demand: {
      icon: TrendingUp,
      label: 'Demand Strategy',
      color: 'blue',
      defaultWeight: 40
    },
    inventory: {
      icon: Package,
      label: 'Inventory Strategy',
      color: 'orange',
      defaultWeight: 25
    },
    competitive: {
      icon: Store,
      label: 'Competitive Strategy',
      color: 'purple',
      defaultWeight: 35
    },
    cost: {
      icon: DollarSign,
      label: 'Cost Strategy',
      color: 'green',
      defaultWeight: 30
    }
  }
  
  return (
    <div className="space-y-6">
      
      {/* Strategy Breakdown */}
      {strategyDetails && strategyDetails.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            <span>Strategy Breakdown</span>
          </h4>
          
          <div className="space-y-4">
            {strategyDetails.map((strategy, idx) => {
              const config = strategyConfig[strategy.strategy] || {
                icon: Info,
                label: strategy.strategy.replace('_', ' '),
                color: 'gray',
                defaultWeight: 0
              }
              
              const Icon = config.icon
              const weight = strategy.weight || config.defaultWeight
              const colorClass = config.color
              
              // Map color to Tailwind classes
              const colorMap: Record<string, { bg: string; border: string; text: string; textDark: string }> = {
                blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', textDark: 'text-blue-700' },
                orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', textDark: 'text-orange-700' },
                purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', textDark: 'text-purple-700' },
                green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', textDark: 'text-green-700' },
                gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', textDark: 'text-gray-700' }
              }
              
              const colors = colorMap[colorClass] || colorMap.gray
              
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 bg-white rounded-lg ${colors.text}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-gray-900">
                          {config.label}
                        </h5>
                        {weight > 0 && (
                          <span className={`text-sm font-medium ${colors.textDark}`}>
                            {weight}% weight
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div>
                          <span className="text-gray-600">Price:</span>
                          <span className="font-semibold text-gray-900 ml-2">
                            {formatCurrency(strategy.recommended_price)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Confidence:</span>
                          <span className="font-semibold text-gray-900 ml-2">
                            {Math.round(strategy.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700">
                        {strategy.reasoning}
                      </p>
                      
                      {/* Additional context for competitive strategy */}
                      {strategy.strategy === 'competitive' && strategy.competitor_context && (
                        <div className="mt-3 pt-3 border-t border-purple-200">
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <p className="text-gray-600">Min</p>
                              <p className="font-semibold">
                                {formatCurrency(strategy.competitor_context.min_price || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Average</p>
                              <p className="font-semibold">
                                {formatCurrency(strategy.competitor_context.avg_price || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Max</p>
                              <p className="font-semibold">
                                {formatCurrency(strategy.competitor_context.max_price || 0)}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            Position: <span className="font-medium">
                              {strategy.competitor_context.position?.replace('_', ' ') || 'unknown'}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Margin Analysis Details */}
      {marginAnalysis && marginAnalysis.details && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            <span>Margin Analysis</span>
          </h4>
          
          <div className={`p-4 border-2 rounded-lg ${
            marginAnalysis.is_safe 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              
              {marginAnalysis.details.selling_price && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Selling Price</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(marginAnalysis.details.selling_price)}
                  </p>
                </div>
              )}
              
              {marginAnalysis.details.net_revenue && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Net Revenue</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(marginAnalysis.details.net_revenue)}
                  </p>
                </div>
              )}
              
              {marginAnalysis.details.costs?.total_variable && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Variable Costs</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(marginAnalysis.details.costs.total_variable)}
                  </p>
                </div>
              )}
              
              <div>
                <p className="text-xs text-gray-600 mb-1">Margin</p>
                <p className={`text-lg font-bold ${
                  marginAnalysis.is_safe ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(marginAnalysis.details.margin?.euro || 0)}
                  <span className="text-sm ml-1">
                    ({marginAnalysis.margin?.toFixed(1)}%)
                  </span>
                </p>
              </div>
              
            </div>
            
            {/* Cost Breakdown */}
            {marginAnalysis.details.costs && (
              <div className="pt-3 border-t border-green-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Cost Breakdown:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {marginAnalysis.details.costs.purchase !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase:</span>
                      <span className="font-medium">
                        {formatCurrency(marginAnalysis.details.costs.purchase)}
                      </span>
                    </div>
                  )}
                  {marginAnalysis.details.costs.shipping !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">
                        {formatCurrency(marginAnalysis.details.costs.shipping)}
                      </span>
                    </div>
                  )}
                  {marginAnalysis.details.costs.packaging !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Packaging:</span>
                      <span className="font-medium">
                        {formatCurrency(marginAnalysis.details.costs.packaging)}
                      </span>
                    </div>
                  )}
                  {marginAnalysis.details.costs.payment_fee !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Fee:</span>
                      <span className="font-medium">
                        {formatCurrency(marginAnalysis.details.costs.payment_fee)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Reference Prices */}
            {(marginAnalysis.details.break_even_price || marginAnalysis.details.recommended_min_price) && (
              <div className="mt-3 pt-3 border-t border-green-200 grid grid-cols-2 gap-3 text-sm">
                {marginAnalysis.details.break_even_price && (
                  <div>
                    <span className="text-gray-600">Break-even:</span>
                    <span className="font-semibold text-gray-900 ml-2">
                      {formatCurrency(marginAnalysis.details.break_even_price)}
                    </span>
                  </div>
                )}
                {marginAnalysis.details.recommended_min_price && (
                  <div>
                    <span className="text-gray-600">Min. recommended:</span>
                    <span className="font-semibold text-green-600 ml-2">
                      {formatCurrency(marginAnalysis.details.recommended_min_price)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Full Competitor List */}
      {competitorData && competitorData.prices && competitorData.prices.length > 5 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            All Competitors ({competitorData.prices.length})
          </h4>
          
          <div className="space-y-2">
            {competitorData.prices
              .sort((a, b) => a.price - b.price)
              .map((competitor, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {idx + 1}. {competitor.source}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(competitor.price)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {/* Debug: Raw Data (optional, for developers) */}
      <details className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
          🔧 Show raw data (for developers)
        </summary>
        <pre className="mt-3 p-3 bg-white rounded border border-gray-300 text-xs overflow-x-auto">
          {JSON.stringify({ strategyDetails, marginAnalysis, competitorData }, null, 2)}
        </pre>
      </details>
      
    </div>
  )
}

