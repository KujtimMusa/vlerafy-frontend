'use client'

import React from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign, Edit2 } from 'lucide-react'

interface MarginDisplayProps {
  marginData: {
    has_cost_data: boolean
    selling_price?: number
    net_revenue?: number
    costs?: {
      purchase: number
      shipping: number
      packaging: number
      payment_fee: number
      total_variable: number
    }
    margin?: {
      euro: number
      percent: number
    }
    break_even_price?: number
    recommended_min_price?: number
    is_above_break_even?: boolean
    is_above_min_margin?: boolean
    vat_rate?: number
    country_code?: string
    payment_provider?: string
  }
  compact?: boolean
  onAddCosts?: () => void
  onEditCosts?: () => void
}

export function MarginDisplay({ marginData, compact = false, onAddCosts, onEditCosts }: MarginDisplayProps) {
  
  if (!marginData.has_cost_data) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-lg">💡</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Noch präziser mit Kostendaten
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Die Preisempfehlung funktioniert auch ohne Kosten. 
              <strong> Mit Kostendaten</strong> können wir zusätzlich deine <strong>Marge optimieren</strong> und 
              sicherstellen, dass du immer profitabel bleibst.
            </p>
            {onAddCosts && (
              <button 
                onClick={onAddCosts}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 underline transition"
              >
                Kosten hinterlegen (optional)
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  const marginColor = marginData.is_above_min_margin 
    ? 'text-green-600' 
    : marginData.is_above_break_even 
    ? 'text-orange-600' 
    : 'text-red-600'
  
  const marginBgColor = marginData.is_above_min_margin 
    ? 'bg-green-50 border-green-200' 
    : marginData.is_above_break_even 
    ? 'bg-orange-50 border-orange-200' 
    : 'bg-red-50 border-red-200'
  
  const marginIcon = marginData.is_above_min_margin 
    ? <CheckCircle className="w-5 h-5 text-green-600" />
    : marginData.is_above_break_even 
    ? <AlertTriangle className="w-5 h-5 text-orange-600" />
    : <TrendingDown className="w-5 h-5 text-red-600" />
  
  // Compact version (for inline use)
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 ${marginBgColor}`}>
        {marginIcon}
        <span className={`font-semibold ${marginColor}`}>
          {marginData.margin?.percent.toFixed(1)}% Marge
        </span>
        <span className="text-sm text-gray-600">
          (€{marginData.margin?.euro.toFixed(2)})
        </span>
      </div>
    )
  }
  
  // Full version
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Margin-Analyse</h3>
        </div>
        <div className="flex items-center gap-3">
          {/* Margin Badge */}
          <div className={`flex items-center gap-2 ${marginColor}`}>
            {marginIcon}
            <span className="text-2xl font-bold">
              {marginData.margin?.percent.toFixed(1)}%
            </span>
          </div>
          
          {/* ✅ Edit Button (when cost data exists) */}
          {marginData.has_cost_data && onEditCosts && (
            <button
              onClick={onEditCosts}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all"
              title="Kosten bearbeiten"
              aria-label="Kostendaten bearbeiten"
            >
              <Edit2 className="w-4 h-4" />
              <span className="hidden sm:inline">Bearbeiten</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Price Info */}
      <div className="grid grid-cols-2 gap-4 py-3 border-y">
        <div>
          <p className="text-sm text-gray-600 mb-1">Verkaufspreis</p>
          <p className="text-xl font-semibold text-gray-900">
            €{marginData.selling_price?.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">
            Nettoerlös
            {marginData.vat_rate && (
              <span className="ml-1 text-xs">
                (nach {(marginData.vat_rate * 100).toFixed(0)}% MwSt)
              </span>
            )}
          </p>
          <p className="text-xl font-semibold text-gray-900">
            €{marginData.net_revenue?.toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* Cost Breakdown */}
      {marginData.costs && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Variable Kosten:</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">• Einkauf:</span>
              <span className="font-medium text-gray-900">
                €{marginData.costs.purchase.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">• Versand:</span>
              <span className="font-medium text-gray-900">
                €{marginData.costs.shipping.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">• Verpackung:</span>
              <span className="font-medium text-gray-900">
                €{marginData.costs.packaging.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                • Payment Fee
                {marginData.payment_provider && (
                  <span className="ml-1 text-xs">({marginData.payment_provider})</span>
                )}:
              </span>
              <span className="font-medium text-gray-900">
                €{marginData.costs.payment_fee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-2 border-t">
              <span className="text-gray-900">Gesamt:</span>
              <span className="text-gray-900">
                €{marginData.costs.total_variable.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Margin Result */}
      {marginData.margin && (
        <div className={`p-4 rounded-lg border-2 ${marginBgColor}`}>
          <div className="flex items-center gap-2 mb-2">
            {marginIcon}
            <span className="font-semibold text-gray-900">Deckungsbeitrag I:</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className={`text-3xl font-bold ${marginColor}`}>
              €{marginData.margin.euro.toFixed(2)}
            </span>
            <span className={`text-xl font-semibold ${marginColor}`}>
              ({marginData.margin.percent.toFixed(1)}%)
            </span>
          </div>
        </div>
      )}
      
      {/* Reference Prices */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {marginData.break_even_price && (
          <div className="text-sm">
            <p className="text-gray-600 mb-1">⚠️ Break-Even:</p>
            <p className="font-semibold text-gray-900">
              €{marginData.break_even_price.toFixed(2)}
            </p>
          </div>
        )}
        {marginData.recommended_min_price && (
          <div className="text-sm">
            <p className="text-gray-600 mb-1">✅ Min. empfohlen (20%):</p>
            <p className="font-semibold text-green-600">
              €{marginData.recommended_min_price.toFixed(2)}
            </p>
          </div>
        )}
      </div>
      
      {/* Status Messages */}
      {!marginData.is_above_break_even && (
        <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-sm">
          <p className="font-semibold text-red-900 mb-1">❌ KRITISCH: Unter Break-Even</p>
          <p className="text-red-800">
            Dieser Preis liegt unter deinen Kosten. Du machst Verlust bei jedem Verkauf!
          </p>
        </div>
      )}
      
      {marginData.is_above_break_even && !marginData.is_above_min_margin && (
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 text-sm">
          <p className="font-semibold text-orange-900 mb-1">⚠️ NIEDRIGE MARGE</p>
          <p className="text-orange-800">
            Marge liegt unter der empfohlenen Mindestmarge von 20%. 
            Berücksichtige Fixkosten und unerwartete Ausgaben.
          </p>
        </div>
      )}
      
      {marginData.is_above_min_margin && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-sm">
          <p className="font-semibold text-green-900 mb-1">✅ GESUNDE MARGE</p>
          <p className="text-green-800">
            Marge über 20% - gute Profitabilität! Genug Puffer für Fixkosten und Gewinn.
          </p>
        </div>
      )}
      
    </div>
  )
}

