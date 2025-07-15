import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCheck, Activity, UserX, Plus } from "lucide-react"

interface RecuperatorStatsProps {
  totalRecuperators: number
  totalActifs: number
  totalInactifs: number
  newThisMonth: number
}

export function RecuperatorStats({ 
  totalRecuperators, 
  totalActifs, 
  totalInactifs, 
  newThisMonth 
}: RecuperatorStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Récupérateurs
          </CardTitle>
          <UserCheck className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalRecuperators}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Actifs
          </CardTitle>
          <Activity className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalActifs}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Inactifs
          </CardTitle>
          <UserX className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalInactifs}</div>
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
          <div className="text-2xl font-bold text-foreground">{newThisMonth}</div>
        </CardContent>
      </Card>
    </div>
  )
}
