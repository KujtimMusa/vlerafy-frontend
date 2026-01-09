/**
 * UX-Writer: Generiert saubere Wettbewerbs-Analyse-Texte aus Rohdaten
 * Filtert und klassifiziert Angebote, berechnet Kennzahlen, generiert UI-Texte
 */

interface CompetitorOffer {
  source: string
  title: string
  price: number
  rating?: number
  url: string
  condition?: 'new' | 'used' | 'refurbished'
}

interface CompetitorAnalysisInput {
  product_title: string
  our_price: number
  offers: CompetitorOffer[]
  data_age_days?: number
}

interface CompetitorAnalysisResult {
  summary: string
  marketOverview: string[]
  position: string
  dataQuality: string
}

// Quellen, die ausgeschlossen werden sollen
const EXCLUDED_SOURCES = [
  'kleinanzeigen',
  'ebay kleinanzeigen',
  'willhaben',
  'facebook marketplace',
  'shpock',
  'vinted',
  'ebay' // Außer explizit "eBay-Shop" mit "Neu"
]

// Schlüsselwörter in Titeln, die auf Bundles/Varianten hinweisen
const BUNDLE_KEYWORDS = [
  'bundle',
  'set',
  'kit',
  'paket',
  'creator edition',
  'limited edition',
  'special edition',
  'travel bundle',
  'starter kit',
  'combo',
  'pack',
  '+',
  'mit',
  'inkl.',
  'inklusive',
  'includes',
  'enthält',
  'zubehör',
  'accessories'
]

/**
 * Prüft ob ein Titel ein Bundle/Variante ist
 */
function isBundleOrVariant(title: string): boolean {
  const titleLower = title.toLowerCase()
  
  // Prüfe auf Bundle-Keywords
  for (const keyword of BUNDLE_KEYWORDS) {
    if (titleLower.includes(keyword)) {
      // Ausnahme: "Standard Edition" ist OK
      if (keyword === 'edition' && titleLower.includes('standard edition')) {
        continue
      }
      return true
    }
  }
  
  // Prüfe auf Pattern wie "+ Produkt" oder "mit Zubehör"
  if (/\+\s*[A-Za-z]/.test(title) || /mit\s+[A-Za-z]/.test(titleLower)) {
    return true
  }
  
  return false
}

/**
 * Prüft ob eine Quelle ausgeschlossen werden soll
 */
function isExcludedSource(source: string): boolean {
  const sourceLower = source.toLowerCase()
  
  for (const excluded of EXCLUDED_SOURCES) {
    if (sourceLower.includes(excluded)) {
      // Ausnahme: "eBay-Shop" mit explizit "Neu" könnte OK sein
      // Aber für jetzt: alle eBay ausschließen
      return true
    }
  }
  
  return false
}

/**
 * Filtert vergleichbare Angebote (core_offers)
 */
function filterComparableOffers(offers: CompetitorOffer[]): CompetitorOffer[] {
  return offers.filter(offer => {
    // MUSS: condition = "new"
    if (offer.condition !== 'new') {
      return false
    }
    
    // MUSS: Quelle nicht ausgeschlossen
    if (isExcludedSource(offer.source)) {
      return false
    }
    
    // MUSS: Titel kein Bundle/Variante
    if (isBundleOrVariant(offer.title)) {
      return false
    }
    
    return true
  })
}

/**
 * Berechnet Kennzahlen aus core_offers
 */
function calculateMetrics(coreOffers: CompetitorOffer[]) {
  if (coreOffers.length === 0) {
    return {
      core_count: 0,
      core_min: 0,
      core_max: 0,
      core_avg: 0,
      price_spread_pct: 0
    }
  }
  
  const prices = coreOffers.map(o => o.price).sort((a, b) => a - b)
  const core_min = Math.round(prices[0] * 100) / 100
  const core_max = Math.round(prices[prices.length - 1] * 100) / 100
  const core_avg = Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100
  const price_spread_pct = core_avg > 0 ? ((core_max - core_min) / core_avg) * 100 : 0
  
  return {
    core_count: coreOffers.length,
    core_min,
    core_max,
    core_avg,
    price_spread_pct: Math.round(price_spread_pct * 100) / 100
  }
}

