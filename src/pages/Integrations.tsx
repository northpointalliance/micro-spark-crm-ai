import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Upload,
  Linkedin,
  Globe,
  Zap
} from "lucide-react";

interface LinkedInConfig {
  isEnabled: boolean;
  accessToken?: string;
  lastSync?: string;
  syncedContacts?: number;
}

export default function Integrations() {
  const { toast } = useToast();
  const [linkedinConfig, setLinkedinConfig] = useState<LinkedInConfig>({
    isEnabled: false,
    syncedContacts: 0
  });
  const [accessToken, setAccessToken] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [zapierWebhook, setZapierWebhook] = useState("");

  const handleLinkedInConnect = async () => {
    if (!accessToken.trim()) {
      toast({
        title: "Access Token Required",
        description: "Please enter your LinkedIn Sales Navigator access token",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call - in real implementation, this would validate the token
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLinkedinConfig({
        isEnabled: true,
        accessToken,
        lastSync: new Date().toISOString(),
        syncedContacts: 0
      });
      
      toast({
        title: "LinkedIn Connected",
        description: "Successfully connected to LinkedIn Sales Navigator",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to LinkedIn. Please check your access token.",
        variant: "destructive",
      });
    }
  };

  const handleImportContacts = async () => {
    setIsImporting(true);
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const importedCount = Math.floor(Math.random() * 50) + 10;
      setLinkedinConfig(prev => ({
        ...prev,
        syncedContacts: (prev.syncedContacts || 0) + importedCount,
        lastSync: new Date().toISOString()
      }));

      toast({
        title: "Import Successful",
        description: `Imported ${importedCount} contacts from LinkedIn Sales Navigator`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleZapierConnect = async () => {
    if (!zapierWebhook.trim()) {
      toast({
        title: "Webhook URL Required",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive",
      });
      return;
    }

    try {
      // Test the webhook
      const response = await fetch(zapierWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          source: "MicroCRM"
        }),
      });

      toast({
        title: "Zapier Connected",
        description: "Webhook URL saved. Check your Zap history to confirm the test trigger.",
      });
    } catch (error) {
      toast({
        title: "Connection Test",
        description: "Webhook URL saved. Please check your Zap configuration.",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground mt-1">
            Connect your favorite tools and automate your workflow
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* LinkedIn Sales Navigator */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Linkedin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    LinkedIn Sales Navigator
                    {linkedinConfig.isEnabled && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Import leads and contacts directly from LinkedIn Sales Navigator
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!linkedinConfig.isEnabled ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="linkedin-token">Sales Navigator Access Token</Label>
                  <Input
                    id="linkedin-token"
                    type="password"
                    placeholder="Enter your LinkedIn Sales Navigator API token"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get your token from LinkedIn Developer Console
                  </p>
                </div>
                <Button onClick={handleLinkedInConnect} className="w-full">
                  Connect LinkedIn Sales Navigator
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Connection Status</p>
                    <p className="text-xs text-muted-foreground">
                      Last synced: {linkedinConfig.lastSync ? new Date(linkedinConfig.lastSync).toLocaleString() : 'Never'}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    {linkedinConfig.syncedContacts || 0} contacts synced
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleImportContacts} 
                    disabled={isImporting}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isImporting ? 'Importing...' : 'Import Contacts'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setLinkedinConfig({isEnabled: false, syncedContacts: 0})}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Zapier Integration */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>Zapier Automation</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Trigger Zaps when contacts are added or updated
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="zapier-webhook">Zapier Webhook URL</Label>
              <Input
                id="zapier-webhook"
                type="url"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={zapierWebhook}
                onChange={(e) => setZapierWebhook(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Create a Zap with a Webhook trigger to get this URL
              </p>
            </div>
            <Button onClick={handleZapierConnect} className="w-full">
              Connect Zapier
            </Button>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="opacity-60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Globe className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  More Integrations
                  <Badge variant="secondary">Coming Soon</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  HubSpot, Salesforce, Gmail, Outlook and more...
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}