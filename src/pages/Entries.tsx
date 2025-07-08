
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
  Calendar, 
  Search, 
  Filter,
  Download,
  Eye,
  Clock,
  ArrowRight,
  ArrowLeft
} from "lucide-react"
import { entryService, Entry } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export default function Entries() {
  const [searchTerm, setSearchTerm] = useState("")

  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: ['entries'],
    queryFn: entryService.getAll,
  })

  const getStatusBadge = (status: string) => {
    return status === "Entrée" 
      ? <Badge className="bg-success text-success-foreground flex items-center gap-1">
          <ArrowRight className="w-3 h-3" />
          Entrée
        </Badge>
      : <Badge className="bg-info text-info-foreground flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          Sortie
        </Badge>
  }

  const filteredEntries = entries.filter((entry: Entry) =>
    entry.childId.toString().includes(searchTerm) ||
    entry.recuperatorId.toString().includes(searchTerm) ||
    entry.agentId.toString().includes(searchTerm)
  )

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
        <div className="text-destructive">Erreur lors du chargement des entrées</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Journal des Entrées</h1>
          <p className="text-muted-foreground">Consultez l'historique des entrées et sorties</p>
        </div>
        <Button className="bg-gradient-primary">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
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
              {entries.filter((e: Entry) => e.status === "Entrée").length}
            </div>
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
              {entries.filter((e: Entry) => e.status === "Sortie").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dernière Activité
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {entries.length > 0 ? "14:30" : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Entrées</CardTitle>
          <CardDescription>
            Consultez tous les mouvements d'entrée et de sortie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Rechercher par ID enfant, récupérateur ou agent..." 
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
                  <TableHead>Heure</TableHead>
                  <TableHead>Enfant</TableHead>
                  <TableHead>Récupérateur</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry: Entry) => (
                  <TableRow key={entry.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {new Date(entry.entryTime).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>ID: {entry.childId}</TableCell>
                    <TableCell>ID: {entry.recuperatorId}</TableCell>
                    <TableCell>ID: {entry.agentId}</TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.notes || "Aucune note"}
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
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune entrée trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
