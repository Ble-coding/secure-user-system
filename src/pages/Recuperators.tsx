
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RestoreModal } from "@/components/modals/RestoreModal"
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
  UserCheck, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  RotateCcw,
  Shield,
  Activity,
  UserX
} from "lucide-react"
import { recuperatorService } from "@/lib/api/recuperators"
import { Recuperator } from "@/types/Recuperator"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { RecuperatorModal } from "@/components/modals/RecuperatorModal"
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal"
import { useToast } from "@/hooks/use-toast"

export default function Recuperators() {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  
  const handleCreateSuccess = () => {
    setPage(1)
  }
  const [statusFilter, setStatusFilter] = useState("")
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: "create" | "edit" | "view"
    recuperator?: Recuperator
  }>({ isOpen: false, mode: "create" })
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    recuperator?: Recuperator
  }>({ isOpen: false })
  const [restoreModal, setRestoreModal] = useState<{
    isOpen: boolean
    recuperator?: Recuperator
  }>({ isOpen: false })

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const queryKey = ['recuperators', page, searchTerm, statusFilter]

  const { data: response, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => recuperatorService.getAll(page, searchTerm, statusFilter),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['recuperators'],
      exact: false,
    })
  }, [page, queryClient])

  const recuperators = response?.data?.data ?? []
  const newThisMonth = response?.data?.new_this_month ?? 0
  const totalActifs = response?.data?.total_actifs ?? 0
  const totalInactifs = response?.data?.total_inactifs ?? 0
  const totalRecuperators = totalActifs + totalInactifs

  const pagination = {
    currentPage: response?.data?.current_page ?? 1,
    lastPage: response?.data?.last_page ?? 1,
    perPage: response?.data?.per_page ?? 15,
    total: response?.data?.total ?? 0,
  }

  const deleteMutation = useMutation({
    mutationFn: (code: string) => recuperatorService.delete(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recuperators'] });
      toast({ title: "Récupérateur supprimé avec succès" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (code: string) => recuperatorService.restore(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recuperators'] })
      toast({ title: "Récupérateur restauré avec succès" })
    },
    onError: () => {
      toast({ title: "Erreur lors de la restauration", variant: "destructive" })
    },
  });

  const getStatusBadge = (recuperator: Recuperator) => {
    const isActive = recuperator.is_active && !recuperator.deleted_at
    return (
      <Badge className={isActive ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
        {isActive ? "Actif" : "Inactif"}
      </Badge>
    )
  }

  const getRelationBadge = (relation: string) => {
    const colors = {
      "parent": "bg-primary text-primary-foreground",
      "grand-parent": "bg-info text-info-foreground", 
      "oncle/tante": "bg-warning text-warning-foreground",
      "frère/sœur": "bg-success text-success-foreground",
      "tuteur": "bg-purple-500 text-white",
      "autre": "bg-muted text-muted-foreground"
    }
    return <Badge className={colors[relation as keyof typeof colors] || "bg-muted text-muted-foreground"}>{relation}</Badge>
  }

  const filteredRecuperators = recuperators.filter((recuperator: Recuperator) =>
    recuperator.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recuperator.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recuperator.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recuperator.relation_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recuperator.code?.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((recuperator: Recuperator) => {
    if (!statusFilter) return true
    const isActive = recuperator.is_active && !recuperator.deleted_at
    if (statusFilter === "Actif") return isActive
    if (statusFilter === "Inactif") return !isActive
    return true
  })

  const handleEdit = (recuperator: Recuperator) => {
    setModalState({ isOpen: true, mode: "edit", recuperator })
  }

  const handleView = (recuperator: Recuperator) => {
    setModalState({ isOpen: true, mode: "view", recuperator })
  }

  const handleDelete = (recuperator: Recuperator) => {
    setDeleteModal({ isOpen: true, recuperator })
  }

  const handleRestore = (recuperator: Recuperator) => {
    setRestoreModal({ isOpen: true, recuperator })
  }

  const confirmDelete = () => {
    if (deleteModal.recuperator) {
      deleteMutation.mutate(deleteModal.recuperator.code)
      setDeleteModal({ isOpen: false })
    }
  }

  const confirmRestore = () => {
    if (restoreModal.recuperator) {
      restoreMutation.mutate(restoreModal.recuperator.code)
      setRestoreModal({ isOpen: false })
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-destructive">Erreur lors du chargement des récupérateurs</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Récupérateurs</h1>
          <p className="text-muted-foreground">Gérez les personnes autorisées à récupérer les enfants</p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => setModalState({ isOpen: true, mode: "create" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un récupérateur
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Récupérateurs
            </CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalRecuperators}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actifs
            </CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalActifs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactifs
            </CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalInactifs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nouveaux ce mois
            </CardTitle>
            <Plus className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{newThisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recuperators Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Récupérateurs</CardTitle>
          <CardDescription>
            Consultez et gérez tous les récupérateurs autorisés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Rechercher par nom, téléphone, relation ou code..." 
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
                <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  setStatusFilter("")
                  setPage(1)
                }}>
                  Tous
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setStatusFilter("Actif")
                  setPage(1)
                }}>
                  Actif
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setStatusFilter("Inactif")
                  setPage(1)
                }}>
                  Inactif
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Relation</TableHead>
                  <TableHead>Enfants</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecuperators.map((recuperator: Recuperator) => (
                  <TableRow key={recuperator.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {recuperator.first_name} {recuperator.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{recuperator.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-muted-foreground">{recuperator.phone || "Non renseigné"}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getRelationBadge(recuperator.relation_type)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {recuperator.children?.length || 0} enfant(s)
                    </TableCell>
                    <TableCell>{getStatusBadge(recuperator)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleView(recuperator)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(recuperator)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {recuperator.deleted_at ? (
                            <DropdownMenuItem onClick={() => handleRestore(recuperator)}>
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Restaurer
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDelete(recuperator)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
              <div className="text-sm text-muted-foreground">
                Page {pagination.currentPage} sur {pagination.lastPage}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
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

          {filteredRecuperators.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun récupérateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <RecuperatorModal
        key={modalState.recuperator?.id ?? "create"}
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: "create" })}
        recuperator={modalState.recuperator}
        mode={modalState.mode}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={confirmDelete}
        title="Supprimer ce récupérateur"
        description="Êtes-vous sûr de vouloir supprimer ce récupérateur ? Cette action est irréversible."
        isLoading={deleteMutation.isPending}
      />

      <RestoreModal
        isOpen={restoreModal.isOpen}
        onClose={() => setRestoreModal({ isOpen: false })}
        onConfirm={confirmRestore}
        title="Restaurer ce récupérateur"
        description="Êtes-vous sûr de vouloir restaurer ce récupérateur ?"
        entityType="Récupérateur"
        entityCode={restoreModal.recuperator?.code || ""}
        isLoading={restoreMutation.isPending}
      />
    </div>
  )
}
