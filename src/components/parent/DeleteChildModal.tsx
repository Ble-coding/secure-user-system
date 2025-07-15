import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteChildModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  childName: string
  hasData: boolean
}

export function DeleteChildModal({
  isOpen,
  onClose,
  onConfirm,
  childName,
  hasData
}: DeleteChildModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <DialogTitle>Supprimer l'enfant</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {hasData ? (
              <>
                <p className="mb-2">
                  <strong>{childName}</strong> a déjà des données enregistrées en base de données.
                </p>
                <p className="text-destructive font-medium">
                  Cette action est irréversible et supprimera définitivement toutes les données associées à cet enfant.
                </p>
              </>
            ) : (
              <p>
                Êtes-vous sûr de vouloir supprimer <strong>{childName}</strong> ?
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onConfirm}
          >
            {hasData ? "Supprimer définitivement" : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
