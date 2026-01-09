'use client'

import React, { useState, useEffect } from 'react'
import { searchCompetitors, CompetitorSearchResponse } from '@/lib/api'
import { formatCurrency } from '@/lib/formatters'
import {
  ShoppingCart,
  RefreshCw,
  Search,
  BarChart,
  MapPin,
  AlertTriangle,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Flame,
  CheckCircle2,
  Lightbulb
} from 'lucide-react'

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

// Helper: Bestimme Produktzustand
const getCondition = (competitor: any): 'new' | 'used' | 'refurbished' => {
  const titleLower = (competitor.title || '').toLowerCase()
  const sourceLower = (competitor.source || '').toLowerCase()
  
  if (
    titleLower.includes('gebraucht') ||
    titleLower.includes('used') ||
    sourceLower.includes('kleinanzeigen') ||
    sourceLower.includes('willhaben')
  ) {
    return 'used'
  } else if (
    titleLower.includes('refurbished') ||
    titleLower.includes('generalüberholt')
  ) {
    return 'refurbished'
  }
  return 'new'
}

export function CompetitorAnalysis({ productId, currentPrice }: CompetitorAnalysisProps) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CompetitorSearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'used' | 'refurbished'>('all')
  
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
    const newOffers = data.competitors.filter(c => getCondition(c) === 'new')
    const usedOffers = data.competitors.filter(c => getCondition(c) === 'used')
    const refurbishedOffers = data.competitors.filter(c => getCondition(c) === 'refurbished')

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
      refurbishedCount: refurbishedOffers.length,
      newMin,
      newMax,
      usedMin
    }
  }

  const metrics = calculateMetrics()
  
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
  
  // Berechne Position auf Scale (0-100%)
  const getYourPricePosition = () => {
    if (!metrics) return 100
    const range = metrics.maxPrice - metrics.minPrice
    if (range === 0) return 100
    const position = ((currentPrice - metrics.minPrice) / range) * 100
    return Math.min(100, Math.max(0, position))
  }

  // Filtere und sortiere Competitors
  const filteredCompetitors = data?.competitors ? data.competitors.filter(comp => {
    if (filter === 'all') return true
    return getCondition(comp) === filter
  }).sort((a, b) => a.price - b.price) : []

  // Zähle nach Zustand
  const newCount = data?.competitors ? data.competitors.filter(c => getCondition(c) === 'new').length : 0
  const refurbishedCount = data?.competitors ? data.competitors.filter(c => getCondition(c) === 'refurbished').length : 0

  // Loading State
  if (loading) {
    return (
      <div className="competitor-content">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Suche Wettbewerber-Preise...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="competitor-content">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="text-sm font-medium mb-1">⚠️ Fehler</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  // Initial State
  if (!data) {
    return (
      <div className="competitor-content">
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">Noch keine Wettbewerber-Daten geladen.</p>
          <button
            onClick={() => handleSearch(false)}
            className="btn-search"
          >
            <Search className="h-4 w-4" />
            Wettbewerber suchen
          </button>
        </div>
      </div>
    )
  }

  // Results
  if (!metrics) {
    return (
      <div className="competitor-content">
        <div className="text-center py-8 text-gray-500">
          <p>Keine Wettbewerber-Daten verfügbar.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="competitor-content">
      
      {/* Header with Actions */}
      <div className="competitor-header">
        <div className="competitor-title-row">
          <div className="competitor-icon-main">
            <ShoppingCart className="h-7 w-7 text-white" />
          </div>
          <h3 className="competitor-title">Wettbewerbsanalyse</h3>
        </div>
        
        <div className="competitor-actions">
          {data && (
            <button 
              className="btn-refresh"
              onClick={() => handleSearch(true)}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
              Aktualisieren
            </button>
          )}
          <button
            className="btn-search"
            onClick={() => handleSearch(false)}
            disabled={loading}
          >
            <Search className="h-4 w-4" />
            Erneut suchen
          </button>
        </div>
      </div>

      {/* Price Position Visualization - HERO */}
      <div className="price-position-hero">
        <div className="price-position-header">
          <div className="price-position-icon">
            <BarChart className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="price-position-title">
            📊 Deine Marktposition auf einen Blick
          </h4>
        </div>
        
        {/* Price Scale */}
        <div className="price-scale-container">
          {/* Labels */}
          <div className="price-scale-labels">
            <div className="price-scale-label cheapest">
              <div className="price-scale-label-icon">💰</div>
              <div className="price-scale-label-text">Günstigster</div>
              <div className="price-scale-value">{formatCurrency(metrics.minPrice)}</div>
            </div>
            
            <div className="price-scale-label average">
              <div className="price-scale-label-icon">⚖️</div>
              <div className="price-scale-label-text">Ø-Preis</div>
              <div className="price-scale-value">{formatCurrency(metrics.avgPrice)}</div>
            </div>
            
            <div className="price-scale-label expensive">
              <div className="price-scale-label-icon">💸</div>
              <div className="price-scale-label-text">Teuerster</div>
              <div className="price-scale-value">{formatCurrency(metrics.maxPrice)}</div>
            </div>
          </div>
          
          {/* Gradient Bar with Marker */}
          <div className="price-scale-bar">
            {/* Your Price Marker */}
            <div className="your-price-marker" style={{ left: `${getYourPricePosition()}%` }}>
              <div className="price-marker-pin">
                <MapPin className="price-marker-icon" />
              </div>
              <div className="price-marker-label">
                DU
              </div>
            </div>
          </div>
        </div>
        
        {/* Warning Box */}
        {metrics.percentAboveAvg > 50 && (
          <div className="price-position-warning">
            <AlertTriangle className="warning-icon" />
            <div className="warning-content">
              <h4>⚠️ Du bist {metrics.percentAboveAvg.toFixed(1)}% teurer als der Durchschnitt</h4>
              <p>
                Kunden werden wahrscheinlich zur Konkurrenz wechseln.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Market Stats Grid */}
      <div className="market-stats-grid">
        <div className="stat-box competitors">
          <div className="stat-box-label">
            <Users className="stat-box-icon" />
            <span>Gefundene Anbieter</span>
          </div>
          <div className="stat-box-value">{metrics.competitorCount}</div>
        </div>
        
        <div className="stat-box average-price">
          <div className="stat-box-label">
            <DollarSign className="stat-box-icon" />
            <span>Ø-Preis</span>
          </div>
          <div className="stat-box-value">{formatCurrency(metrics.avgPrice)}</div>
        </div>
        
        <div className="stat-box price-range">
          <div className="stat-box-label">
            <TrendingUp className="stat-box-icon" />
            <span>Preis-Spanne</span>
          </div>
          <div className="stat-box-value">{formatCurrency(metrics.priceSpread)}</div>
        </div>
        
        <div className="stat-box your-position">
          <div className="stat-box-label">
            <AlertCircle className="stat-box-icon" />
            <span>Du vs Ø teurer</span>
          </div>
          <div className="stat-box-value">+{formatCurrency(metrics.yourPriceDiff)}</div>
        </div>
      </div>

      {/* Product Status */}
      {metrics.newCount > 0 && (
        <div className="product-status-box">
          <div className="status-row">
            <span className="status-label">📦 Produktzustand:</span>
            <span className="status-value">
              Neuware: {metrics.newCount} Anbieter bieten von{' '}
              {metrics.newMin && formatCurrency(metrics.newMin)} - {metrics.newMax && formatCurrency(metrics.newMax)}
            </span>
          </div>
        </div>
      )}

      {/* Competitors List Header */}
      <div className="competitors-section-header">
        <div className="competitors-section-title">
          <div className="competitors-section-icon">
            <Flame className="h-4 w-4 text-white" />
          </div>
          <span>🔥 {metrics.competitorCount} Wettbewerber im Vergleich</span>
        </div>
        
        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Alle
          </button>
          {newCount > 0 && (
            <button 
              className={`filter-tab ${filter === 'new' ? 'active' : ''}`}
              onClick={() => setFilter('new')}
            >
              Nur Neuware ({newCount})
            </button>
          )}
          {refurbishedCount > 0 && (
            <button 
              className={`filter-tab ${filter === 'refurbished' ? 'active' : ''}`}
              onClick={() => setFilter('refurbished')}
            >
              Nur Refurbished ({refurbishedCount})
            </button>
          )}
        </div>
      </div>

      {/* Competitors Cards */}
      <div className="competitors-list">
        {filteredCompetitors.map((competitor, idx) => {
          const condition = getCondition(competitor)
          const priceDiff = currentPrice - competitor.price
          const priceDiffPct = competitor.price > 0 ? (priceDiff / competitor.price) * 100 : 0
          const isCheapest = idx === 0
          const isExpensive = idx === filteredCompetitors.length - 1
          
          // Avatar basierend auf Position
          let avatarClass = 'avatar-gray'
          let avatarEmoji = '🟢'
          if (isCheapest) {
            avatarClass = 'avatar-gray'
            avatarEmoji = '🟢'
          } else if (isExpensive) {
            avatarClass = 'avatar-gray'
            avatarEmoji = '🔴'
          } else {
            avatarClass = 'avatar-gold'
            avatarEmoji = '🟡'
          }
          
          return (
            <div key={idx} className="competitor-card">
              <div className={`competitor-rank ${isCheapest ? 'cheapest' : isExpensive ? 'expensive' : ''}`}>
                {isCheapest ? '#1' : isExpensive ? 'TEUER' : `#${idx + 1}`}
              </div>
              
              <div className="competitor-card-content">
                <div className="competitor-merchant-row">
                  <div className={`competitor-avatar ${avatarClass}`}>
                    {avatarEmoji}
                  </div>
                  
                  <div className="competitor-info">
                    <div className="competitor-name">{competitor.source || 'Unbekannt'}</div>
                    <div className="competitor-product">
                      {competitor.title || 'Kein Titel verfügbar'}
                    </div>
                    <div className="competitor-badges">
                      {competitor.rating && (
                        <span className="competitor-badge badge-rating">
                          ⭐ {competitor.rating.toFixed(1)} Sterne
                        </span>
                      )}
                      {condition === 'new' && (
                        <span className="competitor-badge badge-new">
                          Neuware
                        </span>
                      )}
                      {condition === 'refurbished' && (
                        <span className="competitor-badge badge-refurbished">
                          Refurbished
                        </span>
                      )}
                      {condition === 'used' && (
                        <span className="competitor-badge badge-condition">
                          Gebraucht
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="competitor-price">{formatCurrency(competitor.price)}</div>
                </div>
                
                <div className="competitor-price-section">
                  <div className="competitor-savings">
                    <TrendingDown className="competitor-savings-icon" />
                    <span>
                      {formatCurrency(Math.abs(priceDiff))} günstiger als du ({priceDiffPct > 0 ? '-' : '+'}{Math.abs(priceDiffPct).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Data Quality Footer */}
      <div className="data-quality-footer">
        <div className="data-quality-icon">
          <CheckCircle2 className="h-5 w-5 text-white" />
        </div>
        
        <div className="data-quality-content">
          <div className="data-quality-title">
            📊 DATENQUALITÄT & AKTUALITÄT
          </div>
          <div className="data-quality-text">
            <strong>{dataQuality.label === 'Eingeschränkt zuverlässig' ? '⚠️ ' : '✅ '}{dataQuality.label}</strong> | 
            Diese Daten sind <strong>heute</strong> aktualisiert worden, zeigen aber {dataQuality.explanation || 'eine normale Preisstreuung'}.
            <br />
            <strong>Das bedeutet:</strong>
          </div>
          <ul style={{ fontSize: '13px', color: '#1e3a8a', marginTop: '8px', paddingLeft: '20px' }}>
            <li>Die Produkte könnten unterschiedliche Varianten sein</li>
            <li>Einige Angebote könnten nicht mehr verfügbar sein</li>
            <li>Preise können sich schnell ändern</li>
          </ul>
        </div>
        
        <div className="data-quality-tip">
          <Lightbulb className="tip-icon" />
          <span>Nutze "Aktualisieren" um die neuesten Preise zu laden. Die Daten werden automatisch alle 24h erneuert.</span>
        </div>
      </div>

    </div>
  )
}
