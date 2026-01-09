/**
 * UX-Writer: Generiert benutzerfreundliche UI-Texte aus Recommendation-Daten
 */

interface RecommendationData {
  product_title?: string
  product_name?: string
  current_price: number
  recommended_price: number
  price_change_pct: number
  confidence: number
  strategies?: {
    demand?: { price: number; confidence: number; strategy: string; reasoning: string }
    inventory?: { price: number; confidence: number; strategy: string; reasoning: string }
    cost?: { price: number; confidence: number; strategy: string; reasoning: string }
    competitive?: { price: number; confidence: number; strategy: string; reasoning: string }
  }
  competitor_context?: {
    position: string
    avg_price: number
    min_price: number
    max_price: number
    price_diff_pct: number
    competitor_count: number
  }
  ml_predictions?: {
    combined_ml_confidence?: number
    meta_approved?: boolean
  }
  margin?: {
    is_safe: boolean
    margin_pct: number
  }
  has_insights?: boolean
}

export interface RecommendationTexts {
  headline: string
  bulletPoints: string[]
  confidence: string
  insights: string
}

/**
 * Generiert UI-Texte aus Recommendation-Daten
 */
export function generateRecommendationTexts(data: RecommendationData): RecommendationTexts {
  const priceChange = data.recommended_price - data.current_price
  const isDecrease = priceChange < 0
  const absChangePct = Math.abs(data.price_change_pct)
  
  // 1. HEADLINE (max. 15 Wörter)
  const headline = generateHeadline(data, isDecrease, absChangePct)
  
  // 2. BULLET POINTS (3-5 Punkte)
  const bulletPoints = generateBulletPoints(data)
  
  // 3. CONFIDENCE TEXT
  const confidence = generateConfidenceText(data)
  
  // 4. INSIGHTS TEXT
  const insights = generateInsightsText(data)
  
  return {
    headline,
    bulletPoints,
    confidence,
    insights
  }
}

function generateHeadline(
  data: RecommendationData,
  isDecrease: boolean,
  absChangePct: number
): string {
  const direction = isDecrease ? 'Preissenkung' : 'Preiserhöhung'
  const reason = isDecrease 
    ? 'um wettbewerbsfähig zu bleiben'
    : 'aufgrund gestiegener Nachfrage'
  
  return `Empfohlene ${direction} um ${absChangePct.toFixed(1)}%, ${reason}.`
}

function generateBulletPoints(data: RecommendationData): string[] {
  const bullets: string[] = []
  
  // Competitor Context (höchste Priorität)
  if (data.competitor_context) {
    const ctx = data.competitor_context
    const positionText = getPositionText(ctx.position)
    const diffText = ctx.price_diff_pct > 0 
      ? `${ctx.price_diff_pct.toFixed(1)}% über`
      : `${Math.abs(ctx.price_diff_pct).toFixed(1)}% unter`
    
    bullets.push(
      `Du liegst aktuell ${diffText} dem durchschnittlichen Marktpreis (${formatPrice(ctx.avg_price)}).`
    )
    
    if (positionText !== 'unknown') {
      bullets.push(
        `Deine Position: ${positionText} (${ctx.competitor_count} Wettbewerber analysiert).`
      )
    }
  }
  
  // Inventory Strategy
  if (data.strategies?.inventory) {
    const inv = data.strategies.inventory
    if (inv.reasoning.includes('Normaler Bestand') || inv.reasoning.includes('normal')) {
      const stockMatch = inv.reasoning.match(/\((\d+)\)/)
      const stock = stockMatch ? stockMatch[1] : ''
      bullets.push(
        `Dein Bestand ist normal${stock ? ` (${stock} Stück)` : ''} – es besteht kein akuter Abverkaufsdruck.`
      )
    } else if (inv.reasoning.includes('Hoher Bestand') || inv.reasoning.includes('hoch')) {
      bullets.push(
        'Dein Bestand ist hoch – eine Preissenkung könnte den Absatz ankurbeln.'
      )
    } else if (inv.reasoning.includes('Niedriger Bestand') || inv.reasoning.includes('niedrig')) {
      bullets.push(
        'Dein Bestand ist niedrig – du könntest den Preis erhöhen, ohne Absatz zu verlieren.'
      )
    }
  }
  
  // Cost/Margin Strategy
  if (data.strategies?.cost) {
    const cost = data.strategies.cost
    const marginMatch = cost.reasoning.match(/(\d+)%/i)
    const targetMargin = marginMatch ? marginMatch[1] : '30'
    
    bullets.push(
      `Die empfohlene Anpassung hält deine Zielmarge von ca. ${targetMargin}% ein.`
    )
  }
  
  // Margin Analysis
  if (data.margin) {
    if (data.margin.is_safe && data.margin.margin_pct >= 20) {
      bullets.push(
        `Deine Marge bleibt mit ${data.margin.margin_pct.toFixed(1)}% auf einem gesunden Niveau.`
      )
    } else if (data.margin.margin_pct < 20) {
      bullets.push(
        `Achtung: Deine Marge liegt bei ${data.margin.margin_pct.toFixed(1)}% – unter dem empfohlenen Minimum von 20%.`
      )
    }
  }
  
  // Demand Strategy (nur wenn relevant)
  if (data.strategies?.demand) {
    const demand = data.strategies.demand
    if (demand.confidence > 0.6 && !demand.reasoning.includes('Zu wenig Daten')) {
      if (demand.reasoning.includes('wachsend') || demand.reasoning.includes('steigend')) {
        bullets.push(
          'Die Nachfrage zeigt einen positiven Trend – eine moderate Preiserhöhung könnte möglich sein.'
        )
      } else if (demand.reasoning.includes('rückläufig') || demand.reasoning.includes('sinkend')) {
        bullets.push(
          'Die Nachfrage ist rückläufig – eine Preissenkung könnte den Absatz stabilisieren.'
        )
      }
    }
  }
  
  // Fallback: Mindestens 2 Bullets
  if (bullets.length < 2) {
    bullets.push(
      'Die Empfehlung basiert auf einer Analyse deiner aktuellen Preislage und Marktvergleichen.'
    )
    bullets.push(
      'Der empfohlene Preis optimiert deine Wettbewerbsposition bei gleichbleibender Profitabilität.'
    )
  }
  
  return bullets.slice(0, 5) // Max. 5 Bullets
}

