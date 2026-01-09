'use client'

interface PositionBadgeProps {
  position: 'cheapest' | 'below_average' | 'average' | 'above_average' | 'most_expensive' | 'unknown';
}

export function PositionBadge({ position }: PositionBadgeProps) {
  const config = {
    cheapest: {
      label: '✅ Günstigster',
      color: 'bg-green-100 text-green-800 border-green-300'
    },
    below_average: {
      label: '👍 Unter Durchschnitt',
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    average: {
      label: '➡️ Am Durchschnitt',
      color: 'bg-gray-100 text-gray-800 border-gray-300'
    },
    above_average: {
      label: '⚠️ Über Durchschnitt',
      color: 'bg-orange-100 text-orange-800 border-orange-300'
    },
    most_expensive: {
      label: '🔴 Teuerster',
      color: 'bg-red-100 text-red-800 border-red-300'
    },
    unknown: {
      label: '❓ Unbekannt',
      color: 'bg-gray-100 text-gray-800 border-gray-300'
    }
  };
  
  const { label, color } = config[position] || config.unknown;
  
  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full border ${color} font-medium`}>
      {label}
    </div>
  );
}











