"use client"

import * as React from "react"
import { X, Sparkles, Edit, Percent, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface BulkActionsToolbarProps {
  selectedCount: number
  onClearSelection: () => void
  onApplyAI: () => void
  onBulkEdit: () => void
  onApplyDiscount: () => void
  onExport: () => void
  className?: string
}

export function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onApplyAI,
  onBulkEdit,
  onApplyDiscount,
  onExport,
  className,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null

  return (
    <div className={cn(
      "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
      "bg-white border rounded-lg shadow-lg",
      "animate-in slide-in-from-bottom-5 duration-300",
      className
    )}>
      <div className="flex items-center gap-2 px-4 py-3">
        {/* Selection Info */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {selectedCount} ausgewählt
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-6 px-2"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="default"
            size="sm"
            onClick={onApplyAI}
            className="gap-1 bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="h-4 w-4" />
            AI Preise anwenden ({selectedCount})
          </Button>

          <Button variant="outline" size="sm" onClick={onBulkEdit} className="gap-1">
            <Edit className="h-4 w-4" />
            Bulk bearbeiten
          </Button>

          <Button variant="outline" size="sm" onClick={onApplyDiscount} className="gap-1">
            <Percent className="h-4 w-4" />
            Rabatt
          </Button>

          <Button variant="outline" size="sm" onClick={onExport} className="gap-1">
            <Download className="h-4 w-4" />
            Exportieren
          </Button>
        </div>
      </div>
    </div>
  )
}

