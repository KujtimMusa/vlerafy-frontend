'use client'

import { AlertTriangle, Lightbulb } from 'lucide-react'
import { FeatureConfidence } from '@/lib/types/confidence'
import { CategoryRow } from './CategoryRow'

interface ConfidenceBreakdownProps {
  data: FeatureConfidence
}

const categoryOrder = ['BASIC', 'SALES', 'INVENTORY', 'PRICE', 'COMPETITOR', 'COST', 'SEASONAL', 'ADVANCED']

export function ConfidenceBreakdown({ data }: ConfidenceBreakdownProps) {
  const categories = Object.entries(data.categories)
    .filter(([_, category]) => category !== undefined)
    .sort(([a], [b]) => {
      const indexA = categoryOrder.indexOf(a)
      const indexB = categoryOrder.indexOf(b)
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
    })

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">Data Confidence Breakdown</h4>
          <p className="text-xs text-gray-600 mt-1">
            {data.available_features} of {data.total_features} features available
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {data.overall_confidence.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Overall</div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
        {categories.map(([categoryName, category]) => (
          <CategoryRow
            key={categoryName}
            categoryName={categoryName}
            category={category}
          />
        ))}
      </div>

      {/* Warnings */}
      {data.warnings && data.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-semibold text-yellow-900 text-sm mb-2">Warnings</h5>
              <ul className="space-y-1">
                {data.warnings.map((warning, idx) => (
                  <li key={idx} className="text-xs text-yellow-800">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Lightbulb size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-semibold text-blue-900 text-sm mb-2">Recommendations</h5>
              <ul className="space-y-1">
                {data.recommendations.map((recommendation, idx) => (
                  <li key={idx} className="text-xs text-blue-800">
                    • {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
