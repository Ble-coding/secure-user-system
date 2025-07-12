import { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Combobox } from "@/components/ui/combobox"
import { ParentUser } from "@/types/Parent"
import { Child } from "@/lib/api/types"
import { RecuperatorFormData } from "./recuperatorValidation"
import { BASE_URL } from "@/lib/api/config"
import { Recuperator } from "@/types/Recuperator"

interface RecuperatorFormFieldsProps {
  form: UseFormReturn<RecuperatorFormData>
  parents: ParentUser[]
  availableChildren: Child[]
  selectedParentId: number | null
  recuperator?: Recuperator
  mode: "create" | "edit" | "view"
}

const relationOptions = [
  { value: "parent", label: "Parent" },
  { value: "grand-parent", label: "Grand-parent" },
  { value: "oncle/tante", label: "Oncle/Tante" },
  { value: "frère/sœur", label: "Frère/Sœur" },
  { value: "tuteur", label: "Tuteur légal" },
  { value: "autre", label: "Autre" },
]

export function RecuperatorFormFields({ 
  form, 
  parents, 
  availableChildren, 
  selectedParentId,
  recuperator,
  mode 
}: RecuperatorFormFieldsProps) {
  const isReadOnly = mode === "view"

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="parent_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parent *</FormLabel>
            <Select 
              onValueChange={(value) => field.onChange(parseInt(value))} 
              value={field.value?.toString()} 
              disabled={isReadOnly}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un parent" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {parents.map((parent: ParentUser) => (
                  <SelectItem key={parent.id} value={parent.id.toString()}>
                    {parent.prenom} {parent.nom} - {parent.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="first_name"
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
          control={form.control}
          name="last_name"
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input {...field} disabled={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sexe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sexe</FormLabel>
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
      </div>

      <FormField
        control={form.control}
        name="relation_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de relation *</FormLabel>
            <FormControl>
              <Combobox
                options={relationOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Sélectionner la relation"
                searchPlaceholder="Rechercher une relation..."
                emptyText="Aucune relation trouvée."
                disabled={isReadOnly}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="photo"
        render={({ field: { onChange, value, ...rest } }) => (
          <FormItem>
            <FormLabel>Photo</FormLabel>
            <FormControl>
              <div className="space-y-2">
                {mode !== "create" && typeof recuperator?.photo === "string" && recuperator.photo && (
                  <a
                    href={`${BASE_URL}/storage/${recuperator.photo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    Voir la photo actuelle
                  </a>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files?.[0])}
                  disabled={isReadOnly}
                  {...rest}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="document_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de document *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CNI">Carte Nationale d'Identité</SelectItem>
                  <SelectItem value="PASSPORT">Passeport</SelectItem>
                  <SelectItem value="PERMIS">Permis de conduire</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document_numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de document</FormLabel>
              <FormControl>
                <Input {...field} disabled={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document_file"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Fichier du document *</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {mode !== "create" && typeof recuperator?.document_file === "string" && recuperator.document_file && (
                    <a
                      href={`${BASE_URL}/storage/${recuperator.document_file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      Voir le document actuel
                    </a>
                  )}
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => onChange(e.target.files?.[0])}
                    disabled={isReadOnly}
                    {...rest}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {selectedParentId && (
        <FormField
          control={form.control}
          name="children_ids"
          render={() => (
            <FormItem>
              <FormLabel>Enfants autorisés *</FormLabel>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-4">
                {availableChildren.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucun enfant trouvé pour ce parent</p>
                ) : (
                  availableChildren.map((child: Child) => (
                    <FormField
                      key={child.id}
                      control={form.control}
                      name="children_ids"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={child.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(child.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, child.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== child.id
                                        )
                                      )
                                }}
                                disabled={isReadOnly}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {child.first_name} {child.last_name} ({child.class || 'Classe non définie'})
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
