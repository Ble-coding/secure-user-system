import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Control, UseFieldArrayReturn } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { ParentFormData } from "./schemas"
import { ClassSelect } from "@/components/form/ClassSelect"

interface ChildrenSectionProps {
  control: Control<ParentFormData>
  fieldArray: UseFieldArrayReturn<ParentFormData, "children", "id">
  isReadOnly: boolean
}

export function ChildrenSection({ control, fieldArray, isReadOnly }: ChildrenSectionProps) {
  const { fields, append, remove } = fieldArray

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Enfants</CardTitle>
        {!isReadOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ 
              first_name: "", 
              last_name: "", 
              gender: "M", 
              date_of_birth: "",
              class: "",
              enrolled_at: "",
            })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un enfant
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Enfant {index + 1}</h4>
              {!isReadOnly && fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`children.${index}.first_name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`children.${index}.last_name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={control}
                name={`children.${index}.gender`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="M">Masculin</SelectItem>
                        <SelectItem value="F">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`children.${index}.date_of_birth`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de naissance *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

           <FormField
  control={control}
  name={`children.${index}.class`}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Classe</FormLabel>
      <FormControl>
        <ClassSelect value={field.value || ""} onChange={field.onChange} disabled={isReadOnly} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


              <FormField
                control={control}
                name={`children.${index}.enrolled_at`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'inscription</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
