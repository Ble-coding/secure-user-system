import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Baby, 
  User,
  Users,
  BookOpen,
  Clock,
  ArrowDown,
  ArrowUp,
  Mail
} from "lucide-react"
import { ChildWithRelations } from "@/lib/api/children"

interface ChildDetailModalProps {
  child: ChildWithRelations | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ChildDetailModal({ child, isOpen, onOpenChange }: ChildDetailModalProps) {
  if (!child) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de l'enfant</DialogTitle>
          <DialogDescription>
            Informations complètes sur l'enfant et ses activités
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations de l'enfant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="w-5 h-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Nom complet:</strong> {child.first_name} {child.last_name}
                </div>
                <div>
                  <strong>Code:</strong> <Badge variant="outline">{child.code}</Badge>
                </div>
                <div>
                  <strong>Genre:</strong> {child.gender === "M" ? "Masculin" : "Féminin"}
                </div>
                <div>
                  <strong>Date de naissance:</strong> {child.date_of_birth}
                </div>
                {child.class && (
                  <div>
                    <strong>Classe:</strong> <Badge variant="outline">{child.class}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informations du parent */}
          {child.parent && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Parent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div><strong>Nom:</strong> {child.parent.prenom} {child.parent.nom}</div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <strong>Email:</strong> {child.parent.email}
                  </div>
                    <div>
                  <strong>Code:</strong> <Badge variant="outline">{child.code}</Badge>
                </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Récupérateurs autorisés */}
          {child.recuperators.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Récupérateurs autorisés ({child.recuperators.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {child.recuperators.map((recup) => (
                    <div key={recup.id} className="p-3 border rounded-lg">
                      <div className="font-semibold">{recup.first_name} {recup.last_name}</div>
                      <div className="text-sm text-muted-foreground">Code: {recup.code}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistiques d'activité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Statistiques d'activité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-success">{child.entry_count}</div>
                  <div className="text-sm text-muted-foreground">Entrées</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-destructive">{child.exit_count}</div>
                  <div className="text-sm text-muted-foreground">Sorties</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {child.entry_count + child.exit_count}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dernières activités */}
          {child.last_activities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Dernières activités
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {child.last_activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {activity.type === 'entry' ? (
                          <ArrowDown className="w-5 h-5 text-success" />
                        ) : (
                          <ArrowUp className="w-5 h-5 text-destructive" />
                        )}
                        <div>
                          <div className="font-semibold">{activity.status}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(activity.scanned_at).toLocaleString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      {activity.recuperator && (
                        <div className="text-right">
                          <div className="font-medium">{activity.recuperator.full_name}</div>
                          <div className="text-sm text-muted-foreground">{activity.recuperator.code}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
