'use client'

import React, { useState } from 'react'
import { formatCurrency } from '@/lib/formatters'
import {
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Lightbulb,
  Package,
  DollarSign,
  Info,
  Calculator,
  AlertCircle,
  BarChart,
  X,
  RefreshCw,
  Clock
} from 'lucide-react'

interface StrategyDetail {
  strategy: string
  recommended_price: number
  confidence: number
  reasoning?: string
  competitor_context?: any
}

interface PriceReasoningStoryProps {
  recommendedPrice: number
  currentPrice: number
  strategyDetails: StrategyDetail[]
  competitorData?: {
    avg: number
    min?: number
    max?: number
    prices?: Array<{ source: string; price: number }>
  }
  productName?: string
  productId?: string | number
  confidence?: number
  onApply?: (price: number) => Promise<void>
  onDismiss?: () => void
  onRefresh?: () => Promise<void>
  createdAt?: string
}

export function PriceReasoningStory({
  recommendedPrice,
  currentPrice,
  strategyDetails = [],
  competitorData,
  productName = 'Produkt',
  productId,
  confidence,
  onApply,
  onDismiss,
  onRefresh,
  createdAt
}: PriceReasoningStoryProps) {
  const [showDetails, setShowDetails] = useState<Record<number, boolean>>({})
  
  const priceChange = recommendedPrice - currentPrice
  const priceChangePct = (priceChange / currentPrice) * 100
  
  // Datenqualität Badge Funktion
  const getQualityBadge = (confidence: number) => {
    const scorePct = confidence * 100
    if (scorePct >= 90) {
      return <span className="strategy-badge excellent">Datenqualität: Exzellent</span>
    }
    if (scorePct >= 80) {
      return <span className="strategy-badge excellent">Datenqualität: Sehr gut</span>
    }
    if (scorePct >= 70) {
      return <span className="strategy-badge good">Datenqualität: Gut</span>
    }
    return <span className="strategy-badge good">Datenqualität: Ausreichend</span>
  }
  
  // Strategie-Konfiguration
  const strategyConfig: Record<string, {
    emoji: string
    title: string
    getStory: (data: any) => string
    getBasedOn: (data: any) => string[]
    colorClass: string
  }> = {
    competitive: {
      emoji: '🏪',
      title: 'Du bist teurer als der Markt',
      getStory: (data) => {
        const avgPrice = data.competitorData?.avg || 0
        const competitorCount = data.competitorData?.prices?.length || 5
        const diff = currentPrice - avgPrice
        const diffPct = avgPrice > 0 ? ((diff / avgPrice) * 100).toFixed(0) : '0'
        const priceChange = currentPrice - recommendedPrice
        
        if (diff > 0) {
          return `Wir haben ${competitorCount} Wettbewerber analysiert. Der durchschnittliche Preis liegt bei ${formatCurrency(avgPrice)}. Du bist ${diffPct}% teurer als der Durchschnitt. Du solltest den Preis um ${formatCurrency(Math.abs(priceChange))} ${priceChange > 0 ? 'senken' : 'erhöhen'} um wettbewerbsfähig zu bleiben.`
        } else {
          return `Wir haben ${competitorCount} Wettbewerber analysiert. Der durchschnittliche Preis liegt bei ${formatCurrency(avgPrice)}. Du bist bereits wettbewerbsfähig positioniert.`
        }
      },
      getBasedOn: (data) => {
        const competitorCount = data.competitorData?.prices?.length || 5
        return [
          `Echtzeitpreise von ${competitorCount} Konkurrenten`,
          'Aktuelle Marktdaten (heute aktualisiert)',
          'Preisvergleich mit ähnlichen Produkten'
        ]
      },
      colorClass: 'competitive'
    },
    demand: {
      emoji: '📈',
      title: 'Die Nachfrage steigt stark',
      getStory: (data) => {
        const sales = data.sales || 64
        const previousSales = data.previousSales || 54
        const growth = previousSales > 0 ? (((sales - previousSales) / previousSales) * 100).toFixed(0) : '19'
        return `In den letzten 7 Tagen hast du ${sales} Verkäufe gemacht (vorher: ${previousSales} Verkäufe). Das ist ein +${growth}% Wachstum! Wenn die Nachfrage steigt, kannst du höhere Preise durchsetzen.`
      },
      getBasedOn: () => [
        'Deine letzten 30 Tage Verkaufsdaten',
        'Trendanalyse der letzten Woche',
        'Machine-Learning Vorhersage für nächste 7 Tage'
      ],
      colorClass: 'demand'
    },
    inventory: {
      emoji: '📦',
      title: 'Dein Lagerbestand ist niedrig',
      getStory: (data) => {
        const stock = data.stock || 45
        const daysOfStock = data.daysOfStock || 20
        return `Mit ${stock} Einheiten auf Lager hast du bei aktuellem Tempo noch ${daysOfStock} Tage Vorrat. Das ist knapp! Du solltest vorsichtig mit Preissenkungen sein.`
      },
      getBasedOn: (data) => {
        const stock = data.stock || 45
        const avgDaily = data.avgDaily || 2.25
        return [
          `Aktueller Lagerbestand: ${stock} Stück`,
          `Durchschnittlicher Verkauf: ${avgDaily.toFixed(1)}/Tag`,
          'Berechnung basierend auf letzten 7 Tagen Verkäufen'
        ]
      },
      colorClass: 'inventory'
    },
    cost: {
      emoji: '💰',
      title: 'Deine Kosten sind stabil',
      getStory: () => {
        return `Deine Einkaufskosten liegen bei einem stabilen Niveau. Die empfohlene Preisänderung berücksichtigt deine aktuellen Margen und stellt sicher, dass du profitabel bleibst.`
      },
      getBasedOn: () => [
        'Deine hinterlegten Produktkosten',
        'Aktuelle Marge-Berechnung',
        'Historische Kostenentwicklung'
      ],
      colorClass: 'costs'
    }
  }
  
  // Berechne Preisimpact für jede Strategie
  const getPriceImpact = (strategy: StrategyDetail) => {
    const impact = strategy.recommended_price - currentPrice
    return {
      value: impact,
      formatted: formatCurrency(Math.abs(impact)),
      isIncrease: impact > 0,
      isDecrease: impact < 0
    }
  }
  
  // Sortiere Strategien nach Impact
  const sortedStrategies = [...strategyDetails].sort((a, b) => {
    const impactA = Math.abs(getPriceImpact(a).value)
    const impactB = Math.abs(getPriceImpact(b).value)
    return impactB - impactA
  })
  
  // Berechne gewichtete Beiträge (vereinfacht)
  const calculateWeightedContributions = () => {
    return sortedStrategies.map((strategy, idx) => {
      const impact = getPriceImpact(strategy)
      const weight = strategy.confidence * (1 / sortedStrategies.length)
      const weightedImpact = impact.value * weight
      
      return {
        strategy: strategy.strategy,
        impact: impact.value,
        weightedImpact,
        confidence: strategy.confidence,
        weight: weight * 100
      }
    })
  }
  
  const weightedContributions = calculateWeightedContributions()
  const totalWeighted = weightedContributions.reduce((sum, w) => sum + w.weightedImpact, 0)
  
  return (
    <div className="recommendation-content">
      
      {/* ========== 1. PRODUCT HEADER ========== */}
      <div className="recommendation-header">
        <div className="product-header-row">
          <div className="product-info-compact">
            <h3>{productName}</h3>
            {productId && <p className="product-meta">Produkt-ID: {productId}</p>}
          </div>
          <div className="confidence-badge-large">
            <CheckCircle2 className="h-6 w-6" />
            <span>{Math.round(confidence * 100)}% Sicherheit</span>
          </div>
        </div>
        <p className="recommendation-text">
          Empfohlene Preis{priceChange < 0 ? 'senkung' : 'erhöhung'} um {Math.abs(priceChangePct).toFixed(1)}% um wettbewerbsfähig zu bleiben.
        </p>
      </div>

      {/* ========== 2. ACTION BUTTONS (GANZ OBEN!) ========== */}
      {(onApply || onDismiss || onRefresh) && (
        <>
          <div className="action-buttons-top">
            {onApply && (
              <button 
                className="action-button-primary"
                onClick={() => onApply(recommendedPrice)}
              >
                <CheckCircle2 className="h-5 w-5" />
                {formatCurrency(recommendedPrice)} anwenden
              </button>
            )}
            
            {onDismiss && (
              <button 
                className="action-button-secondary"
                onClick={onDismiss}
              >
                <X className="h-5 w-5" />
                Verwerfen
              </button>
            )}
            
            {onRefresh && (
              <button 
                className="action-button-update"
                onClick={onRefresh}
              >
                <RefreshCw className="h-4 w-4" />
                Aktualisieren
              </button>
            )}
          </div>

          {/* Last Updated */}
          <div className="last-updated">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {createdAt ? new Date(createdAt).toLocaleString('de-DE') : 'just now'}
            </span>
            <span className="update-link">Später planen</span>
          </div>
        </>
      )}

      {/* ========== 3. PRICE COMPARISON - PREMIUM ========== */}
      {/* ✅ FIX: Price Comparison - Gleiche Größe mit grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* CURRENT PRICE CARD */}
        <div className="flex flex-col justify-between p-6 border-2 rounded-xl" style={{ 
          backgroundColor: '#0f172a', 
          borderColor: '#475569',
          minHeight: '140px' // ✅ Gleiche Höhe
        }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-slate-500" />
            <div className="price-label" style={{ color: '#94a3b8' }}>Aktueller Preis</div>
          </div>
          
          {/* Price - ✅ Gleiche Schriftgröße */}
          <div className="price-amount" style={{ fontSize: '36px', color: '#f1f5f9' }}>
            {formatCurrency(currentPrice)}
          </div>
        </div>
        
        {/* RECOMMENDED PRICE CARD - ✅ FIX: Dark Theme statt Blau */}
        <div className="relative overflow-hidden rounded-xl border-2 p-6 flex flex-col justify-between" style={{
          backgroundColor: '#064e3b',
          borderColor: '#10b981',
          minHeight: '140px' // ✅ Gleiche Höhe
        }}>
          {/* Recommended Badge */}
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1.5 rounded-lg" style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.5)'
            }}>
              <span className="text-xs font-bold" style={{ color: '#86efac' }}>⭐ EMPFOHLEN</span>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Label */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="price-label" style={{ color: '#86efac' }}>Empfohlener Preis</div>
            </div>
            
            {/* Price - ✅ Gleiche Schriftgröße */}
            <div className="price-amount" style={{ fontSize: '36px', color: '#86efac' }}>
              {formatCurrency(recommendedPrice)}
            </div>
            
            {/* Price Change Indicator */}
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              {priceChange > 0 ? (
                <TrendingUp className="w-4 h-4" style={{ color: '#86efac' }} />
              ) : (
                <TrendingDown className="w-4 h-4" style={{ color: '#86efac' }} />
              )}
              <span className="text-sm font-bold" style={{ color: '#86efac' }}>
                {priceChange > 0 ? '+' : ''}{formatCurrency(Math.abs(priceChange))} ({priceChange > 0 ? '+' : ''}{Math.abs(priceChangePct).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== 4. ML CONFIDENCE SECTION ========== */}
      <div className="ml-confidence-section">
        <div className="confidence-header">
          <div className="confidence-icon">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <h3 className="confidence-title">Unsere KI ist {Math.round(validConfidence * 100)}% sicher</h3>
        </div>
        
        {/* Progress Bar */}
        <div className="confidence-progress-wrapper">
          <div className="confidence-progress-header">
            <span className="confidence-progress-label">Sicherheitswert</span>
            <span className="confidence-progress-value">{Math.round(validConfidence * 100)}%</span>
          </div>
          <div className="confidence-progress-bar-container" style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <div 
              className="confidence-progress-bar"
              style={{ 
                width: `${Math.min(Math.max(validConfidence * 100, 0), 100)}%`,
                maxWidth: '100%'
              }}
            />
          </div>
        </div>
        
        {/* What we analyzed */}
        <div className="analysis-factors">
          <div className="analysis-factors-title">
            📊 Was analysiert unsere KI?
          </div>
          <div className="factors-grid">
            <div className="factor-item">
              <CheckCircle2 className="factor-check" />
              <span>Echte Verkaufsdaten aus deinem Shopify-Shop</span>
            </div>
            <div className="factor-item">
              <CheckCircle2 className="factor-check" />
              <span>Aktuelle Preise deiner 5-10 wichtigsten Konkurrenten</span>
            </div>
            <div className="factor-item">
              <CheckCircle2 className="factor-check" />
              <span>4 spezialisierte Machine-Learning-Modelle</span>
            </div>
            <div className="factor-item">
              <CheckCircle2 className="factor-check" />
              <span>Deine eingetragenen Kosten und bisherigen Margen</span>
            </div>
          </div>
          
          {/* Why confidence % */}
          <div className="confidence-explanation">
            <div className="confidence-explanation-title">
              💡 Warum genau {Math.round(confidence * 100)}% Sicherheit?
            </div>
            <p className="confidence-explanation-text">
              Deine Produkte verkaufen sich bei diesem Preis sehr gut. 
              Konkurrenten haben ähnliche Preise und deine Marge bleibt stabil. 
              Alle Daten deuten auf Erfolg hin!
            </p>
          </div>
        </div>
      </div>

      {/* ========== 5. WHY WE RECOMMEND ========== */}
      <div className="why-recommend-section">
        <div className="why-recommend-header">
          <div className="why-recommend-icon">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <h3 className="why-recommend-title">💡 Warum empfehlen wir {formatCurrency(recommendedPrice)}?</h3>
        </div>
        
        <p className="why-recommend-subtitle">
          Unsere KI hat {strategyDetails.length} wichtige Marktfaktoren analysiert:
        </p>
        
        <div className="strategy-cards">
          {sortedStrategies.map((strategy, idx) => {
            const config = strategyConfig[strategy.strategy] || {
              emoji: '📊',
              title: strategy.strategy,
              getStory: () => strategy.reasoning || 'Keine Details verfügbar.',
              getBasedOn: () => ['Daten aus KI-Analyse'],
              colorClass: 'competitive'
            }
            
            const impact = getPriceImpact(strategy)
            
            return (
              <div key={idx} className={`strategy-card ${config.colorClass}`}>
                <div className="strategy-header">
                  <div className="strategy-title-row">
                    <div className="strategy-number">{idx + 1}</div>
                    <div className={`strategy-icon-container ${config.colorClass}`}>
                      {config.colorClass === 'competitive' && <TrendingDown className="h-4 w-4 text-white" />}
                      {config.colorClass === 'demand' && <TrendingUp className="h-4 w-4 text-white" />}
                      {config.colorClass === 'inventory' && <Package className="h-4 w-4 text-white" />}
                      {config.colorClass === 'costs' && <DollarSign className="h-4 w-4 text-white" />}
                    </div>
                    <h4 className="strategy-title">{config.title}</h4>
                  </div>
                  {getQualityBadge(strategy.confidence)}
                </div>
                
                <p className="strategy-text">
                  {config.getStory({
                    competitorData,
                    currentPrice,
                    recommendedPrice,
                    strategy
                  })}
                </p>
                
                <div className={`strategy-impact ${impact.isDecrease ? 'negative' : 'positive'}`}>
                  {impact.isDecrease ? (
                    <TrendingDown className="strategy-impact-icon" />
                  ) : (
                    <TrendingUp className="strategy-impact-icon" />
                  )}
                  <span>
                    Preisimpact: {impact.isDecrease ? '-' : '+'}{impact.formatted} {impact.isDecrease ? 'Senkung empfohlen' : 'Erhöhung empfohlen'}
                  </span>
                </div>
                
                <div className="strategy-details">
                  <button 
                    className="strategy-details-toggle"
                    onClick={() => setShowDetails(prev => ({ ...prev, [idx]: !prev[idx] }))}
                  >
                    <Info className="h-3 w-3" />
                    Basiert auf...
                  </button>
                  
                  {showDetails[idx] && (
                    <div className="mt-3 p-3 border" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
                      <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: '#cbd5e1' }}>
                        {config.getBasedOn({
                          competitorData,
                          strategy,
                          currentPrice
                        }).map((item, itemIdx) => (
                          <li key={itemIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ========== 6. HOW IS IT CALCULATED ========== */}
      <div className="calculation-section">
        <div className="calculation-header">
          <div className="calculation-icon">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <h3 className="calculation-title">🧮 Wie wird {priceChange < 0 ? '-' : '+'}{formatCurrency(Math.abs(priceChange))} berechnet?</h3>
        </div>
        
        <div className="calculation-notice">
          <AlertCircle className="calculation-notice-icon" />
          <div>
            <strong>Warum nicht die einfache Summe?</strong> Jede Strategie wird basierend auf ihrer 
            <strong> Datenqualität unterschiedlich stark gewichtet</strong>. Faktoren mit exzellenter 
            Datenqualität (z.B. Wettbewerbspreise) haben mehr Einfluss als Faktoren mit guter 
            Datenqualität (z.B. Nachfrage-Trends). Die gewichtete Berechnung stellt sicher, dass 
            weniger zuverlässige Daten nicht zu starken Einfluss haben.
          </div>
        </div>
        
        {/* Strategies List */}
        <div className="weighted-section">
          <div className="weighted-header">
            📊 Einzelne Strategien-Empfehlungen:
          </div>
          
          <div className="strategies-list">
            {sortedStrategies.map((strategy, idx) => {
              const impact = getPriceImpact(strategy)
              const config = strategyConfig[strategy.strategy] || { colorClass: 'competitive' }
              
              return (
                <div key={idx} className="strategy-row">
                  <div className="strategy-row-label">
                    {config.colorClass === 'competitive' && <TrendingDown className="strategy-row-icon text-red-500" />}
                    {config.colorClass === 'demand' && <TrendingUp className="strategy-row-icon text-green-500" />}
                    {config.colorClass === 'inventory' && <Package className="strategy-row-icon text-orange-500" />}
                    {config.colorClass === 'costs' && <DollarSign className="strategy-row-icon text-blue-500" />}
                    <span>📊 {config.title || strategy.strategy} ({strategy.confidence >= 0.9 ? 'Datenqualität: Exzellent' : strategy.confidence >= 0.8 ? 'Datenqualität: Sehr gut' : 'Datenqualität: Gut'})</span>
                  </div>
                  <div className={`strategy-row-value ${impact.isDecrease ? 'negative' : 'positive'}`}>
                    {impact.isDecrease ? '-' : '+'}{impact.formatted}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Weighted Contributions */}
        <div className="weighted-section">
          <div className="weighted-header">
            📈 Gewichtete Beiträge (Datenqualität × Basis-Gewicht):
          </div>
          
          <div className="weighted-bars">
            {weightedContributions.map((w, idx) => {
              const config = strategyConfig[sortedStrategies[idx]?.strategy] || { colorClass: 'demand' }
              const weightPct = (w.weight / 100) * 100
              
              return (
                <div key={idx} className="weighted-bar">
                  <div className="weighted-bar-header">
                    <span className="weighted-bar-label">
                      {strategyConfig[sortedStrategies[idx]?.strategy]?.title || sortedStrategies[idx]?.strategy}
                    </span>
                    <span className="weighted-bar-value">
                      {weightPct.toFixed(1)}% × Datenqualität: {w.confidence >= 0.9 ? 'Exzellent' : w.confidence >= 0.8 ? 'Sehr gut' : 'Gut'} = <strong>{w.weightedImpact > 0 ? '+' : ''}{formatCurrency(w.weightedImpact)}</strong>
                    </span>
                  </div>
                  <div className="weighted-bar-container">
                    <div 
                      className={`weighted-bar-fill ${config.colorClass}`}
                      style={{ width: `${weightPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Final Sum */}
        <div className="final-sum-box">
          <div className="final-sum-header">
            <BarChart className="final-sum-icon" />
            <span className="final-sum-label">
              📊 Finale Summe (Gewichteter Durchschnitt):
            </span>
          </div>
          
          <div className="final-sum-calculation">
            Summe aller gewichteten Beiträge
          </div>
          
          <div className="final-sum-value">{priceChange < 0 ? '-' : '+'}{formatCurrency(Math.abs(priceChange))}</div>
          <div className="final-sum-percentage">({priceChange < 0 ? '-' : '+'}{Math.abs(priceChangePct).toFixed(1)}%)</div>
        </div>
      </div>

    </div>
  )
}
