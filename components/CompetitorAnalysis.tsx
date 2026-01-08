'use client'

import React, { useState, useEffect } from 'react'
import { searchCompetitors, CompetitorSearchResponse } from '@/lib/api'
import { CompetitorList } from './CompetitorList'
import { generateCompetitorAnalysisTexts } from '@/lib/competitorAnalysisTexts'
import { formatCurrency } from '@/lib/formatters'

interface CompetitorAnalysisProps {
  productId: number
  currentPrice: number
}

// Helper-Funktionen für localStorage
const getStorageKey = (productId: number) => `competitor_analysis_${productId}`

const loadCachedData = (productId: number): CompetitorSearchResponse | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const cached = localStorage.getItem(getStorageKey(productId))
    if (cached) {
      const data = JSON.parse(cached)
      const cacheAge = Date.now() - (data.cached_at || 0)
      const maxAge = 24 * 60 * 60 * 1000 // 24 Stunden
      
      if (cacheAge < maxAge) {
        return data.data
      } else {
        localStorage.removeItem(getStorageKey(productId))
      }
    }
  } catch (error) {
    console.error('Fehler beim Laden aus Cache:', error)
  }
  return null
}

const saveCachedData = (productId: number, data: CompetitorSearchResponse) => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(getStorageKey(productId), JSON.stringify({
      data,
      cached_at: Date.now()
    }))
  } catch (error) {
    console.error('Fehler beim Speichern im Cache:', error)
  }
}