/**
 * Bestimmt Position relativ zum Durchschnitt
 */
function determinePosition(ourPrice: number, coreAvg: number): string {
  if (coreAvg === 0) {
    return 'unbekannt'
  }
  
  const diffPct = ((ourPrice - coreAvg) / coreAvg) * 100
  
  if (diffPct < -15) {
    return 'deutlich unter Durchschnitt'
  } else if (diffPct < -5) {
    return 'unter Durchschnitt'
  } else if (diffPct <= 5) {
    return 'im Bereich des Durchschnitts'
  } else if (diffPct <= 20) {
    return 'über Durchschnitt'
  } else {
    return 'deutlich über Durchschnitt'
  }
}

/**
 * Prüft Datenqualität
 */
function assessDataQuality(
  coreCount: number,
  dataAgeDays: number,
  priceSpreadPct: number
): { isUncertain: boolean; reasons: string[] } {
  const reasons: string[] = []
  let isUncertain = false
  
  if (coreCount < 3) {
    isUncertain = true
    reasons.push('zu wenig vergleichbare Angebote')
  }
  
  if (dataAgeDays > 7) {
    isUncertain = true
    reasons.push(`Daten sind ${dataAgeDays} Tage alt`)
  }
  
  if (priceSpreadPct > 40) {
    isUncertain = true
    reasons.push('sehr hohe Preisstreuung')
  }
  
  return { isUncertain, reasons }
}

/**
 * Formatiert Preis auf Deutsch
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

/**
 * Generiert Wettbewerbs-Analyse-Texte
 */
export function generateCompetitorAnalysisTexts(
  input: CompetitorAnalysisInput
): CompetitorAnalysisResult {
  // 1. Filtere vergleichbare Angebote
  const coreOffers = filterComparableOffers(input.offers)
  
  // 2. Berechne Kennzahlen
  const metrics = calculateMetrics(coreOffers)
  
  // 3. Bestimme Position
  const positionText = determinePosition(input.our_price, metrics.core_avg)
  
  // 4. Prüfe Datenqualität
  const dataAge = input.data_age_days || 0
  const quality = assessDataQuality(metrics.core_count, dataAge, metrics.price_spread_pct)
  
  // 5. Zusätzliche Kennzahlen (optional)
  const usedOffers = input.offers.filter(o => o.condition === 'used')
  const bundleOffers = input.offers.filter(o => 
    o.condition === 'new' && isBundleOrVariant(o.title)
  )
  
  const usedMin = usedOffers.length > 0 
    ? Math.round(Math.min(...usedOffers.map(o => o.price)) * 100) / 100
    : null
  
  const bundleMin = bundleOffers.length > 0
    ? Math.round(Math.min(...bundleOffers.map(o => o.price)) * 100) / 100
    : null
  
  // 6. Generiere Zusammenfassung
  const summary = generateSummary(input.our_price, metrics, coreOffers.length)
  
  // 7. Generiere Markt-Überblick
  const marketOverview = generateMarketOverview(metrics, usedMin, bundleMin, coreOffers.length)
  
  // 8. Generiere Positions-Text
  const position = generatePositionText(positionText, metrics, input.our_price)
  
  // 9. Generiere Datenqualitäts-Text
  const dataQuality = generateDataQualityText(quality, dataAge, metrics.core_count)
  
  return {
    summary,
    marketOverview,
    position,
    dataQuality
  }
}

