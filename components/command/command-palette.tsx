"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Calculator, 
  Calendar, 
  CreditCard, 
  Settings, 
  Smile, 
  User,
  Home,
  Package,
  BarChart3,
  Sparkles,
  RefreshCw,
  Plus,
  Filter,
} from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0">
        <Command>
          <CommandInput placeholder="Befehl eingeben oder suchen..." />
          <CommandList>
        <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => { router.push("/"); setOpen(false) }}>
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => { router.push("/products"); setOpen(false) }}>
            <Package className="mr-2 h-4 w-4" />
            <span>Produkte</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => { router.push("/recommendations"); setOpen(false) }}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Empfehlungen</span>
            <CommandShortcut>⌘E</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Aktionen">
          <CommandItem>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Alle Empfehlungen generieren</span>
            <CommandShortcut>⌘G</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Von Shopify synchronisieren</span>
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Plus className="mr-2 h-4 w-4" />
            <span>Produkt hinzufügen</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Schnellfilter">
          <CommandItem>
            <Filter className="mr-2 h-4 w-4" />
            <span>Nur AI Empfehlungen anzeigen</span>
          </CommandItem>
          <CommandItem>
            <Filter className="mr-2 h-4 w-4" />
            <span>Niedrigen Lagerbestand anzeigen</span>
          </CommandItem>
          <CommandItem>
            <Filter className="mr-2 h-4 w-4" />
            <span>Trending Produkte anzeigen</span>
          </CommandItem>
        </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

