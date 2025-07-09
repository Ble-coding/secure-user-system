
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, userService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const userSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").optional(),
  role: z.string().min(1, "Le rôle est requis"),
})

type UserFormData = z.infer<typeof userSchema>

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user?: User
  mode: "create" | "edit" | "view"
}

export function UserModal({ isOpen, onClose, user, mode }: UserModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
    } : {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  })

  const createMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: "Utilisateur créé avec succès" })
      form.reset()
      onClose()
    },
    onError: (error: any) => {
      console.error('Error creating user:', error)
      toast({ 
        title: "Erreur lors de la création", 
        description: error.message || "Une erreur est survenue",
        variant: "destructive" 
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: "Utilisateur modifié avec succès" })
      onClose()
    },
    onError: (error: any) => {
      console.error('Error updating user:', error)
      toast({ 
        title: "Erreur lors de la modification", 
        description: error.message || "Une erreur est survenue",
        variant: "destructive" 
      })
    },
  })

  const onSubmit = (data: UserFormData) => {
    if (mode === "create") {
      createMutation.mutate(data)
    } else if (mode === "edit" && user) {
      const { password, ...updateData } = data
      updateMutation.mutate({ id: user.id, data: updateData })
    }
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Ajouter un utilisateur"}
            {mode === "edit" && "Modifier l'utilisateur"}
            {mode === "view" && "Détails de l'utilisateur"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Créer un nouvel utilisateur dans le système"}
            {mode === "edit" && "Modifier les informations de l'utilisateur"}
            {mode === "view" && "Consulter les informations de l'utilisateur"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
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

            {mode === "create" && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Agent">Agent</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Récupérateur">Récupérateur</SelectItem>
                    </SelectContent>
                  </Select>
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
