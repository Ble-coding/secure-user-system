
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Key, 
  Shield,
  Camera,
  Save,
  Bell,
  Settings,
  Activity,
  Lock
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MonCompte() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const { toast } = useToast()

  const [userData, setUserData] = useState({
    name: "Admin User",
    email: "admin@example.com",
    phone: "+33 1 23 45 67 89",
    role: "Administrateur",
    address: "123 Rue de l'École, Paris",
    joinDate: "Janvier 2024",
    lastLogin: "Aujourd'hui à 14:30",
    avatar: "/placeholder-user.jpg"
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true
  })

  const handleSave = () => {
    setIsEditing(false)
    toast({ 
      title: "Profil mis à jour", 
      description: "Vos informations ont été sauvegardées avec succès" 
    })
  }

  const handlePasswordChange = () => {
    toast({ 
      title: "Mot de passe changé", 
      description: "Votre mot de passe a été mis à jour avec succès" 
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mon Compte</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et paramètres</p>
        </div>
        {activeTab === "profile" && (
          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </>
            )}
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Card */}
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={userData.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {userData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button 
                        size="icon" 
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{userData.name}</h3>
                    <Badge className="bg-primary text-primary-foreground">
                      {userData.role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Membre depuis {userData.joinDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Dernière connexion: {userData.lastLogin}</span>
                </div>
              </CardContent>
            </Card>

            {/* Information Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
                <CardDescription>
                  Vos informations de profil et de contact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="name"
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        disabled={!isEditing}
                        className={!isEditing ? "border-0 bg-transparent" : ""}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        disabled={!isEditing}
                        className={!isEditing ? "border-0 bg-transparent" : ""}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        disabled={!isEditing}
                        className={!isEditing ? "border-0 bg-transparent" : ""}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="role"
                        value={userData.role}
                        disabled
                        className="border-0 bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="address"
                      value={userData.address}
                      onChange={(e) => setUserData({...userData, address: e.target.value})}
                      disabled={!isEditing}
                      className={!isEditing ? "border-0 bg-transparent" : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Sécurité du Compte
              </CardTitle>
              <CardDescription>
                Gérez vos paramètres de sécurité et mots de passe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button onClick={handlePasswordChange} className="w-full justify-start">
                  <Key className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Authentification à deux facteurs</h4>
                    <p className="text-sm text-muted-foreground">Ajoutez une couche de sécurité supplémentaire</p>
                  </div>
                  <Button 
                    variant={security.twoFactor ? "default" : "outline"}
                    onClick={() => setSecurity({...security, twoFactor: !security.twoFactor})}
                  >
                    {security.twoFactor ? "Activé" : "Désactivé"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertes de connexion</h4>
                    <p className="text-sm text-muted-foreground">Recevez des notifications pour les nouvelles connexions</p>
                  </div>
                  <Button 
                    variant={security.loginAlerts ? "default" : "outline"}
                    onClick={() => setSecurity({...security, loginAlerts: !security.loginAlerts})}
                  >
                    {security.loginAlerts ? "Activé" : "Désactivé"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Préférences de Notifications
              </CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications par email</h4>
                    <p className="text-sm text-muted-foreground">Recevez des mises à jour par email</p>
                  </div>
                  <Button 
                    variant={notifications.email ? "default" : "outline"}
                    onClick={() => setNotifications({...notifications, email: !notifications.email})}
                  >
                    {notifications.email ? "Activé" : "Désactivé"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications push</h4>
                    <p className="text-sm text-muted-foreground">Recevez des notifications dans votre navigateur</p>
                  </div>
                  <Button 
                    variant={notifications.push ? "default" : "outline"}
                    onClick={() => setNotifications({...notifications, push: !notifications.push})}
                  >
                    {notifications.push ? "Activé" : "Désactivé"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications SMS</h4>
                    <p className="text-sm text-muted-foreground">Recevez des alertes importantes par SMS</p>
                  </div>
                  <Button 
                    variant={notifications.sms ? "default" : "outline"}
                    onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                  >
                    {notifications.sms ? "Activé" : "Désactivé"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Historique d'Activité
              </CardTitle>
              <CardDescription>
                Vos dernières actions dans le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Connexion au système", time: "Il y a 5 min", type: "login" },
                  { action: "Modification du profil", time: "Il y a 2h", type: "update" },
                  { action: "Scan QR Code", time: "Il y a 3h", type: "scan" },
                  { action: "Ajout d'un nouvel agent", time: "Hier", type: "create" },
                  { action: "Génération de rapport", time: "Il y a 2 jours", type: "report" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
