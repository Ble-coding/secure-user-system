
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Shield, 
  Plus, 
  Search, 
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Settings
} from "lucide-react"

interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
  userCount: number
  status: "Actif" | "Inactif"
}

export default function Roles() {
  const [searchTerm, setSearchTerm] = useState("")

  const roles: Role[] = [
    {
      id: 1,
      name: "Super Administrateur",
      description: "Accès complet à toutes les fonctionnalités",
      permissions: ["all"],
      userCount: 2,
      status: "Actif"
    },
    {
      id: 2,
      name: "Administrateur",
      description: "Gestion des utilisateurs et du système",
      permissions: ["users.manage", "system.config", "reports.view"],
      userCount: 5,
      status: "Actif"
    },
    {
      id: 3,
      name: "Agent",
      description: "Scan des QR codes et gestion des entrées",
      permissions: ["entries.scan", "children.view"],
      userCount: 12,
      status: "Actif"
    },
    {
      id: 4,
      name: "Parent",
      description: "Consultation des informations de leurs enfants",
      permissions: ["children.own.view", "entries.own.view"],
      userCount: 150,
      status: "Actif"
    },
    {
      id: 5,
      name: "Récupérateur",
      description: "Récupération des enfants autorisés",
      permissions: ["children.pickup"],
      userCount: 45,
      status: "Actif"
    }
  ]

  const getStatusBadge = (status: string) => {
    return status === "Actif" 
      ? <Badge className="bg-success text-success-foreground">Actif</Badge>
      : <Badge variant="secondary">Inactif</Badge>
  }

  const getPermissionsBadge = (permissions: string[]) => {
    if (permissions.includes("all")) {
      return <Badge className="bg-destructive text-destructive-foreground">Tous les droits</Badge>
    }
    return <Badge variant="outline">{permissions.length} permissions</Badge>
  }

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Rôles</h1>
          <p className="text-muted-foreground">Gérez les rôles et permissions du système</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau rôle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Rôles
            </CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{roles.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rôles Actifs
            </CardTitle>
            <Settings className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {roles.filter(r => r.status === "Actif").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs Assignés
            </CardTitle>
            <Users className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {roles.reduce((total, role) => total + role.userCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Permissions Uniques
            </CardTitle>
            <Shield className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Rôles</CardTitle>
          <CardDescription>
            Consultez et gérez tous les rôles du système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Rechercher un rôle..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du Rôle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Utilisateurs</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {role.description}
                    </TableCell>
                    <TableCell>{getPermissionsBadge(role.permissions)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{role.userCount} utilisateur{role.userCount > 1 ? 's' : ''}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(role.status)}</TableCell>
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

          {filteredRoles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun rôle trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
