
import { useState } from "react"
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
import { Recuperator, recuperatorService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const recuperatorSchema = z.object({
  parent_id: z.number().min(1, "Parent requis"),
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().optional(),
  relation_type: z.string().min(1, "Type de relation requis"),
  document_type: z.string().min(1, "Type de document requis"),
  document_file: z.any().optional(),
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

  const form = useForm<RecuperatorFormData>({
    resolver: zodResolver(recuperatorSchema),
    defaultValues: recuperator ? {
      parent_id: recuperator.parent_id,
      first_name: recuperator.first_name || "",
      last_name: recuperator.last_name || "",
      phone: recuperator.phone || "",
      relation_type: recuperator.relation_type || "",
      document_type: recuperator.document_type || "",
      children_ids: recuperator.authorizedChildren || [],
    } : {
      parent_id: 1,
      first_name: "",
      last_name: "",
      phone: "",
      relation_type: "",
      document_type: "",
      children_ids: [],
    },
  })

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
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      recuperatorService.update(id, data),
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
    formData.append('relation_type', data.relation_type)
    formData.append('document_type', data.document_type)
    if (data.document_file) formData.append('document_file', data.document_file)
    
    // Ajouter les IDs des enfants
    data.children_ids.forEach((childId, index) => {
      formData.append(`children_ids[${index}]`, childId.toString())
    })

    if (mode === "create") {
      createMutation.mutate(formData)
    } else if (mode === "edit" && recuperator) {
      updateMutation.mutate({ id: recuperator.id, data: formData })
    }
  }

  const isReadOnly = mode === "view"

  // Mock data pour les enfants - en réalité, cela devrait venir d'une API
  const availableChildren = [
    { id: 1, name: "Sophie Martin", parent_id: 1 },
    { id: 2, name: "Lucas Bernard", parent_id: 1 },
    { id: 3, name: "Emma Leroy", parent_id: 2 },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
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
              name="relation_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de relation *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type de relation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="grand-parent">Grand-parent</SelectItem>
                      <SelectItem value="oncle-tante">Oncle/Tante</SelectItem>
                      <SelectItem value="frere-soeur">Frère/Soeur</SelectItem>
                      <SelectItem value="ami-famille">Ami de la famille</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de document *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type de document" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CNI">Carte Nationale d'Identité</SelectItem>
                      <SelectItem value="passeport">Passeport</SelectItem>
                      <SelectItem value="permis">Permis de conduire</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document_file"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Document *</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".jpeg,.png,.jpg,.pdf"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      disabled={isReadOnly}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="children_ids"
              render={() => (
                <FormItem>
                  <FormLabel>Enfants autorisés *</FormLabel>
                  <div className="space-y-2">
                    {availableChildren.map((child) => (
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
                                {child.name}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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