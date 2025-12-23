'use client'

/**
 * Margin Health Dashboard Widget
 * Shows overview of margin health across all products
 */

import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Package, Loader2 } from 'lucide-react'
import { getMarginHealthOverview, MarginHealthData } from '@/lib/api'

interface MarginHealthDashboardProps {
  shopId: string
  onViewDetails?: () => void
}

export function MarginHealthDashboard({
  shopId,
  onViewDetails
}: MarginHealthDashboardProps) {
  
  const [data, setData] = useState<MarginHealthData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    loadHealthData()
  }, [shopId])
  
  const loadHealthData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const healthData = await getMarginHealthOverview()
      setData(healthData)
    } catch (err) {
      console.error('Error loading margin health:', err)
      setError('Fehler beim Laden der Margin-Übersicht')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-3" />
          <p className="text-gray-600">Lade Margin-Daten...</p>
        </div>
      </div>
    )
  }
  
  if (error || !data) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle className="w-6 h-6" />
          <p>{error || 'Keine Daten verfügbar'}</p>
        </div>
      </div>
    )
  }
  
  const totalProducts = data.healthy + data.moderate + data.low + data.negative + data.no_costs
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          📊 Margin Health Overview
        </h2>
        <p className="text-sm text-gray-600">
          {data.total_products_with_costs} Produkte mit Kostendaten
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6">
        
        {/* Healthy */}
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-700">Gesund</span>
          </div>
          <p className="text-3xl font-bold text-green-900">{data.healthy}</p>
          <p className="text-xs text-green-600 mt-1">&gt;30% Marge</p>
        </div>
        
        {/* Moderate */}
        <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-sm font-medium text-yellow-700">Mittel</span>
          </div>
          <p className="text-3xl font-bold text-yellow-900">{data.moderate}</p>
          <p className="text-xs text-yellow-600 mt-1">15-30% Marge</p>
        </div>
        
        {/* Low */}
        <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <span className="text-sm font-medium text-orange-700">Niedrig</span>
          </div>
          <p className="text-3xl font-bold text-orange-900">{data.low}</p>
          <p className="text-xs text-orange-600 mt-1">&lt;15% Marge</p>
        </div>
        
        {/* Negative */}
        <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-sm font-medium text-red-700">Negativ</span>
          </div>
          <p className="text-3xl font-bold text-red-900">{data.negative}</p>
          <p className="text-xs text-red-600 mt-1">Verlust!</p>
        </div>
        
        {/* No Costs */}
        <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-sm font-medium text-gray-700">Keine Kosten</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.no_costs}</p>
          <p className="text-xs text-gray-600 mt-1">Nicht erfasst</p>
        </div>
        
      </div>
      
      {/* Critical Products */}
      {data.critical_products && data.critical_products.length > 0 && (
        <div className="p-6 border-t bg-red-50">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">
              Kritische Produkte ({data.critical_products.length})
            </h3>
          </div>
          
          <div className="space-y-2">
            {data.critical_products.slice(0, 5).map((product, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {product.title || `Product ${product.product_id}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    €{product.current_price?.toFixed(2) || 'N/A'}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className={`text-lg font-bold ${
                    product.margin_percent < 0 ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {product.margin_percent?.toFixed(1) || '0'}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.health_status === 'negative' ? 'Verlust' : 'Niedrig'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer */}
      {onViewDetails && (
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onViewDetails}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Details anzeigen
          </button>
        </div>
      )}
      
    </div>
  )
}

