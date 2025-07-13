
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Baby, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  UserCheck,
  UserX,
  BookOpen,
  User,
  Users,
  Clock,
  ArrowDown,
  ArrowUp,
  Phone,
  Mail
} from "lucide-react"
import { childService, ChildWithRelations } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

export default function Children() {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [entryFilter, setEntryFilter] = useState<"all" | "entry" | "exit">("all")
  const [selectedChild, setSelectedChild] = useState<ChildWithRelations | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const { toast } = useToast()

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['children-with-relations', page, searchTerm],
    queryFn: () => childService.getAllWithRelations(page, searchTerm),
    staleTime: 0,
    refetchOnMount: true,
  })

  const children = response?.data?.children ?? []
  const pagination = {
    currentPage: response?.data?.current_page ?? 1,
    lastPage: response?.data?.last_page ?? 1,
    perPage: response?.data?.per_page ?? 15,
    total: response?.data?.total ?? 0,
  }

  const getStatusBadge = (child: ChildWithRelations) => {
    const lastActivity = child.last_activities?.[0]
    if (!lastActivity) {
      return <Badge variant="secondary">Aucune activité</Badge>
    }
    
    return lastActivity.type === 'entry' 
      ? <Badge className="bg-success text-success-foreground">Présent</Badge>
      : <Badge className="bg-destructive text-destructive-foreground">Sorti</Badge>
  }

  const filteredChildren = children.filter((child: ChildWithRelations) => {
    if (entryFilter === "all") return true
    const lastActivity = child.last_activities?.[0]
    if (!lastActivity) return false
    return lastActivity.type === entryFilter
  })

  const handleViewDetails = (child: ChildWithRelations) => {
    setSelectedChild(child)
    setIsDetailModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-destructive">Erreur lors du chargement des enfants</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Liste des Enfants</h1>
          <p className="text-muted-foreground">Consultez tous les enfants avec leurs détails</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Enfants
            </CardTitle>
            <Baby className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pagination.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Présents
            </CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {children.filter(c => c.last_activities?.[0]?.type === "entry").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sortis
            </CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {children.filter(c => c.last_activities?.[0]?.type === "exit").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Entrées
            </CardTitle>
            <BookOpen className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {children.reduce((sum, c) => sum + c.entry_count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Children Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Enfants</CardTitle>
          <CardDescription>
            Consultez tous les enfants avec leurs parents et récupérateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Rechercher par nom ou code..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filtrer par activité</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setEntryFilter("all")}>
                  Tous
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEntryFilter("entry")}>
                  <ArrowDown className="w-4 h-4 mr-2 text-success" />
                  Présents
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEntryFilter("exit")}>
                  <ArrowUp className="w-4 h-4 mr-2 text-destructive" />
                  Sortis
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enfant</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Récupérateurs</TableHead>
                  <TableHead>Activités</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière activité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChildren.map((child: ChildWithRelations) => (
                  <TableRow key={child.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{child.first_name} {child.last_name}</div>
                        <div className="text-sm text-muted-foreground">
                          <Badge variant="outline" className="mr-1">{child.code}</Badge>
                          {child.class && <Badge variant="outline">{child.class}</Badge>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {child.parent ? (
                        <div className="text-sm">
                          <div className="font-medium">{child.parent.prenom} {child.parent.nom}</div>
                          <div className="text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {child.parent.email}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Aucun parent</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {child.recuperators.length > 0 ? (
                          child.recuperators.slice(0, 2).map((recup) => (
                            <Badge key={recup.id} variant="outline" className="text-xs">
                              {recup.first_name} {recup.last_name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">Aucun</span>
                        )}
                        {child.recuperators.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{child.recuperators.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-success">↓ {child.entry_count}</div>
                        <div className="text-destructive">↑ {child.exit_count}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(child)}</TableCell>
                    <TableCell>
                      {child.last_scanned_at ? (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(child.last_scanned_at).toLocaleString('fr-FR')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewDetails(child)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 p-4">
              <div className="text-sm text-muted-foreground">
                Page {pagination.currentPage} sur {pagination.lastPage} ({pagination.total} enfants)
              </div>
              <div className="flex items-center gap-2">
                {[...Array(pagination.lastPage)].map((_, i) => {
                  const pageNumber = i + 1
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === pagination.currentPage ? "default" : "outline"}
                      onClick={() => setPage(pageNumber)}
                      className="px-3 py-1 h-auto text-sm"
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>

          {filteredChildren.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun enfant trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'enfant</DialogTitle>
            <DialogDescription>
              Informations complètes sur l'enfant et ses activités
            </DialogDescription>
          </DialogHeader>
          
          {selectedChild && (
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
                      <strong>Nom complet:</strong> {selectedChild.first_name} {selectedChild.last_name}
                    </div>
                    <div>
                      <strong>Code:</strong> <Badge variant="outline">{selectedChild.code}</Badge>
                    </div>
                    <div>
                      <strong>Genre:</strong> {selectedChild.gender === "M" ? "Masculin" : "Féminin"}
                    </div>
                    <div>
                      <strong>Date de naissance:</strong> {selectedChild.date_of_birth}
                    </div>
                    {selectedChild.class && (
                      <div>
                        <strong>Classe:</strong> <Badge variant="outline">{selectedChild.class}</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Informations du parent */}
              {selectedChild.parent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Parent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div><strong>Nom:</strong> {selectedChild.parent.prenom} {selectedChild.parent.nom}</div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <strong>Email:</strong> {selectedChild.parent.email}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Récupérateurs autorisés */}
              {selectedChild.recuperators.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Récupérateurs autorisés ({selectedChild.recuperators.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedChild.recuperators.map((recup) => (
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
                      <div className="text-2xl font-bold text-success">{selectedChild.entry_count}</div>
                      <div className="text-sm text-muted-foreground">Entrées</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-destructive">{selectedChild.exit_count}</div>
                      <div className="text-sm text-muted-foreground">Sorties</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {selectedChild.entry_count + selectedChild.exit_count}
                      </div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dernières activités */}
              {selectedChild.last_activities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Dernières activités
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedChild.last_activities.map((activity) => (
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
