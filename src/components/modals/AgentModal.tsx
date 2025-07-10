
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BASE_URL } from "@/lib/api/config"
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
  const isReadOnly = mode === "view"
  

  const agentSchema = z.object({
    first_name: z.string().min(2, "Le prénom est requis"),
    last_name: z.string().min(2, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().min(10, "Téléphone invalide"),
    type: z.string().min(1, "Type d'agent requis"),
    ville: z.string().optional(),
    sexe: z.enum(["M", "F"], { required_error: "Le sexe est requis" }),
    date_naissance: z.string().optional(),
    document_type: z.string().min(1, "Type de document requis"),
    document_file: mode === "create"
      ? z.any().refine((file) => file instanceof File, {
          message: "Le fichier du document est requis"
        })
      : z.any().optional()
  })

type AgentFormData = z.infer<typeof agentSchema>
const isSexeValid = (val: unknown): val is "M" | "F" => val === "M" || val === "F"


 const form = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      first_name: agent?.first_name || "",
      last_name: agent?.last_name || "",
      email: agent?.email || "",
      phone: agent?.phone || "",
      type: agent?.type || "",
      ville: agent?.ville || "",
      sexe: isSexeValid(agent?.sexe) ? agent.sexe : undefined,
      date_naissance: agent?.date_naissance || "",
      document_type: agent?.document_type || "",
      document_file: undefined,
    }
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
    onError: (error: unknown) => {
      const err = error as { message?: string };
      console.error('Error creating agent:', error);
      toast({ 
        title: "Erreur lors de la création", 
        description: err.message || "Une erreur est survenue",
        variant: "destructive" 
      });
    },
  })

  const updateMutation = useMutation({
   mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      agentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      toast({ title: "Agent modifié avec succès" })
      onClose()
    },
   onError: (error: unknown) => {
      const err = error as { message?: string };
      console.error('Error creating agent:', error);
      toast({ 
        title: "Erreur lors de la création", 
        description: err.message || "Une erreur est survenue",
        variant: "destructive" 
      });
    },
  })

const onSubmit = (data: AgentFormData) => {
  const formData = new FormData()
  formData.append('first_name', data.first_name)
  formData.append('last_name', data.last_name)
  formData.append('email', data.email)
  formData.append('phone', data.phone)
  formData.append('type', data.type)
  if (data.ville) formData.append('ville', data.ville)
  if (data.sexe) formData.append('sexe', data.sexe)
  if (data.date_naissance) formData.append('date_naissance', data.date_naissance)
  formData.append('document_type', data.document_type)
  if (data.document_file instanceof File) {
    formData.append('document_file', data.document_file)
  }

  if (mode === "create") {
    createMutation.mutate(formData)
  } else if (mode === "edit" && agent) {
    updateMutation.mutate({ id: agent.code, data: formData })
  }
}


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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
  <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'agent</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}  disabled={isReadOnly}>

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
<FormField
  control={form.control}
  name="date_naissance"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Date de naissance</FormLabel>
      <FormControl>
        <Input
          type="date"
          {...field}
          disabled={isReadOnly}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

</div>

            <FormField
  control={form.control}
  name="ville"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Ville</FormLabel>
      <FormControl>
        <Input {...field} disabled={isReadOnly} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
  <div className="grid grid-cols-2 gap-4">
<FormField
  control={form.control}
  name="sexe"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Sexe</FormLabel>
<Select onValueChange={field.onChange} defaultValue={field.value}  disabled={isReadOnly}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le sexe" />
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
  name="document_type"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Type de document</FormLabel>
<Select onValueChange={field.onChange} defaultValue={field.value}  disabled={isReadOnly}>

        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="CNI">Carte Nationale d’Identité</SelectItem>
          <SelectItem value="PASSPORT">Passeport</SelectItem>
          <SelectItem value="PERMIS">Permis de conduire</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>  </div>

<FormField
  control={form.control}
  name="document_file"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Fichier du document</FormLabel>
      <FormControl>
        <div className="space-y-2">
          {mode !== "create" && typeof agent?.document_file === "string" && agent.document_file && (
            <a
              href={`${BASE_URL}/storage/${agent.document_file}`}
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
   onChange={(e) => field.onChange(e.target.files?.[0])} />

        </div>
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
