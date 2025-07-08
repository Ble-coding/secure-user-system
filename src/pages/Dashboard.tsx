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
  AlertCircle
} from "lucide-react"

export default function Dashboard() {
  const recentActivities = [
    { id: 1, action: "Nouveau parent enregistré", user: "Marie Dupont", time: "Il y a 5 min", status: "success" },
    { id: 2, action: "QR Code scanné", user: "Jean Martin", time: "Il y a 12 min", status: "info" },
    { id: 3, action: "Récupération enfant", user: "Sophie Bernard", time: "Il y a 20 min", status: "success" },
    { id: 4, action: "Tentative accès refusé", user: "Inconnu", time: "Il y a 35 min", status: "warning" },
    { id: 5, action: "Nouvel agent ajouté", user: "Pierre Moreau", time: "Il y a 1h", status: "info" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-success text-success-foreground"
      case "warning": return "bg-warning text-warning-foreground"
      case "info": return "bg-info text-info-foreground"
      default: return "bg-muted text-muted-foreground"
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
          <Button size="sm" className="bg-gradient-primary">
            <TrendingUp className="w-4 h-4 mr-2" />
            Générer rapport
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Utilisateurs"
          value="1,247"
          description="Tous les utilisateurs"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Agents Actifs"
          value="23"
          description="En service"
          icon={UserCheck}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Parents Enregistrés"
          value="892"
          description="Dans le système"
          icon={Users2}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Récupérations Jour"
          value="156"
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
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
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
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Ajouter un utilisateur
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <UserCheck className="w-4 h-4 mr-2" />
              Ajouter un agent
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users2 className="w-4 h-4 mr-2" />
              Ajouter un parent
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Heart className="w-4 h-4 mr-2" />
              Ajouter un récupérateur
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Baby className="w-4 h-4 mr-2" />
              Ajouter un enfant
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
            <div className="text-2xl font-bold text-foreground">1,456</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+7%</span> par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              QR Codes générés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">234</div>
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
            <div className="text-2xl font-bold text-foreground">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Récupérations réussies
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}