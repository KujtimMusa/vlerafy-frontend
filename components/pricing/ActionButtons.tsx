'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, X, AlertTriangle, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'

interface ActionButtonsProps {
  recommendedPrice: number
  onApply: () => Promise<void>
  onDismiss: () => void
  isApplying: boolean
  isDisabled?: boolean
  marginAnalysis?: {
    is_safe: boolean
    margin: number
    warning: string | null
    message: string
    details?: {
      margin?: {
        euro: number
      }
    }
  } | null
}

export function ActionButtons({
  recommendedPrice,
  onApply,
  onDismiss,
  isApplying,
  isDisabled = false,
  marginAnalysis
}: ActionButtonsProps) {
  const t = useTranslations('pricing')
  const tCommon = useTranslations('common')
  const tActions = useTranslations('actions')
  
  const [showSchedule, setShowSchedule] = useState(false)
  const hasMarginWarning = marginAnalysis && !marginAnalysis.is_safe
  
  // Calculate estimated revenue impact (placeholder - you'd calculate this properly)
  const estimatedMonthlyImpact = marginAnalysis?.details?.margin?.euro 
    ? marginAnalysis.details.margin.euro * 30 // Rough estimate: margin * 30 days
    : null
  
  return (
    <div className="space-y-3">
      
      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        
        {/* Apply Button */}
        <button
          onClick={onApply}
          disabled={isApplying || isDisabled}
          className={`
            flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold
            transition-all duration-200 transform hover:scale-105
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            ${isDisabled 
              ? 'bg-gray-300 text-gray-600' 
              : hasMarginWarning
                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isApplying ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t('applying')}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <div className="flex flex-col items-start">
                <span>{t('apply_price', { price: formatCurrency(recommendedPrice) })}</span>
                {estimatedMonthlyImpact && (
                  <span className="text-xs opacity-80 font-normal">
                    +{formatCurrency(estimatedMonthlyImpact)}{tActions('month_est')}
                  </span>
                )}
              </div>
            </>
          )}
        </button>
        
        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          disabled={isApplying}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold
                     border-2 border-gray-300 text-gray-700 hover:bg-gray-50
                     transition-all disabled:opacity-50"
        >
          <X className="w-5 h-5" />
          <span>{tCommon('dismiss')}</span>
        </button>
        
      </div>
      
      {/* Secondary Action: Schedule */}
      <button
        onClick={() => setShowSchedule(!showSchedule)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm
                   text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Clock className="w-4 h-4" />
        <span>{t('schedule_later')}</span>
      </button>
      
      {/* Schedule Panel (if shown) */}
      {showSchedule && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
          <p className="text-sm font-medium text-blue-900">
            {tActions('schedule_price_change')}
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-blue-700 mb-1">{tActions('date')}</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-blue-700 mb-1">{tActions('time')}</label>
              <input
                type="time"
                defaultValue="09:00"
                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
              />
            </div>
          </div>
          
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                       hover:bg-blue-700 transition-colors"
          >
            {tActions('schedule_change')}
          </button>
        </div>
      )}
      
      {/* Warning Message (if disabled) */}
      {isDisabled && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            {tActions('cannot_apply_warning')}
          </p>
        </div>
      )}
      
      {/* Margin Warning */}
      {hasMarginWarning && !isDisabled && (
        <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-orange-900 mb-1">{tActions('margin_warning')}</p>
            <p className="text-xs text-orange-800">{marginAnalysis?.message}</p>
          </div>
        </div>
      )}
      
    </div>
  )
}

