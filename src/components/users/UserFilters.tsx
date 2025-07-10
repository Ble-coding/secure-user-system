
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

interface UserFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function UserFilters({ searchTerm, onSearchChange }: UserFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Rechercher par nom, email ou rôle..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="outline">
        <Filter className="w-4 h-4 mr-2" />
        Filtres
      </Button>
    </div>
  )
}
