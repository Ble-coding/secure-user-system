
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users as UsersIcon, 
  Plus, 
  UserCheck,
  UserX
} from "lucide-react"
import { User } from "@/lib/api"

interface UserStatsProps {
  users: User[]
}

export function UserStats({ users }: UserStatsProps) {
  const activeUsers = users.filter((u: User) => u.status === "Actif").length
  const inactiveUsers = users.filter((u: User) => u.status === "Inactif").length

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Utilisateurs
          </CardTitle>
          <UsersIcon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{users.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Utilisateurs Actifs
          </CardTitle>
          <UserCheck className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{activeUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Utilisateurs Inactifs
          </CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{inactiveUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Nouveaux ce mois
          </CardTitle>
          <Plus className="h-4 w-4 text-info" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">12</div>
        </CardContent>
      </Card>
    </div>
  )
}
