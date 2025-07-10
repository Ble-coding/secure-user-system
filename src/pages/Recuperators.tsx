
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
  UserCheck, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw
} from "lucide-react"
import { recuperatorService, Recuperator } from "@/lib/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { RecuperatorModal } from "@/components/modals/RecuperatorModal"
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal"
import { RestoreModal } from "@/components/modals/RestoreModal"
import { useToast } from "@/hooks/use-toast"

export default function Recuperators() {
  const [searchTerm, setSearchTerm] = useState("")
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

  const { data: recuperators = [], isLoading, error } = useQuery({
    queryKey: ['recuperators'],
    queryFn: recuperatorService.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: recuperatorService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recuperators'] })
      toast({ title: "Récupérateur supprimé avec succès" })
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" })
    },
  })

  const restoreMutation = useMutation({
    mutationFn: recuperatorService.restore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recuperators'] })
      toast({ title: "Récupérateur restauré avec succès" })
    },
    onError: () => {
      toast({ title: "Erreur lors de la restauration", variant: "destructive" })
    },
  })

  const getStatusBadge = (status: string) => {
    const colors = {
      "Actif": "bg-success text-success-foreground",
      "Inactif": "bg-destructive text-destructive-foreground",
      "En attente": "bg-warning text-warning-foreground"
    }
    return <Badge className={colors[status as keyof typeof colors] || "bg-muted text-muted-foreground"}>{status}</Badge>
  }

  const filteredRecuperators = recuperators.filter((recuperator: Recuperator) =>
    recuperator.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recuperator.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recuperator.relation_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recuperator.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      deleteMutation.mutate(deleteModal.recuperator.id)
      setDeleteModal({ isOpen: false })
    }
  }

  const confirmRestore = () => {
    if (restoreModal.recuperator) {
      restoreMutation.mutate(restoreModal.recuperator.code)
      setRestoreModal({ isOpen: false })
    }
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
          <p className="text-muted-foreground">Gérez tous les récupérateurs autorisés</p>
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
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{recuperators.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actifs
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {recuperators.filter((r: Recuperator) => r.status === "Actif").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {recuperators.filter((r: Recuperator) => !r.is_active).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactifs
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {recuperators.filter((r: Recuperator) => r.status === "Inactif").length}
            </div>
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
                placeholder="Rechercher par nom, relation ou téléphone..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Relation</TableHead>
                  <TableHead>Enfants autorisés</TableHead>
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
                    <TableCell className="text-muted-foreground">{recuperator.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{recuperator.relation_type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {recuperator.authorizedChildren?.length || 0} enfant(s)
                    </TableCell>
                    <TableCell>{getStatusBadge(recuperator.status || (recuperator.is_active ? "Actif" : "En attente"))}</TableCell>
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
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleRestore(recuperator)}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restaurer
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDelete(recuperator)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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