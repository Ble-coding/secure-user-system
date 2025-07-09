
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  QrCode, 
  Scan, 
  Camera, 
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { qrCodeService, agentService, ChildEntry } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export default function QRCode() {
  const [childCode, setChildCode] = useState("")
  const [agentCode, setAgentCode] = useState("")
  const [recuperatorCode, setRecuperatorCode] = useState("")
  const [scanType, setScanType] = useState<"entry" | "exit">("entry")
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Récupérer les scans récents
  const { data: recentScans = [], isLoading: isLoadingScans } = useQuery({
    queryKey: ['recent-scans'],
    queryFn: () => qrCodeService.getRecentScans(10),
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  })

  const scanMutation = useMutation({
    mutationFn: qrCodeService.scanQRCode,
    onSuccess: (data) => {
      toast({
        title: "Scan réussi",
        description: `${scanType === "entry" ? "Entrée" : "Sortie"} enregistrée avec succès`,
      })
      
      // Reset form
      setChildCode("")
      setAgentCode("")
      setRecuperatorCode("")
      
      // Rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['recent-scans'] })
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      
      // Afficher les avertissements si présents
      if (data.warnings && data.warnings.length > 0) {
        data.warnings.forEach((warning: string) => {
          toast({
            title: "Avertissement",
            description: warning,
            variant: "destructive"
          })
        })
      }
    },
    onError: (error: any) => {
      console.error('Scan error:', error)
      toast({
        title: "Erreur de scan",
        description: error.message || "Une erreur est survenue lors du scan",
        variant: "destructive"
      })
    },
  })

  const handleScan = async () => {
    if (!childCode || !agentCode) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir au moins les codes enfant et agent",
        variant: "destructive"
      })
      return
    }

    const scanData = {
      child_id: childCode,
      parent_user_id: "1", // À ajuster selon votre logique
      agent_id: agentCode,
      recuperator_id: recuperatorCode || undefined,
      type: scanType,
      scanned_at: new Date().toISOString(),
    }

    scanMutation.mutate(scanData)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scanner QR Code</h1>
          <p className="text-muted-foreground">Enregistrez les entrées et sorties des enfants</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Guide d'utilisation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scans Aujourd'hui
            </CardTitle>
            <Scan className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {recentScans?.filter((scan: ChildEntry) => 
                new Date(scan.scanned_at).toDateString() === new Date().toDateString()
              ).length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entrées
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {recentScans?.filter((scan: ChildEntry) => 
                scan.type === 'entry' && 
                new Date(scan.scanned_at).toDateString() === new Date().toDateString()
              ).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sorties
            </CardTitle>
            <XCircle className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {recentScans?.filter((scan: ChildEntry) => 
                scan.type === 'exit' && 
                new Date(scan.scanned_at).toDateString() === new Date().toDateString()
              ).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Erreurs
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Scanner Interface */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scan Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              Scanner QR Code
            </CardTitle>
            <CardDescription>
              Scannez les codes pour enregistrer l'entrée/sortie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="childCode">Code Enfant *</Label>
              <Input 
                id="childCode"
                placeholder="CH-123456-12345"
                value={childCode}
                onChange={(e) => setChildCode(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentCode">Code Agent *</Label>
              <Input 
                id="agentCode"
                placeholder="AG-123456-12345"
                value={agentCode}
                onChange={(e) => setAgentCode(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recuperatorCode">Code Récupérateur (optionnel)</Label>
              <Input 
                id="recuperatorCode"
                placeholder="RC-123456-12345"
                value={recuperatorCode}
                onChange={(e) => setRecuperatorCode(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Type de Scan</Label>
              <div className="flex gap-2">
                <Button
                  variant={scanType === "entry" ? "default" : "outline"}
                  onClick={() => setScanType("entry")}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Entrée
                </Button>
                <Button
                  variant={scanType === "exit" ? "default" : "outline"}
                  onClick={() => setScanType("exit")}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Sortie
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleScan}
              disabled={scanMutation.isPending}
              className="w-full bg-gradient-primary"
            >
              {scanMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Scan en cours...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 mr-2" />
                  Scanner
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Camera Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Aperçu Caméra
            </CardTitle>
            <CardDescription>
              Positionnez le QR code dans le cadre pour le scanner automatiquement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Caméra non activée</p>
                <Button variant="outline" className="mt-2">
                  <Camera className="w-4 h-4 mr-2" />
                  Activer la caméra
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle>Scans Récents</CardTitle>
          <CardDescription>
            Historique des derniers scans effectués
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingScans ? (
            <div className="text-center py-4">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Chargement des scans récents...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.slice(0, 5).map((scan: ChildEntry, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">
                      {new Date(scan.scanned_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <Badge variant="outline">Enfant: {scan.child_id}</Badge>
                    <Badge variant="outline">Agent: {scan.agent_id}</Badge>
                    {scan.recuperator_id && (
                      <Badge variant="outline">Récup: {scan.recuperator_id}</Badge>
                    )}
                    <Badge className={scan.type === "entry" ? "bg-success text-success-foreground" : "bg-info text-info-foreground"}>
                      {scan.type === "entry" ? "Entrée" : "Sortie"}
                    </Badge>
                  </div>
                  <Badge variant="default">
                    Réussi
                  </Badge>
                </div>
              ))}
              
              {recentScans.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucun scan récent</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
