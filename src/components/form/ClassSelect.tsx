// components/form/ClassSelect.tsx
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { CLASSES_OPTIONS } from "@/components/parent/constants"

interface ClassSelectProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ClassSelect({ value, onChange, disabled }: ClassSelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className="w-full justify-between"
        >
          {value ? CLASSES_OPTIONS.find((c) => c === value) : "Sélectionner"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher..." />
          <CommandList>
            {CLASSES_OPTIONS.map((classe) => (
              <CommandItem
                key={classe}
                value={classe}
                onSelect={(selected) => {
                  onChange(selected)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === classe ? "opacity-100" : "opacity-0"
                  )}
                />
                {classe}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
