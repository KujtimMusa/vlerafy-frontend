'use client'

import { ArrowUp, ArrowDown, RefreshCw, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import MetricCard from './MetricCard'
import { formatRelativeTime, formatStrategyName, getConfidenceColor, getConfidenceMessage } from '@/lib/recommendationUtils'

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
  
  created_at: string
  applied_at?: string | null
}

interface RecommendationCardProps {
  data: RecommendationData
  onRegenerate: () => void
  generating?: boolean
  onApply?: () => void
}

export default function RecommendationCard({ 
  data, 
  onRegenerate, 
  generating = false,
  onApply 
}: RecommendationCardProps) {
  
  const priceChange = data.recommended_price - data.current_price
  const priceChangePct = data.price_change_pct || ((priceChange / data.current_price) * 100)
  const isIncrease = priceChange > 0

  const confidenceLevel = data.confidence >= 0.7 ? 'high' : data.confidence >= 0.5 ? 'medium' : 'low'
  const confidenceColors = {
    high: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-red-100 text-red-800 border-red-200'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-4xl">
      
      {/* Header: Produkt-Info & Confidence Badge */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.product_name}</h3>
          <p className="text-sm text-gray-600">Product ID: {data.product_id}</p>
        </div>
        
        {/* Confidence Badge */}
        <div className={`px-4 py-2 rounded-lg border font-semibold text-sm ${confidenceColors[confidenceLevel]}`}>
          {confidenceLevel === 'high' && '✓ High Confidence'}
          {confidenceLevel === 'medium' && '⚠️ Medium Confidence'}
          {confidenceLevel === 'low' && '❌ Low Confidence'}
        </div>
      </div>

      {/* Pricing Change Visualization */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-3 gap-6 items-center">
          
          {/* Current Price */}
          <div className="text-center bg-white rounded-lg p-6 border-2 border-gray-200">
            <span className="text-sm font-medium text-gray-600 block mb-2">Current Price</span>
            <span className="text-3xl font-bold text-gray-900">€{data.current_price.toFixed(2)}</span>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            {isIncrease ? (
              <ArrowUp className="text-green-600" size={40} />
            ) : (
              <ArrowDown className="text-red-600" size={40} />
            )}
          </div>

          {/* Recommended Price */}
          <div className={`text-center bg-white rounded-lg p-6 border-2 ${
            isIncrease ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
          }`}>
            <span className="text-sm font-medium text-gray-600 block mb-2">Recommended Price</span>
            <span className="text-3xl font-bold text-gray-900 block mb-1">
              €{data.recommended_price.toFixed(2)}
            </span>
            <span className={`text-lg font-semibold ${
              isIncrease ? 'text-green-600' : 'text-red-600'
            }`}>
              {isIncrease ? '+' : ''}{priceChangePct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Price Change Summary */}
        <div className="mt-4 text-center">
          {isIncrease ? (
            <span className="text-green-700 font-medium">
              💰 Increase by €{priceChange.toFixed(2)} per unit
            </span>
          ) : (
            <span className="text-red-700 font-medium">
              📉 Decrease by €{Math.abs(priceChange).toFixed(2)} per unit
            </span>
          )}
        </div>
      </div>

      {/* Strategy & Reasoning */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{getStrategyIcon(data.strategy)}</span>
          <span className="font-semibold text-gray-900">{formatStrategyName(data.strategy)}</span>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-700 leading-relaxed">
            {typeof data.reasoning === 'string' 
              ? data.reasoning 
              : typeof data.reasoning === 'object' && data.reasoning !== null
                ? ((data.reasoning as any)?.summary || (data.reasoning as any)?.reasoning || JSON.stringify(data.reasoning, null, 2))
                : 'No reasoning provided.'}
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon="📈"
          label="Demand Growth"
          value={data.demand_growth !== null && data.demand_growth !== undefined 
            ? `${data.demand_growth > 0 ? '+' : ''}${(data.demand_growth * 100).toFixed(1)}%`
            : 'N/A'
          }
          status={data.demand_growth !== null && data.demand_growth !== undefined
            ? (data.demand_growth > 0.2 ? 'good' : data.demand_growth < -0.1 ? 'bad' : 'neutral')
            : 'neutral'
          }
        />
        
        <MetricCard
          icon="📦"
          label="Days of Stock"
          value={data.days_of_stock !== null && data.days_of_stock !== undefined
            ? data.days_of_stock.toFixed(1)
            : 'N/A'
          }
          status={data.days_of_stock !== null && data.days_of_stock !== undefined
            ? (data.days_of_stock < 15 ? 'warning' : 'good')
            : 'neutral'
          }
        />
        
        <MetricCard
          icon="🛒"
          label="Sales (7d)"
          value={data.sales_7d !== null && data.sales_7d !== undefined
            ? data.sales_7d.toString()
            : 'N/A'
          }
        />
        
        {data.competitor_avg_price !== null && data.competitor_avg_price !== undefined && (
          <MetricCard
            icon="🏪"
            label="Market Avg"
            value={`€${data.competitor_avg_price.toFixed(2)}`}
            status={data.current_price > data.competitor_avg_price ? 'warning' : 'good'}
          />
        )}
      </div>

      {/* Confidence Bar */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Confidence Level</span>
          <span className={`text-sm font-bold ${getConfidenceColor(data.confidence)}`}>
            {(data.confidence * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all ${
              data.confidence >= 0.7 ? 'bg-green-600' :
              data.confidence >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${data.confidence * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-600">
          {getConfidenceMessage(data.confidence)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-4">
        {onApply && (
          <button
            onClick={onApply}
            disabled={data.confidence < 0.5}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} />
            Apply Recommendation
          </button>
        )}
        
        <button
          onClick={onRegenerate}
          disabled={generating}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} className={generating ? 'animate-spin' : ''} />
          {generating ? 'Generating...' : 'Regenerate'}
        </button>
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-200">
        <Clock size={14} />
        <span>Generated {formatRelativeTime(data.created_at)}</span>
        {data.applied_at && (
          <>
            <span>•</span>
            <span>Applied {formatRelativeTime(data.applied_at)}</span>
          </>
        )}
      </div>
    </div>
  )
}

function getStrategyIcon(strategy: string): string {
  const icons: Record<string, string> = {
    demand_based: '📈',
    cost_based: '💰',
    competitive: '🏪',
    inventory_low: '⚠️',
    value_based: '💎',
    inventory: '📦',
    demand: '📊'
  }
  return icons[strategy] || '📊'
}

