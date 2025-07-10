
import { useState } from "react"
import { useEffect } from "react"
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
  Users as UsersIcon, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  RotateCcw,
  Eye,
  UserCheck,
  UserX
} from "lucide-react"
// import { userService, User } from "@/lib/api"
import { userService } from "@/lib/api/userService"
import { User } from "@/lib/api/users"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { UserModal } from "@/components/modals/UserModal"
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal"
import { useToast } from "@/hooks/use-toast"

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const handleCreateSuccess = () => {
  setPage(1)
}
  const [statusFilter, setStatusFilter] = useState("")
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: "create" | "edit" | "view"
    user?: User
  }>({ isOpen: false, mode: "create" })
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    user?: User
  }>({ isOpen: false })
  const [restoreModal, setRestoreModal] = useState<{
    isOpen: boolean
    user?: User
  }>({ isOpen: false })


  const { toast } = useToast()
  const queryClient = useQueryClient()
  
const queryKey = ['users', page, searchTerm, statusFilter]

const { data: response, isLoading, error  } = useQuery({
  queryKey,
  queryFn: () => userService.getAll(page, searchTerm, statusFilter),
  staleTime: 0,
  refetchOnMount: true,
  refetchOnWindowFocus: false,
})

useEffect(() => {
  queryClient.invalidateQueries({
    queryKey: ['users'],
    exact: false,
  })
}, [page, queryClient]) // ← ✅ ajoute queryClient ici


// const { data: response, isLoading, error } = useQuery({
//   queryKey,
//   queryFn: () => userService.getAll(page, searchTerm, statusFilter),
// })







  // const users = response?.data?.users ?? []
  // const newThisMonth = response?.data?.new_this_month ?? 0

  const users = response?.data?.users ?? []
  const newThisMonth = response?.data?.new_this_month ?? 0
  const totalActifs = response?.data?.total_actifs ?? 0
  const totalInactifs = response?.data?.total_inactifs ?? 0
  const totalUsers = response?.data?.total_actifs + response?.data?.total_inactifs

  const pagination = {
    currentPage: response?.data?.current_page ?? 1,
    lastPage: response?.data?.last_page ?? 1,
    perPage: response?.data?.per_page ?? 20,
    total: response?.data?.total ?? 0,
  }

  const deleteMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: "Utilisateur supprimé avec succès" })
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" })
    },
  })

    const restoreMutation = useMutation({
    mutationFn: userService.restore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: "Utilisateur restauré avec succès" })
    },
    onError: () => {
      toast({ title: "Erreur lors de la restauration", variant: "destructive" })
    },
  })

  const getStatusBadge = (status: string) => {
    return status === "Actif" 
      ? <Badge className="bg-success text-success-foreground">Actif</Badge>
      : <Badge variant="secondary">Inactif</Badge>
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      "Admin": "bg-primary text-primary-foreground",
      "Agent": "bg-info text-info-foreground", 
      "Parent": "bg-warning text-warning-foreground",
      "Récupérateur": "bg-success text-success-foreground"
    }
    return <Badge className={colors[role as keyof typeof colors] || "bg-muted text-muted-foreground"}>{role}</Badge>
  }

  const filteredUsers = users.filter((user: User) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  ) .filter((user: User) => 
    !statusFilter || user.status === statusFilter
  )

  const handleEdit = (user: User) => {
    setModalState({ isOpen: true, mode: "edit", user })
  }

  const handleView = (user: User) => {
    setModalState({ isOpen: true, mode: "view", user })
  }

  const handleDelete = (user: User) => {
    setDeleteModal({ isOpen: true, user })
  }
 const handleRestore = (user: User) => {
    setRestoreModal({ isOpen: true, user })
  }

  const confirmDelete = () => {
    if (deleteModal.user) {
      deleteMutation.mutate(deleteModal.user.id)
      setDeleteModal({ isOpen: false })
    }
  }

    const confirmRestore = () => {
    if (restoreModal.user) {
      // Assumons que l'user a un code ou utilisons l'id comme identifiant
      restoreMutation.mutate(restoreModal.user.id)
      setRestoreModal({ isOpen: false })
    }
  }


  
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-96">
  //       <div className="text-muted-foreground">Chargement...</div>
  //     </div>
  //   )
  // }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-destructive">Erreur lors du chargement des utilisateurs</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">Gérez tous les utilisateurs du système
            - 
            {users.find((u: User) => u.role === "Admin")?.name || "Administrateur"} connecté

          </p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => setModalState({ isOpen: true, mode: "create" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Stats Cards */}
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Utilisateurs
          </CardTitle>
          <UsersIcon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Utilisateurs Actifs
          </CardTitle>
          <UserCheck className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalActifs}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Utilisateurs Inactifs
          </CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
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

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>
            Consultez et gérez tous les utilisateurs enregistrés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Rechercher par nom, email ou rôle..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>


            {/* 🎛️ DropdownMenu pour Filtres */}
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

          {/* Users Table */}
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: User) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status || "Actif")}</TableCell>
                    <TableCell className="text-muted-foreground">{user.last_login || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleView(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                         {user.status === "Inactif" ? (
  <DropdownMenuItem onClick={() => handleRestore(user)}>
    <RotateCcw className="mr-2 h-4 w-4" />
    Restaurer
  </DropdownMenuItem>
) : (
  <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDelete(user)}>
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
  <UserModal
  key={modalState.user?.id ?? "create"} // 👈 important pour reset complet
  isOpen={modalState.isOpen}
  onClose={() => setModalState({ isOpen: false, mode: "create" })}
  user={modalState.user}
  mode={modalState.mode}
   onCreateSuccess={handleCreateSuccess}
/>


      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={confirmDelete}
        title="Supprimer cet utilisateur"
        description="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
        isLoading={deleteMutation.isPending}
      />

            <RestoreModal
        isOpen={restoreModal.isOpen}
        onClose={() => setRestoreModal({ isOpen: false })}
        onConfirm={confirmRestore}
        title="Restaurer cet utilisateur"
        description="Êtes-vous sûr de vouloir restaurer cet utilisateur ?"
        entityType="Utilisateur"
        entityCode={restoreModal.user?.email || ""}
        isLoading={restoreMutation.isPending}
      />
    </div>
  )
}