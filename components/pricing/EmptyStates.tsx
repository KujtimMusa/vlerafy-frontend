'use client'

import React from 'react'
import { 
  Sparkles, 
  TrendingDown, 
  Search, 
  Clock, 
  Package,
  AlertCircle,
  BarChart3
} from 'lucide-react'

export type EmptyStateType = 
  | 'new_product'
  | 'low_sales'
  | 'no_competitors'
  | 'insufficient_data'
  | 'no_cost_data'
  | 'loading'

interface EmptyStateProps {
  type: EmptyStateType
  productName?: string
  onAction?: () => void
  actionLabel?: string
}

export function EmptyState({
  type,
  productName,
  onAction,
  actionLabel
}: EmptyStateProps) {
  
  const states: Record<EmptyStateType, {
    icon: any
    color: string
    title: string
    description: string
    subtext?: string
    showProgress?: boolean
    progress?: number
    suggestions?: string[]
    actionText?: string
  }> = {
    new_product: {
      icon: Sparkles,
      color: 'blue',
      title: 'Just added!',
      description: `We're analyzing market data for ${productName || 'this product'}.`,
      subtext: 'First insights ready in ~24 hours',
      showProgress: true,
      progress: 30
    },
    low_sales: {
      icon: TrendingDown,
      color: 'gray',
      title: 'Low sales volume',
      description: 'Not enough recent sales to analyze demand trends.',
      suggestions: [
        'Try running a promotion',
        'Check product visibility',
        'Review competitor pricing'
      ]
    },
    no_competitors: {
      icon: Search,
      color: 'gray',
      title: 'No competitors found',
      description: "We couldn't find similar products on the market.",
      actionText: 'This might mean your product is unique, or our search needs refinement.'
    },
    insufficient_data: {
      icon: Clock,
      color: 'yellow',
      title: 'Collecting data...',
      description: 'We need more time to build accurate insights.',
      subtext: 'Check back in 7 days for demand analysis',
      showProgress: true,
      progress: 60
    },
    no_cost_data: {
      icon: AlertCircle,
      color: 'orange',
      title: 'Cost data missing',
      description: 'Add cost information to enable margin protection.',
      actionText: 'We can still optimize your price, but margin validation is disabled.'
    },
    loading: {
      icon: BarChart3,
      color: 'blue',
      title: 'Analyzing...',
      description: 'Crunching numbers and comparing with market data.',
      showProgress: true,
      progress: 50
    }
  }
  
  const state = states[type]
  const Icon = state.icon
  
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-50 border-blue-200',
    gray: 'text-gray-400 bg-gray-50 border-gray-200',
    yellow: 'text-yellow-500 bg-yellow-50 border-yellow-200',
    orange: 'text-orange-500 bg-orange-50 border-orange-200'
  }
  
  return (
    <div className={`p-8 rounded-lg border-2 ${colorClasses[state.color]} text-center`}>
      
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <Icon className={`w-16 h-16 ${state.color === 'gray' ? 'opacity-50' : ''}`} />
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {state.title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-700 mb-2 max-w-md mx-auto">
        {state.description}
      </p>
      
      {/* Subtext */}
      {state.subtext && (
        <p className="text-sm text-gray-600 mb-4">
          {state.subtext}
        </p>
      )}
      
      {/* Progress Bar */}
      {state.showProgress && state.progress !== undefined && (
        <div className="max-w-xs mx-auto mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${state.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {state.progress}% complete
          </p>
        </div>
      )}
      
      {/* Suggestions */}
      {state.suggestions && state.suggestions.length > 0 && (
        <div className="mt-4 text-left max-w-md mx-auto">
          <p className="text-sm font-medium text-gray-700 mb-2">What you can do:</p>
          <ul className="space-y-1">
            {state.suggestions.map((suggestion, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Action Text */}
      {state.actionText && (
        <p className="text-sm text-gray-600 mt-4 max-w-md mx-auto">
          {state.actionText}
        </p>
      )}
      
      {/* Action Button */}
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors
            ${state.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
              state.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
              'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
        >
          {actionLabel}
        </button>
      )}
      
    </div>
  )
}

// Convenience wrapper for common scenarios
export function NoDataState({ onAddCosts }: { onAddCosts?: () => void }) {
  return (
    <EmptyState
      type="no_cost_data"
      onAction={onAddCosts}
      actionLabel="Add Cost Data"
    />
  )
}

export function LoadingState() {
  return <EmptyState type="loading" />
}

export function NewProductState({ productName }: { productName: string }) {
  return <EmptyState type="new_product" productName={productName} />
}
















