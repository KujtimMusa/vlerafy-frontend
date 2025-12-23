'use client'

import React, { useState, useEffect } from 'react'
import { X, Info, TrendingUp, Loader2 } from 'lucide-react'
import { API_URL, getProductCosts, getCategoryDefaults, estimateCostsFromPrice } from '@/lib/api'

interface CostInputModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productTitle: string
  currentPrice?: number
  shopId: string
  onSave: (costData: ProductCostData) => Promise<void>
}

interface ProductCostData {
  purchase_cost: number
  shipping_cost: number
  packaging_cost: number
  payment_provider: string
  country_code: string
  category?: string
}

interface CategoryDefaults {
  typical_margin: number
  shipping_estimate: number
  packaging_estimate: number
}

export function CostInputModal({
  isOpen,
  onClose,
  productId,
  productTitle,
  currentPrice,
  shopId,
  onSave
}: CostInputModalProps) {
  const [costData, setCostData] = useState<ProductCostData>({
    purchase_cost: 0,
    shipping_cost: 0,
    packaging_cost: 0,
    payment_provider: 'stripe',
    country_code: 'DE',
    category: undefined
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showEstimates, setShowEstimates] = useState(false)
  const [categoryDefaults, setCategoryDefaults] = useState<CategoryDefaults | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const categories = ['fashion', 'electronics', 'beauty', 'home', 'food']
  const paymentProviders = [
    { value: 'stripe', label: 'Stripe (2.9% + €0.30)' },
    { value: 'paypal', label: 'PayPal (2.49% + €0.35)' },
    { value: 'klarna', label: 'Klarna (4.5%)' },
    { value: 'custom', label: 'Custom' }
  ]
  
  // Load existing cost data
  useEffect(() => {
    if (isOpen && productId) {
      loadExistingCosts()
    }
  }, [isOpen, productId])
  
  const loadExistingCosts = async () => {
    try {
      const data = await getProductCosts(productId)
      if (data) {
        setCostData({
          purchase_cost: data.purchase_cost,
          shipping_cost: data.shipping_cost,
          packaging_cost: data.packaging_cost,
          payment_provider: data.payment_provider,
          country_code: data.country_code,
          category: data.category
        })
      }
    } catch (error) {
      console.error('Failed to load costs:', error)
      setError('Fehler beim Laden der Kosten')
    }
  }
  
  // Load category defaults when category changes
  useEffect(() => {
    if (costData.category) {
      loadCategoryDefaults(costData.category)
    }
  }, [costData.category])
  
  const loadCategoryDefaults = async (category: string) => {
    try {
      const data = await getCategoryDefaults(category)
      setCategoryDefaults(data)
    } catch (error) {
      console.error('Failed to load category defaults:', error)
    }
  }
  
  const handleEstimateCosts = async () => {
    if (!currentPrice || !costData.category) {
      setError('Bitte wähle zuerst eine Kategorie')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const estimates = await estimateCostsFromPrice(
        currentPrice,
        costData.category,
        costData.country_code
      )
      
      setCostData(prev => ({
        ...prev,
        purchase_cost: estimates.estimated_purchase_cost,
        shipping_cost: estimates.estimated_shipping_cost,
        packaging_cost: estimates.estimated_packaging_cost
      }))
      setShowEstimates(true)
    } catch (error) {
      console.error('Failed to estimate costs:', error)
      setError('Fehler beim Schätzen der Kosten')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleApplyDefaults = () => {
    if (categoryDefaults) {
      setCostData(prev => ({
        ...prev,
        shipping_cost: categoryDefaults.shipping_estimate,
        packaging_cost: categoryDefaults.packaging_estimate
      }))
    }
  }
  
  const handleSave = async () => {
    // Validation
    if (costData.purchase_cost <= 0) {
      setError('Einkaufspreis muss größer als 0 sein')
      return
    }
    
    setIsSaving(true)
    setError(null)
    
    try {
      await onSave(costData)
      onClose()
    } catch (error) {
      console.error('Failed to save costs:', error)
      setError('Fehler beim Speichern der Kosten')
    } finally {
      setIsSaving(false)
    }
  }
  
  if (!isOpen) return null
  
  const totalCosts = costData.purchase_cost + costData.shipping_cost + costData.packaging_cost
  const estimatedMargin = currentPrice 
    ? ((currentPrice / 1.19 - totalCosts) / (currentPrice / 1.19) * 100)
    : 0
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Kosten hinterlegen
              </h2>
              <p className="text-sm text-gray-600">{productTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}
        
        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategorie
            </label>
            <select
              value={costData.category || ''}
              onChange={(e) => setCostData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Kategorie wählen...</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            
            {categoryDefaults && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium">Typisch für {costData.category}:</p>
                    <p>Versand: €{categoryDefaults.shipping_estimate.toFixed(2)}, 
                       Verpackung: €{categoryDefaults.packaging_estimate.toFixed(2)}</p>
                      <button
                        onClick={handleApplyDefaults}
                        className="text-blue-600 hover:text-blue-800 font-medium mt-1 underline"
                      >
                        → Werte übernehmen
                      </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
            {/* Estimate Button */}
          {currentPrice && costData.category && (
            <button
              onClick={handleEstimateCosts}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              <span>
                {isLoading ? 'Schätze...' : `Kosten schätzen (Verkaufspreis: €${currentPrice.toFixed(2)})`}
              </span>
            </button>
          )}
          
          {showEstimates && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              ⚠️ Dies sind Schätzungen basierend auf Branchendurchschnitten. 
              Bitte mit echten Daten ersetzen!
            </div>
          )}
          
          {/* Cost Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Purchase Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Einkaufspreis (netto) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costData.purchase_cost || ''}
                  onChange={(e) => setCostData(prev => ({ 
                    ...prev, 
                    purchase_cost: parseFloat(e.target.value) || 0 
                  }))}
                    className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500">€</span>
              </div>
            </div>
            
            {/* Shipping Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📦 Versandkosten (pro Stück)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costData.shipping_cost || ''}
                  onChange={(e) => setCostData(prev => ({ 
                    ...prev, 
                    shipping_cost: parseFloat(e.target.value) || 0 
                  }))}
                    className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500">€</span>
              </div>
            </div>
            
            {/* Packaging Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📦 Verpackung (pro Stück)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costData.packaging_cost || ''}
                  onChange={(e) => setCostData(prev => ({ 
                    ...prev, 
                    packaging_cost: parseFloat(e.target.value) || 0 
                  }))}
                    className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500">€</span>
              </div>
            </div>
            
            {/* Payment Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💳 Payment Provider
              </label>
              <select
                value={costData.payment_provider}
                onChange={(e) => setCostData(prev => ({ ...prev, payment_provider: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {paymentProviders.map(provider => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Country Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌍 Land (MwSt)
              </label>
              <select
                value={costData.country_code}
                onChange={(e) => setCostData(prev => ({ ...prev, country_code: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="DE">Deutschland (19%)</option>
                <option value="AT">Österreich (20%)</option>
                <option value="CH">Schweiz (7.7%)</option>
                <option value="GB">UK (20%)</option>
                <option value="US">USA (0%)</option>
              </select>
            </div>
            
          </div>
          
          {/* Cost Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Summe variable Kosten:</span>
              <span className="font-semibold">€{totalCosts.toFixed(2)}</span>
            </div>
            
            {currentPrice && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Aktueller Preis:</span>
                  <span className="font-semibold">€{currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Geschätzte Marge:</span>
                  <span className={estimatedMargin >= 20 ? 'text-green-600' : 'text-orange-600'}>
                    {estimatedMargin.toFixed(1)}%
                  </span>
                </div>
              </>
            )}
          </div>
          
        </div>
        
          {/* Footer */}
          <div className="flex gap-3 p-6 border-t bg-gray-50 sticky bottom-0">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || costData.purchase_cost === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Speichern...</span>
                </>
              ) : (
                <span>Speichern</span>
              )}
            </button>
          </div>
          
        </div>
      </div>
    </>
  )
}

