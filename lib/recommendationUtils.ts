/**
 * Utility functions for Recommendation UI
 */

export function formatStrategyName(strategy: string): string {
  const names: Record<string, string> = {
    demand_based: 'Demand-Based Pricing',
    cost_based: 'Cost-Based Pricing',
    competitive: 'Competitive Pricing',
    inventory_low: 'Low Inventory Strategy',
    value_based: 'Value-Based Pricing',
    inventory: 'Inventory-Based Strategy',
    demand: 'Demand-Based Strategy'
  }
  return names[strategy] || strategy.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.7) return 'text-green-600'
  if (confidence >= 0.5) return 'text-yellow-600'
  return 'text-red-600'
}

export function getConfidenceMessage(confidence: number): string {
  if (confidence >= 0.7) {
    return 'High confidence - Strong signals support this recommendation'
  }
  if (confidence >= 0.5) {
    return 'Medium confidence - Some uncertainty in data'
  }
  return 'Low confidence - Limited data or conflicting signals'
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  
  // Fallback to formatted date
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}











