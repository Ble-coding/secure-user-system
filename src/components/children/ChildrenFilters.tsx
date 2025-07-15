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
import { Search, Filter, ArrowDown, ArrowUp, Users, GraduationCap } from "lucide-react"

interface ChildrenFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  entryFilter: "all" | "entry" | "exit"
  setEntryFilter: (value: "all" | "entry" | "exit") => void
  genderFilter: "all" | "M" | "F"
  setGenderFilter: (value: "all" | "M" | "F") => void
  classFilter: string
  setClassFilter: (value: string) => void
}

export function ChildrenFilters({
  searchTerm,
  setSearchTerm,
  entryFilter,
  setEntryFilter,
  genderFilter,
  setGenderFilter,
  classFilter,
  setClassFilter
}: ChildrenFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-6 flex-wrap">
      <div className="relative flex-1 min-w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Rechercher par nom ou code..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="relative">
        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Classe..." 
          className="pl-10 w-32"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Genre
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Filtrer par genre</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setGenderFilter("all")}>
            Tous
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setGenderFilter("M")}>
            Garçons
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setGenderFilter("F")}>
            Filles
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Activité
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Filtrer par activité</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEntryFilter("all")}>
            Tous
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEntryFilter("entry")}>
            <ArrowDown className="w-4 h-4 mr-2 text-success" />
            Présents
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEntryFilter("exit")}>
            <ArrowUp className="w-4 h-4 mr-2 text-destructive" />
            Sortis
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
