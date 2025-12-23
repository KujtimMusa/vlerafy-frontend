# i18n Refactoring Beispiele

## Beispiel 1: PriceRecommendationCard.tsx

### Vorher:
```typescript
<p className="text-sm text-gray-600 mb-1 font-medium">Current</p>
<p className="text-sm font-medium mb-1">Recommended</p>
<span>No change recommended</span>
<span>{Math.round(recommendation.confidence * 100)}% Confidence</span>
<span>Product ID: {recommendation.product_id}</span>
<span>Market Comparison</span>
<span>{competitorCount} competitors</span>
<button>Show detailed analysis</button>
<button>Hide detailed analysis</button>
<button>Refresh</button>
```

### Nachher:
```typescript
'use client'

import { useTranslations } from 'next-intl'
// ... andere imports

export function PriceRecommendationCard({ ... }) {
  const t = useTranslations('pricing')
  const tMarket = useTranslations('market')
  const tCommon = useTranslations('common')
  
  // ... existing code ...
  
  return (
    <div>
      {/* Current Price */}
      <p className="text-sm text-gray-600 mb-1 font-medium">
        {t('current')}
      </p>
      
      {/* Recommended Price */}
      <p className="text-sm font-medium mb-1">
        {t('recommended')}
      </p>
      
      {/* No Change */}
      {noChange && (
        <span>{t('no_change')}</span>
      )}
      
      {/* Confidence Badge */}
      <span>
        {Math.round(recommendation.confidence * 100)}% {t('confidence')}
      </span>
      
      {/* Product ID */}
      <p>
        {t('product_id')}: {recommendation.product_id}
      </p>
      
      {/* Market Comparison */}
      <span>{tMarket('comparison')}</span>
      
      {/* Competitors Count */}
      <span>
        {tMarket('competitors', { count: competitorCount })}
      </span>
      
      {/* Show/Hide Details */}
      <button>
        {showDetails ? t('hide_details') : t('show_details')}
      </button>
      
      {/* Refresh */}
      <button>
        {tCommon('refresh')}
      </button>
    </div>
  )
}
```

## Beispiel 2: KeyInsights.tsx

### Vorher:
```typescript
<h3>💡 Why this price?</h3>
<h4>❌ Below Break-Even</h4>
<p>Price is below break-even point</p>
<h4>⚠️ Low Margin</h4>
<h4>💰 Margin Protected</h4>
<h4>🏪 Market Position</h4>
<p>You're the most expensive</p>
<p>Market avg: {price} • {count} competitors tracked</p>
<h4>📦 Inventory Alert</h4>
<p>High stock detected</p>
<h4>📦 Stock Running Low</h4>
<p>Limited inventory remaining</p>
<h4>📈 Demand Growing</h4>
<h4>📉 Demand Declining</h4>
```

### Nachher:
```typescript
'use client'

import { useTranslations } from 'next-intl'
// ... andere imports

export function KeyInsights({ ... }) {
  const t = useTranslations('insights')
  const tMarket = useTranslations('market')
  
  // ... existing code ...
  
  return (
    <div>
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        💡 {t('title')}
      </h3>
      
      {/* Below Break-Even */}
      {insight.type === 'margin_critical' && (
        <>
          <h4>❌ {t('below_breakeven')}</h4>
          <p>{t('breakeven_warning')}</p>
        </>
      )}
      
      {/* Low Margin */}
      {insight.type === 'margin_low' && (
        <h4>⚠️ {t('margin_low')}</h4>
      )}
      
      {/* Margin Protected */}
      {insight.type === 'margin_healthy' && (
        <h4>💰 {t('margin_protected')}</h4>
      )}
      
      {/* Market Position */}
      {insight.type === 'competitive' && (
        <>
          <h4>🏪 {t('market_position')}</h4>
          <p>
            {position === 'most_expensive' && t('most_expensive_desc')}
            {position === 'above_average' && t('above_average_desc')}
            {position === 'average' && t('aligned_average_desc')}
            {position === 'below_average' && t('below_average_desc')}
            {position === 'cheapest' && t('cheapest_option_desc')}
          </p>
          <p>
            {t('market_avg')}: {formatCurrency(avgPrice)} • {count} {t('competitors_tracked')}
          </p>
        </>
      )}
      
      {/* Inventory Alert */}
      {insight.type === 'inventory_high' && (
        <>
          <h4>📦 {t('inventory_alert')}</h4>
          <p>{t('inventory_high')}</p>
        </>
      )}
      
      {/* Stock Running Low */}
      {insight.type === 'inventory_low' && (
        <>
          <h4>📦 {t('inventory_low')}</h4>
          <p>{t('limited_inventory')}</p>
        </>
      )}
      
      {/* Demand Growing */}
      {insight.type === 'demand' && isGrowing && (
        <h4>📈 {t('demand_growing')}</h4>
      )}
      
      {/* Demand Declining */}
      {insight.type === 'demand' && !isGrowing && (
        <h4>📉 {t('demand_declining')}</h4>
      )}
    </div>
  )
}
```

