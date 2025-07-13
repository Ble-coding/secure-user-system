
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Baby, UserCheck, UserX, BookOpen } from "lucide-react"
import { ChildWithRelations } from "@/lib/api"

interface ChildrenStatsProps {
  children: ChildWithRelations[]
  totalCount: number
}

export function ChildrenStats({ children, totalCount }: ChildrenStatsProps) {
  const presentCount = children.filter(c => c.last_activities?.[0]?.type === "entry").length
  const exitedCount = children.filter(c => c.last_activities?.[0]?.type === "exit").length
  const totalEntries = children.reduce((sum, c) => sum + c.entry_count, 0)

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Enfants
          </CardTitle>
          <Baby className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalCount}</div>
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
          <div className="text-2xl font-bold text-foreground">{presentCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Sortis
          </CardTitle>
          <UserX className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{exitedCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Entrées
          </CardTitle>
          <BookOpen className="h-4 w-4 text-info" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalEntries}</div>
        </CardContent>
      </Card>
    </div>
  )
}
