'use client'

import React from 'react'
import { CheckCircle, AlertCircle, HelpCircle, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ConfidenceBasis {
  ml_models?: number
  competitor_count?: number
  sales_30d?: number
  margin_stable?: boolean
  margin_pct?: number | null
}

interface ConfidenceIndicatorProps {
  confidence: number // 0-1 or 0-100
  reasoning?: string
  compact?: boolean
  confidenceBasis?: ConfidenceBasis
}

export function ConfidenceIndicator({ 
  confidence, 
  reasoning, 
  compact = false,
  confidenceBasis
}: ConfidenceIndicatorProps) {
  const t = useTranslations('confidence')
  
  // Normalize confidence to 0-100
  const confidencePct = confidence > 1 ? confidence : confidence * 100
  
  // Determine level
  const level = 
    confidencePct >= 85 ? 'high' :
    confidencePct >= 60 ? 'medium' :
    'low'
  
  const config = {
    high: {
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      barColor: 'bg-green-500',
      gradientBar: 'bg-gradient-to-r from-green-500 to-emerald-600'
    },
    medium: {
      icon: AlertCircle,
      color: 'yellow',
      bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      barColor: 'bg-yellow-500',
      gradientBar: 'bg-gradient-to-r from-yellow-500 to-amber-600'
    },
    low: {
      icon: HelpCircle,
      color: 'red',
      bgColor: 'bg-gradient-to-r from-red-50 to-orange-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      barColor: 'bg-red-500',
      gradientBar: 'bg-gradient-to-r from-red-500 to-orange-600'
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
  
  // Get competitor count and sales data
  const compCount = confidenceBasis?.competitor_count || 0
  const sales30d = confidenceBasis?.sales_30d || 0
  
  // Full version - New improved design (visuell prominent: p-6, border-2, shadow-md)
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-500 shadow-md space-y-4">
      
      {/* HEADLINE: Größte Schrift + Progressbar */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Check className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">
            {t('title', { confidence: confidencePct.toFixed(0) })}
          </h3>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{width: `${confidencePct}%`}}
            />
          </div>
        </div>
      </div>

      {/* NEUE ERKLÄRUNG: Klar + konkret */}
      <div className="p-4 bg-white/50 rounded-xl border">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          📊 <span>{t('whatAnalyzes')}</span>
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Echte Verkaufsdaten aus deinem Shopify-Shop</li>
          <li>• Aktuelle Preise deiner {compCount > 0 ? `${compCount}-${Math.max(compCount, 10)}` : '5-10'} wichtigsten Konkurrenten</li>
          <li>• {confidenceBasis?.ml_models || 4} spezialisierte Machine-Learning-Modelle (Umsatz, Konkurrenz, Marge, Saisonalität)</li>
          <li>• Deine eingetragenen Kosten und bisherigen Margen</li>
        </ul>
      </div>

      {/* WARUM-ERKLÄRUNG: Konkret statt "strong signals" */}
      <div className="p-4 bg-yellow-50/80 border border-yellow-200 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          💡 {t('why', { confidence: confidencePct.toFixed(0) })}
        </h4>
        <p className="text-sm text-gray-800 leading-relaxed">
          {t('whyText')}
        </p>
      </div>
      
    </div>
  )
}






