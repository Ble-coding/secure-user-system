
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { 
  Calendar, 
  Search, 
  Filter,
  Download,
  Eye,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Users,
  MapPin
} from "lucide-react"
import { entryService, ChildEntry } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export default function Entries() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "entry" | "exit">("all")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: entries = [], isLoading, error, refetch } = useQuery({
    queryKey: ['entries', filterType, selectedDate],
    queryFn: entryService.getAll,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const getStatusBadge = (type: string) => {
    return type === "entry" 
      ? <Badge className="bg-success text-success-foreground flex items-center gap-1">
          <ArrowRight className="w-3 h-3" />
          Entrée
        </Badge>
      : <Badge className="bg-info text-info-foreground flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          Sortie
        </Badge>
  }

  const filteredEntries = entries.filter((entry: ChildEntry) => {
    const matchesSearch = 
      entry.child_id.toString().includes(searchTerm) ||
      entry.recuperator_id?.toString().includes(searchTerm) ||
      entry.agent_id.toString().includes(searchTerm)
    
    const matchesType = filterType === "all" || entry.type === filterType
    
    const matchesDate = !selectedDate || 
      new Date(entry.scanned_at).toDateString() === selectedDate.toDateString()
    
    return matchesSearch && matchesType && matchesDate
  })

  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage)

  const exportData = () => {
    const csv = [
      ['Heure', 'Enfant', 'Récupérateur', 'Agent', 'Type', 'Date'],
      ...filteredEntries.map((entry: ChildEntry) => [
        new Date(entry.scanned_at).toLocaleTimeString('fr-FR'),
        `ID: ${entry.child_id}`,
        entry.recuperator_id ? `ID: ${entry.recuperator_id}` : 'N/A',
        `ID: ${entry.agent_id}`,
        entry.type === 'entry' ? 'Entrée' : 'Sortie',
        new Date(entry.scanned_at).toLocaleDateString('fr-FR')
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `entrees_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Chargement des entrées...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-destructive mb-2">Erreur lors du chargement des entrées</div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Journal des Entrées</h1>
          <p className="text-muted-foreground">Consultez l'historique des entrées et sorties en temps réel</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={exportData} className="bg-gradient-primary">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Entrées
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{entries.length}</div>
            <p className="text-xs text-muted-foreground">
              Toutes les entrées enregistrées
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entrées Aujourd'hui
            </CardTitle>
            <ArrowRight className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {entries.filter((e: ChildEntry) => {
                const today = new Date().toDateString()
                const entryDate = new Date(e.scanned_at).toDateString()
                return e.type === "entry" && entryDate === today
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Enfants entrés aujourd'hui
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sorties Aujourd'hui
            </CardTitle>
            <ArrowLeft className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {entries.filter((e: ChildEntry) => {
                const today = new Date().toDateString()
                const entryDate = new Date(e.scanned_at).toDateString()
                return e.type === "exit" && entryDate === today
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Enfants sortis aujourd'hui
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enfants Présents
            </CardTitle>
            <Users className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {(() => {
                const today = new Date().toDateString()
                const todayEntries = entries.filter((e: ChildEntry) => 
                  new Date(e.scanned_at).toDateString() === today
                )
                const entriesCount = todayEntries.filter(e => e.type === "entry").length
                const exitsCount = todayEntries.filter(e => e.type === "exit").length
                return Math.max(0, entriesCount - exitsCount)
              })()}
            </div>
            <p className="text-xs text-muted-foreground">
              Actuellement dans l'établissement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
          <CardDescription>
            Filtrez les entrées par date, type ou recherchez par ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Rechercher par ID enfant, récupérateur ou agent..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de mouvement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="entry">Entrées uniquement</SelectItem>
                <SelectItem value="exit">Sorties uniquement</SelectItem>
              </SelectContent>
            </Select>

            <DatePicker
              selected={selectedDate}
              onSelect={setSelectedDate}
              placeholder="Filtrer par date"
            />

            {(searchTerm || filterType !== "all" || selectedDate) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("all")
                  setSelectedDate(undefined)
                }}
              >
                Réinitialiser
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Entries Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des Entrées</CardTitle>
              <CardDescription>
                {filteredEntries.length} entrée(s) trouvée(s)
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Page {currentPage} sur {totalPages}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Enfant</TableHead>
                  <TableHead>Récupérateur</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEntries.map((entry: ChildEntry) => (
                  <TableRow key={entry.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <div>{new Date(entry.scanned_at).toLocaleDateString('fr-FR')}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.scanned_at).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">ID: {entry.child_id}</Badge>
                    </TableCell>
                    <TableCell>
                      {entry.recuperator_id ? (
                        <Badge variant="outline">ID: {entry.recuperator_id}</Badge>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">ID: {entry.agent_id}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(entry.type)}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-success text-success-foreground">
                        Validé
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Aucune entrée trouvée</p>
                <p className="text-sm">Essayez de modifier vos critères de recherche</p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredEntries.length)} sur {filteredEntries.length} entrées
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <span className="text-sm">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
