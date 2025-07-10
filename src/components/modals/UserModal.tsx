
import { useState,useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { userService } from "@/lib/api/userService"
import { User } from "@/lib/api/users"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const userSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(6, "Téléphone requis"),

  password: z.preprocess(
    (val) => val === "" ? undefined : val, // vide = undefined
    z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").optional()
  ),

  password_confirmation: z.preprocess(
    (val) => val === "" ? undefined : val,
    z.string().optional()
  ),

  role: z.string().min(1, "Le rôle est requis"),
  photo: z.any().optional(),
}).refine((data) => {
  if (data.password || data.password_confirmation) {
    return data.password === data.password_confirmation
  }
  return true
}, {
  path: ['password_confirmation'],
  message: "Les mots de passe ne correspondent pas",
})



type UserFormData = z.infer<typeof userSchema>

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
    onCreateSuccess?: () => void
  user?: User
  mode: "create" | "edit" | "view"
}

export function UserModal({ isOpen, onClose, user, mode, onCreateSuccess  }: UserModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
const [photoInputKey, setPhotoInputKey] = useState(Date.now())
 const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      role: "",
    photo: undefined, // ✅ correct

    },
  })

  useEffect(() => {
  const errors = form.formState.errors
  if (Object.keys(errors).length > 0) {
    console.warn("❌ Erreurs de validation", errors)
  }
}, [form.formState.errors])

  useEffect(() => {
  if (isOpen) {
    if (user && mode !== "create") {
form.reset({
  name: user.name || "",
  email: user.email || "",
  phone: user.phone || "",               // ✅ Ajouté
  role: user.role || "",
  password: "",
  password_confirmation: "",
  photo: undefined,                      // ✅ ← FormData, pas besoin de set un string
})

    } else {
       form.reset()
    }
       setPhotoInputKey(Date.now()) // ✅ force le champ input file à se remonter
  }
}, [isOpen, user, mode, form]) // ← ajouter `form`


  const createMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
        setTimeout(() => {
    onCreateSuccess?.() // setPage(1)
  }, 0)
    queryClient.invalidateQueries({
  queryKey: ['users'], // cela va invalider toutes les variations ['users', ...]
  exact: false, // ce `false` est important pour que toutes les variations avec page, filtre, etc., soient rafraîchies
})
      toast({ title: "Utilisateur créé avec succès" })
      form.reset()
      onClose()
        onCreateSuccess?.() // 🔁 déclenche le setPage(1)
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      console.error('Error creating user:', error);
      toast({ 
        title: "Erreur lors de la création", 
        description: err.message || "Une erreur est survenue",
        variant: "destructive" 
      });
    },
  })

const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      userService.update(id, data),
    onSuccess: () => {
        setTimeout(() => {
    onCreateSuccess?.() // setPage(1)
  }, 0)
queryClient.invalidateQueries({
  queryKey: ['users'], // cela va invalider toutes les variations ['users', ...]
  exact: false, // ce `false` est important pour que toutes les variations avec page, filtre, etc., soient rafraîchies
})
      toast({ title: "Utilisateur mis à jour avec succès" })
      form.reset()
      onClose()
        onCreateSuccess?.() // 🔁 déclenche le setPage(1)
    },
    onError: () => {
      toast({
        title: "Erreur lors de la mise à jour",
        variant: "destructive",
      })
    },
  })
  // const onSubmit = (data: UserFormData) => {
  //   if (mode === "create") {
  //     createMutation.mutate(data)
  //   } else if (mode === "edit" && user) {
  //     const { password, ...updateData } = data
  //     updateMutation.mutate({ id: user.id, data: updateData })
  //   }
  // }

const onSubmit = (data: z.infer<typeof userSchema>) => {
  const formData = new FormData()
  formData.append("name", data.name)
  formData.append("email", data.email)
  formData.append("phone", data.phone)
    formData.append("role", data.role)
  if (data.password) formData.append("password", data.password)
  if (data.password_confirmation) formData.append("password_confirmation", data.password_confirmation)
        if (data.photo instanceof File) formData.append("photo", data.photo)

console.log([...formData.entries()])
  if (mode === "create") {
    createMutation.mutate(formData)
  } else if (mode === "edit" && user) {
      console.log("🔧 En mode édition, updateMutation envoyé")
    updateMutation.mutate({ id: user.id, data: formData })
  }
}



  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent  className="max-w-md max-h-[90vh] overflow-y-auto">

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
         
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={isReadOnly} />
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


            {mode === "create" && (
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
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
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      {/* <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Récupérateur">Récupérateur</SelectItem> */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isReadOnly && (
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo de profil</FormLabel>
             <FormControl>
  <div className="space-y-2">
    {mode !== "create" && typeof user?.photo === "string" && user.photo && (
      <img
        src={`${BASE_URL}/storage/${user.photo}`}
        alt="Aperçu"
        className="w-20 h-20 object-cover rounded-md border"
        onError={(e) => {
          e.currentTarget.style.display = "none"
          console.warn("Erreur de chargement image :", e.currentTarget.src)
        }}
      />
    )}

    <Input
      type="file"
      key={photoInputKey}
      accept="image/*"
      onChange={(e) => field.onChange(e.target.files?.[0])}
    />
  </div>
</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
