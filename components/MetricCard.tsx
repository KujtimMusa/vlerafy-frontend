'use client'

interface MetricCardProps {
  icon: string
  label: string
  value: string
  status?: 'good' | 'warning' | 'bad' | 'neutral'
}

export default function MetricCard({ icon, label, value, status = 'neutral' }: MetricCardProps) {
  const statusColors = {
    good: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    bad: 'border-red-200 bg-red-50',
    neutral: 'border-gray-200 bg-gray-50'
  }
  
  return (
    <div className={`metric-card border rounded-lg p-4 ${statusColors[status]}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <div className="text-xs font-medium text-gray-600 mb-1">{label}</div>
          <div className="text-lg font-bold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  )
}













