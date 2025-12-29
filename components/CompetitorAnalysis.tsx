'use client'

import React, { useState, useEffect } from 'react'
import { searchCompetitors, CompetitorSearchResponse } from '@/lib/api'
import { PositionBadge } from './PositionBadge'
import { PriceComparisonChart } from './PriceComparisonChart'
import { CompetitorList } from './CompetitorList'
import { generateCompetitorAnalysisTexts } from '@/lib/competitorAnalysisTexts'

interface CompetitorAnalysisProps {
  productId: number;
  currentPrice: number;
}

// Helper-Funktionen für localStorage
const getStorageKey = (productId: number) => `competitor_analysis_${productId}`

const loadCachedData = (productId: number): CompetitorSearchResponse | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const cached = localStorage.getItem(getStorageKey(productId))
    if (cached) {
      const data = JSON.parse(cached)
      // Prüfe ob Daten nicht älter als 24 Stunden sind (optional)
      const cacheAge = Date.now() - (data.cached_at || 0)
      const maxAge = 24 * 60 * 60 * 1000 // 24 Stunden
      
      if (cacheAge < maxAge) {
        return data.data
      } else {
        // Cache abgelaufen, entfernen
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
      // Speichere Ergebnisse im Cache
      saveCachedData(productId, result)
    } catch (err: any) {
      console.error('[CompetitorAnalysis] Fehler beim Laden:', err)
      
      // Differenzierte Fehlermeldungen
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
  
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      {/* Header mit Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">🔍 Wettbewerbs-Analyse</h3>
        
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
      {data && !loading && (() => {
        // Generiere saubere Analyse-Texte
        const analysisTexts = generateCompetitorAnalysisTexts({
          product_title: data.product_title || '',
          our_price: data.your_price,
          offers: data.competitors.map(c => {
            // Versuche condition aus Titel und Quelle abzuleiten
            let condition: 'new' | 'used' | 'refurbished' = 'new'
            const titleLower = (c.title || '').toLowerCase()
            const sourceLower = (c.source || '').toLowerCase()
            
            // Prüfe auf Gebrauchtware-Indikatoren
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
          data_age_days: 0 // TODO: Aus data extrahieren wenn verfügbar
        })
        
        return (
          <>
            {/* Cache-Hinweis */}
            <div className="mb-4 text-xs text-gray-500 text-center">
              💾 Ergebnisse gespeichert • Klicke auf "Aktualisieren" für neue Daten
            </div>
            
            {/* Zusammenfassung */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Zusammenfassung:</p>
              <p className="text-sm text-gray-700">{analysisTexts.summary}</p>
            </div>
            
            {/* Markt im Überblick */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Markt im Überblick:</p>
              <ul className="list-disc list-inside space-y-1">
                {analysisTexts.marketOverview.map((bullet, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{bullet}</li>
                ))}
              </ul>
            </div>
            
            {/* Position */}
            <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-gray-900 mb-1">Position:</p>
              <p className="text-sm text-gray-700">{analysisTexts.position}</p>
            </div>
            
            {/* Datenqualität */}
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs font-medium text-gray-900 mb-1">Datenqualität:</p>
              <p className="text-xs text-gray-700">{analysisTexts.dataQuality}</p>
            </div>
            
            {/* Position Badge (visuell) */}
            <div className="flex justify-center mb-4">
              <PositionBadge position={data.summary.your_position} />
            </div>
            
            {/* Preis-Vergleich Chart */}
            {data.summary.found > 0 && (
              <PriceComparisonChart 
                yourPrice={data.your_price}
                minPrice={data.summary.min_price}
                avgPrice={data.summary.avg_price}
                maxPrice={data.summary.max_price}
              />
            )}
            
            {/* Wettbewerber-Liste */}
            <div className="mt-4">
              <CompetitorList competitors={data.competitors} />
            </div>
          </>
        )
      })()}
      
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

