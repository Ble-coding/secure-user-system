
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
import { Agent } from "@/types/Agent"
import { agentService } from "@/lib/api/agents"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const agentSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  type: z.string().min(1, "Type d'agent requis"),
})

type AgentFormData = z.infer<typeof agentSchema>

interface AgentModalProps {
  isOpen: boolean
  onClose: () => void
  agent?: Agent
  mode: "create" | "edit" | "view"
  onCreateSuccess?: () => void
}

export function AgentModal({ isOpen, onClose, agent, mode, onCreateSuccess }: AgentModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: agent ? {
      first_name: agent.first_name || "",
      last_name: agent.last_name || "",
      email: agent.email || "",
      phone: agent.phone || "",
      type: agent.type || "",
    } : {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      type: "",
    },
  })

  const createMutation = useMutation({
    mutationFn: agentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      toast({ title: "Agent créé avec succès" })
      form.reset()
      onClose()
      onCreateSuccess?.()
    },
    onError: (error: any) => {
      console.error('Error creating agent:', error)
      toast({ 
        title: "Erreur lors de la création", 
        description: error.message || "Une erreur est survenue",
        variant: "destructive" 
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      agentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      toast({ title: "Agent modifié avec succès" })
      onClose()
    },
    onError: (error: any) => {
      console.error('Error updating agent:', error)
      toast({ 
        title: "Erreur lors de la modification", 
        description: error.message || "Une erreur est survenue",
        variant: "destructive" 
      })
    },
  })

  const onSubmit = (data: AgentFormData) => {
    const formData = new FormData()
    formData.append('first_name', data.first_name)
    formData.append('last_name', data.last_name)
    formData.append('email', data.email)
    formData.append('phone', data.phone)
    formData.append('type', data.type)
    formData.append('code', `AG-${Date.now()}`)
    formData.append('status', 'En service')

    if (mode === "create") {
      createMutation.mutate(formData)
    } else if (mode === "edit" && agent) {
      updateMutation.mutate({ id: agent.id, data: formData })
    }
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Ajouter un agent"}
            {mode === "edit" && "Modifier l'agent"}
            {mode === "view" && "Détails de l'agent"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Créer un nouvel agent dans le système"}
            {mode === "edit" && "Modifier les informations de l'agent"}
            {mode === "view" && "Consulter les informations de l'agent"}
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'agent</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type d'agent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="enseignant">Enseignant</SelectItem>
                      <SelectItem value="surveillant">Surveillant</SelectItem>
                      <SelectItem value="sécurité">Sécurité</SelectItem>
                      <SelectItem value="administration">Administration</SelectItem>
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
