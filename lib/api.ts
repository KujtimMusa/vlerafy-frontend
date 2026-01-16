export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Dashboard Stats API
 * Lädt Missed Revenue und Trust Ladder Daten
 */
export async function getDashboardStats() {
  const response = await fetch(`${API_URL}/api/dashboard/stats`, {
    headers: getHeaders()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Dashboard-Daten');
  }
  return response.json();
}

// Session-ID Management
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';
  
  // Versuche Session-ID aus localStorage zu holen
  let sessionId = localStorage.getItem('session_id');
  
  if (!sessionId) {
    // Generiere neue Session-ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
    console.log('[API] Neue Session-ID generiert:', sessionId);
  }
  
  return sessionId;
}

// Helper: Füge Session-ID zu Headers hinzu
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const sessionId = getOrCreateSessionId();
  if (sessionId) {
    headers['X-Session-ID'] = sessionId;
  }
  
  return headers;
}

export async function fetchProducts(shopId?: number) {
  // Wenn shopId übergeben wird, nutze es (Backward-Compatibility)
  // Sonst nutze Shop-Context vom Backend
  const url = shopId 
    ? `${API_URL}/products/?shop_id=${shopId}`
    : `${API_URL}/products/`;
  const response = await fetch(url, {
    headers: getHeaders()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Produkte');
  }
  return response.json();
}

export async function syncProducts(shopId: number) {
  const response = await fetch(`${API_URL}/products/sync/${shopId}`, {
    method: 'POST',
  });
  return response.json();
}

export async function getRecommendations(productId: number) {
  const response = await fetch(`${API_URL}/recommendations/product/${productId}`, {
    headers: getHeaders()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Empfehlungen');
  }
  const data = await response.json();
  // ✅ Return komplettes Response-Object (alle Fields!)
  return data;
}

/**
 * ✅ NEW: Accept Recommendation
 * 
 * Marks a recommendation as "accepted"
 * Backend Endpoint: PATCH /recommendations/{id}/accept
 */
export async function acceptRecommendation(recommendationId: number) {
  const response = await fetch(`${API_URL}/recommendations/${recommendationId}/accept`, {
    method: 'PATCH',
    headers: getHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Akzeptieren der Empfehlung');
  }
  return response.json();
}

/**
 * ✅ NEW: Reject Recommendation
 * 
 * Marks a recommendation as "rejected"
 * Backend Endpoint: PATCH /recommendations/{id}/reject
 */
export async function rejectRecommendation(recommendationId: number, reason?: string) {
  const response = await fetch(`${API_URL}/recommendations/${recommendationId}/reject`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ reason }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Ablehnen der Empfehlung');
  }
  return response.json();
}

/**
 * ✅ NEW: Get Recommendation by ID
 * 
 * Fetches a single recommendation with all details
 * Backend Endpoint: GET /recommendations/{id}
 */
export async function getRecommendation(recommendationId: number) {
  const response = await fetch(`${API_URL}/recommendations/${recommendationId}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Empfehlung');
  }
  const data = await response.json();
  // ✅ Return komplettes Recommendation-Object
  return data;
}

/**
 * ⚠️ DEPRECATED: Use generateRecommendation() instead
 * 
 * This function now ALWAYS generates fresh recommendations.
 * Never uses cached/stale data from database.
 * 
 * For pricing decisions, you ALWAYS want the latest:
 * - Current competitor prices
 * - Real-time inventory
 * - Recent sales trends
 * - Current market conditions
 */
export async function getLatestRecommendation(productId: number) {
  // ALWAYS generate fresh - never use cached!
  // This ensures recommendations reflect CURRENT market data
  return generateRecommendation(productId);
}

/**
 * ✅ PRIMARY ENDPOINT for recommendations
 * 
 * Generates FRESH recommendation using:
 * - Latest CSV/Shopify data
 * - Current competitor prices
 * - Real-time inventory
 * - Recent sales trends (90 days)
 * 
 * Always call this for live pricing decisions.
 * Never uses cached/stale recommendations.
 * 
 * Performance: ~1-2 seconds (acceptable for pricing use case)
 * 
 * Returns: Complete Recommendation object with ALL Backend-Fields
 */
export async function generateRecommendation(productId: number) {
  const response = await fetch(`${API_URL}/recommendations/generate/${productId}`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Generieren der Empfehlung');
  }
  const data = await response.json();
  // ✅ Return komplettes Recommendation-Object (alle Fields!)
  // Enthält jetzt: confidence, strategy, status, reasoning, ml_confidence, etc.
  // NEW: Enthält auch feature_confidence für Feature Confidence Breakdown
  return data;
}

// Competitor Analysis API (automatische Suche mit Serper)
// Die alten manuellen Competitor-Tracking-Funktionen wurden entfernt
// Es wird nur noch die automatische Suche verwendet

// Shop Management API
export async function getAvailableShops() {
  const response = await fetch(`${API_URL}/shops`, {
    headers: getHeaders()
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Fehler beim Laden der Shops');
  }
  return response.json();
}

export async function getCurrentShop() {
  const response = await fetch(`${API_URL}/shops/current`, {
    headers: getHeaders()
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Fehler beim Laden des aktuellen Shops');
  }
  return response.json();
}

export async function switchShop(shopId: number, useDemo: boolean) {
  const response = await fetch(`${API_URL}/shops/switch`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ shop_id: shopId, use_demo: useDemo }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Fehler beim Wechseln des Shops');
  }
  return response.json();
}

// Competitor Search mit Serper API (automatische Suche)
export interface CompetitorPrice {
  source: string;
  title: string;
  price: number;
  url: string;
  rating?: number;
  reviews?: number;
  scraped_at: string;
}

export interface CompetitorSearchResponse {
  product_id: number;
  product_title: string;
  competitors: CompetitorPrice[];
  summary: {
    found: number;
    avg_price: number;
    min_price: number;
    max_price: number;
    your_position: 'cheapest' | 'below_average' | 'average' | 'above_average' | 'most_expensive' | 'unknown';
  };
  your_price: number;
}

export async function searchCompetitors(
  productId: number | string,
  options?: {
    maxResults?: number;
    forceRefresh?: boolean;
  }
): Promise<CompetitorSearchResponse> {
  const params = new URLSearchParams();
  if (options?.maxResults) params.set('max_results', String(options.maxResults));
  if (options?.forceRefresh) params.set('force_refresh', 'true');
  
  const response = await fetch(
    `${API_URL}/competitors/products/${productId}/competitor-search?${params}`,
    { 
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include'
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Competitor search failed');
  }
  return response.json();
}

// ==========================================
// MARGIN CALCULATOR API
// ==========================================

export interface ProductCostData {
  purchase_cost: number;
  shipping_cost: number;
  packaging_cost: number;
  payment_provider: string;
  country_code: string;
  category?: string;
}

export interface MarginCalculationResult {
  has_cost_data: boolean;
  selling_price: number;
  net_revenue: number;
  costs: {
    purchase: number;
    shipping: number;
    packaging: number;
    payment_fee: number;
    total_variable: number;
  };
  margin: {
    euro: number;
    percent: number;
  };
  break_even_price: number;
  recommended_min_price: number;
  is_above_break_even: boolean;
  is_above_min_margin: boolean;
}

export interface MarginValidationResult {
  is_safe: boolean;
  margin: number | null;
  warning: string | null;
  message: string;
  details?: MarginCalculationResult;
}

export interface MarginHealthData {
  healthy: number;
  moderate: number;
  low: number;
  negative: number;
  no_costs: number;
  total_products_with_costs: number;
  critical_products?: Array<{
    product_id: string;
    title: string;
    current_price: number;
    margin_percent: number;
    health_status: string;
  }>;
}

// Save product costs
export async function saveProductCosts(productId: string, costData: ProductCostData) {
  const response = await fetch(`${API_URL}/margin/costs`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({
      product_id: productId,
      ...costData
    })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Speichern der Kosten');
  }
  return response.json();
}

// Get product costs
export async function getProductCosts(productId: string): Promise<ProductCostData | null> {
  const response = await fetch(`${API_URL}/margin/costs/${productId}`, {
    headers: getHeaders(),
    credentials: 'include'
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Kosten');
  }
  return response.json();
}

// Update product costs
export async function updateProductCosts(productId: string, costData: Partial<ProductCostData>) {
  const response = await fetch(`${API_URL}/margin/costs/${productId}`, {
    method: 'PUT',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(costData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Aktualisieren der Kosten');
  }
  return response.json();
}

// Calculate margin
export async function calculateMargin(productId: string, sellingPrice: number): Promise<MarginCalculationResult> {
  const response = await fetch(`${API_URL}/margin/calculate/${productId}`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({
      selling_price: sellingPrice,
      save_to_history: true,
      triggered_by: 'manual'
    })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Berechnen der Marge');
  }
  return response.json();
}

// Validate price recommendation
export async function validatePriceRecommendation(productId: string, recommendedPrice: number): Promise<MarginValidationResult> {
  const response = await fetch(`${API_URL}/margin/validate`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({
      product_id: productId,
      recommended_price: recommendedPrice
    })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler bei der Preisvalidierung');
  }
  return response.json();
}

// Get margin health overview
export async function getMarginHealthOverview(): Promise<MarginHealthData> {
  const response = await fetch(`${API_URL}/margin/dashboard/health`, {
    headers: getHeaders(),
    credentials: 'include'
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Margin-Übersicht');
  }
  return response.json();
}

// Get category defaults
export async function getCategoryDefaults(category: string) {
  const response = await fetch(`${API_URL}/margin/category-defaults/${category}`, {
    headers: getHeaders(),
    credentials: 'include'
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Category-Defaults');
  }
  return response.json();
}

// Estimate costs from price
export async function estimateCostsFromPrice(sellingPrice: number, category: string, countryCode: string = 'DE') {
  const response = await fetch(`${API_URL}/margin/estimate-costs?selling_price=${sellingPrice}&category=${category}&country_code=${countryCode}`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include'
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Schätzen der Kosten');
  }
  return response.json();
}

// Check if product has cost data
export async function hasCostData(productId: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/margin/has-costs/${productId}`, {
    headers: getHeaders(),
    credentials: 'include'
  });
  if (!response.ok) {
    return false;
  }
  const data = await response.json();
  return data.has_cost_data || false;
}

