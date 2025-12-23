'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/navigation'
import { ShopSwitcher } from '@/components/ShopSwitcher'
import { useShop } from '@/hooks/useShop'

export default function Home() {
  const { currentShop, isDemoMode, shops, loading } = useShop()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar mit Shop-Switcher */}
      <aside className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Dynamic Pricing</h2>
        
        {/* Shop Switcher */}
        <div className="mb-6">
          <ShopSwitcher />
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          <Link 
            href="/" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/products" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Products
          </Link>
          <Link 
            href="/recommendations" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Recommendations
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span>🧪</span>
              <span className="font-medium">Demo Mode Active</span>
              <span className="text-blue-600">
                • Testing with {currentShop?.product_count || 20} synthetic products
              </span>
            </div>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Pricing Optimizer</h1>
        
        {loading ? (
          <div className="text-gray-600">Lade Shop-Status...</div>
        ) : currentShop ? (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-green-900">
              ✅ {isDemoMode ? 'Demo-Shop aktiv' : 'Shop verbunden'}
            </h3>
            <p className="text-green-700 mb-2">
              Shop: <strong>{currentShop.name}</strong>
            </p>
            <p className="text-green-700">
              {isDemoMode ? (
                <>
                  Produkte: <strong>{currentShop.product_count} Demo-Produkte</strong>
                </>
              ) : (
                <>
                  Produkte: <strong>{currentShop.product_count} Produkte</strong>
                  {' • '}
                  URL: <strong>{currentShop.shop_url}</strong>
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-yellow-900">⚠️ Kein Shop aktiv</h3>
            <p className="text-yellow-700 mb-4">
              Nutze den Shop-Switcher in der Sidebar, um einen Shop auszuwählen oder einen neuen Shopify-Shop zu installieren:
            </p>
            <a 
              href="http://localhost:8000/auth/shopify/install?shop=priceiq-2.myshopify.com"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shop installieren
            </a>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/products" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Produkte</h2>
            <p className="text-gray-600">Verwalte deine Shopify-Produkte und synchronisiere sie mit der Datenbank.</p>
          </Link>
          
          <Link href="/recommendations" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Preisempfehlungen</h2>
            <p className="text-gray-600">Sieh dir Preisempfehlungen basierend auf verschiedenen Strategien an.</p>
          </Link>
        </div>
        </div>
      </main>
    </div>
  )
}