function generateConfidenceText(data: RecommendationData): string {
  const confidencePct = (data.confidence * 100).toFixed(1)
  const mlConfidence = data.ml_predictions?.combined_ml_confidence
    ? (data.ml_predictions.combined_ml_confidence * 100).toFixed(1)
    : null
  
  const parts: string[] = []
  
  if (data.confidence >= 0.8) {
    parts.push('Hohe Sicherheit')
  } else if (data.confidence >= 0.6) {
    parts.push('Moderate Sicherheit')
  } else {
    parts.push('Eingeschränkte Sicherheit')
  }
  
  parts.push(`${confidencePct}%`)
  
  const factors: string[] = []
  if (data.competitor_context) {
    factors.push('Wettbewerbsvergleich')
  }
  if (data.strategies?.cost) {
    factors.push('Kosten')
  }
  if (data.strategies?.inventory) {
    factors.push('Bestand')
  }
  if (mlConfidence) {
    factors.push('historische Daten')
  }
  
  if (factors.length > 0) {
    parts.push(`basierend auf ${factors.join(', ')}`)
  }
  
  if (mlConfidence && parseFloat(mlConfidence) > 90) {
    parts.push(`und ML-Vorhersage (${mlConfidence}%)`)
  }
  
  return parts.join(': ') + '.'
}

function generateInsightsText(data: RecommendationData): string {
  if (data.has_insights) {
    const insights: string[] = []
    
    // Extreme Preisposition
    if (data.competitor_context) {
      if (data.competitor_context.position === 'most_expensive' && data.competitor_context.price_diff_pct > 30) {
        insights.push(
          `Du bist deutlich teurer als der Markt (${data.competitor_context.price_diff_pct.toFixed(1)}% über Durchschnitt).`
        )
      } else if (data.competitor_context.position === 'cheapest' && Math.abs(data.competitor_context.price_diff_pct) > 20) {
        insights.push(
          `Du bist deutlich günstiger als der Markt – eine moderate Preiserhöhung könnte möglich sein.`
        )
      }
    }
    
    // Margin-Warnung
    if (data.margin && !data.margin.is_safe) {
      insights.push(
        `Achtung: Die empfohlene Preisänderung würde deine Marge auf ${data.margin.margin_pct.toFixed(1)}% reduzieren.`
      )
    }
    
    return insights.join(' ') || 'Aktuell liegen keine besonderen Auffälligkeiten vor.'
  }
  
  return 'Aktuell liegen keine besonderen Auffälligkeiten vor. Die Empfehlung basiert auf Standardmodellen und den aktuellen Marktpreisen.'
}

function getPositionText(position: string): string {
  const map: Record<string, string> = {
    'most_expensive': 'Teuerste Option',
    'above_average': 'Über dem Durchschnitt',
    'average': 'Marktdurchschnitt',
    'below_average': 'Unter dem Durchschnitt',
    'cheapest': 'Günstigste Option',
    'unknown': 'Unbekannt'
  }
  return map[position] || 'Unbekannt'
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}










