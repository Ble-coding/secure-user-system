import { useState } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ParentUser } from "@/types/Parent"
import { parentService } from "@/lib/api/parents"
import { useQuery } from "@tanstack/react-query"

interface ParentComboboxProps {
  value?: number
  onSelect: (parentId: number, parent: ParentUser) => void
  disabled?: boolean
  placeholder?: string
}

export function ParentCombobox({ value, onSelect, disabled, placeholder = "Sélectionner un parent..." }: ParentComboboxProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const { data: parentsResponse, isLoading } = useQuery({
    queryKey: ['parents-search', searchTerm],
    queryFn: () => parentService.getAll(1, searchTerm, "actif"),
    enabled: open || searchTerm.length > 0,
  })

  const parents = parentsResponse?.data?.parents || []
  const selectedParent = parents.find((parent: ParentUser) => parent.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedParent
            ? `${selectedParent.prenom} ${selectedParent.nom} - ${selectedParent.telephone}`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Rechercher un parent..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Recherche en cours..." : "Aucun parent trouvé"}
            </CommandEmpty>
            <CommandGroup>
              {parents.map((parent: ParentUser) => (
                <CommandItem
                  key={parent.id}
                  value={`${parent.prenom} ${parent.nom} ${parent.telephone} ${parent.code}`}
                  onSelect={() => {
                    onSelect(parent.id!, parent)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === parent.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {parent.prenom} {parent.nom}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {parent.telephone} • {parent.code}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
