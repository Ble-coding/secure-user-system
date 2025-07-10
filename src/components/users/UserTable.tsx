
import { 
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from "@/lib/api"
import { UserTableRow } from "./UserTableRow"

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onView: (user: User) => void
  onDelete: (user: User) => void
  onRestore?: (user: User) => void
}

export function UserTable({ users, onEdit, onView, onDelete, onRestore }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Dernière connexion</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: User) => (
          <UserTableRow
            key={user.id}
            user={user}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            onRestore={onRestore}
          />
        ))}
      </TableBody>
    </Table>
  )
}