function generateSummary(
  ourPrice: number,
  metrics: ReturnType<typeof calculateMetrics>,
  coreCount: number
): string {
  if (coreCount === 0) {
    return `Keine vergleichbaren Neuware-Angebote gefunden.`
  }
  
  if (coreCount === 1) {
    const diff = ourPrice - metrics.core_avg
    const diffText = diff > 0 
      ? `${formatPrice(Math.abs(diff))} teurer`
      : `${formatPrice(Math.abs(diff))} günstiger`
    
    return `Du liegst mit ${formatPrice(ourPrice)} ${diffText} als das einzige vergleichbare Neuware-Angebot (${formatPrice(metrics.core_avg)}).`
  }
  
  const diffPct = metrics.core_avg > 0 
    ? ((ourPrice - metrics.core_avg) / metrics.core_avg) * 100 
    : 0
  
  if (Math.abs(diffPct) < 1) {
    return `Du liegst mit ${formatPrice(ourPrice)} nahe am Marktdurchschnitt von ${formatPrice(metrics.core_avg)}.`
  }
  
  const direction = diffPct > 0 ? 'über' : 'unter'
  const absDiffPct = Math.abs(diffPct).toFixed(1)
  
  return `Du liegst mit ${formatPrice(ourPrice)} ${absDiffPct}% ${direction} dem Marktdurchschnitt von ${formatPrice(metrics.core_avg)}.`
}

function generateMarketOverview(
  metrics: ReturnType<typeof calculateMetrics>,
  usedMin: number | null,
  bundleMin: number | null,
  coreCount: number
): string[] {
  const bullets: string[] = []
  
  if (coreCount === 0) {
    bullets.push('Keine vergleichbaren Neuware-Angebote gefunden.')
  } else if (coreCount === 1) {
    bullets.push(`Nur 1 vergleichbares Neuware-Angebot gefunden (${formatPrice(metrics.core_avg)}).`)
  } else {
    bullets.push(
      `${coreCount} vergleichbare Neuware-Angebote gefunden (Spanne: ${formatPrice(metrics.core_min)} – ${formatPrice(metrics.core_max)}).`
    )
    bullets.push(
      `Durchschnittspreis: ${formatPrice(metrics.core_avg)}.`
    )
  }
  
  if (bundleMin !== null) {
    bullets.push(
      `Bundles mit Zubehör starten ab ${formatPrice(bundleMin)} (nicht in der Berechnung).`
    )
  }
  
  if (usedMin !== null) {
    bullets.push(
      `Gebrauchtangebote starten ab ${formatPrice(usedMin)} (nicht in der Berechnung).`
    )
  }
  
  return bullets
}

function generatePositionText(
  positionText: string,
  metrics: ReturnType<typeof calculateMetrics>,
  ourPrice: number
): string {
  if (metrics.core_count === 0) {
    return 'Vergleichsbasis fehlt – Position kann nicht bestimmt werden.'
  }
  
  if (metrics.core_count < 3) {
    return 'Vergleichsbasis ist sehr dünn – Position kann nicht sicher bestimmt werden.'
  }
  
  if (positionText === 'im Bereich des Durchschnitts') {
    return `Du liegst im Bereich des Marktdurchschnitts – wettbewerbsfähige Position.`
  }
  
  return `Deine Position: ${positionText} (${formatPrice(ourPrice)} vs. Durchschnitt ${formatPrice(metrics.core_avg)}).`
}

function generateDataQualityText(
  quality: { isUncertain: boolean; reasons: string[] },
  dataAge: number,
  coreCount: number
): string {
  if (!quality.isUncertain) {
    const ageText = dataAge === 0 
      ? 'aktuell' 
      : dataAge === 1 
        ? 'vor 1 Tag' 
        : `vor ${dataAge} Tagen`
    
    return `Wettbewerbsdaten sind zuverlässig (${coreCount} vergleichbare Angebote, Stand: ${ageText}).`
  }
  
  const reasonsText = quality.reasons.join(', ')
  const ageText = dataAge === 0 
    ? 'aktuell' 
    : dataAge === 1 
      ? 'vor 1 Tag' 
      : `vor ${dataAge} Tagen`
  
  return `Hinweis: Wettbewerbsdaten sind eingeschränkt zuverlässig (${reasonsText}, Stand: ${ageText}).`
}






