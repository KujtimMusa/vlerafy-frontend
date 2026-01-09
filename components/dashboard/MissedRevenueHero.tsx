"use client"

import { AlertCircle, Sparkles, ArrowRight } from "lucide-react"

interface MissedRevenueHeroProps {
  missedRevenue: number
  productCount: number
  onOptimizeClick?: () => void
}

export default function MissedRevenueHero({
  missedRevenue,
  productCount,
  onOptimizeClick
}: MissedRevenueHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 p-8 shadow-xl">
      <div className="relative flex items-start gap-6">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="flex h-16 w-16 items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">
              Du verlierst aktuell Geld!
            </h3>
          </div>
          
          <p className="text-red-50">
            {productCount} Produkte haben suboptimale Preise
          </p>

          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-4xl font-bold text-white">
              {Math.abs(missedRevenue).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </span>
            <span className="text-red-100">Umsatz verpasst</span>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={onOptimizeClick}
          className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 hover:bg-red-50 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Produkte optimieren
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
