
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface CrudModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit' | 'view'
  entity: 'user' | 'agent' | 'parent' | 'child' | 'recuperator'
  data?: any
  onSave?: (data: any) => void
}

export function CrudModal({ isOpen, onClose, mode, entity, data, onSave }: CrudModalProps) {
  const [formData, setFormData] = useState(data || {})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (onSave) {
        await onSave(formData)
      }
      toast({
        title: mode === 'create' ? 'Créé avec succès' : 'Modifié avec succès',
        description: `${entity} ${mode === 'create' ? 'créé' : 'modifié'} avec succès`
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTitle = () => {
    const actions = { create: 'Créer', edit: 'Modifier', view: 'Voir' }
    const entities = { 
      user: 'Utilisateur', 
      agent: 'Agent', 
      parent: 'Parent', 
      child: 'Enfant', 
      recuperator: 'Récupérateur' 
    }
    return `${actions[mode]} ${entities[entity]}`
  }

  const renderFields = () => {
    const commonFields = (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">Prénom</Label>
            <Input
              id="first_name"
              value={formData.first_name || ''}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              disabled={mode === 'view'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Nom</Label>
            <Input
              id="last_name"
              value={formData.last_name || ''}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              disabled={mode === 'view'}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={mode === 'view'}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={mode === 'view'}
          />
        </div>
      </>
    )

    switch (entity) {
      case 'agent':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type || ''} onValueChange={(value) => setFormData({ ...formData, type: value })} disabled={mode === 'view'}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enseignant">Enseignant</SelectItem>
                  <SelectItem value="surveillant">Surveillant</SelectItem>
                  <SelectItem value="sécurité">Sécurité</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      
      case 'parent':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={formData.nom || ''}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  disabled={mode === 'view'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={formData.prenom || ''}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  disabled={mode === 'view'}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={formData.telephone || ''}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Textarea
                id="adresse"
                value={formData.adresse || ''}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>
          </>
        )
      
      case 'child':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Genre</Label>
                <Select value={formData.gender || ''} onValueChange={(value) => setFormData({ ...formData, gender: value })} disabled={mode === 'view'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Classe</Label>
                <Input
                  id="class"
                  value={formData.class || ''}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  disabled={mode === 'view'}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date de naissance</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>
          </>
        )
      
      case 'recuperator':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label htmlFor="relation_type">Type de relation</Label>
              <Select value={formData.relation_type || ''} onValueChange={(value) => setFormData({ ...formData, relation_type: value })} disabled={mode === 'view'}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="grand-parent">Grand-parent</SelectItem>
                  <SelectItem value="oncle_tante">Oncle/Tante</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      
      default:
        return commonFields
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === 'create' && `Créer un nouveau ${entity}`}
            {mode === 'edit' && `Modifier les informations de ce ${entity}`}  
            {mode === 'view' && `Voir les détails de ce ${entity}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {renderFields()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          {mode !== 'view' && (
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
