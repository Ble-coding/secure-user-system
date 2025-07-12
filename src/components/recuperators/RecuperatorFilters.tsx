
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter } from "lucide-react"

interface RecuperatorFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  setPage: (page: number) => void
}

export function RecuperatorFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  setPage
}: RecuperatorFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Rechercher par nom, téléphone, relation ou code..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
            setStatusFilter("")
            setPage(1)
          }}>
            Tous
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setStatusFilter("Actif")
            setPage(1)
          }}>
            Actif
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setStatusFilter("Inactif")
            setPage(1)
          }}>
            Inactif
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
