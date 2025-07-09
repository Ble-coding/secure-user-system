
import { useState, useEffect } from "react"
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
import { authService } from "@/lib/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export default function MonCompte() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
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

  // Récupérer les données utilisateur
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: authService.me,
    retry: false,
  })

  // Mettre à jour les données du formulaire quand l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      toast({ title: "Profil mis à jour avec succès" })
      setIsEditing(false)
    },
    onError: (error: any) => {
      console.error('Error updating profile:', error)
      toast({ 
        title: "Erreur lors de la mise à jour", 
        description: error.message || "Une erreur est survenue",
        variant: "destructive" 
      })
    },
  })

  const updatePasswordMutation = useMutation({
    mutationFn: authService.updatePassword,
    onSuccess: () => {
      toast({ title: "Mot de passe changé avec succès" })
      setPasswordData({ current_password: "", password: "", password_confirmation: "" })
    },
    onError: (error: any) => {
      console.error('Error updating password:', error)
      toast({ 
        title: "Erreur lors du changement de mot de passe", 
        description: error.message || "Une erreur est survenue",
        variant: "destructive" 
      })
    },
  })

  const handleSave = () => {
    updateProfileMutation.mutate(formData)
  }

  const handlePasswordChange = () => {
    if (passwordData.password !== passwordData.password_confirmation) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      })
      return
    }
    
    updatePasswordMutation.mutate(passwordData)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-destructive mb-2">Erreur lors du chargement du profil</div>
          <p className="text-muted-foreground">Vous devez être connecté pour accéder à cette page</p>
        </div>
      </div>
    )
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
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? (
              "Enregistrement..."
            ) : isEditing ? (
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
                      <AvatarImage src={user?.photo} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
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
                    <h3 className="font-semibold text-lg">{user?.name || 'Utilisateur'}</h3>
                    <Badge className="bg-primary text-primary-foreground">
                      Administrateur
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Membre depuis {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Dernière connexion: Aujourd'hui</span>
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
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                        value="Administrateur"
                        disabled
                        className="border-0 bg-transparent"
                      />
                    </div>
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
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Changer le mot de passe</h4>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Mot de passe actuel</Label>
                      <Input 
                        id="current_password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password">Nouveau mot de passe</Label>
                      <Input 
                        id="new_password"
                        type="password"
                        value={passwordData.password}
                        onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
                      <Input 
                        id="confirm_password"
                        type="password"
                        value={passwordData.password_confirmation}
                        onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                      />
                    </div>
                    <Button 
                      onClick={handlePasswordChange}
                      disabled={updatePasswordMutation.isPending}
                      className="w-fit"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      {updatePasswordMutation.isPending ? "Changement..." : "Changer le mot de passe"}
                    </Button>
                  </div>
                </div>
                
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
