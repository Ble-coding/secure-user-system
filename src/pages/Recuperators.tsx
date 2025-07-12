
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { recuperatorService } from "@/lib/api/recuperators"
import { Recuperator } from "@/types/Recuperator"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { RecuperatorModal } from "@/components/modals/RecuperatorModal"
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal"
import { RestoreModal } from "@/components/modals/RestoreModal"
import { useToast } from "@/hooks/use-toast"
import { RecuperatorStats } from "@/components/recuperators/RecuperatorStats"
import { RecuperatorFilters } from "@/components/recuperators/RecuperatorFilters"
import { RecuperatorTable } from "@/components/recuperators/RecuperatorTable"
import { RecuperatorPagination } from "@/components/recuperators/RecuperatorPagination"

export default function Recuperators() {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
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

  const handleView = (recuperator: Recuperator) => {
    setModalState({ isOpen: true, mode: "view", recuperator })
  }

  const handleEdit = (recuperator: Recuperator) => {
    setModalState({ isOpen: true, mode: "edit", recuperator })
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
      <RecuperatorStats
        totalRecuperators={totalRecuperators}
        totalActifs={totalActifs}
        totalInactifs={totalInactifs}
        newThisMonth={newThisMonth}
      />

      {/* Recuperators Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Récupérateurs</CardTitle>
          <CardDescription>
            Consultez et gérez tous les récupérateurs autorisés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecuperatorFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            setPage={setPage}
          />

          <RecuperatorTable
            recuperators={filteredRecuperators}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />

          <RecuperatorPagination
            pagination={pagination}
            onPageChange={setPage}
          />

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
