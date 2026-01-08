'use client'

import { useState } from 'react'
import { CompetitorPrice } from '@/lib/api'
import { formatCurrency } from '@/lib/formatters'

interface CompetitorListProps {
  competitors: CompetitorPrice[]
  yourPrice: number
}

type FilterType = 'all' | 'new' | 'used' | 'refurbished'

export function CompetitorList({ competitors, yourPrice }: CompetitorListProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  if (!competitors || competitors.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p className="font-medium mb-2">❓ Unbekannt</p>
        <p className="text-sm">Keine Wettbewerber gefunden</p>
        <p className="text-xs mt-2 text-gray-400">
          Die Suche hat keine Ergebnisse zurückgegeben. Mögliche Gründe:
        </p>
        <ul className="text-xs mt-2 text-gray-400 text-left max-w-md mx-auto">
          <li>• Produktname zu spezifisch oder ungewöhnlich</li>
          <li>• Serper API Key fehlt oder ist ungültig</li>
          <li>• Rate Limit erreicht (2500 Calls/Monat)</li>
          <li>• Keine Shopping-Ergebnisse für dieses Produkt verfügbar</li>
        </ul>
      </div>
    )
  }

  // Helper: Bestimme Produktzustand aus Titel und Quelle
  const getCondition = (competitor: CompetitorPrice): 'new' | 'used' | 'refurbished' => {
    const titleLower = (competitor.title || '').toLowerCase()
    const sourceLower = (competitor.source || '').toLowerCase()
    
    if (
      titleLower.includes('gebraucht') ||
      titleLower.includes('used') ||
      titleLower.includes('wie neu') ||
      titleLower.includes('zustand') ||
      sourceLower.includes('kleinanzeigen') ||
      sourceLower.includes('willhaben') ||
      sourceLower.includes('shpock') ||
      sourceLower.includes('vinted')
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

  // Filtere nach Zustand
  const filteredCompetitors = competitors.filter(comp => {
    if (filter === 'all') return true
    return getCondition(comp) === filter
  })

  // Sortiere nach Preis
  const sortedCompetitors = [...filteredCompetitors].sort((a, b) => a.price - b.price)

  // Zähle nach Zustand
  const newCount = competitors.filter(c => getCondition(c) === 'new').length
  const usedCount = competitors.filter(c => getCondition(c) === 'used').length
  const refurbishedCount = competitors.filter(c => getCondition(c) === 'refurbished').length

  // Prüfe ob alle Wettbewerber günstiger sind
  const allCompetitorsCheaper = sortedCompetitors.every(c => c.price < yourPrice)
  const maxCompetitorPrice = sortedCompetitors.length > 0 
    ? Math.max(...sortedCompetitors.map(c => c.price))
    : 0

  // Bestimme Label und Icon für Position
  const getPositionLabel = (idx: number, total: number) => {
    if (idx === 0) return { label: 'GÜNSTIGSTER', icon: '🟢' }
    if (idx === total - 1) return { label: 'TEUERSTER', icon: '🔴' }
    if (idx < 3) return { label: `#${idx + 1}`, icon: '🟡' }
    return { label: `#${idx + 1}`, icon: '🟡' }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>💰</span>
        {competitors.length} WETTBEWERBER IM VERGLEICH
      </h3>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setFilter('all')}
        >
          Alle
        </button>
        {newCount > 0 && (
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'new' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('new')}
          >
            Nur Neuware ({newCount})
          </button>
        )}
        {usedCount > 0 && (
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'used' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('used')}
          >
            Nur Gebraucht ({usedCount})
          </button>
        )}
        {refurbishedCount > 0 && (
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'refurbished' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('refurbished')}
          >
            Nur Refurbished ({refurbishedCount})
          </button>
        )}
      </div>

      {/* Competitor Cards */}
      <div className="space-y-4">
        {sortedCompetitors.map((comp, idx) => {
          const { label, icon } = getPositionLabel(idx, sortedCompetitors.length)
          const condition = getCondition(comp)
          const priceDiff = yourPrice - comp.price
          const priceDiffPct = Math.round((priceDiff / yourPrice) * 100)

          return (
            <div 
              key={idx}
              className="border-2 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              {/* Header with Rank & Price */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {label}
                    </div>
                    <div className="text-xl font-bold">{comp.source}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(comp.price)}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="mb-3">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {comp.title}
                </p>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm mb-4">
                {comp.rating && (
                  <span className="text-gray-600">
                    ⭐ {comp.rating.toFixed(1)} Sterne
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full font-medium ${
                  condition === 'new' 
                    ? 'bg-green-100 text-green-800' 
                    : condition === 'refurbished'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {condition === 'new' ? 'Neuware' :
                   condition === 'refurbished' ? 'Refurbished' : 
                   'Gebraucht'}
                </span>
              </div>

              {/* Price Difference Highlight */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                <p className="text-sm font-medium text-blue-900">
                  💡 {formatCurrency(Math.abs(priceDiff))} günstiger als du
                  ({priceDiffPct > 0 ? '-' : '+'}{Math.abs(priceDiffPct)}%)
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Warning if ALL competitors are cheaper */}
      {allCompetitorsCheaper && sortedCompetitors.length > 0 && (
        <div className="mt-6 bg-orange-50 border-l-4 border-orange-400 p-4">
          <p className="text-sm font-medium text-orange-900">
            ⚠️ <strong>WICHTIG:</strong> Selbst der teuerste Wettbewerber ist{' '}
            {formatCurrency(yourPrice - maxCompetitorPrice)} günstiger als dein 
            aktueller Preis!
          </p>
        </div>
      )}
    </div>
  )
}
