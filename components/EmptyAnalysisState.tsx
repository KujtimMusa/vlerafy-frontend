'use client'

import React from 'react'

interface EmptyAnalysisStateProps {
  productId: string | number
  competitorCount: number
  salesDataDays: number
  onRunAnalysis?: () => void
}

export function EmptyAnalysisState({
  productId,
  competitorCount,
  salesDataDays,
  onRunAnalysis
}: EmptyAnalysisStateProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h3 className="font-bold text-xl text-yellow-800 mb-2">
        ⚠️ Erstmalige Analyse für Produkt #{productId}
      </h3>
      
      {competitorCount === 0 && (
        <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400 mb-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔍</span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Wettbewerbsanalyse läuft...</h4>
              <p className="text-sm text-gray-600 mb-2">
                Wir sammeln gerade Preisdaten von Wettbewerbern für dieses Produkt.
              </p>
              {onRunAnalysis && (
                <button 
                  onClick={onRunAnalysis}
                  className="text-blue-600 underline hover:text-blue-800 text-sm font-medium mt-2"
                >
                  Jetzt sofort analysieren →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {salesDataDays < 7 && (
        <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📈</span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Verkaufsdaten werden gesammelt</h4>
              <p className="text-sm text-gray-600">
                Aktuell: <span className="font-semibold">{salesDataDays} Tage</span>. 
                Optimal: <span className="font-semibold text-green-600">30+ Tage</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Mehr Verkaufsdaten führen zu präziseren Preisempfehlungen.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {competitorCount > 0 && salesDataDays >= 7 && (
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Datenbasis vorhanden</h4>
              <p className="text-sm text-gray-600">
                Wir haben genug Daten für eine erste Analyse. Die Empfehlung wird mit mehr Daten präziser.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}







