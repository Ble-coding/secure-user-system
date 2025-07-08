
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
import { Textarea } from "@/components/ui/textarea"
import { Parent, parentService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const parentSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  address: z.string().min(5, "Adresse requise"),
  status: z.enum(["Actif", "Inactif"]),
})

type ParentFormData = z.infer<typeof parentSchema>

interface ParentModalProps {
  isOpen: boolean
  onClose: () => void
  parent?: Parent
  mode: "create" | "edit" | "view"
}

export function ParentModal({ isOpen, onClose, parent, mode }: ParentModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: parent || {
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "Actif",
    },
  })

  const createMutation = useMutation({
    mutationFn: parentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] })
      toast({ title: "Parent créé avec succès" })
      onClose()
    },
    onError: () => {
      toast({ title: "Erreur lors de la création", variant: "destructive" })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Parent> }) =>
      parentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] })
      toast({ title: "Parent modifié avec succès" })
      onClose()
    },
    onError: () => {
      toast({ title: "Erreur lors de la modification", variant: "destructive" })
    },
  })

  const onSubmit = (data: ParentFormData) => {
    if (mode === "create") {
      createMutation.mutate(data)
    } else if (mode === "edit" && parent) {
      updateMutation.mutate({ id: parent.id, data })
    }
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Ajouter un parent"}
            {mode === "edit" && "Modifier le parent"}
            {mode === "view" && "Détails du parent"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Créer un nouveau parent dans le système"}
            {mode === "edit" && "Modifier les informations du parent"}
            {mode === "view" && "Consulter les informations du parent"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isReadOnly} />
                  </FormControl>
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
                  {mode === "create" ? "Créer" : "Modifier"}
                </Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
