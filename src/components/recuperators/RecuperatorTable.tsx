
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  RotateCcw,
} from "lucide-react"
import { Recuperator } from "@/types/Recuperator"

interface RecuperatorTableProps {
  recuperators: Recuperator[]
  onView: (recuperator: Recuperator) => void
  onEdit: (recuperator: Recuperator) => void
  onDelete: (recuperator: Recuperator) => void
  onRestore: (recuperator: Recuperator) => void
}

export function RecuperatorTable({
  recuperators,
  onView,
  onEdit,
  onDelete,
  onRestore
}: RecuperatorTableProps) {
  const getStatusBadge = (recuperator: Recuperator) => {
    const isActive = recuperator.is_active && !recuperator.deleted_at
    return (
      <Badge className={isActive ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
        {isActive ? "Actif" : "Inactif"}
      </Badge>
    )
  }

  const getRelationBadge = (relation: string) => {
    const colors = {
      "parent": "bg-primary text-primary-foreground",
      "grand-parent": "bg-info text-info-foreground", 
      "oncle/tante": "bg-warning text-warning-foreground",
      "frère/sœur": "bg-success text-success-foreground",
      "tuteur": "bg-purple-500 text-white",
      "autre": "bg-muted text-muted-foreground"
    }
    return <Badge className={colors[relation as keyof typeof colors] || "bg-muted text-muted-foreground"}>{relation}</Badge>
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Relation</TableHead>
            <TableHead>Enfants</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recuperators.map((recuperator: Recuperator) => (
            <TableRow key={recuperator.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {recuperator.first_name} {recuperator.last_name}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{recuperator.code}</Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="text-muted-foreground">{recuperator.phone || "Non renseigné"}</div>
                </div>
              </TableCell>
              <TableCell>{getRelationBadge(recuperator.relation_type)}</TableCell>
              <TableCell className="text-muted-foreground">
                {recuperator.children?.length || 0} enfant(s)
              </TableCell>
              <TableCell>{getStatusBadge(recuperator)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => onView(recuperator)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir les détails
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(recuperator)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {recuperator.deleted_at ? (
                      <DropdownMenuItem onClick={() => onRestore(recuperator)}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Restaurer
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => onDelete(recuperator)}>
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
    </div>
  )
}
