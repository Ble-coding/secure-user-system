
import { useState, useEffect } from "react"
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
  Shield,
  Activity,
  UserX
} from "lucide-react"
import { agentService } from "@/lib/api/agents"
import { Agent } from "@/types/Agent"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AgentModal } from "@/components/modals/AgentModal"
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal"
import { useToast } from "@/hooks/use-toast"

export default function Agents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: "create" | "edit" | "view"
    agent?: Agent
  }>({ isOpen: false, mode: "create" })
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    agent?: Agent
  }>({ isOpen: false })

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const queryKey = ['agents', page, searchTerm, statusFilter]

  const { data: response, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => agentService.getAll(page, searchTerm, statusFilter),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['agents'],
      exact: false,
    })
  }, [page, queryClient])

  const handleCreateSuccess = () => {
    setPage(1)
  }

  const agents = response?.data?.agents ?? []
  const newThisMonth = response?.data?.new_this_month ?? 0
  const totalEnService = response?.data?.total_en_service ?? 0
  const totalHorsService = response?.data?.total_hors_service ?? 0
  const totalEnPause = response?.data?.total_en_pause ?? 0
  const totalAgents = totalEnService + totalHorsService + totalEnPause

  const pagination = {
    currentPage: response?.data?.current_page ?? 1,
    lastPage: response?.data?.last_page ?? 1,
    perPage: response?.data?.per_page ?? 20,
    total: response?.data?.total ?? 0,
  }

  const deleteMutation = useMutation({
    mutationFn: agentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      toast({ title: "Agent supprimé avec succès" })
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" })
    },
  })

  const getStatusBadge = (status: string) => {
    const colors = {
      "En service": "bg-success text-success-foreground",
      "Hors service": "bg-destructive text-destructive-foreground",
      "En pause": "bg-warning text-warning-foreground"
    }
    return <Badge className={colors[status as keyof typeof colors] || "bg-muted text-muted-foreground"}>{status}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      "enseignant": "bg-primary text-primary-foreground",
      "surveillant": "bg-info text-info-foreground", 
      "sécurité": "bg-warning text-warning-foreground",
      "administration": "bg-success text-success-foreground"
    }
    return <Badge className={colors[type as keyof typeof colors] || "bg-muted text-muted-foreground"}>{type}</Badge>
  }

  const filteredAgents = agents.filter((agent: Agent) =>
    agent.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.code?.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((agent: Agent) => 
    !statusFilter || agent.status === statusFilter
  )

  const handleEdit = (agent: Agent) => {
    setModalState({ isOpen: true, mode: "edit", agent })
  }

  const handleView = (agent: Agent) => {
    setModalState({ isOpen: true, mode: "view", agent })
  }

  const handleDelete = (agent: Agent) => {
    setDeleteModal({ isOpen: true, agent })
  }

  const confirmDelete = () => {
    if (deleteModal.agent) {
      deleteMutation.mutate(deleteModal.agent.id)
      setDeleteModal({ isOpen: false })
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-destructive">Erreur lors du chargement des agents</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Agents</h1>
          <p className="text-muted-foreground">Gérez les agents de sécurité et de contrôle</p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => setModalState({ isOpen: true, mode: "create" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un agent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Agents
            </CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalAgents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Service
            </CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalEnService}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hors Service
            </CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalHorsService}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Pause
            </CardTitle>
            <Shield className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalEnPause}</div>
          </CardContent>
        </Card>
      </div>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Agents</CardTitle>
          <CardDescription>
            Consultez et gérez tous les agents de sécurité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Rechercher par nom, email, code ou type..." 
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
                  setStatusFilter("En service")
                  setPage(1)
                }}>
                  En service
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setStatusFilter("Hors service")
                  setPage(1)
                }}>
                  Hors service
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setStatusFilter("En pause")
                  setPage(1)
                }}>
                  En pause
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
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent: Agent) => (
                  <TableRow key={agent.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {agent.first_name} {agent.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{agent.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-foreground">{agent.email}</div>
                        <div className="text-muted-foreground">{agent.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(agent.type)}</TableCell>
                    <TableCell>{getStatusBadge(agent.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleView(agent)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(agent)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDelete(agent)}>
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

          {filteredAgents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun agent trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AgentModal
        key={modalState.agent?.id ?? "create"}
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: "create" })}
        agent={modalState.agent}
        mode={modalState.mode}
        onCreateSuccess={handleCreateSuccess}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={confirmDelete}
        title="Supprimer cet agent"
        description="Êtes-vous sûr de vouloir supprimer cet agent ? Cette action est irréversible."
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
