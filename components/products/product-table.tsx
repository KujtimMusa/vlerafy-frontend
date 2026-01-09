"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowUpDown,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  CheckCircle2,
  Target,
  Eye,
  Edit,
  BarChart3,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Link } from "@/navigation"

// Types
export type Product = {
  id: number | string
  shopify_product_id: string
  title: string
  price: number
  cost?: number
  inventory_quantity: number
  inventory?: number
  category?: string
  vendor?: string
  image_url?: string
  recommended_price?: number
  ml_confidence?: number
  margin_pct?: number
  inventory_level?: "critical" | "low" | "good" | "high"
  has_recommendation: boolean
  sales_trend?: "up" | "down" | "stable"
  trend_value?: number
  sales_7d?: number
}

// Column Definitions
export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Produkt
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center gap-3 min-w-[250px]">
          {/* Product Image */}
          <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{product.title}</span>
              {product.has_recommendation && (
                <Badge variant="secondary" className="gap-1 bg-purple-100 text-purple-700 border-purple-200">
                  <Sparkles className="h-3 w-3" />
                  AI
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {product.category && (
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
              )}
              <span>SKU: {String(product.shopify_product_id).slice(-8)}</span>
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Preis
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const product = row.original
      const price = parseFloat(product.price.toString())
      const recommendedPrice = product.recommended_price
      
      return (
        <div className="flex flex-col gap-1">
          <div className="font-medium">€{price.toFixed(2)}</div>
          {recommendedPrice && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-500">→</span>
              <span className="font-semibold text-purple-600">
                €{recommendedPrice.toFixed(2)}
              </span>
              {recommendedPrice > price ? (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  +{((recommendedPrice - price) / price * 100).toFixed(1)}%
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-200">
                  {((recommendedPrice - price) / price * 100).toFixed(1)}%
                </Badge>
              )}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "inventory_quantity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lager
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const product = row.original
      const quantity = product.inventory_quantity || product.inventory || 0
      const level = product.inventory_level || (quantity < 10 ? "critical" : quantity < 30 ? "low" : quantity < 100 ? "good" : "high")
      
      const levelConfig = {
        critical: { color: "text-red-600 bg-red-50 border-red-200", icon: AlertTriangle },
        low: { color: "text-orange-600 bg-orange-50 border-orange-200", icon: AlertTriangle },
        good: { color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
        high: { color: "text-gray-600 bg-gray-50 border-gray-200", icon: Package },
      }
      
      const config = levelConfig[level]
      const Icon = config.icon
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className={cn("gap-1", config.color)}>
                <Icon className="h-3 w-3" />
                {quantity}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Lagerbestand: {level}</p>
              {level === "critical" && <p className="text-red-600">⚠️ Dringend nachbestellen!</p>}
              {level === "low" && <p className="text-orange-600">Nachbestellung erwägen</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: "margin_pct",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Marge
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const product = row.original
      const margin = product.margin_pct || (product.cost && product.price ? ((product.price - product.cost) / product.price * 100) : 0)
      const isHealthy = margin >= 20
      
      return (
        <div className="flex flex-col gap-1">
          <span className={cn(
            "font-medium",
            isHealthy ? "text-green-600" : margin > 0 ? "text-orange-600" : "text-red-600"
          )}>
            {margin.toFixed(1)}%
          </span>
          {/* Mini margin bar */}
          <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all",
                isHealthy ? "bg-green-500" : margin > 0 ? "bg-orange-500" : "bg-red-500"
              )}
              style={{ width: `${Math.min(Math.max(margin, 0), 100)}%` }}
            />
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "ml_confidence",
    header: "ML Score",
    cell: ({ row }) => {
      const confidence = row.original.ml_confidence || 0
      const isHigh = confidence >= 80
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge 
                variant={isHigh ? "default" : "secondary"}
                className={cn(
                  "gap-1",
                  isHigh && "bg-purple-600 hover:bg-purple-700"
                )}
              >
                <Target className="h-3 w-3" />
                {confidence}%
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>ML Confidence Score</p>
              <p className="text-xs text-gray-500">
                {isHigh ? "Hohe Sicherheit - bereit zum Anwenden" : "Manuelle Prüfung empfohlen"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    id: "trend",
    header: "Trend",
    cell: ({ row }) => {
      const trend = row.original.sales_trend || "stable"
      const value = row.original.trend_value || 0
      
      return (
        <div className="flex items-center gap-1">
          {trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
          {trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
          {trend === "stable" && <div className="h-4 w-4" />}
          <span className={cn(
            "text-xs font-medium",
            trend === "up" && "text-green-600",
            trend === "down" && "text-red-600",
            trend === "stable" && "text-gray-600"
          )}>
            {value > 0 ? "+" : ""}{value}%
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original
      
      return (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {product.has_recommendation && (
            <Link href={`/recommendations?product_id=${product.id}`}>
              <Button size="sm" variant="default" className="gap-1 bg-purple-600 hover:bg-purple-700">
                <Sparkles className="h-3 w-3" />
                AI anwenden
              </Button>
            </Link>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Menü öffnen</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
              <Link href={`/recommendations?product_id=${product.id}`}>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Details anzeigen
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics anzeigen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Sparkles className="mr-2 h-4 w-4" />
                Empfehlung generieren
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

// Main Table Component
interface ProductTableProps {
  data: Product[]
  onRowSelectionChange?: (selection: Record<string, boolean>) => void
}

export function ProductTable({ data, onRowSelectionChange }: ProductTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  React.useEffect(() => {
    if (onRowSelectionChange) {
      onRowSelectionChange(rowSelection)
    }
  }, [rowSelection, onRowSelectionChange])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "group border-b transition-colors hover:bg-gray-50/50",
                      row.original.has_recommendation && "border-l-2 border-l-purple-500"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Keine Produkte gefunden.
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-gray-500">
          {table.getFilteredSelectedRowModel().rows.length} von{" "}
          {table.getFilteredRowModel().rows.length} Zeile(n) ausgewählt.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Zurück
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  )
}

