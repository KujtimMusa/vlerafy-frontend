/**
 * Confidence utility functions for UI components
 */

export type ConfidenceBadgeVariant = 'default' | 'success' | 'warning' | 'secondary' | 'danger'

/**
 * Get badge variant based on confidence level
 */
export function getConfidenceBadgeVariant(
  confidence: number
): ConfidenceBadgeVariant {
  if (confidence >= 0.8) return 'success'
  if (confidence >= 0.6) return 'warning'
  if (confidence >= 0.4) return 'secondary'
  return 'danger'
}

/**
 * Get color class for confidence level
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'green'
  if (confidence >= 0.6) return 'yellow'
  if (confidence >= 0.4) return 'orange'
  return 'red'
}

/**
 * Get confidence percentage (0-100)
 */
export function getConfidencePercentage(confidence: number): number {
  return Math.round((confidence || 0.5) * 100)
}

/**
 * Get confidence label text
 */
export function getConfidenceLabel(confidence: number): string {
  const percentage = getConfidencePercentage(confidence)
  return `${percentage}% Sicherheit`
}
