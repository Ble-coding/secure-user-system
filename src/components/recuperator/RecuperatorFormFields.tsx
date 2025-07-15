import { UseFormReturn } from "react-hook-form"
import { SearchableSelect } from "@/components/form/SearchableSelect"
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
import { ParentUser } from "@/types/Parent"
import { Child } from "@/lib/api/types"
import { RecuperatorFormData } from "./recuperatorValidation"
import { BASE_URL } from "@/lib/api/config"
import { Recuperator } from "@/types/Recuperator"
import { useEffect } from "react"
interface RecuperatorFormFieldsProps {
  form: UseFormReturn<RecuperatorFormData>
  parents: ParentUser[]
  availableChildren: Child[]
    selectedParentData?: ParentUser
  // selectedParentId: number | null
    selectedParentId: string; // ✅
  recuperator?: Recuperator
  mode: "create" | "edit" | "view"
  search: string
  setSearch: (s: string) => void
}

export function RecuperatorFormFields({
  form,
  parents,
  availableChildren,
  selectedParentId,
  recuperator,
  selectedParentData,
  mode,
  search,
  setSearch,
}: RecuperatorFormFieldsProps) {
  const isReadOnly = mode === "view"


  const RELATION_OPTIONS = [
 "Père / Mère",
  "Frère / Sœur",
  "Oncle / Tante",
  "Cousin / Cousine",
  "Grand-père / Grand-mère",
  "Beau-père / Belle-mère",
  "Tuteur / Garde",
  "Nounou / Chauffeur",
  "Voisin / Voisine",
  "Amie / Ami",

  "Autre (personne de confiance)"
].map((r) => ({ label: r, value: r }))

const SEX_OPTIONS = [
  { label: "Masculin", value: "M" },
  { label: "Féminin", value: "F" }
]

const DOCUMENT_OPTIONS = [
  { label: "Carte Nationale d'Identité", value: "CNI" },
  { label: "Passeport", value: "Passeport" },
  { label: "Permis de conduire", value: "Permis de conduire" },
  { label: "Acte de naissance", value: "Acte de naissance" },
  { label: "Certificat de mariage", value: "Certificat de mariage" },
  { label: "Carte consulaire", value: "Carte consulaire" }
]


  useEffect(() => {
    if (
      !isReadOnly &&
      selectedParentId &&
      availableChildren.length > 0 &&
      form.getValues("children_ids").length === 0
    ) {
      const allCodes = availableChildren.map((child) => child.code)
      form.setValue("children_ids", allCodes, { shouldValidate: true })
    }
  }, [availableChildren, selectedParentId, isReadOnly, form])
  // const parentLoaded = parents.find(p => p.code === selectedParentId) || selectedParentData
// const readyToRenderParentSelect = isReadOnly || !selectedParentId || !!parentLoaded
// const readyToRenderParentSelect = true // TEMPORAIREMENT pour forcer l'affichage du champ

const parentLoaded = parents.find(p => p.code === selectedParentId) || selectedParentData
const readyToRenderParentSelect = !!parentLoaded || isReadOnly


  return (
    <div className="space-y-4">
<FormField
  control={form.control}
  name="parent_id"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Parent *</FormLabel>
      <Select
        onValueChange={field.onChange}
        value={field.value?.toString()}
        disabled={isReadOnly}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un parent" />
          </SelectTrigger>
        </FormControl>
   <SelectContent>
  <div className="p-2">
    <Input
      placeholder="Rechercher un parent..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="mb-2"
      disabled={isReadOnly}
    />
  </div>

  {!field.value && (
    <SelectItem value="" disabled>
      -- Sélectionner un parent --
    </SelectItem>
  )}
{/* {selectedParentData?.data?.code === field.value && (
  <SelectItem value={selectedParentData.data.code}>
    {selectedParentData.data.prenom} {selectedParentData.data.nom} - {selectedParentData.data.email}
  </SelectItem>
)} */}

{/* {selectedParentData?.data?.code === field.value && (
  <SelectItem value={selectedParentData.data.code}>
    {selectedParentData.data.prenom} {selectedParentData.data.nom} - {selectedParentData.data.email}
  </SelectItem>
)} */}

{/* ✅ Ajout du parent sélectionné s’il n’est pas dans la liste paginée */}
{/* {selectedParentData &&
  !parents.some((p) => p.code === selectedParentData.code) &&
  selectedParentData.code === field.value && (
    // <SelectItem key={`extra-${selectedParentData.code}`} value={selectedParentData.code}>
    //   {selectedParentData.prenom} {selectedParentData.nom} - {selectedParentData.email}
    // </SelectItem>
    <SelectItem value={selectedParentData.code}>
  {selectedParentData.prenom} {selectedParentData.nom} - {selectedParentData.email}
</SelectItem>

)} */}


 {/* ✅ Si le parent sélectionné n’est pas dans la liste paginée, on l’ajoute */}
{/* {selectedParentData &&
  !parents.some((p) => p.code === selectedParentData.code) && (
    <SelectItem
      key={`extra-${selectedParentData.code}`}
      value={selectedParentData.code}
    >
      {selectedParentData.prenom} {selectedParentData.nom} - {selectedParentData.email}
    </SelectItem>
)}
 */}

  {/* 🔁 Parents paginés */}
{parents.map((parent) => (
  // <SelectItem key={`parent-${parent.code}`} value={parent.code}>
  //   {parent.prenom} {parent.nom} - {parent.email}
  // </SelectItem>
  <SelectItem key={`parent-${parent.code}`} value={parent.code}>
  <div>{parent.prenom} {parent.nom} - {parent.email}</div>
</SelectItem>

))}

{/* Pour le parent non paginé */}
{selectedParentData &&
  !parents.some((p) => p.code === selectedParentData.code) &&
  selectedParentData.code === field.value && (
    <SelectItem key={`extra-${selectedParentData.code}`} value={selectedParentData.code}>
      <div>{selectedParentData.prenom} {selectedParentData.nom} - {selectedParentData.email}</div>
    </SelectItem>
)}

</SelectContent>

      </Select>
      <FormMessage />
    </FormItem>
  )}
