import { useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { parentService } from "@/lib/api/parents"
import { ParentUser } from "@/types/Parent"
import { parentSchema, ParentFormData } from "./schemas"

interface UseParentFormProps {
  parent?: ParentUser
  mode: "create" | "edit" | "view"
  isOpen: boolean
  onClose: () => void
}

export function useParentForm({ parent, mode, isOpen, onClose }: UseParentFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      adresse: "",
      ville: "",
      date_naissance: "",
      sexe: undefined,
      photo: undefined,
      document_type: "",
      document_numero: "",
      document_file: undefined,
      children: [{ 
        first_name: "", 
        last_name: "", 
        gender: "M" as const, 
        date_of_birth: "",
        class: "",
        enrolled_at: "",
      }],
      recuperator: {
        first_name: "",
        last_name: "",
        phone: "",
        relation_type: "",
        document_type: "",
        document_numero: "",
        sexe: undefined,
        date_naissance: "",
        adresse: "",
        ville: "",
      },
    },
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: "children"
  })

  useEffect(() => {
    if (isOpen) {
      if (parent && mode !== "create") {
        form.reset({
          nom: parent.nom || "",
          prenom: parent.prenom || "",
          email: parent.email || "",
          telephone: parent.telephone || "",
          adresse: parent.adresse || "",
          ville: parent.ville || "",
          date_naissance: parent.date_naissance || "",
          sexe: parent.sexe as "M" | "F" | undefined,
          document_type: parent.document_type || "",
          document_numero: parent.document_numero || "",
          children: parent.children?.map(child => ({
            id: child.id,
            first_name: child.first_name,
            last_name: child.last_name,
            gender: child.gender as "M" | "F",
            date_of_birth: child.date_of_birth,
            class: child.class || "",
            enrolled_at: child.enrolled_at || "",
          })) || [{ 
            first_name: "", 
            last_name: "", 
            gender: "M" as const, 
            date_of_birth: "",
            class: "",
            enrolled_at: "",
          }],
          recuperator: {
            first_name: "",
            last_name: "",
            phone: "",
            relation_type: "",
            document_type: "",
            document_numero: "",
            sexe: undefined,
            date_naissance: "",
            adresse: "",
            ville: "",
          },
        })
      } else {
        form.reset()
      }
    }
  }, [isOpen, parent, mode, form])

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => parentService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] })
      toast({ title: "Parent créé avec succès" })
      form.reset()
      onClose()
    },
    onError: (error: unknown) => {
      const err = error as { message?: string }
      console.error('Error creating parent:', error)
      toast({ 
        title: "Erreur lors de la création", 
        description: err.message || "Une erreur est survenue",
        variant: "destructive" 
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ code, data }: { code: string; data: FormData }) =>
      parentService.update(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] })
      toast({ title: "Parent modifié avec succès" })
      form.reset()
      onClose()
    },
    onError: (error: unknown) => {
      const err = error as { message?: string }
      console.error('Error updating parent:', error)
      toast({ 
        title: "Erreur lors de la modification", 
        description: err.message || "Une erreur est survenue",
        variant: "destructive" 
      })
    },
  })

  const onSubmit = (data: ParentFormData) => {
    const formData = new FormData()
    
    // Données du parent
    formData.append('nom', data.nom)
    formData.append('prenom', data.prenom)
    formData.append('telephone', data.telephone)
    if (data.email) formData.append('email', data.email)
    if (data.adresse) formData.append('adresse', data.adresse)
    if (data.ville) formData.append('ville', data.ville)
    if (data.date_naissance) formData.append('date_naissance', data.date_naissance)
    if (data.sexe) formData.append('sexe', data.sexe)
    if (data.document_type) formData.append('document_type', data.document_type)
    if (data.document_numero) formData.append('document_numero', data.document_numero)
    
    // Fichiers
    if (data.photo instanceof File) {
      formData.append('photo', data.photo)
    }
    if (data.document_file instanceof File) {
      formData.append('document_file', data.document_file)
    }

    // Enfants (JSON stringifié selon l'API)
    const childrenData = data.children.map(child => ({
      ...(child.id && { id: child.id }),
      first_name: child.first_name,
      last_name: child.last_name,
      gender: child.gender,
      date_of_birth: child.date_of_birth,
      ...(child.class && { class: child.class }),
      ...(child.enrolled_at && { enrolled_at: child.enrolled_at }),
    }))
    formData.append('children', JSON.stringify(childrenData))

    // Récupérateur (JSON stringifié selon l'API)
    if (data.recuperator?.first_name) {
      const recuperatorData = {
        first_name: data.recuperator.first_name,
        last_name: data.recuperator.last_name || '',
        phone: data.recuperator.phone || '',
        relation_type: data.recuperator.relation_type || '',
        document_type: data.recuperator.document_type || '',
        ...(data.recuperator.document_numero && { document_numero: data.recuperator.document_numero }),
        ...(data.recuperator.sexe && { sexe: data.recuperator.sexe }),
        ...(data.recuperator.date_naissance && { date_naissance: data.recuperator.date_naissance }),
        ...(data.recuperator.adresse && { adresse: data.recuperator.adresse }),
        ...(data.recuperator.ville && { ville: data.recuperator.ville }),
      }
      formData.append('recuperator', JSON.stringify(recuperatorData))
      
      // Fichiers du récupérateur
      if (data.recuperator.document_file instanceof File) {
        formData.append('recuperator[document_file]', data.recuperator.document_file)
      }
      if (data.recuperator.photo instanceof File) {
        formData.append('recuperator[photo]', data.recuperator.photo)
      }
    }

    console.log('FormData entries:', [...formData.entries()])
    
    if (mode === "create") {
      createMutation.mutate(formData)
    } else if (mode === "edit" && parent) {
      updateMutation.mutate({ code: parent.code, data: formData })
    }
  }

  return {
    form,
    fieldArray,
    onSubmit,
    createMutation,
    updateMutation
  }
}
