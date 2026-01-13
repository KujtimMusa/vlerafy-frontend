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
  Lightbulb,
  ArrowUpDown,
  Info
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
        {/* Gefundene Anbieter */}
        <div className="group relative overflow-hidden rounded-xl bg-slate-800/80 border border-slate-700/50 p-6 hover:border-blue-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Gefundene Anbieter
            </span>
          </div>
          <span className="text-3xl font-bold text-white">{metrics.competitorCount}</span>
        </div>
        
        {/* Durchschnittspreis */}
        <div className="group relative overflow-hidden rounded-xl bg-slate-800/80 border border-slate-700/50 p-6 hover:border-green-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Durchschnittspreis
            </span>
          </div>
          <span className="text-3xl font-bold text-white">{formatCurrency(metrics.avgPrice)}</span>
        </div>
        
        {/* Preisspanne */}
        <div className="group relative overflow-hidden rounded-xl bg-slate-800/80 border border-slate-700/50 p-6 hover:border-purple-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Preisspanne
            </span>
          </div>
          <span className="text-3xl font-bold text-white">{formatCurrency(metrics.priceSpread)}</span>
        </div>
        
        {/* Abweichung vom Durchschnitt */}
        <div className="group relative overflow-hidden rounded-xl bg-slate-800/80 border border-slate-700/50 p-6 hover:border-orange-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Abweichung
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-orange-400">+{formatCurrency(metrics.yourPriceDiff)}</span>
            <span className="text-sm text-slate-400">teurer</span>
          </div>
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
            <div key={idx} className="competitor-card group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 hover:border-slate-600/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              {/* Glow Effect */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isCheapest ? 'bg-green-500/5' : isExpensive ? 'bg-red-500/5' : 'bg-blue-500/5'
              }`} />
              
              {/* Rank Badge - Prominenter */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${
                  isCheapest 
                    ? 'bg-green-500/20 border-2 border-green-500/50 text-green-400' 
                    : isExpensive 
                    ? 'bg-red-500/20 border-2 border-red-500/50 text-red-400'
                    : 'bg-blue-500/20 border-2 border-blue-500/50 text-blue-400'
                }`}>
                  #{idx + 1}
                </div>
                {isExpensive && (
                  <span className="px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-400">
                    Teuerster
                  </span>
                )}
              </div>
              
              {/* Card Content */}
              <div className="pl-16">
                {/* Competitor Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-md ${
                    isCheapest 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : isExpensive 
                      ? 'bg-red-500/20 border border-red-500/30'
                      : 'bg-blue-500/20 border border-blue-500/30'
                  }`}>
                    {avatarEmoji}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-lg font-bold text-white mb-1">
                      {competitor.source || 'Unbekannt'}
                    </p>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                      {competitor.title || 'Kein Titel verfügbar'}
                    </p>
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
                  
                  {/* Price - Prominenter */}
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white mb-1">
                      {formatCurrency(competitor.price)}
                    </p>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${
                      priceDiff < 0
                        ? 'bg-green-500/10 border border-green-500/20'
                        : 'bg-red-500/10 border border-red-500/20'
                    }`}>
                      {priceDiff < 0 ? (
                        <TrendingDown className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                      )}
                      <span className={`text-xs font-bold ${
                        priceDiff < 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {priceDiff < 0 ? '' : '+'}{formatCurrency(Math.abs(priceDiff))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Data Quality Footer */}
      <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            dataQuality.label === 'Eingeschränkt zuverlässig' 
              ? 'bg-yellow-500/10 border border-yellow-500/20' 
              : 'bg-green-500/10 border border-green-500/20'
          }`}>
            {dataQuality.label === 'Eingeschränkt zuverlässig' ? (
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Datenqualität & Aktualität</h3>
            <p className="text-sm text-slate-400">
              {dataQuality.label === 'Eingeschränkt zuverlässig' ? '⚠️ Eingeschränkt zuverlässig' : '✅ Zuverlässig'} - Heute aktualisiert
            </p>
          </div>
        </div>
        
        {/* Quality Score Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4 ${
          dataQuality.label === 'Eingeschränkt zuverlässig'
            ? 'bg-yellow-500/10 border border-yellow-500/20'
            : 'bg-green-500/10 border border-green-500/20'
        }`}>
          <div className="flex items-center gap-1">
            {dataQuality.label === 'Eingeschränkt zuverlässig' ? (
              <>
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-slate-600" />
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </>
            )}
          </div>
          <span className={`text-sm font-bold ${
            dataQuality.label === 'Eingeschränkt zuverlässig' ? 'text-yellow-400' : 'text-green-400'
          }`}>
            Qualität: {dataQuality.label === 'Eingeschränkt zuverlässig' ? 'Mittel' : 'Hoch'}
          </span>
        </div>
        
        {/* Strukturierte Liste */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-300">
              Die Produkte könnten unterschiedliche Varianten sein
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-300">
              Einige Angebote könnten nicht mehr verfügbar sein
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-300">
              Preise können sich schnell ändern
            </p>
          </div>
        </div>
        
        {/* Was das bedeutet */}
        <div className="px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/30 mb-4">
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-slate-300">Das bedeutet:</span> {dataQuality.explanation 
              ? `Die Preise zeigen ${dataQuality.explanation}. Sie geben einen guten Überblick, sollten aber vor finalen Entscheidungen verifiziert werden.`
              : 'Die Preise geben einen guten Überblick und können für Preisentscheidungen verwendet werden.'}
          </p>
        </div>
        
        {/* CTA Button */}
        <button 
          onClick={() => handleSearch(true)}
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Daten jetzt aktualisieren</span>
        </button>
      </div>

    </div>
  )
}