export function CompetitorAnalysis({ productId, currentPrice }: CompetitorAnalysisProps) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CompetitorSearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Lade gecachte Daten beim Mount
  useEffect(() => {
    const cachedData = loadCachedData(productId)
    if (cachedData) {
      setData(cachedData)
    }
  }, [productId])
  
  const handleSearch = async (forceRefresh = false) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await searchCompetitors(productId, { 
        maxResults: 5,
        forceRefresh 
      })
      setData(result)
      saveCachedData(productId, result)
    } catch (err: any) {
      console.error('[CompetitorAnalysis] Fehler beim Laden:', err)
      
      let errorMessage = 'Fehler beim Laden der Wettbewerber-Daten'
      
      if (err?.response?.status === 404) {
        errorMessage = 'Produkt nicht gefunden. Prüfe Shop-Auswahl und Produkt-ID.'
      } else if (err?.response?.status === 429) {
        errorMessage = 'API-Limit erreicht. Bitte später erneut versuchen.'
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server-Fehler. Bitte später erneut versuchen oder Support kontaktieren.'
      } else if (err?.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  // Berechne Metriken aus Daten
  const calculateMetrics = () => {
    if (!data || !data.competitors || data.competitors.length === 0) {
      return null
    }

    const prices = data.competitors.map(c => c.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
    const priceSpread = maxPrice - minPrice
    const yourPriceDiff = currentPrice - avgPrice
    const percentAboveAvg = avgPrice > 0 ? ((currentPrice - avgPrice) / avgPrice) * 100 : 0

    // Gruppiere nach Zustand
    const newOffers = data.competitors.filter(c => {
      const titleLower = (c.title || '').toLowerCase()
      const sourceLower = (c.source || '').toLowerCase()
      return !(
        titleLower.includes('gebraucht') ||
        titleLower.includes('used') ||
        sourceLower.includes('kleinanzeigen') ||
        sourceLower.includes('willhaben')
      ) && !(
        titleLower.includes('refurbished') ||
        titleLower.includes('generalüberholt')
      )
    })

    const usedOffers = data.competitors.filter(c => {
      const titleLower = (c.title || '').toLowerCase()
      const sourceLower = (c.source || '').toLowerCase()
      return (
        titleLower.includes('gebraucht') ||
        titleLower.includes('used') ||
        sourceLower.includes('kleinanzeigen') ||
        sourceLower.includes('willhaben')
      )
    })

    const newMin = newOffers.length > 0 ? Math.min(...newOffers.map(c => c.price)) : null
    const newMax = newOffers.length > 0 ? Math.max(...newOffers.map(c => c.price)) : null
    const usedMin = usedOffers.length > 0 ? Math.min(...usedOffers.map(c => c.price)) : null

    return {
      minPrice,
      maxPrice,
      avgPrice,
      priceSpread,
      yourPriceDiff,
      percentAboveAvg,
      competitorCount: data.competitors.length,
      newCount: newOffers.length,
      usedCount: usedOffers.length,
      newMin,
      newMax,
      usedMin
    }
  }

  const metrics = calculateMetrics()
  const analysisTexts = data ? generateCompetitorAnalysisTexts({
    product_title: data.product_title || '',
    our_price: currentPrice,
    offers: data.competitors.map(c => {
      let condition: 'new' | 'used' | 'refurbished' = 'new'
      const titleLower = (c.title || '').toLowerCase()
      const sourceLower = (c.source || '').toLowerCase()
      
      if (
        titleLower.includes('gebraucht') ||
        titleLower.includes('used') ||
        sourceLower.includes('kleinanzeigen') ||
        sourceLower.includes('willhaben')
      ) {
        condition = 'used'
      } else if (
        titleLower.includes('refurbished') ||
        titleLower.includes('generalüberholt')
      ) {
        condition = 'refurbished'
      }
      
      return {
        source: c.source || 'Unknown',
        title: c.title || '',
        price: c.price,
        rating: c.rating,
        url: c.url || '',
        condition
      }
    }),
    data_age_days: 0
  }) : null

  // Bestimme Datenqualität
  const getDataQuality = () => {
    if (!metrics) return { label: 'Unbekannt', color: 'gray', explanation: '' }
    
    const hasHighSpread = metrics.priceSpread / metrics.avgPrice > 0.4
    const hasFewCompetitors = metrics.competitorCount < 3
    
    if (hasHighSpread || hasFewCompetitors) {
      return {
        label: 'Eingeschränkt zuverlässig',
        color: 'orange',
        explanation: hasHighSpread ? 'sehr hohe Preisstreuung' : 'zu wenig vergleichbare Angebote'
      }
    }
    
    return {
      label: 'Zuverlässig',
      color: 'green',
      explanation: ''
    }
  }

  const dataQuality = getDataQuality()
  
  return (
    <div className="space-y-6">
      {/* HERO: Header mit Aktualisieren-Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>🏢</span>
            Wettbewerbsanalyse
          </h3>
          
          <div className="flex gap-2">
            {data && (
              <button 
                onClick={() => handleSearch(true)}
                disabled={loading}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                🔄 Aktualisieren
              </button>
            )}
            
            <button
              onClick={() => handleSearch(false)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Suche läuft...' : data ? 'Erneut suchen' : 'Wettbewerber suchen'}
            </button>
          </div>
        </div>

        {/* Datenqualität-Warning (falls relevant) */}
        {data && analysisTexts && analysisTexts.dataQuality.includes('eingeschränkt') && (
          <div className="mt-4 p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
            <p className="text-sm font-medium text-orange-900">
              ⚠️ Hinweis: {analysisTexts.dataQuality}
            </p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Suche Wettbewerber-Preise...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="text-sm font-medium mb-1">⚠️ Fehler</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {data && !loading && metrics && (
        <>
          {/* 1. MARKTPOSITION VISUAL */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📊</span>
              DEINE MARKTPOSITION AUF EINEN BLICK
            </h3>
            
            {/* Visual Slider */}
            <div className="bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 rounded-lg p-6 mb-4">
              {/* Price Range Labels */}
              <div className="flex justify-between text-sm mb-3">
                <div>
                  <div className="text-gray-600 mb-1">💶 Günstigster</div>
                  <div className="text-xl font-bold text-green-700">
                    {formatCurrency(metrics.minPrice)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 mb-1">💶 Ø-Preis</div>
                  <div className="text-xl font-bold text-gray-800">
                    {formatCurrency(metrics.avgPrice)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-600 mb-1">💶 Teuerster</div>
                  <div className="text-xl font-bold text-orange-700">
                    {formatCurrency(metrics.maxPrice)}
                  </div>
                </div>
              </div>

              {/* Visual Position Indicator */}
              <div className="relative mt-6">
                <div className="h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full" />
                
                {/* Your Position Marker */}
                <div 
                  className="absolute -top-1 w-5 h-5 bg-red-600 rounded-full border-3 border-white shadow-lg z-10"
                  style={{ 
                    left: `${Math.min(95, Math.max(5, ((currentPrice - metrics.minPrice) / (metrics.maxPrice - metrics.minPrice)) * 100))}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      DU
                    </div>
                  </div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="font-bold text-sm">{formatCurrency(currentPrice)}</div>
                  </div>
                </div>
              </div>

              {/* Percentage Indicator */}
              <div className="text-center mt-8">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800">
                  ⚠️ Du bist {metrics.percentAboveAvg.toFixed(1)}% teurer als der Durchschnitt
                </span>
              </div>
            </div>

            {/* Risk Warning */}
            {metrics.percentAboveAvg > 50 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <h4 className="font-bold text-red-900 mb-1">
                      RISIKO: Du bist teurer als ALLE gefundenen Wettbewerber!
                    </h4>
                    <p className="text-sm text-red-800">
                      Kunden werden wahrscheinlich zur Konkurrenz wechseln.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. MARKTDATEN-ÜBERSICHT */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📈</span>
              MARKTDATEN IM ÜBERBLICK
            </h3>
            
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-700">
                  {metrics.competitorCount}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Gefunden<br/>Anbieter
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-700">
                  {formatCurrency(metrics.avgPrice)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Ø-Preis
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-700">
                  {formatCurrency(metrics.priceSpread)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Preis-<br/>Spanne
                </div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-700">
                  +{formatCurrency(metrics.yourPriceDiff)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Du vs Ø<br/>teurer
                </div>
              </div>
            </div>

            {/* Product Condition Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span>📦</span>
                Produktzustand:
              </h4>
              <ul className="space-y-2 text-sm">
                {metrics.newCount > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">• </span>
                    <span>
                      <strong>Neuware:</strong> {metrics.newCount} Anbieter bieten von{' '}
                      {metrics.newMin && formatCurrency(metrics.newMin)} - {metrics.newMax && formatCurrency(metrics.newMax)}
                    </span>
                  </li>
                )}
                {metrics.usedCount > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-gray-600">• </span>
                    <span>
                      <strong>Gebraucht:</strong> {metrics.usedCount} Anbieter bieten ab{' '}
                      {metrics.usedMin && formatCurrency(metrics.usedMin)}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* 3. WETTBEWERBER-LISTE */}
          <CompetitorList 
            competitors={data.competitors} 
            yourPrice={currentPrice}
          />

          {/* 4. DATENQUALITÄT-BEREICH */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>⚙️</span>
              DATENQUALITÄT & AKTUALITÄT
            </h3>
            
            <div className="flex items-start gap-4">
              <div className={`px-4 py-2 rounded-lg font-medium ${
                dataQuality.color === 'green' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {dataQuality.label === 'Eingeschränkt zuverlässig' ? '⚠️ ' : '✅ '}
                {dataQuality.label}
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-4">
                  Diese Daten sind <strong>heute</strong> aktualisiert worden, zeigen aber{' '}
                  {dataQuality.explanation || 'eine normale Preisstreuung'}.
                </p>
                
                <div className="bg-white rounded-lg border p-4">
                  <h4 className="font-medium mb-2 text-sm">Das bedeutet:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span>- </span>
                      <span>Die Produkte könnten unterschiedliche Varianten sein</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>- </span>
                      <span>Einige Angebote könnten nicht mehr verfügbar sein</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>- </span>
                      <span>Preise können sich schnell ändern</span>
                    </li>
                  </ul>
                </div>
                
                <p className="text-sm text-blue-700 mt-4">
                  💡 <strong>Tipp:</strong> Nutze "Aktualisieren" um die neuesten Preise 
                  zu laden. Die Daten werden automatisch alle 24h erneuert.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Initial State (keine Daten) */}
      {!data && !loading && !error && (
        <div className="text-center py-8 text-gray-500">
          <p>Noch keine Wettbewerber-Daten geladen.</p>
          <p className="text-sm mt-2">Klicke auf "Wettbewerber suchen" um zu starten.</p>
        </div>
      )}
    </div>
  )
}