## Beispiel 3: ActionButtons.tsx

### Vorher:
```typescript
<span>Applying...</span>
<span>Apply {formatCurrency(recommendedPrice)}</span>
<span>+{formatCurrency(estimatedMonthlyImpact)}/month est.</span>
<span>Dismiss</span>
<span>Schedule for later</span>
<p>Schedule price change</p>
<label>Date</label>
<label>Time</label>
<button>Schedule Change</button>
<p>This price cannot be applied due to critical warnings...</p>
<p>Margin Warning</p>
```

### Nachher:
```typescript
'use client'

import { useTranslations } from 'next-intl'
// ... andere imports

export function ActionButtons({ ... }) {
  const t = useTranslations('pricing')
  const tCommon = useTranslations('common')
  const tActions = useTranslations('actions')
  
  // ... existing code ...
  
  return (
    <div>
      {/* Apply Button */}
      <button>
        {isApplying ? (
          <>
            <div className="animate-spin" />
            <span>{t('applying')}</span>
          </>
        ) : (
          <>
            <CheckCircle2 />
            <div>
              <span>{t('apply_price', { price: formatCurrency(recommendedPrice) })}</span>
              {estimatedMonthlyImpact && (
                <span>
                  +{formatCurrency(estimatedMonthlyImpact)}{tActions('month_est')}
                </span>
              )}
            </div>
          </>
        )}
      </button>
      
      {/* Dismiss Button */}
      <button>
        <X />
        <span>{tCommon('dismiss')}</span>
      </button>
      
      {/* Schedule Button */}
      <button>
        <Clock />
        <span>{t('schedule_later')}</span>
      </button>
      
      {/* Schedule Panel */}
      {showSchedule && (
        <div>
          <p>{tActions('schedule_price_change')}</p>
          <label>{tActions('date')}</label>
          <label>{tActions('time')}</label>
          <button>{tActions('schedule_change')}</button>
        </div>
      )}
      
      {/* Warning Message */}
      {isDisabled && (
        <p>{tActions('cannot_apply_warning')}</p>
      )}
      
      {/* Margin Warning */}
      {hasMarginWarning && (
        <div>
          <p>{tActions('margin_warning')}</p>
        </div>
      )}
    </div>
  )
}
```

## Beispiel 4: Pluralisierung

### Vorher:
```typescript
<span>{competitorCount} competitors</span>
<span>{productCount} products</span>
```

### Nachher:
```typescript
import { useTranslations } from 'next-intl'

const tMarket = useTranslations('market')
const tShop = useTranslations('shop')

// Automatische Pluralisierung
<span>{tMarket('competitors', { count: competitorCount })}</span>
// DE: "5 Wettbewerber" / "1 Wettbewerber" / "Keine Wettbewerber"
// EN: "5 competitors" / "1 competitor" / "No competitors"

<span>{tShop('products_count', { count: productCount })}</span>
// DE: "5 Produkte" / "1 Produkt" / "Keine Produkte"
// EN: "5 products" / "1 product" / "No products"
```

## Beispiel 5: Variablen in Übersetzungen

### Vorher:
```typescript
<span>Apply {formatCurrency(recommendedPrice)}</span>
<span>Price change: {formatCurrency(amount)} ({formatPercentage(percentage)})</span>
```

### Nachher:
```typescript
import { useTranslations } from 'next-intl'

const t = useTranslations('pricing')

// Mit Variablen
<span>{t('apply_price', { price: formatCurrency(recommendedPrice) })}</span>
// DE: "392,73 € anwenden"
// EN: "Apply 392.73 €"

<span>{t('price_change', { 
  amount: formatCurrency(amount), 
  percentage: formatPercentage(percentage) 
})}</span>
// DE: "Preisänderung: -56,27 € (-12,5%)"
// EN: "Price change: -56.27 € (-12.5%)"
```


