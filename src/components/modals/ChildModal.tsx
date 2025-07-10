
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
import { Child, childService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const childSchema = z.object({
  parent_id: z.number().min(1, "Parent requis"),
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  gender: z.enum(["M", "F"], { message: "Sélectionnez le genre" }),
  date_of_birth: z.string().min(1, "Date de naissance requise"),
  class: z.string().optional(),
  enrolled_at: z.string().optional(),
  photo: z.any().optional(),
})

type ChildFormData = z.infer<typeof childSchema>

interface ChildModalProps {
  isOpen: boolean
  onClose: () => void
  child?: Child
  mode: "create" | "edit" | "view"
}

export function ChildModal({ isOpen, onClose, child, mode }: ChildModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<ChildFormData>({
    resolver: zodResolver(childSchema),
    defaultValues: child ? {
      parent_id: child.parent_id,
      first_name: child.first_name || "",
      last_name: child.last_name || "",
      gender: child.gender as "M" | "F",
      date_of_birth: child.date_of_birth || "",
      class: child.class || "",
      enrolled_at: child.enrolled_at || "",
    } : {
      parent_id: 1,
      first_name: "",
      last_name: "",
      gender: "M",
      date_of_birth: "",
      class: "",
      enrolled_at: "",
    },
  })

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => childService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] })
      toast({ title: "Enfant créé avec succès" })
      form.reset()
      onClose()
    },
    onError: (error: any) => {
      console.error('Error creating child:', error)
      toast({ 
        title: "Erreur lors de la création", 
        description: error.message || "Une erreur est survenue",
        variant: "destructive" 
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      childService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] })
      toast({ title: "Enfant modifié avec succès" })
      onClose()
    },
    onError: (error: any) => {
      console.error('Error updating child:', error)
      toast({ 
        title: "Erreur lors de la modification", 
        description: error.message || "Une erreur est survenue",
        variant: "destructive" 
      })
    },
  })

  const onSubmit = (data: ChildFormData) => {
    const formData = new FormData()
    
    formData.append('parent_id', data.parent_id.toString())
    formData.append('first_name', data.first_name)
    formData.append('last_name', data.last_name)
    formData.append('gender', data.gender)
    formData.append('date_of_birth', data.date_of_birth)
    if (data.class) formData.append('class', data.class)
    if (data.enrolled_at) formData.append('enrolled_at', data.enrolled_at)
    if (data.photo) formData.append('photo', data.photo)

    if (mode === "create") {
      createMutation.mutate(formData)
    } else if (mode === "edit" && child) {
      updateMutation.mutate({ id: child.id, data: formData })
    }
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Ajouter un enfant"}
            {mode === "edit" && "Modifier l'enfant"}
            {mode === "view" && "Détails de l'enfant"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Créer un nouvel enfant dans le système"}
            {mode === "edit" && "Modifier les informations de l'enfant"}
            {mode === "view" && "Consulter les informations de l'enfant"}
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le genre" />
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
                control={form.control}
                name="date_of_birth"
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
            </div>

            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enrolled_at"
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

            <FormField
              control={form.control}
              name="photo"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      disabled={isReadOnly}
                      {...field}
                    />
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