/>


      
     {selectedParentId && (
  <FormField
    control={form.control}
    name="children_ids"
    render={() => (
      <FormItem>
        <FormLabel>Enfants autorisés *</FormLabel>
        <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-4">
          {availableChildren.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Aucun enfant trouvé pour ce parent
            </p>
          ) : (
            availableChildren.map((child) => (
              <FormField
                key={child.code}
                control={form.control}
                name="children_ids"
                render={({ field }) => {
                  const isChecked = field.value?.includes(child.code)

                  return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...field.value, child.code]
                              : field.value.filter((val) => val !== child.code)
                            field.onChange(newValue)
                          }}
                          disabled={isReadOnly}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {child.first_name} {child.last_name} ({child.class || "Classe non définie"})
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
          {SEX_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
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
        <SearchableSelect
          value={field.value}
          onChange={field.onChange}
          options={RELATION_OPTIONS}
          placeholder="Sélectionner la relation"
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
          {/* {mode !== "create" && recuperator?.photo && ( */}
          {recuperator?.photo && (
            <img
              src={`${BASE_URL}/storage/${recuperator.photo}`}
              alt="photo"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
      {!isReadOnly && (
  <Input
    type="file"
    accept="image/*"
    onChange={(e) => onChange(e.target.files?.[0])}
    {...rest}
  />
)}
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
          {DOCUMENT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
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
      <FormLabel>Fichier du document</FormLabel>
      <FormControl>
        <div className="space-y-2">
         {recuperator?.document_file && (
            <a
              href={`${BASE_URL}/storage/${recuperator.document_file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              Voir le document actuel
            </a>
          )}
           {!isReadOnly && (
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => onChange(e.target.files?.[0])}
              {...rest}
            />
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

      </div>

    </div>
  )
}
