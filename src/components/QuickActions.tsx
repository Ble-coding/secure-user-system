
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { 
  Users, 
  UserPlus, 
  Heart, 
  Baby, 
  Shield, 
  Calendar,
  QrCode,
  FileText,
  ArrowRight
} from "lucide-react"

interface QuickAction {
  title: string
  description: string
  icon: React.ElementType
  route: string
  color: string
}

export function QuickActions() {
  const navigate = useNavigate()

  const actions: QuickAction[] = [
    {
      title: "Ajouter un Parent",
      description: "Enregistrer un nouveau parent",
      icon: UserPlus,
      route: "/parents",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Ajouter un Récupérateur",
      description: "Autoriser une nouvelle personne",
      icon: Heart,
      route: "/recuperators", 
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Enregistrer un Enfant",
      description: "Ajouter un nouvel enfant",
      icon: Baby,
      route: "/children",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Gérer les Agents",
      description: "Configurer les agents",
      icon: Shield,
      route: "/agents",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Scanner QR Code",
      description: "Enregistrer entrée/sortie",
      icon: QrCode,
      route: "/entries",
      color: "bg-indigo-500 hover:bg-indigo-600"
    },
    {
      title: "Journal des Entrées",
      description: "Consulter l'historique",
      icon: Calendar,
      route: "/entries",
      color: "bg-teal-500 hover:bg-teal-600"
    },
    {
      title: "Gérer les Utilisateurs",
      description: "Administration système",
      icon: Users,
      route: "/users",
      color: "bg-red-500 hover:bg-red-600"
    },
    {
      title: "Rapports",
      description: "Générer des rapports",
      icon: FileText,
      route: "/reports",
      color: "bg-gray-500 hover:bg-gray-600"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-primary" />
          Actions Rapides
        </CardTitle>
        <CardDescription>
          Raccourcis vers les fonctions principales du système
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
              onClick={() => navigate(action.route)}
            >
              <div className={`p-2 rounded-full ${action.color} text-white`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
