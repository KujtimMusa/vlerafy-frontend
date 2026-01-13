/**
 * Dashboard Layout mit Shop-Switcher
 */
'use client';

import React from 'react';
import { ShopSwitcher } from './ShopSwitcher';
import { useShop } from '@/hooks/useShop';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isDemoMode, currentShop } = useShop();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Dynamic Pricing</h2>
        </div>
        
        {/* Shop Switcher in Sidebar */}
        <div className="p-4 border-b border-gray-200 overflow-y-auto">
          <ShopSwitcher />
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <a 
            href="/dashboard" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Dashboard
          </a>
          <a 
            href="/products" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Products
          </a>
          <a 
            href="/recommendations" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Recommendations
          </a>
          <a 
            href="/analytics" 
            className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Analytics
          </a>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Demo Mode Indicator in Header */}
        {isDemoMode && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-2">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span>🧪</span>
              <span className="font-medium">Demo Mode Active</span>
              <span className="text-blue-600">
                • Testing with {currentShop?.product_count || 20} synthetic products
              </span>
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}


















