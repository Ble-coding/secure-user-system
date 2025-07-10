
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
  Baby, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  BookOpen,
  RotateCcw
} from "lucide-react"
import { childService, Child } from "@/lib/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChildModal } from "@/components/modals/ChildModal"
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal"
import { RestoreModal } from "@/components/modals/RestoreModal"
import { useToast } from "@/hooks/use-toast"

export default function Children() {
  const [searchTerm, setSearchTerm] = useState("")
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: "create" | "edit" | "view"
    child?: Child
  }>({ isOpen: false, mode: "create" })
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    child?: Child
  }>({ isOpen: false })
  const [restoreModal, setRestoreModal] = useState<{
    isOpen: boolean
    child?: Child
  }>({ isOpen: false })

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: children = [], isLoading, error } = useQuery({
    queryKey: ['children'],
    queryFn: childService.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: childService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] })
      toast({ title: "Enfant supprimé avec succès" })
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" })
    },
  })

  const restoreMutation = useMutation({
    mutationFn: childService.restore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] })
      toast({ title: "Enfant restauré avec succès" })
    },
    onError: () => {
      toast({ title: "Erreur lors de la restauration", variant: "destructive" })
    },
  })

  const getStatusBadge = (status: string) => {
    const colors = {
      "Présent": "bg-success text-success-foreground",
      "Absent": "bg-destructive text-destructive-foreground",
      "Récupéré": "bg-warning text-warning-foreground"
    }
    return <Badge className={colors[status as keyof typeof colors] || "bg-muted text-muted-foreground"}>{status}</Badge>
  }

  const filteredChildren = children.filter((child: Child) =>
    child.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.class?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (child: Child) => {
    setModalState({ isOpen: true, mode: "edit", child })
  }

  const handleView = (child: Child) => {
    setModalState({ isOpen: true, mode: "view", child })
  }

  const handleDelete = (child: Child) => {
    setDeleteModal({ isOpen: true, child })
  }

  const handleRestore = (child: Child) => {
    setRestoreModal({ isOpen: true, child })
  }

  const confirmDelete = () => {
    if (deleteModal.child) {
      deleteMutation.mutate(deleteModal.child.id)
      setDeleteModal({ isOpen: false })
    }
  }

  const confirmRestore = () => {
    if (restoreModal.child) {
      restoreMutation.mutate(restoreModal.child.code)
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
        <div className="text-destructive">Erreur lors du chargement des enfants</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Enfants</h1>
          <p className="text-muted-foreground">Gérez tous les enfants inscrits</p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => setModalState({ isOpen: true, mode: "create" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un enfant
        </Button>
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
            <div className="text-2xl font-bold text-foreground">{children.length}</div>
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
              {children.filter((c: Child) => c.status === "Présent").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Absents
            </CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {children.filter((c: Child) => c.status === "Absent").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Récupérés
            </CardTitle>
            <BookOpen className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {children.filter((c: Child) => c.status === "Récupéré").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Children Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Enfants</CardTitle>
          <CardDescription>
            Consultez et gérez tous les enfants inscrits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Rechercher par nom ou classe..." 
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
                  <TableHead>Genre</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChildren.map((child: Child) => (
                  <TableRow key={child.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {child.first_name} {child.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{child.gender === "M" ? "Masculin" : "Féminin"}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{child.date_of_birth}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{child.class || "N/A"}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(child.status || "Présent")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleView(child)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(child)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleRestore(child)}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restaurer
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDelete(child)}>
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

          {filteredChildren.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun enfant trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ChildModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: "create" })}
        child={modalState.child}
        mode={modalState.mode}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={confirmDelete}
        title="Supprimer cet enfant"
        description="Êtes-vous sûr de vouloir supprimer cet enfant ? Cette action est irréversible."
        isLoading={deleteMutation.isPending}
      />

      <RestoreModal
        isOpen={restoreModal.isOpen}
        onClose={() => setRestoreModal({ isOpen: false })}
        onConfirm={confirmRestore}
        title="Restaurer cet enfant"
        description="Êtes-vous sûr de vouloir restaurer cet enfant ?"
        entityType="Enfant"
        entityCode={restoreModal.child?.code || ""}
        isLoading={restoreMutation.isPending}
      />
    </div>
  )
}
