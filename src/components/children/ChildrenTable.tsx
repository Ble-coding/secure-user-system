import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  MoreHorizontal,
  Eye,
  Clock,
  Mail,
  User,
  Phone,
  Hash
} from "lucide-react"
import { ChildWithRelations } from "@/lib/api/children"

interface ChildrenTableProps {
  children: ChildWithRelations[]
  onViewDetails: (child: ChildWithRelations) => void
}

export function ChildrenTable({ children, onViewDetails }: ChildrenTableProps) {
  const getStatusBadge = (child: ChildWithRelations) => {
    const lastActivity = child.last_activities?.[0]
    if (!lastActivity) {
      return <Badge variant="secondary">Aucune activité</Badge>
    }
    
    return lastActivity.type === 'entry' 
      ? <Badge className="bg-success text-success-foreground">Présent</Badge>
      : <Badge className="bg-destructive text-destructive-foreground">Sorti</Badge>
  }

  const getGenderBadge = (gender: "M" | "F") => {
    return gender === "M" 
      ? <Badge variant="outline" className="text-blue-600">Garçon</Badge>
      : <Badge variant="outline" className="text-pink-600">Fille</Badge>
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Enfant</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Récupérateurs</TableHead>
            <TableHead>Activités</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Dernière activité</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {children.map((child: ChildWithRelations) => (
            <TableRow key={child.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div>
                  <div className="font-semibold">{child.first_name} {child.last_name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Badge variant="outline" className="mr-1">{child.code}</Badge>
                    {(child.gender === "M" || child.gender === "F") && getGenderBadge(child.gender)}
                    {child.class && <Badge variant="outline">{child.class}</Badge>}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {child.parent ? (
                  <div className="text-sm">
                    <div className="font-medium flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {child.parent.prenom} {child.parent.nom}
                    </div>
                    {child.parent.code && (
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {child.parent.code}
                      </div>
                    )}
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {child.parent.email}
                    </div>
                    {child.parent.telephone && (
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {child.parent.telephone}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Aucun parent</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {child.recuperators && child.recuperators.length > 0 ? (
                    child.recuperators.slice(0, 2).map((recup) => (
                      <Badge key={recup.id} variant="outline" className="text-xs">
                        {recup.first_name} {recup.last_name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">Aucun</span>
                  )}
                  {child.recuperators && child.recuperators.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{child.recuperators.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="text-success">↓ {child.entry_count || 0}</div>
                  <div className="text-destructive">↑ {child.exit_count || 0}</div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(child)}</TableCell>
              <TableCell>
                {child.last_scanned_at ? (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(child.last_scanned_at).toLocaleString('fr-FR')}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => onViewDetails(child)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir les détails
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
