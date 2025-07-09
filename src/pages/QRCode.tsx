
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

export default function QRCode() {
  const [childCode, setChildCode] = useState("")
  const [agentCode, setAgentCode] = useState("")
  const [scanType, setScanType] = useState<"entry" | "exit">("entry")
  const [isScanning, setIsScanning] = useState(false)
  const { toast } = useToast()

  const handleScan = async () => {
    if (!childCode || !agentCode) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive"
      })
      return
    }

    setIsScanning(true)
    
    try {
      // Simulation d'un scan QR - ici vous pouvez intégrer l'API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Scan réussi",
        description: `${scanType === "entry" ? "Entrée" : "Sortie"} enregistrée avec succès`,
      })
      
      // Reset form
      setChildCode("")
      setAgentCode("")
    } catch (error) {
      toast({
        title: "Erreur de scan",
        description: "Une erreur est survenue lors du scan",
        variant: "destructive"
      })
    } finally {
      setIsScanning(false)
    }
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
            <div className="text-2xl font-bold text-foreground">156</div>
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
            <div className="text-2xl font-bold text-foreground">89</div>
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
            <div className="text-2xl font-bold text-foreground">67</div>
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
            <div className="text-2xl font-bold text-foreground">3</div>
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
              Scannez le code de l'enfant et de l'agent pour enregistrer l'entrée/sortie
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
              disabled={isScanning}
              className="w-full bg-gradient-primary"
            >
              {isScanning ? (
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
          <div className="space-y-3">
            {[
              { time: "14:30", child: "CH-001", agent: "AG-001", type: "entry", status: "success" },
              { time: "14:25", child: "CH-002", agent: "AG-002", type: "exit", status: "success" },
              { time: "14:20", child: "CH-003", agent: "AG-001", type: "entry", status: "error" },
            ].map((scan, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">{scan.time}</div>
                  <Badge variant="outline">{scan.child}</Badge>
                  <Badge variant="outline">{scan.agent}</Badge>
                  <Badge className={scan.type === "entry" ? "bg-success text-success-foreground" : "bg-info text-info-foreground"}>
                    {scan.type === "entry" ? "Entrée" : "Sortie"}
                  </Badge>
                </div>
                <Badge variant={scan.status === "success" ? "default" : "destructive"}>
                  {scan.status === "success" ? "Réussi" : "Erreur"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
