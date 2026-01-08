/**
 * Utility functions for recommendation display
 */

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'gerade eben'
  if (diffMins < 60) return `vor ${diffMins} ${diffMins === 1 ? 'Minute' : 'Minuten'}`
  if (diffHours < 24) return `vor ${diffHours} ${diffHours === 1 ? 'Stunde' : 'Stunden'}`
  if (diffDays < 7) return `vor ${diffDays} ${diffDays === 1 ? 'Tag' : 'Tagen'}`
  
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatStrategyName(strategy: string): string {
  const strategyMap: Record<string, string> = {
    'balanced': 'Ausgewogen',
    'volume': 'Umsatz',
    'margin': 'Marge',
    'competitive': 'Wettbewerbsfähig',
    'demand': 'Nachfrage',
    'inventory': 'Lager'
  }
  
  return strategyMap[strategy] || strategy
}

export function getConfidenceColor(confidence: number): string {
  const confidencePct = confidence > 1 ? confidence : confidence * 100
  
  if (confidencePct >= 85) return 'text-green-600'
  if (confidencePct >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

export function getConfidenceMessage(confidence: number): string {
  const confidencePct = confidence > 1 ? confidence : confidence * 100
  
  if (confidencePct >= 85) return 'Sehr zuverlässig'
  if (confidencePct >= 60) return 'Zuverlässig'
  return 'Eingeschränkt zuverlässig'
}
