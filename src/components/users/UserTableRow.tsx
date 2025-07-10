
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  RotateCcw
} from "lucide-react"
import { User } from "@/lib/api"

interface UserTableRowProps {
  user: User
  onEdit: (user: User) => void
  onView: (user: User) => void
  onDelete: (user: User) => void
  onRestore?: (user: User) => void
}

export function UserTableRow({ user, onEdit, onView, onDelete, onRestore }: UserTableRowProps) {
  const getStatusBadge = (status: string) => {
    return status === "Actif" 
      ? <Badge className="bg-success text-success-foreground">Actif</Badge>
      : <Badge variant="secondary">Inactif</Badge>
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      "Admin": "bg-primary text-primary-foreground",
      "Agent": "bg-info text-info-foreground", 
      "Parent": "bg-warning text-warning-foreground",
      "Récupérateur": "bg-success text-success-foreground"
    }
    return <Badge className={colors[role as keyof typeof colors] || "bg-muted text-muted-foreground"}>{role}</Badge>
  }

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell className="text-muted-foreground">{user.email}</TableCell>
      <TableCell>{getRoleBadge(user.role)}</TableCell>
      <TableCell>{getStatusBadge(user.status || "Actif")}</TableCell>
      <TableCell className="text-muted-foreground">{user.lastLogin || "N/A"}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer" onClick={() => onView(user)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir les détails
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(user)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onRestore && (
              <DropdownMenuItem className="cursor-pointer" onClick={() => onRestore(user)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restaurer
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => onDelete(user)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
