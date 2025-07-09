
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
import { Recuperator, recuperatorService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const recuperatorSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  relation_type: z.string().min(1, "Type de relation requis"),
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
      first_name: recuperator.first_name || "",
      last_name: recuperator.last_name || "",
      phone: recuperator.phone || "",
      relation_type: recuperator.relation_type || "",
    } : {
      first_name: "",
      last_name: "",
      phone: "",
      relation_type: "",
    },
  })

  const createMutation = useMutation({
    mutationFn: recuperatorService.create,
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
    mutationFn: ({ id, data }: { id: number; data: Partial<Recuperator> }) =>
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
    const submitData = {
      ...data,
      parent_id: 1, // Vous devrez ajuster ceci selon votre logique
      code: `RC-${Date.now()}`, // Génération temporaire du code
      is_active: true,
      status: "Actif" as const,
      authorizedChildren: []
    };

    if (mode === "create") {
      createMutation.mutate(submitData)
    } else if (mode === "edit" && recuperator) {
      updateMutation.mutate({ id: recuperator.id, data: submitData })
    }
  }

  const isReadOnly = mode === "view"

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
                    <FormLabel>Prénom</FormLabel>
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
                    <FormLabel>Nom</FormLabel>
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
                  <FormLabel>Type de relation</FormLabel>
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

            {isReadOnly && recuperator && (
              <div className="space-y-2">
                <FormLabel>Enfants autorisés</FormLabel>
                <div className="text-sm text-muted-foreground">
                  {recuperator.authorizedChildren.length > 0
                    ? `${recuperator.authorizedChildren.length} enfant(s) autorisé(s)`
                    : "Aucun enfant autorisé"}
                </div>
              </div>
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
