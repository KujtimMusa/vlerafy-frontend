/**
 * TypeScript types for Feature Confidence data
 */

export type ConfidenceStatus = 'excellent' | 'good' | 'ok' | 'low' | 'critical'

export interface CategoryConfidence {
  available: number
  total: number
  percentage: number
  status: ConfidenceStatus
  missing_critical: string[]
  missing_non_critical: string[]
  legitimate_zeros: string[]
  not_implemented: string[]
}

export interface FeatureConfidence {
  overall_confidence: number
  total_features: number
  available_features: number
  categories: {
    SALES?: CategoryConfidence
    INVENTORY?: CategoryConfidence
    PRICE?: CategoryConfidence
    COMPETITOR?: CategoryConfidence
    COST?: CategoryConfidence
    SEASONAL?: CategoryConfidence
    ADVANCED?: CategoryConfidence
    BASIC?: CategoryConfidence
  }
  warnings?: string[]
  recommendations?: string[]
}
