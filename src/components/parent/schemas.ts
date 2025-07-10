import * as z from "zod"

export const childSchema = z.object({
  id: z.number().optional(),
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  gender: z.enum(["M", "F"], { message: "Sélectionnez le genre" }),
  date_of_birth: z.string().min(1, "Date de naissance requise"),
  class: z.string().optional(),
  enrolled_at: z.string().optional(),
})

export const recuperatorSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  relation_type: z.string().optional(),
  document_type: z.string().optional(),
  document_numero: z.string().optional(),
  document_file: z.any().optional(),
  sexe: z.enum(["M", "F"]).optional(),
  date_naissance: z.string().optional(),
  adresse: z.string().optional(),
  photo: z.any().optional(),
  ville: z.string().optional(),
})

export const parentSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  telephone: z.string().min(10, "Numéro de téléphone invalide"),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  date_naissance: z.string().optional(),
  sexe: z.enum(["M", "F"]).optional(),
  photo: z.any().optional(),
  document_type: z.string().optional(),
  document_numero: z.string().optional(),
  document_file: z.any().optional(),
  children: z.array(childSchema).min(1, "Au moins un enfant est requis"),
  recuperator: recuperatorSchema.optional(),
})

export type ParentFormData = z.infer<typeof parentSchema>
