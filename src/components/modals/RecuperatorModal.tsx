
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Recuperator } from "@/types/Recuperator"
import { ParentUser } from "@/types/Parent"
import { Child } from "@/lib/api/types"
import { recuperatorService } from "@/lib/api/recuperators"
import { parentService } from "@/lib/api/parents"
import { childService } from "@/lib/api/children"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { BASE_URL } from "@/lib/api/config"

const recuperatorSchema = z.object({
  parent_id: z.number().min(1, "Parent requis"),
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().optional(),
  sexe: z.enum(["M", "F"]).optional(),
  relation_type: z.string().min(1, "Type de relation requis"),
  document_type: z.string().min(1, "Type de document requis"),
  document_numero: z.string().optional(),
  document_file: z.any().optional(),
  photo: z.any().optional(),
  children_ids: z.array(z.number()).min(1, "Au moins un enfant doit être sélectionné"),
})

type RecuperatorFormData = z.infer<typeof recuperatorSchema>

interface RecuperatorModalProps {
  isOpen: boolean
  onClose: () => void
  recuperator?: Recuperator
  mode: "create" | "edit" | "view"
}

export function RecuperatorModal({ isOpen, onClose, recuperator, mode }: RecuperatorModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null)

  const form = useForm<RecuperatorFormData>({
    resolver: zodResolver(recuperatorSchema),
    defaultValues: recuperator ? {
      parent_id: recuperator.parent_id || 0,
      first_name: recuperator.first_name || "",
      last_name: recuperator.last_name || "",
      phone: recuperator.phone || "",
      sexe: recuperator.sexe || undefined,
      relation_type: recuperator.relation_type || "",
      document_type: recuperator.document_type || "",
      document_numero: recuperator.document_numero || "",
      children_ids: recuperator.children?.map(child => child.id) || [],
    } : {
      parent_id: 0,
      first_name: "",
      last_name: "",
      phone: "",
      sexe: undefined,
      relation_type: "",
      document_type: "",
      document_numero: "",
      children_ids: [],
    },
  })

  // Récupérer la liste des parents
  const { data: parentsResponse } = useQuery({
    queryKey: ['parents', 'all'],
    queryFn: () => parentService.getAll(1, "", ""),
  })

  // Récupérer la liste des enfants
  const { data: childrenResponse } = useQuery({
    queryKey: ['children', 'all'],
    queryFn: () => childService.getAll(),
  })

  const parents = parentsResponse?.data?.parent || []
  const allChildren = childrenResponse || []

  // Filtrer les enfants selon le parent sélectionné
  const availableChildren = selectedParentId 
    ? allChildren.filter((child: Child) => child.parent_id === selectedParentId)
    : []

  // Mettre à jour le parent sélectionné quand le formulaire change
  useEffect(() => {
    const parentId = form.watch("parent_id")
    if (parentId && parentId !== selectedParentId) {
      setSelectedParentId(parentId)
      // Réinitialiser les enfants sélectionnés quand on change de parent
      form.setValue("children_ids", [])
    }
  }, [form.watch("parent_id"), selectedParentId, form])

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => recuperatorService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recuperators'] })
      toast({ title: "Récupérateur créé avec succès" })
      form.reset()
      onClose()
    },
    onError: (error: any) => {
      console.error('Error creating recuperator:', error)
      toast({ 
        title: "Erreur lors de la création", 
        description: error.message || "Une erreur est survenue",
        variant: "destructive" 
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ code, data }: { code: string; data: FormData }) =>
      recuperatorService.update(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recuperators'] })
      toast({ title: "Récupérateur modifié avec succès" })
      onClose()
    },
    onError: (error: any) => {
      console.error('Error updating recuperator:', error)
      toast({ 
        title: "Erreur lors de la modification", 
        description: error.message || "Une erreur est survenue",
        variant: "destructive" 
      })
    },
  })

  const onSubmit = (data: RecuperatorFormData) => {
    const formData = new FormData()
    
    formData.append('parent_id', data.parent_id.toString())
    formData.append('first_name', data.first_name)
    formData.append('last_name', data.last_name)
    if (data.phone) formData.append('phone', data.phone)
    if (data.sexe) formData.append('sexe', data.sexe)
    formData.append('relation_type', data.relation_type)
    formData.append('document_type', data.document_type)
    if (data.document_numero) formData.append('document_numero', data.document_numero)
    if (data.document_file) formData.append('document_file', data.document_file)
    if (data.photo) formData.append('photo', data.photo)
    
    // Ajouter les IDs des enfants
    data.children_ids.forEach((childId, index) => {
      formData.append(`children_ids[${index}]`, childId.toString())
    })

    if (mode === "create") {
      createMutation.mutate(formData)
    } else if (mode === "edit" && recuperator) {
      updateMutation.mutate({ code: recuperator.code, data: formData })
    }
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Ajouter un récupérateur"}
            {mode === "edit" && "Modifier le récupérateur"}
            {mode === "view" && "Détails du récupérateur"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Créer un nouveau récupérateur dans le système"}
            {mode === "edit" && "Modifier les informations du récupérateur"}
            {mode === "view" && "Consulter les informations du récupérateur"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la relation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="grand-parent">Grand-parent</SelectItem>
                      <SelectItem value="oncle/tante">Oncle/Tante</SelectItem>
                      <SelectItem value="frère/sœur">Frère/Sœur</SelectItem>
                      <SelectItem value="tuteur">Tuteur légal</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
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

            {!isReadOnly && (
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? "En cours..." : 
                   mode === "create" ? "Créer" : "Modifier"}
                </Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
