
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, RotateCcw } from "lucide-react"
import { userService, User } from "@/lib/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { UserModal } from "@/components/modals/UserModal"
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal"
import { RestoreModal } from "@/components/modals/RestoreModal"
import { useToast } from "@/hooks/use-toast"
import { UserStats } from "@/components/users/UserStats"
import { UserFilters } from "@/components/users/UserFilters"
import { UserTable } from "@/components/users/UserTable"

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("")
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

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

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

  const filteredUsers = users.filter((user: User) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
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
      // Assumons que l'user a un code ou utilisons l'email comme identifiant
      restoreMutation.mutate(restoreModal.user.email)
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
          <p className="text-muted-foreground">
            Gérez tous les utilisateurs du système - 
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
      <UserStats users={users} />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>
            Consultez et gérez tous les utilisateurs enregistrés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Enhanced User Table with Restore functionality */}
          <div className="rounded-md border border-border">
            <UserTable
              users={filteredUsers}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
              onRestore={handleRestore}
            />
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
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: "create" })}
        user={modalState.user}
        mode={modalState.mode}
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
