'use client'

interface PriceComparisonChartProps {
  yourPrice: number;
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
}

export function PriceComparisonChart({ 
  yourPrice, 
  minPrice, 
  avgPrice, 
  maxPrice 
}: PriceComparisonChartProps) {
  
  // Berechne Position in Prozent
  const range = maxPrice - minPrice;
  const yourPosition = range > 0 ? ((yourPrice - minPrice) / range) * 100 : 50;
  const avgPosition = range > 0 ? ((avgPrice - minPrice) / range) * 100 : 50;
  
  return (
    <div className="space-y-2">
      {/* Labels */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>Min: €{minPrice.toFixed(2)}</span>
        <span>Ø: €{avgPrice.toFixed(2)}</span>
        <span>Max: €{maxPrice.toFixed(2)}</span>
      </div>
      
      {/* Visual Bar */}
      <div className="relative h-16 bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 rounded-lg border border-gray-200">
        
        {/* Average Line */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
          style={{ left: `${Math.max(0, Math.min(100, avgPosition))}%` }}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap">
            Ø
          </div>
        </div>
        
        {/* Your Price Marker */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-2 h-8 bg-blue-600 rounded"
          style={{ left: `${Math.max(0, Math.min(100, yourPosition))}%` }}
        >
          <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600 whitespace-nowrap">
            Du: €{yourPrice.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
















