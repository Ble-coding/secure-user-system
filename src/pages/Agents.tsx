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
  Shield,
  Activity
} from "lucide-react"


export default function Agents() {
  const [searchTerm, setSearchTerm] = useState("")

  const agents = [
    { id: 1, name: "Jean Martin", email: "jean.martin@email.com", phone: "+33 6 12 34 56 78", status: "En service", zone: "Zone A", lastActivity: "Il y a 2 min" },
    { id: 2, name: "Thomas Leroy", email: "thomas.leroy@email.com", phone: "+33 6 98 76 54 32", status: "En service", zone: "Zone B", lastActivity: "Il y a 5 min" },
    { id: 3, name: "Michel Dubois", email: "michel.dubois@email.com", phone: "+33 6 11 22 33 44", status: "Hors service", zone: "Zone C", lastActivity: "Il y a 2h" },
    { id: 4, name: "Pierre Moreau", email: "pierre.moreau@email.com", phone: "+33 6 55 66 77 88", status: "En pause", zone: "Zone A", lastActivity: "Il y a 15 min" },
    { id: 5, name: "Paul Bernard", email: "paul.bernard@email.com", phone: "+33 6 99 88 77 66", status: "En service", zone: "Zone D", lastActivity: "Il y a 1 min" },
  ]

  const getStatusBadge = (status: string) => {
    const colors = {
      "En service": "bg-success text-success-foreground",
      "Hors service": "bg-destructive text-destructive-foreground",
      "En pause": "bg-warning text-warning-foreground"
    }
    return <Badge className={colors[status as keyof typeof colors] || "bg-muted text-muted-foreground"}>{status}</Badge>
  }

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.zone.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Agents</h1>
          <p className="text-muted-foreground">Gérez les agents de sécurité et de contrôle</p>
        </div>
        <Button className="bg-gradient-primary">
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
            <div className="text-2xl font-bold text-foreground">{agents.length}</div>
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
            <div className="text-2xl font-bold text-foreground">
              {agents.filter(a => a.status === "En service").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hors Service
            </CardTitle>
            <Shield className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {agents.filter(a => a.status === "Hors service").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Zones Couvertes
            </CardTitle>
            <Shield className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4</div>
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
                placeholder="Rechercher par nom, email ou zone..." 
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
                  <TableHead>Contact</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière activité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-foreground">{agent.email}</div>
                        <div className="text-muted-foreground">{agent.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{agent.zone}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(agent.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{agent.lastActivity}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-destructive">
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

          {filteredAgents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun agent trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}