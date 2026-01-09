"use client"

import * as React from "react"
import { Sparkles, AlertTriangle, TrendingUp, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FilterChipProps {
  icon: React.ReactNode
  label: string
  count: number
  active?: boolean
  variant?: "default" | "warning" | "success" | "info" | "ai"
  onClick: () => void
}

function FilterChip({ icon, label, count, active, variant = "default", onClick }: FilterChipProps) {
  const variantStyles = {
    default: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    warning: "bg-orange-100 hover:bg-orange-200 text-orange-900",
    success: "bg-green-100 hover:bg-green-200 text-green-900",
    info: "bg-blue-100 hover:bg-blue-200 text-blue-900",
    ai: "bg-purple-100 hover:bg-purple-200 text-purple-900",
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "gap-2 rounded-full px-3 py-1 h-8 transition-all",
        active && "ring-2 ring-offset-2",
        variantStyles[variant]
      )}
    >
      {icon}
      <span>{label}</span>
      <Badge variant="secondary" className="ml-1 rounded-full px-1.5">
        {count}
      </Badge>
    </Button>
  )
}

interface ProductFiltersProps {
  onFilterChange: (filter: string) => void
  onSearchChange: (query: string) => void
  aiCount: number
  lowStockCount: number
  trendingCount: number
  lowMarginCount: number
}

export function ProductFilters({
  onFilterChange,
  onSearchChange,
  aiCount,
  lowStockCount,
  trendingCount,
  lowMarginCount,
}: ProductFiltersProps) {
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleFilterClick = (filter: string) => {
    const newFilter = activeFilter === filter ? null : filter
    setActiveFilter(newFilter)
    onFilterChange(newFilter || "")
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearchChange(query)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Produkte, SKUs, Kategorien durchsuchen..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-md"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-500">Schnellfilter:</span>
        
        <FilterChip
          icon={<Sparkles className="h-4 w-4" />}
          label="AI Empfehlungen"
          count={aiCount}
          active={activeFilter === "ai"}
          variant="ai"
          onClick={() => handleFilterClick("ai")}
        />

        <FilterChip
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Niedriger Lagerbestand"
          count={lowStockCount}
          active={activeFilter === "lowStock"}
          variant="warning"
          onClick={() => handleFilterClick("lowStock")}
        />

        <FilterChip
          icon={<TrendingUp className="h-4 w-4" />}
          label="Trending"
          count={trendingCount}
          active={activeFilter === "trending"}
          variant="success"
          onClick={() => handleFilterClick("trending")}
        />

        <FilterChip
          icon={<DollarSign className="h-4 w-4" />}
          label="Niedrige Marge"
          count={lowMarginCount}
          active={activeFilter === "lowMargin"}
          variant="warning"
          onClick={() => handleFilterClick("lowMargin")}
        />
      </div>
    </div>
  )
}

