
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Users2, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Phone,
  MapPin
} from "lucide-react"
import { parentService, ParentUser } from "@/lib/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ParentModal } from "@/components/modals/ParentModal"
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal"
import { useToast } from "@/hooks/use-toast"

export default function Parents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: "create" | "edit" | "view"
    parent?: ParentUser
  }>({ isOpen: false, mode: "create" })
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    parent?: ParentUser
  }>({ isOpen: false })

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: parents = [], isLoading, error } = useQuery({
    queryKey: ['parents'],
    queryFn: parentService.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: parentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] })
      toast({ title: "Parent supprimé avec succès" })
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" })
    },
  })

  const getStatusBadge = (status: string) => {
    return status === "Actif" 
      ? <Badge className="bg-success text-success-foreground">Actif</Badge>
      : <Badge variant="secondary">Inactif</Badge>
  }

  const filteredParents = parents.filter((parent: ParentUser) => {
    const fullName = `${parent.nom} ${parent.prenom}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.telephone.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || parent.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleEdit = (parent: ParentUser) => {
    setModalState({ isOpen: true, mode: "edit", parent })
  }

  const handleView = (parent: ParentUser) => {
    setModalState({ isOpen: true, mode: "view", parent })
  }

  const handleDelete = (parent: ParentUser) => {
    setDeleteModal({ isOpen: true, parent })
  }

  const confirmDelete = () => {
    if (deleteModal.parent) {
      deleteMutation.mutate(deleteModal.parent.id)
      setDeleteModal({ isOpen: false })
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
        <div className="text-destructive">Erreur lors du chargement des parents</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Parents</h1>
          <p className="text-muted-foreground">Gérez tous les parents et leurs enfants</p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => setModalState({ isOpen: true, mode: "create" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un parent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Parents
            </CardTitle>
            <Users2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{parents.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Parents Actifs
            </CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {parents.filter((p: ParentUser) => p.status === "Actif").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Parents Inactifs
            </CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {parents.filter((p: ParentUser) => p.status === "Inactif").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Enfants
            </CardTitle>
            <Plus className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {parents.reduce((total: number, parent: ParentUser) => total + parent.children.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Parents</CardTitle>
          <CardDescription>
            Consultez et gérez tous les parents enregistrés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Rechercher par nom, email ou téléphone..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="Inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Enfants</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParents.map((parent: ParentUser) => (
                  <TableRow key={parent.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{`${parent.nom} ${parent.prenom}`}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-foreground">{parent.email}</div>
                        <div className="text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {parent.telephone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {parent.adresse}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {parent.children.length} enfant{parent.children.length > 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(parent.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleView(parent)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(parent)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDelete(parent)}>
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

          {filteredParents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun parent trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ParentModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: "create" })}
        parent={modalState.parent}
        mode={modalState.mode}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={confirmDelete}
        title="Supprimer ce parent"
        description="Êtes-vous sûr de vouloir supprimer ce parent ? Cette action est irréversible."
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
