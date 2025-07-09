
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Key, 
  Shield,
  Camera
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MonCompte() {
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const userData = {
    name: "Admin User",
    email: "admin@example.com",
    phone: "+33 1 23 45 67 89",
    role: "Administrateur",
    address: "123 Rue de l'École, Paris",
    joinDate: "Janvier 2024",
    lastLogin: "Aujourd'hui à 14:30"
  }

  const handleSave = () => {
    setIsEditing(false)
    toast({ title: "Profil mis à jour avec succès" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mon Compte</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles</p>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? "Enregistrer" : "Modifier"}
          <Edit className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    AU
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
                  disabled={!isEditing}
                  className={!isEditing ? "border-0 bg-transparent" : ""}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Sécurité</h4>
              <Button variant="outline" className="w-full justify-start">
                <Key className="w-4 h-4 mr-2" />
                Changer le mot de passe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
