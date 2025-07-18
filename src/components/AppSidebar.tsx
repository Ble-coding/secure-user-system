
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { BASE_URL } from "@/lib/api/config"
import { 
  BarChart3, 
  Users, 
  UserCheck, 
  Users2, 
  Heart, 
  Baby, 
  Calendar, 
  QrCode, 
  Settings, 
  Shield,
  LogOut,
  Home,
  MessageSquare,
  Search
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

const mainItems = [
  { title: "Tableau de bord", url: "/", icon: Home },
  { title: "Gestion des Utilisateurs", url: "/users", icon: Users },
  { title: "Gestion des Agents", url: "/agents", icon: UserCheck },
  { title: "Gestion des Parents", url: "/parents", icon: Users2 },
  { title: "Gestion des Récupérateurs", url: "/recuperators", icon: Heart },
  { title: "Gestion des Enfants", url: "/children", icon: Baby },
]

const toolItems = [
  { title: "Journal des Entrées", url: "/entries", icon: Calendar },
  { title: "Chat", url: "/chat", icon: MessageSquare },
  { title: "QR Code", url: "/qrcode", icon: QrCode },
]

const settingsItems = [
  { title: "Mon Compte", url: "/profile", icon: Settings },
  { title: "Rôles & Permissions", url: "/roles", icon: Shield },
]

export function AppSidebar() {
   const { user } = useAuth()
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"
  const [searchTerm, setSearchTerm] = useState("")


  
    // Fonction pour déterminer le rôle affiché
 const getUserRole = () => {
    if (!user) return "Utilisateur"
   const roleName = user.roles?.[0]?.name
    return roleName === 'superadmin'
      ? 'Super Administrateur'
      : roleName === 'admin'
      ? 'Administrateur'
      : 'Utilisateur'
  }

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 ${isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground"
    }`

  // Fonction pour filtrer les éléments selon le terme de recherche
  const filterItems = (items: typeof mainItems) => {
    if (!searchTerm) return items
    return items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const filteredMainItems = filterItems(mainItems)
  const filteredToolItems = filterItems(toolItems)
  const filteredSettingsItems = filterItems(settingsItems)

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-64"} border-r border-sidebar-border bg-sidebar shadow-card-custom`}>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-sidebar-foreground">Admin Panel</h2>
              <p className="text-xs text-sidebar-foreground/70">Système de gestion</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Barre de recherche */}
        {!collapsed && (
          <div className="mb-4 px-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8 text-sm bg-sidebar-accent/50 border-sidebar-border placeholder:text-sidebar-foreground/60"
              />
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-sidebar-foreground/70"}>
            Gestion Principale
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-sidebar-foreground/70"}>
            Outils
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredToolItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-sidebar-foreground/70"}>
            Paramètres
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredSettingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.photo ? `${BASE_URL}/storage/${user.photo}` : undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || 'Utilisateur'}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">{getUserRole()}</p>
            </div>
          </div>
        )}
        <Button 
          variant="outline" 
          size={collapsed ? "icon" : "sm"} 
          className="w-full border-sidebar-border bg-sidebar-accent hover:bg-destructive hover:text-destructive-foreground text-sidebar-foreground"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="ml-2">Déconnexion</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}