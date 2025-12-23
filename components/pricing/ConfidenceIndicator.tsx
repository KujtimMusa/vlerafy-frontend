'use client'

import React from 'react'
import { CheckCircle, AlertCircle, HelpCircle } from 'lucide-react'

interface ConfidenceIndicatorProps {
  confidence: number // 0-1 or 0-100
  reasoning?: string
  compact?: boolean
}

export function ConfidenceIndicator({ 
  confidence, 
  reasoning, 
  compact = false 
}: ConfidenceIndicatorProps) {
  // Normalize confidence to 0-100
  const confidencePct = confidence > 1 ? confidence : confidence * 100
  
  // Determine level
  const level = 
    confidencePct >= 80 ? 'high' :
    confidencePct >= 60 ? 'medium' :
    'low'
  
  const config = {
    high: {
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      barColor: 'bg-green-500',
      label: 'High Confidence',
      description: 'Strong signals support this price'
    },
    medium: {
      icon: AlertCircle,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      barColor: 'bg-yellow-500',
      label: 'Medium Confidence',
      description: 'Moderate evidence supports this price'
    },
    low: {
      icon: HelpCircle,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      barColor: 'bg-red-500',
      label: 'Low Confidence',
      description: 'Limited data available - use caution'
    }
  }
  
  const current = config[level]
  const Icon = current.icon
  
  // Compact version (for header badge)
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${current.bgColor} ${current.borderColor}`}>
        <Icon className={`w-4 h-4 ${current.textColor}`} />
        <span className={`text-sm font-semibold ${current.textColor}`}>
          {confidencePct.toFixed(0)}%
        </span>
      </div>
    )
  }
  
  // Full version
  return (
    <div className="space-y-3">
      
      {/* Label and Percentage */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${current.textColor}`} />
          <span className={`font-semibold ${current.textColor}`}>
            {current.label}
          </span>
        </div>
        <span className="text-2xl font-bold text-gray-900">
          {confidencePct.toFixed(1)}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${current.barColor} transition-all duration-500 ease-out`}
            style={{ width: `${confidencePct}%` }}
          />
        </div>
        
        {/* Threshold markers */}
        <div className="absolute top-0 left-[60%] w-px h-3 bg-gray-400 opacity-30" />
        <div className="absolute top-0 left-[80%] w-px h-3 bg-gray-400 opacity-30" />
      </div>
      
      {/* Description - nur wenn reasoning vorhanden und nicht JSON */}
      {reasoning && typeof reasoning === 'string' && !reasoning.trim().startsWith('{') && (
        <p className="text-sm text-gray-600">
          {reasoning}
        </p>
      )}
      
      {/* Fallback Description wenn kein reasoning */}
      {(!reasoning || (typeof reasoning === 'string' && reasoning.trim().startsWith('{'))) && (
        <p className="text-sm text-gray-600">
          {current.description}
        </p>
      )}
      
    </div>
  )
}






