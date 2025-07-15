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
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Recuperator } from "@/types/Recuperator"
import { recuperatorService } from "@/lib/api/recuperators"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { recuperatorSchema, RecuperatorFormData } from "@/components/recuperator/recuperatorValidation"
import { useRecuperatorData } from "@/components/recuperator/useRecuperatorData"
import { RecuperatorFormFields } from "@/components/recuperator/RecuperatorFormFields"

interface RecuperatorModalProps {
  isOpen: boolean
  onClose: () => void
  recuperator?: Recuperator
  mode: "create" | "edit" | "view"
  onCreateSuccess?: () => void
}

export function RecuperatorModal({ isOpen, onClose, recuperator, mode, onCreateSuccess  }: RecuperatorModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isReadOnly = mode === "view"

  const [selectedParentCode, setSelectedParentCode] = useState<string | null>(null)


  const form = useForm<RecuperatorFormData>({
    resolver: zodResolver(recuperatorSchema),
    defaultValues: recuperator
      ? {
                  // parent_id: recuperator.parent_id || 0,
                  
   parent_id:
  recuperator?.parent?.code
  ?? recuperator?.parent_id?.toString()
  ?? recuperator?.parent?.id?.toString() // fallback supplémentaire si besoin
  ?? "",
              // parent_id: recuperator?.parent_id?.toString() ?? "",
    children_ids: recuperator?.children?.map((child) => child.code) ?? [],
          first_name: recuperator.first_name || "",
          last_name: recuperator.last_name || "",
          phone: recuperator.phone || "",
          sexe: recuperator.sexe || undefined,
          relation_type: recuperator.relation_type || "",
          document_type: recuperator.document_type || "",
          document_numero: recuperator.document_numero || "",
            photo: undefined, // ✅ IMPORTANT ! fichiers doivent être `undefined`, pas `string`
        document_file: undefined,
          // children_ids: recuperator.children?.map((child) => child.id) || [],
            //  children_ids: recuperator.children?.map((child) => child.code) || [],
             
        }
      : {
          parent_id: "",
          first_name: "",
          last_name: "",
          phone: "",
          sexe: undefined,
          relation_type: "",
          document_type: "",
          document_numero: "",
             photo: undefined,
        document_file: undefined,
          children_ids: [],
        },
  })

// const parentId = Number(form.watch("parent_id"))

const parentCode = form.watch("parent_id") // string


useEffect(() => {
  if (!selectedParentCode && mode === "edit" && parentCode) {
    setSelectedParentCode(parentCode)
  }

  if (parentCode && parentCode !== selectedParentCode) {
    setSelectedParentCode(parentCode)

    if (mode === "create") {
      form.setValue("children_ids", []) // uniquement en création
    }
  }
}, [parentCode, selectedParentCode, form, mode])


  const {
  // parents,

    parents: fullParents,
  search,
  setSearch,
  useAvailableChildren,
    selectedParentData,
// } = useRecuperatorData()
} = useRecuperatorData(parentCode)
  // const { parents, useAvailableChildren } = useRecuperatorData()


useEffect(() => {
  console.log("📌 parentCode =", parentCode)
  // console.log("🧩 fullParents =", fullParents)
  console.log("📌 parents =", fullParents)
  console.log("📌 selectedParentData =", selectedParentData)
}, [parentCode, fullParents, selectedParentData])
// const parentLoaded = parents.find(p => p.code === parentCode) || selectedParentData
useEffect(() => {
  const found = fullParents.find(p => p.code === selectedParentData?.code)
  console.log("🧐 parent existe déjà dans parents ?", !!found)
}, [fullParents, selectedParentData])

// const readyToRenderParentSelect = isReadOnly || !parentCode || !!parentLoaded

useEffect(() => {
  if (selectedParentData) {
    console.log("PARENT NON PAGINÉ", selectedParentData)
  }
}, [selectedParentData])

  // const { data: availableChildrenResponse } = useAvailableChildren(selectedParentId)
  // const availableChildren = availableChildrenResponse?.data || []
  const childrenResponse = useAvailableChildren(selectedParentCode)
const availableChildren = childrenResponse.data?.data ?? []



  const createMutation = useMutation({
    mutationFn: recuperatorService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recuperators'] })
      toast({ title: "Récupérateur créé avec succès" })
      form.reset()
      onClose()
      onCreateSuccess?.()
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      console.error('Error creating recuperator:', error);
      toast({ 
        title: "Erreur lors de la création", 
        description: err.message || "Une erreur est survenue",
        variant: "destructive" 
      });
    },
  })

  const updateMutation = useMutation({
   mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      recuperatorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recuperators'] })
      toast({ title: "Récupérateur modifié avec succès" })
      onClose()
    },
   onError: (error: unknown) => {
      const err = error as { message?: string };
      console.error('Error creating recuperator:', error);
      toast({ 
        title: "Erreur lors de la création", 
        description: err.message || "Une erreur est survenue",
        variant: "destructive" 
      });
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
  // data.children_ids.forEach((childId, index) => {
  //   formData.append(`children_ids[${index}]`, childId.toString())
  // })

  data.children_ids.forEach((childCode, index) => {
    formData.append(`children_ids[${index}]`, childCode)
  })




   if (mode === "create") {
    createMutation.mutate(formData)
  } else if (mode === "edit" && recuperator) {
    updateMutation.mutate({ id: recuperator.code, data: formData })
  }
}
  
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
  parents={fullParents}
  // parents={parents}
  availableChildren={availableChildren}
  recuperator={recuperator} 
  selectedParentId={form.watch("parent_id")}
  
  // mode="create"
  mode={mode}
  search={search}
  selectedParentData={selectedParentData} 
  setSearch={setSearch}
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
                  {createMutation.isPending || updateMutation.isPending
                    ? "En cours..."
                    : mode === "create"
                    ? "Créer"
                    : "Modifier"}
                </Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
