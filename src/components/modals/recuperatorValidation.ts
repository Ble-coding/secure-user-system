
import * as z from "zod"

export const recuperatorSchema = z.object({
  parent_id: z.number().min(1, "Parent requis"),
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().optional(),
  sexe: z.enum(["M", "F"]).optional(),
  relation_type: z.string().min(1, "Type de relation requis"),
  document_type: z.string().min(1, "Type de document requis"),
  document_numero: z.string().optional(),
  document_file: z.any().optional(),
  photo: z.any().optional(),
  children_ids: z.array(z.number()).min(1, "Au moins un enfant doit être sélectionné"),
})

export type RecuperatorFormData = z.infer<typeof recuperatorSchema>
