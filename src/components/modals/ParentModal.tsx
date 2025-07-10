
import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ParentUser, parentService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2 } from "lucide-react"

const childSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  gender: z.enum(["M", "F"], { message: "Sélectionnez le genre" }),
  date_of_birth: z.string().min(1, "Date de naissance requise"),
  class: z.string().optional(),
  enrolled_at: z.string().optional(),
})

const recuperatorSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  relation_type: z.string().optional(),
  document_type: z.string().optional(),
  document_file: z.any().optional(),
})

const parentSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  telephone: z.string().min(10, "Numéro de téléphone invalide"),
  children: z.array(childSchema).min(1, "Au moins un enfant est requis"),
  recuperator: recuperatorSchema.optional(),
})

type ParentFormData = z.infer<typeof parentSchema>

interface ParentModalProps {
  isOpen: boolean
  onClose: () => void
  parent?: ParentUser
  mode: "create" | "edit" | "view"
}

export function ParentModal({ isOpen, onClose, parent, mode }: ParentModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
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
      },
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children"
  })

  useEffect(() => {
    const errors = form.formState.errors
    if (Object.keys(errors).length > 0) {
      console.warn("❌ Erreurs de validation", errors)
    }
  }, [form.formState.errors])

  useEffect(() => {
    if (isOpen) {
      if (parent && mode !== "create") {
        form.reset({
          nom: parent.nom || "",
          prenom: parent.prenom || "",
          email: parent.email || "",
          telephone: parent.telephone || "",
          children: parent.children?.map(child => ({
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
          },
        })
      } else {
        form.reset({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
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
          },
        })
      }
    }
  }, [isOpen, parent, mode, form])

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => parentService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['parents'],
        exact: false,
      })
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
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      parentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['parents'],
        exact: false,
      })
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
    
    formData.append('nom', data.nom)
    formData.append('prenom', data.prenom)
    formData.append('telephone', data.telephone)
    if (data.email) formData.append('email', data.email)

    // Ajouter les enfants
    data.children.forEach((child, index) => {
      formData.append(`children[${index}][first_name]`, child.first_name)
      formData.append(`children[${index}][last_name]`, child.last_name)
      formData.append(`children[${index}][gender]`, child.gender)
      formData.append(`children[${index}][date_of_birth]`, child.date_of_birth)
      if (child.class) formData.append(`children[${index}][class]`, child.class)
      if (child.enrolled_at) formData.append(`children[${index}][enrolled_at]`, child.enrolled_at)
    })

    // Ajouter le récupérateur si fourni
    if (data.recuperator?.first_name) {
      formData.append('recuperator[first_name]', data.recuperator.first_name)
      formData.append('recuperator[last_name]', data.recuperator.last_name || '')
      formData.append('recuperator[phone]', data.recuperator.phone || '')
      formData.append('recuperator[relation_type]', data.recuperator.relation_type || '')
      formData.append('recuperator[document_type]', data.recuperator.document_type || '')
      if (data.recuperator.document_file) {
        formData.append('recuperator[document_file]', data.recuperator.document_file)
      }
    }

    console.log([...formData.entries()])
    
    if (mode === "create") {
      createMutation.mutate(formData)
    } else if (mode === "edit" && parent) {
      console.log("🔧 En mode édition, updateMutation envoyé")
      updateMutation.mutate({ id: parent.id, data: formData })
    }
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Ajouter un parent"}
            {mode === "edit" && "Modifier le parent"}
            {mode === "view" && "Détails du parent"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Créer un nouveau parent avec ses enfants et éventuellement un récupérateur"}
            {mode === "edit" && "Modifier les informations du parent"}
            {mode === "view" && "Consulter les informations du parent"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informations du parent */}
            <Card>
              <CardHeader>
                <CardTitle>Informations du parent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nom"
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

                  <FormField
                    control={form.control}
                    name="prenom"
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone *</FormLabel>
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
                </div>
              </CardContent>
            </Card>

            {/* Enfants */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Enfants</CardTitle>
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ 
                      first_name: "", 
                      last_name: "", 
                      gender: "M", 
                      date_of_birth: "",
                      class: "",
                      enrolled_at: "",
                    })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un enfant
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Enfant {index + 1}</h4>
                      {!isReadOnly && fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`children.${index}.first_name`}
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
                        name={`children.${index}.last_name`}
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

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`children.${index}.gender`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Genre *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner" />
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
                        name={`children.${index}.date_of_birth`}
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

                      <FormField
                        control={form.control}
                        name={`children.${index}.class`}
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
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Récupérateur optionnel */}
            {mode === "create" && (
              <Card>
                <CardHeader>
                  <CardTitle>Récupérateur (Optionnel)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="recuperator.first_name"
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
                      name="recuperator.last_name"
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="recuperator.phone"
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
                      name="recuperator.relation_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relation</FormLabel>
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
                      name="recuperator.document_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de document</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isReadOnly} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recuperator.document_file"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <FormLabel>Document</FormLabel>
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
                  </div>
                </CardContent>
              </Card>
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
