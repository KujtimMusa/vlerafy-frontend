'use client'

import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { ConfidenceStatus } from '@/lib/types/confidence'

interface ConfidenceBadgeProps {
  confidence: number
  status: ConfidenceStatus
  onClick?: () => void
  expanded?: boolean
}

const statusConfig: Record<ConfidenceStatus, { color: string; bgColor: string; icon: React.ReactNode; label: string }> = {
  excellent: {
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-300',
    icon: <CheckCircle2 size={14} className="text-green-600" />,
    label: 'Excellent'
  },
  good: {
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
    icon: <CheckCircle2 size={14} className="text-green-600" />,
    label: 'Good'
  },
  ok: {
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
    icon: <AlertTriangle size={14} className="text-yellow-600" />,
    label: 'OK'
  },
  low: {
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
    icon: <AlertTriangle size={14} className="text-orange-600" />,
    label: 'Low'
  },
  critical: {
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
    icon: <XCircle size={14} className="text-red-600" />,
    label: 'Critical'
  }
}

export function ConfidenceBadge({ confidence, status, onClick, expanded }: ConfidenceBadgeProps) {
  const config = statusConfig[status] || statusConfig.ok

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full border
        font-semibold text-sm transition-all hover:shadow-md
        ${config.bgColor} ${config.color} ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
      aria-label={`Data confidence: ${confidence}% - ${config.label}`}
    >
      {config.icon}
      <span>{Math.round(confidence)}%</span>
      {onClick && (
        <span className="text-xs opacity-70">
          {expanded ? '▼' : '▶'}
        </span>
      )}
    </button>
  )
}
