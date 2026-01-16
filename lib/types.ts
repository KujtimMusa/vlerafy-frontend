/**
 * Type-Definitionen für Backend-API Responses
 * Vollständig synchronisiert mit Backend-Schema
 */

// Product Type
export interface Product {
  id: number;
  shop_id: number;
  title: string;
  name?: string;
  price: number;
  shopify_product_id: string;
  shopify_variant_id?: string;
  inventory_quantity?: number;
  cost?: number;
  created_at?: string;
  updated_at?: string;
}

// Recommendation Reasoning (vollständig)
export interface RecommendationReasoning {
  sales_prediction?: number;  // Expected Sales Ratio (0.5-2.0)
  top_features?: Array<{
    name: string;
    value: number;
    importance: number;
  }>;
  warnings?: string[];
  calculations?: Record<string, any>;
  strategies?: Record<string, any>;
  ml_predictions?: {
    combined_ml_confidence?: number;
    meta_approved?: boolean;
  };
  summary?: string;
}

// Recommendation Type (vollständig - alle Backend-Fields)
export interface Recommendation {
  // Basic Fields
  id: number;
  product_id: number;
  shop_id: number;
  
  // Pricing
  current_price: number;
  recommended_price: number;
  price_change_pct?: number;
  
  // ML Fields
  confidence: number;                    // 0-1 (Legacy Overall Confidence)
  overall_confidence?: number;           // NEW: 0-100 (from confidence breakdown)
  strategy: string;                      // "ml_enhanced" | "demand" | "cost" | "competitive" | "inventory"
  status: 'pending' | 'accepted' | 'rejected' | 'applied';
  
  // Reasoning (optional)
  reasoning?: RecommendationReasoning | string;
  
  // Confidence Breakdown (optional)
  ml_confidence?: number;
  base_confidence?: number;
  meta_labeler_confidence?: number;
  
  // Timestamps
  created_at: string;
  updated_at?: string;
  applied_at?: string | null;
  
  // Applied Price (wenn status = "applied")
  applied_price?: number | null;
  
  // Relations
  product?: Product;  // Embedded Product Data
  product_name?: string;
  product_title?: string;
  
  // Strategy Details (optional)
  strategy_details?: Array<{
    strategy: string;
    recommended_price: number;
    confidence: number;
    reasoning: string;
    competitor_context?: any;
  }>;
  
  // Margin Analysis (optional)
  margin_analysis?: {
    is_safe: boolean;
    margin: number;
    warning: string | null;
    message: string;
    details: any;
  };
  
  // Competitor Data (optional)
  competitor_data?: {
    avg: number;
    min: number;
    max: number;
    prices: Array<{
      source: string;
      price: number;
      title?: string;
      url?: string;
    }>;
  };
  
  // Warnings (optional)
  warnings?: Array<{
    type: string;
    severity: string;
    message: string;
  }>;
  
  // Confidence Basis (optional)
  confidence_basis?: {
    ml_models?: number;
    competitor_count?: number;
    sales_30d?: number;
    margin_stable?: boolean;
    margin_pct?: number | null;
  };
  
  // SHAP Explanation (optional)
  shap_explanation?: Array<{
    feature: string;
    impact: number;
    pct: number;
  }>;
  
  // Competitor Count (optional)
  competitor_count?: number;
  
  // Metadata
  generated_at?: string;
}

// API Response Types
export interface GenerateRecommendationResponse {
  success: boolean
  recommendation: Recommendation
  confidence?: {  // NEW: Feature confidence breakdown
    overall_confidence: number  // 0-100
    total_features: number
    available_features: number
    categories: Record<string, {
      percentage: number
      status: string
      available: number
      total: number
      missing_critical: string[]
      missing_non_critical: string[]
      legitimate_zeros: string[]
      not_implemented: string[]
    }>
    warnings?: string[]
    recommendations?: string[]
  }
  details?: any
  shop_context?: {
    shop_id: number
    is_demo: boolean
  }
  message?: string
}

export interface GetRecommendationsResponse {
  product_id: number;
  product_name: string;
  current_price: number;
  recommendations: Recommendation[];
}

export interface AcceptRecommendationResponse {
  success: boolean;
  recommendation: Recommendation;
  message?: string;
}

export interface RejectRecommendationResponse {
  success: boolean;
  recommendation: Recommendation;
  message?: string;
}
