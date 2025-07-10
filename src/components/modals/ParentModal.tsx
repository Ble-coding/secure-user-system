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
import { ParentUser } from "@/types/Parent"
import { ParentInfoSection } from "@/components/parent/ParentInfoSection"
import { ChildrenSection } from "@/components/parent/ChildrenSection"
import { RecuperatorSection } from "@/components/parent/RecuperatorSection"
import { useParentForm } from "@/components/parent/useParentForm"

interface ParentModalProps {
  isOpen: boolean
  onClose: () => void
  parent?: ParentUser
  mode: "create" | "edit" | "view"
}

export function ParentModal({ isOpen, onClose, parent, mode }: ParentModalProps) {
  const { form, fieldArray, onSubmit, createMutation, updateMutation } = useParentForm({
    parent,
    mode,
    isOpen,
    onClose
  })

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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
            <ParentInfoSection 
              control={form.control} 
              isReadOnly={isReadOnly} 
            />

            <ChildrenSection 
              control={form.control} 
              fieldArray={fieldArray} 
              isReadOnly={isReadOnly} 
            />

            <RecuperatorSection 
              control={form.control} 
              isReadOnly={isReadOnly}
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
