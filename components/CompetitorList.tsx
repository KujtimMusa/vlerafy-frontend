'use client'

import { CompetitorPrice } from '@/lib/api'

interface CompetitorListProps {
  competitors: CompetitorPrice[];
}

export function CompetitorList({ competitors }: CompetitorListProps) {
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
    );
  }
  
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-700">
        Gefundene Wettbewerber ({competitors.length}):
      </h4>
      
      {competitors.map((competitor, index) => (
        <div 
          key={index}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            {/* Left: Source & Title */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🏪</span>
                <span className="font-semibold text-gray-900">
                  {competitor.source}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {competitor.title}
              </p>
              {competitor.rating && (
                <div className="mt-1 text-xs text-gray-500">
                  ⭐ {competitor.rating.toFixed(1)}
                  {competitor.reviews && ` (${competitor.reviews} Reviews)`}
                </div>
              )}
            </div>
            
            {/* Right: Price & Link */}
            <div className="text-right ml-4">
              <div className="text-xl font-bold text-gray-900 mb-2">
                €{competitor.price.toFixed(2)}
              </div>
              <a 
                href={competitor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Link öffnen →
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}






