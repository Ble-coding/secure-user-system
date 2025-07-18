import { StatsCard } from "@/components/StatsCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  UserCheck, 
  Users2, 
  Heart, 
  Baby, 
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { dashboardService } from "@/lib/api/dashboard"

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => dashboardService.getOverview(),
  })

  const overview = dashboardData?.data


    const recentActivities = [
    { id: 1, action: "Nouveau parent enregistré", user: "Marie Dupont", time: "Il y a 5 min", status: "success" },
    { id: 2, action: "QR Code scanné", user: "Jean Martin", time: "Il y a 12 min", status: "info" },
    { id: 3, action: "Récupération enfant", user: "Sophie Bernard", time: "Il y a 20 min", status: "success" },
    { id: 4, action: "Tentative accès refusé", user: "Inconnu", time: "Il y a 35 min", status: "warning" },
    { id: 5, action: "Nouvel agent ajouté", user: "Pierre Moreau", time: "Il y a 1h", status: "info" },
  ]

  
  const getActivityIcon = (type: string) => {
    return type === 'entry' ? CheckCircle : XCircle
  }

  const getActivityColor = (type: string) => {
    return type === 'entry' ? 'text-green-600' : 'text-orange-600'
  }

  const getStatusBadgeColor = (type: string) => {
    return type === 'entry' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
  }

  // const getStatusBadgeColor = (status: string) => {
  //   switch (status) {
  //     case "success": return "bg-success text-success-foreground"
  //     case "warning": return "bg-warning text-warning-foreground"
  //     case "info": return "bg-info text-info-foreground"
  //     default: return "bg-muted text-muted-foreground"
  //   }

  

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `Il y a ${hours}h`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `Il y a ${days}j`
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de votre système de gestion</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Aujourd'hui
          </Button>
          <Button size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Générer rapport
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Utilisateurs"
          value={isLoading ? "..." : overview?.total_users || 0}
          description="Tous les utilisateurs"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Agents Actifs"
          value={isLoading ? "..." : overview?.active_agents || 0}
          description="En service"
          icon={UserCheck}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Parents Enregistrés"
          value={isLoading ? "..." : overview?.registered_parents || 0}
          description="Dans le système"
          icon={Users2}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Récupérations Jour"
          value={isLoading ? "..." : overview?.today_recoveries || 0}
          description="Aujourd'hui"
          icon={Heart}
          trend={{ value: 5, isPositive: false }}
        />
      </div>

     {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Activités Récentes
            </CardTitle>
            <CardDescription>
              Les dernières actions effectuées dans le système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {isLoading ? (
                          <div className="text-center py-4 text-muted-foreground">Chargement...</div>
                        ) : overview?.recent_activities?.length ? (
                          overview.recent_activities.map((activity) => {
                            const IconComponent = getActivityIcon(activity.type)
                            return (
                              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">
                                      {activity.status}
                                      {activity.recuperator && ` - ${activity.recuperator.full_name}`}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {activity.recuperator?.code || 'Sans récupérateur'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className={getStatusBadgeColor(activity.type)}>
                                    {activity.status}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTimeAgo(activity.scanned_at)}
                                  </span>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">Aucune activité récente</div>
                        )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Actions Rapides
            </CardTitle>
            <CardDescription>
              Raccourcis vers les fonctions principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/users')}
            >
              <Users className="w-4 h-4 mr-2" />
              Gestion des Utilisateurs
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/agents')}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Gestion des Agents
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/parents')}
            >
              <Users2 className="w-4 h-4 mr-2" />
              Gestion des Parents
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/recuperators')}
            >
              <Heart className="w-4 h-4 mr-2" />
              Gestion des Récupérateurs
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/children')}
            >
              <Baby className="w-4 h-4 mr-2" />
              Gestion des Enfants
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/qrcode')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Scanner QR Code
            </Button>
          </CardContent>
        </Card>
      </div>


      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Enfants dans le système
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-foreground">
      {overview?.children_count ?? 0}
    </div>
    <p className="text-xs text-muted-foreground">
      <span className={overview?.children_trend?.isPositive ? "text-success" : "text-destructive"}>
        {overview?.children_trend?.isPositive ? "+" : "-"}
        {overview?.children_trend?.value ?? 0}%
      </span>{" "}
      par rapport au mois dernier
    </p>
  </CardContent>
</Card>


        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              QR Codes scannés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : overview?.qr_scans_week || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux de réussite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : `${overview?.success_rate || 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Récupérations réussies
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
