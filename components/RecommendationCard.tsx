'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown, RefreshCw, Clock, CheckCircle2, AlertCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import MetricCard from './MetricCard'
import { formatRelativeTime, formatStrategyName, getConfidenceColor, getConfidenceMessage } from '@/lib/recommendationUtils'
import { ConfidenceExplanation } from './ConfidenceExplanation'
import { Recommendation } from '@/lib/types'
import { acceptRecommendation, rejectRecommendation } from '@/lib/api'

interface RecommendationData extends Partial<Recommendation> {
  id: number
  product_id: number
  product_name: string
  current_price: number
  recommended_price: number
  price_change_pct: number
  strategy: string
  confidence: number
  reasoning: string | any
  
  // Metrics
  demand_growth?: number | null
  days_of_stock?: number | null
  sales_7d?: number | null
  competitor_avg_price?: number | null
  
  created_at: string
  applied_at?: string | null
  status?: 'pending' | 'accepted' | 'rejected' | 'applied'
  ml_confidence?: number
  base_confidence?: number
  applied_price?: number | null
}

interface RecommendationCardProps {
  data: RecommendationData
  onRegenerate: () => void
  generating?: boolean
  onApply?: () => void
  onUpdate?: (updated: RecommendationData) => void
}

export default function RecommendationCard({ 
  data, 
  onRegenerate, 
  generating = false,
  onApply,
  onUpdate
}: RecommendationCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const priceChange = data.recommended_price - data.current_price
  const priceChangePct = data.price_change_pct || ((priceChange / data.current_price) * 100)
  const isIncrease = priceChange > 0

  const confidenceLevel = data.confidence >= 0.7 ? 'high' : data.confidence >= 0.5 ? 'medium' : 'low'
  const confidenceColors = {
    high: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-red-100 text-red-800 border-red-200'
  }
  
  // Status colors
  const statusColors = {
    pending: 'bg-blue-100 text-blue-800 border-blue-200',
    accepted: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    applied: 'bg-purple-100 text-purple-800 border-purple-200'
  }
  
  const statusLabels = {
    pending: 'Ausstehend',
    accepted: 'Akzeptiert',
    rejected: 'Abgelehnt',
    applied: 'Angewendet'
  }
  
  // Parse reasoning
  const reasoningObj = typeof data.reasoning === 'string' 
    ? (() => { try { return JSON.parse(data.reasoning) } catch { return {} } })()
    : (data.reasoning || {})
  
  // Sales prediction
  const salesPrediction = reasoningObj?.sales_prediction 
    ? ((reasoningObj.sales_prediction - 1) * 100).toFixed(1)
    : null
  
  // Handlers
  const handleAccept = async () => {
    setIsLoading(true)
    try {
      await acceptRecommendation(data.id)
      if (onUpdate) {
        onUpdate({ ...data, status: 'accepted' })
      }
      toast.success('Recommendation akzeptiert! ✓', {
        description: `Preis: €${data.recommended_price.toFixed(2)} (${data.price_change_pct > 0 ? '+' : ''}${data.price_change_pct.toFixed(1)}%)`
      })
    } catch (error: any) {
      console.error('Failed to accept recommendation:', error)
      toast.error('Fehler beim Akzeptieren', {
        description: error.message || 'Bitte versuche es erneut'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleReject = async () => {
    setIsLoading(true)
    try {
      await rejectRecommendation(data.id)
      if (onUpdate) {
        onUpdate({ ...data, status: 'rejected' })
      }
      toast.warning('Recommendation abgelehnt', {
        description: 'Keine Änderungen werden angewendet'
      })
    } catch (error: any) {
      console.error('Failed to reject recommendation:', error)
      toast.error('Fehler beim Ablehnen', {
        description: error.message || 'Bitte versuche es erneut'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-4xl">
      
      {/* Header: Produkt-Info & Badges */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.product_name}</h3>
          <p className="text-sm text-gray-600">Product ID: {data.product_id}</p>
        </div>
        
        <div className="flex flex-col gap-2 items-end">
          {/* Confidence Badge */}
          <div className={`px-4 py-2 rounded-lg border font-semibold text-sm ${confidenceColors[confidenceLevel]}`}>
            {Math.round(data.confidence * 100)}% Confidence
          </div>
          
          {/* NEW: Status Badge */}
          {data.status && (
            <div className={`px-3 py-1 rounded-lg border text-xs font-semibold ${statusColors[data.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
              {statusLabels[data.status] || data.status}
            </div>
          )}
          
          {/* NEW: Strategy Tag */}
          <div className="px-3 py-1 rounded-lg border text-xs font-medium bg-gray-50 text-gray-700 border-gray-200">
            {formatStrategyName(data.strategy)}
          </div>
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

      {/* Confidence Explanation */}
      <div className="mb-6">
        <ConfidenceExplanation
          confidence={data.confidence}
          competitorCount={data.competitor_avg_price ? 1 : 0}
          salesDataDays={data.sales_7d ? 7 : 0}
        />
      </div>

      {/* NEW: Sales Prediction Display */}
      {salesPrediction && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900">
            Erwartete Verkaufsänderung: {parseFloat(salesPrediction) > 0 ? '+' : ''}{salesPrediction}%
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Basierend auf {reasoningObj?.top_features?.length || 0} ML-Features
          </p>
        </div>
      )}
      
      {/* NEW: Warnings (if any) */}
      {reasoningObj?.warnings && Array.isArray(reasoningObj.warnings) && reasoningObj.warnings.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm font-medium text-yellow-900 mb-2">⚠️ Warnungen:</p>
          <ul className="text-xs text-yellow-700 space-y-1">
            {reasoningObj.warnings.map((warning: string, idx: number) => (
              <li key={idx}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* NEW: ML Confidence Breakdown */}
      {(data.ml_confidence !== undefined || data.base_confidence !== undefined) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-2">Confidence Breakdown:</p>
          <div className="space-y-1 text-xs text-gray-700">
            {data.ml_confidence !== undefined && (
              <p>ML Confidence: {Math.round(data.ml_confidence * 100)}%</p>
            )}
            {data.base_confidence !== undefined && (
              <p>Base Confidence: {Math.round(data.base_confidence * 100)}%</p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mb-4">
        {/* NEW: Accept/Reject Buttons (nur wenn status = pending) */}
        {data.status === 'pending' && (
          <>
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              {isLoading ? 'Lädt...' : 'Akzeptieren'}
            </button>
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
            >
              <X size={18} />
              {isLoading ? 'Lädt...' : 'Ablehnen'}
            </button>
          </>
        )}
        
        {/* Status: Accepted */}
        {data.status === 'accepted' && (
          <button
            disabled
            className="flex-1 px-6 py-3 bg-green-100 text-green-800 rounded-lg border border-green-200 font-semibold flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} />
            ✓ Akzeptiert
          </button>
        )}
        
        {/* Status: Rejected */}
        {data.status === 'rejected' && (
          <button
            disabled
            className="flex-1 px-6 py-3 bg-red-100 text-red-800 rounded-lg border border-red-200 font-semibold flex items-center justify-center gap-2"
          >
            <X size={18} />
            ✗ Abgelehnt
          </button>
        )}
        
        {/* Status: Applied */}
        {data.status === 'applied' && (
          <div className="flex-1 text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm font-medium text-purple-900">
              ✓ Angewendet am {data.applied_at ? new Date(data.applied_at).toLocaleDateString('de-DE') : 'N/A'}
            </p>
            {data.applied_price && (
              <p className="text-xs text-purple-700 mt-1">
                Preis: €{data.applied_price.toFixed(2)}
              </p>
            )}
          </div>
        )}
        
        {/* Apply Button (nur wenn nicht pending) */}
        {onApply && data.status !== 'pending' && (
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
        <span>Erstellt {formatRelativeTime(data.created_at)}</span>
        {data.applied_at && (
          <>
            <span>•</span>
            <span>Angewendet {formatRelativeTime(data.applied_at)}</span>
            {data.applied_price && (
              <>
                <span>•</span>
                <span>Preis: €{data.applied_price.toFixed(2)}</span>
              </>
            )}
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

