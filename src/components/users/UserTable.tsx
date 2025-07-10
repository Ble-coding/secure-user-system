
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
}

export function UserTable({ users, onEdit, onView, onDelete }: UserTableProps) {
  return (
    <div className="rounded-md border border-border">
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
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
