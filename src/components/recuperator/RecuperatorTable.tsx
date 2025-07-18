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
    onCreateSuccess?: () => void
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
 const colors: Record<string, string> = {
  "Père / Mère": "bg-blue-600 text-white",
  "Frère / Sœur": "bg-green-600 text-white",
  "Oncle / Tante": "bg-yellow-500 text-black",
  "Cousin / Cousine": "bg-cyan-600 text-white",
  "Grand-père / Grand-mère": "bg-gray-600 text-white",
  "Beau-père / Belle-mère": "bg-indigo-600 text-white",
  "Tuteur / Garde": "bg-purple-600 text-white",
  "Nounou / Chauffeur": "bg-rose-500 text-white",
  "Voisin / Voisine": "bg-lime-500 text-black",
  "Amie / Ami": "bg-teal-500 text-white",
  "Autre (personne de confiance)": "bg-muted text-muted-foreground"
}


  return (
    <Badge className={colors[relation] || "bg-muted text-muted-foreground"}>
      {relation}
    </Badge>
  )


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
          {!recuperator.deleted_at && (
  <>
    <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(recuperator)}>
      <Edit className="mr-2 h-4 w-4" />
      Modifier
    </DropdownMenuItem>
    <DropdownMenuSeparator />
  </>
)}
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
