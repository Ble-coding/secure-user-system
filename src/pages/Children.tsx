
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
  BookOpen
} from "lucide-react"

// Données de test pour les enfants
const children = [
  { id: 1, name: "Sophie Martin", age: 8, class: "CM1", parentName: "Marie Dupont", status: "Présent" },
  { id: 2, name: "Lucas Bernard", age: 6, class: "CP", parentName: "Sophie Bernard", status: "Récupéré" },
  { id: 3, name: "Emma Leroy", age: 9, class: "CM2", parentName: "Thomas Leroy", status: "Présent" },
  { id: 4, name: "Noah Dubois", age: 7, class: "CE1", parentName: "Anna Dubois", status: "Absent" },
  { id: 5, name: "Chloé Moreau", age: 8, class: "CE2", parentName: "Pierre Moreau", status: "Présent" },
]

export default function Children() {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusBadge = (status: string) => {
    const colors = {
      "Présent": "bg-success text-success-foreground",
      "Absent": "bg-destructive text-destructive-foreground",
      "Récupéré": "bg-warning text-warning-foreground"
    }
    return <Badge className={colors[status as keyof typeof colors] || "bg-muted text-muted-foreground"}>{status}</Badge>
  }

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Enfants</h1>
          <p className="text-muted-foreground">Gérez tous les enfants inscrits</p>
        </div>
        <Button className="bg-gradient-primary">
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
              {children.filter(c => c.status === "Présent").length}
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
              {children.filter(c => c.status === "Absent").length}
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
              {children.filter(c => c.status === "Récupéré").length}
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
                placeholder="Rechercher par nom, classe ou parent..." 
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
                  <TableHead>Âge</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChildren.map((child) => (
                  <TableRow key={child.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{child.name}</TableCell>
                    <TableCell>{child.age} ans</TableCell>
                    <TableCell>
                      <Badge variant="outline">{child.class}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{child.parentName}</TableCell>
                    <TableCell>{getStatusBadge(child.status)}</TableCell>
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

          {filteredChildren.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun enfant trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
