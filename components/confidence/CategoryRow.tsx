'use client'

import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { CategoryConfidence, ConfidenceStatus } from '@/lib/types/confidence'

interface CategoryRowProps {
  categoryName: string
  category: CategoryConfidence
}

const statusConfig: Record<ConfidenceStatus, { color: string; icon: React.ReactNode }> = {
  excellent: {
    color: 'text-green-600',
    icon: <CheckCircle2 size={16} className="text-green-600" />
  },
  good: {
    color: 'text-green-600',
    icon: <CheckCircle2 size={16} className="text-green-600" />
  },
  ok: {
    color: 'text-yellow-600',
    icon: <AlertTriangle size={16} className="text-yellow-600" />
  },
  low: {
    color: 'text-orange-600',
    icon: <AlertTriangle size={16} className="text-orange-600" />
  },
  critical: {
    color: 'text-red-600',
    icon: <XCircle size={16} className="text-red-600" />
  }
}

const categoryLabels: Record<string, string> = {
  SALES: 'Sales History',
  INVENTORY: 'Inventory & Stock',
  PRICE: 'Price History',
  COMPETITOR: 'Competitor Data',
  COST: 'Cost & Margin',
  SEASONAL: 'Seasonal & Temporal',
  ADVANCED: 'Advanced Analytics',
  BASIC: 'Basic Product Data'
}

export function CategoryRow({ categoryName, category }: CategoryRowProps) {
  const [expanded, setExpanded] = useState(false)
  const config = statusConfig[category.status] || statusConfig.ok
  const label = categoryLabels[categoryName] || categoryName

  const hasIssues = 
    category.missing_critical.length > 0 ||
    category.missing_non_critical.length > 0 ||
    category.not_implemented.length > 0

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div 
        className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Status Icon */}
        <div className="flex-shrink-0">
          {config.icon}
        </div>

        {/* Category Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 text-sm">{label}</span>
            {hasIssues && (
              <span className="text-xs text-gray-500">
                ({category.missing_critical.length + category.missing_non_critical.length + category.not_implemented.length} issues)
              </span>
            )}
          </div>
        </div>

        {/* Percentage */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-sm font-semibold ${config.color} min-w-[3rem] text-right`}>
            {category.percentage.toFixed(1)}%
          </span>

          {/* Progress Bar */}
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                category.status === 'excellent' || category.status === 'good' ? 'bg-green-500' :
                category.status === 'ok' ? 'bg-yellow-500' :
                category.status === 'low' ? 'bg-orange-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(category.percentage, 100)}%` }}
            />
          </div>

          {/* Expand Icon */}
          {hasIssues && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(!expanded)
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {expanded ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && hasIssues && (
        <div className="pl-8 pr-4 pb-3 space-y-2 text-xs text-gray-600">
          {category.missing_critical.length > 0 && (
            <div>
              <span className="font-semibold text-red-700">Critical Missing:</span>
              <ul className="list-disc list-inside ml-2 mt-1">
                {category.missing_critical.map((feature, idx) => (
                  <li key={idx} className="text-red-600">{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {category.missing_non_critical.length > 0 && (
            <div>
              <span className="font-semibold text-orange-700">Missing:</span>
              <ul className="list-disc list-inside ml-2 mt-1">
                {category.missing_non_critical.map((feature, idx) => (
                  <li key={idx} className="text-orange-600">{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {category.not_implemented.length > 0 && (
            <div>
              <span className="font-semibold text-gray-700">Not Implemented:</span>
              <ul className="list-disc list-inside ml-2 mt-1">
                {category.not_implemented.map((feature, idx) => (
                  <li key={idx} className="text-gray-600">{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {category.legitimate_zeros.length > 0 && (
            <div>
              <span className="font-semibold text-blue-700">Valid Zeros:</span>
              <span className="ml-2 text-blue-600">
                {category.legitimate_zeros.length} feature(s) with legitimate zero values
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
