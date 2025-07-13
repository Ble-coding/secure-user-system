
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Agent } from '@/types/Agent'
import { ParentUser } from '@/types/Parent'
import { Child } from '@/types/Recuperator'
import { Recuperator } from '@/types/Recuperator'
import { User } from '@/lib/api/types'

type EntityData = User | Agent | ParentUser | Child | Recuperator | Record<string, unknown>

interface CrudModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit' | 'view'
  entity: 'user' | 'agent' | 'parent' | 'child' | 'recuperator'
  data?: EntityData
  onSave?: (data: EntityData) => void | Promise<void>
}

export function CrudModal({ isOpen, onClose, mode, entity, data, onSave }: CrudModalProps) {
  const [formData, setFormData] = useState<EntityData>(data || {})
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

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const renderFields = () => {
    const commonFields = (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">Prénom</Label>
            <Input
              id="first_name"
              value={(formData as Agent | Child | Recuperator).first_name || ''}
              onChange={(e) => updateFormData('first_name', e.target.value)}
              disabled={mode === 'view'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Nom</Label>
            <Input
              id="last_name"
              value={(formData as Agent | Child | Recuperator).last_name || ''}
              onChange={(e) => updateFormData('last_name', e.target.value)}
              disabled={mode === 'view'}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={(formData as Agent | User).email || ''}
            onChange={(e) => updateFormData('email', e.target.value)}
            disabled={mode === 'view'}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={(formData as Agent | Recuperator).phone || ''}
            onChange={(e) => updateFormData('phone', e.target.value)}
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
              <Select 
                value={(formData as Agent).type || ''} 
                onValueChange={(value) => updateFormData('type', value)} 
                disabled={mode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enseignant">Enseignant</SelectItem>
                  <SelectItem value="surveillant">Surveillant</SelectItem>
                  <SelectItem value="sécurité">Sécurité</SelectItem>
                  <SelectItem value="administration">Administration</SelectItem>
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
                  value={(formData as ParentUser).nom || ''}
                  onChange={(e) => updateFormData('nom', e.target.value)}
                  disabled={mode === 'view'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={(formData as ParentUser).prenom || ''}
                  onChange={(e) => updateFormData('prenom', e.target.value)}
                  disabled={mode === 'view'}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={(formData as ParentUser).email || ''}
                onChange={(e) => updateFormData('email', e.target.value)}
                disabled={mode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={(formData as ParentUser).telephone || ''}
                onChange={(e) => updateFormData('telephone', e.target.value)}
                disabled={mode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Textarea
                id="adresse"
                value={(formData as ParentUser).adresse || ''}
                onChange={(e) => updateFormData('adresse', e.target.value)}
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
                <Select 
                  value={(formData as Child).gender || ''} 
                  onValueChange={(value) => updateFormData('gender', value)} 
                  disabled={mode === 'view'}
                >
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
                  value={(formData as Child).class || ''}
                  onChange={(e) => updateFormData('class', e.target.value)}
                  disabled={mode === 'view'}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date de naissance</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={(formData as Child).date_of_birth || ''}
                onChange={(e) => updateFormData('date_of_birth', e.target.value)}
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
              <Select 
                value={(formData as Recuperator).relation_type || ''} 
                onValueChange={(value) => updateFormData('relation_type', value)} 
                disabled={mode === 'view'}
              >
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
