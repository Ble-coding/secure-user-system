
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Recuperator } from "@/types/Recuperator"
import { recuperatorService } from "@/lib/api/recuperators"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { recuperatorSchema, RecuperatorFormData } from "./recuperatorValidation"
import { useRecuperatorData } from "./useRecuperatorData"
import { RecuperatorFormFields } from "./RecuperatorFormFields"

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
  
  const { parents, getAvailableChildren } = useRecuperatorData()

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

  const availableChildren = getAvailableChildren(selectedParentId)

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
            <RecuperatorFormFields
              form={form}
              parents={parents}
              availableChildren={availableChildren}
              selectedParentId={selectedParentId}
              recuperator={recuperator}
              mode={mode}
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
