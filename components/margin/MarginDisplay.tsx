'use client'

import React from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, CheckCircle2, DollarSign, Edit2, Edit3 } from 'lucide-react'
import '@/app/styles/recommendations.css'

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
      <div className="border p-4" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center" style={{ backgroundColor: '#334155' }}>
            <span className="text-lg">💡</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1" style={{ color: '#f1f5f9' }}>
              Noch präziser mit Kostendaten
            </h3>
            <p className="text-xs mb-3" style={{ color: '#cbd5e1' }}>
              Die Preisempfehlung funktioniert auch ohne Kosten. 
              <strong> Mit Kostendaten</strong> können wir zusätzlich deine <strong>Marge optimieren</strong> und 
              sicherstellen, dass du immer profitabel bleibst.
            </p>
            {onAddCosts && (
              <button 
                onClick={onAddCosts}
                className="text-xs font-medium transition" style={{ color: '#60a5fa', textDecoration: 'none' }}
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
    ? { backgroundColor: '#064e3b', borderColor: '#10b981' }
    : marginData.is_above_break_even 
    ? { backgroundColor: '#78350f', borderColor: '#f59e0b' }
    : { backgroundColor: '#7f1d1d', borderColor: '#ef4444' }
  
  const marginIcon = marginData.is_above_min_margin 
    ? <CheckCircle className="w-5 h-5 text-green-600" />
    : marginData.is_above_break_even 
    ? <AlertTriangle className="w-5 h-5 text-orange-600" />
    : <TrendingDown className="w-5 h-5 text-red-600" />
  
  // Compact version (for inline use)
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 border-2" style={marginBgColor}>
        {marginIcon}
        <span className={`font-semibold ${marginColor}`}>
          {marginData.margin?.percent.toFixed(1)}% Marge
        </span>
        <span className="text-sm" style={{ color: '#94a3b8' }}>
          (€{marginData.margin?.euro.toFixed(2)})
        </span>
      </div>
    )
  }
  
  // Full version
  return (
    <div className="margin-content">
      
      {/* Header with Success Badge */}
      <div className="margin-header">
        <h3 className="margin-title">
          <DollarSign className="margin-title-icon" />
          Margin-Analyse
        </h3>
        
        <div className="flex items-center gap-3">
          {marginData.margin && (
            <div className="margin-success-badge">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <span className="margin-success-percentage">
                {marginData.margin.percent.toFixed(1)}%
              </span>
            </div>
          )}
          
          {/* Edit Button */}
          {marginData.has_cost_data && onEditCosts && (
            <button
              onClick={onEditCosts}
              className="margin-edit-button"
              title="Kosten bearbeiten"
              aria-label="Kostendaten bearbeiten"
            >
              <Edit3 className="h-4 w-4" />
              Bearbeiten
            </button>
          )}
        </div>
      </div>

      {/* Price Grid */}
      <div className="price-grid">
        <div className="price-box">
          <div className="price-box-label">Verkaufspreis</div>
          <div className="price-box-value">
            €{marginData.selling_price?.toFixed(2) || '0.00'}
          </div>
        </div>
        
        <div className="price-box">
          <div className="price-box-label">Nettoerlös</div>
          <div className="price-box-value">
            €{marginData.net_revenue?.toFixed(2) || '0.00'}
          </div>
          {marginData.vat_rate && (
            <div className="price-box-meta">
              (nach {(marginData.vat_rate * 100).toFixed(0)}% MwSt)
            </div>
          )}
        </div>
      </div>

      {/* Variable Costs */}
      {marginData.costs && (
        <div className="variable-costs-section">
          <div className="section-label">Variable Kosten:</div>
          
          <div className="costs-list">
            <div className="cost-item">
              <div className="cost-item-label">
                <span className="cost-item-bullet"></span>
                Einkauf:
              </div>
              <div className="cost-item-value">
                €{marginData.costs.purchase.toFixed(2)}
              </div>
            </div>
            
            <div className="cost-item">
              <div className="cost-item-label">
                <span className="cost-item-bullet"></span>
                Versand:
              </div>
              <div className="cost-item-value">
                €{marginData.costs.shipping.toFixed(2)}
              </div>
            </div>
            
            <div className="cost-item">
              <div className="cost-item-label">
                <span className="cost-item-bullet"></span>
                Verpackung:
              </div>
              <div className="cost-item-value">
                €{marginData.costs.packaging.toFixed(2)}
              </div>
            </div>
            
            <div className="cost-item">
              <div className="cost-item-label">
                <span className="cost-item-bullet"></span>
                Payment Fee
                {marginData.payment_provider && (
                  <span className="text-xs text-gray-500">({marginData.payment_provider})</span>
                )}:
              </div>
              <div className="cost-item-value">
                €{marginData.costs.payment_fee.toFixed(2)}
              </div>
            </div>
            
            <div className="cost-item total-row">
              <div className="cost-item-label">
                Gesamt:
              </div>
              <div className="cost-item-value">
                €{marginData.costs.total_variable.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contribution Margin - HERO BOX */}
      {marginData.margin && (
        <div className="contribution-margin-box">
          <div className="contribution-margin-header">
            <CheckCircle2 className="contribution-check-icon" />
            <span className="contribution-label">Deckungsbeitrag I:</span>
          </div>
          <div className="contribution-amount">
            €{marginData.margin.euro.toFixed(2)}
          </div>
          <div className="contribution-percentage">
            ({marginData.margin.percent.toFixed(1)}%)
          </div>
        </div>
      )}

      {/* Break-Even & Min. Recommendation */}
      <div className="insights-grid">
        {marginData.break_even_price && (
          <div className="insight-box warning">
            <div className="insight-header">
              <AlertTriangle className="insight-icon warning" />
              <span className="insight-label">Break-Even:</span>
            </div>
            <div className="insight-value">
              €{marginData.break_even_price.toFixed(2)}
            </div>
          </div>
        )}
        
        {marginData.recommended_min_price && (
          <div className="insight-box success">
            <div className="insight-header">
              <CheckCircle2 className="insight-icon success" />
              <span className="insight-label">Min. empfohlen (20%):</span>
            </div>
            <div className="insight-value">
              €{marginData.recommended_min_price.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Health Banner */}
      {!marginData.is_above_break_even && (
        <div className="health-banner" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', borderColor: '#f87171' }}>
          <AlertTriangle className="health-icon" style={{ color: '#dc2626' }} />
          <div className="health-content">
            <div className="health-title" style={{ color: '#991b1b' }}>❌ KRITISCH: Unter Break-Even</div>
            <div className="health-description" style={{ color: '#7f1d1d' }}>
              Dieser Preis liegt unter deinen Kosten. Du machst Verlust bei jedem Verkauf!
            </div>
          </div>
        </div>
      )}
      
      {marginData.is_above_break_even && !marginData.is_above_min_margin && (
        <div className="health-banner" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderColor: '#fbbf24' }}>
          <AlertTriangle className="health-icon" style={{ color: '#f59e0b' }} />
          <div className="health-content">
            <div className="health-title" style={{ color: '#92400e' }}>⚠️ NIEDRIGE MARGE</div>
            <div className="health-description" style={{ color: '#78350f' }}>
              Marge liegt unter der empfohlenen Mindestmarge von 20%. Berücksichtige Fixkosten und unerwartete Ausgaben.
            </div>
          </div>
        </div>
      )}
      
      {marginData.is_above_min_margin && (
        <div className="health-banner">
          <CheckCircle2 className="health-icon" />
          <div className="health-content">
            <div className="health-title">✅ Gesunde Marge</div>
            <div className="health-description">
              Marge über 20% - gute Profitabilität! Genug Puffer für Fixkosten und Gewinn.
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}

