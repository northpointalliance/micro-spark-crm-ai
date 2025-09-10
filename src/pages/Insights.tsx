import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ConvertLeadDialog from "@/components/ConvertLeadDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Globe,
  Brain,
  TrendingUp,
  Users,
  AlertCircle,
  Plus,
  Loader2,
  ExternalLink,
  Star
} from "lucide-react";

interface Insight {
  id: string;
  title: string;
  url?: string;
  summary: string;
  sentiment: {
    score: number;
    label: string;
  };
  keywords: string[];
  lead_score: number;
  actionable_items: any[];
  created_at: string;
}

interface GeneratedLead {
  id: string;
  company_name?: string;
  contact_name?: string;
  email?: string;
  lead_score: number;
  confidence_level: number;
  notes?: string;
  status: string;
  created_at: string;
}

export default function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [generatedLeads, setGeneratedLeads] = useState<GeneratedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch insights
      const { data: insightsData, error: insightsError } = await supabase
        .from("insights")
        .select("*")
        .order("created_at", { ascending: false });

      if (insightsError) throw insightsError;

      // Fetch generated leads
      const { data: leadsData, error: leadsError } = await supabase
        .from("generated_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (leadsError) throw leadsError;

      setInsights(insightsData || []);
      setGeneratedLeads(leadsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch insights and leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeContent = async () => {
    if (!url.trim() && !content.trim()) {
      toast({
        title: "Error",
        description: "Please provide either a URL or content to analyze",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-web-content", {
        body: { url: url.trim(), content: content.trim() }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content analyzed successfully!",
      });

      setUrl("");
      setContent("");
      fetchData();
    } catch (error) {
      console.error("Error analyzing content:", error);
      toast({
        title: "Error",
        description: "Failed to analyze content",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Web Insights</h1>
          <p className="text-muted-foreground">Analyze web content and generate actionable leads</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-crm-blue hover:bg-crm-blue-dark">
              <Plus className="mr-2 h-4 w-4" />
              Analyze Content
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Analyze Web Content</DialogTitle>
              <DialogDescription>
                Enter a URL to scrape or paste content directly for AI analysis
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">URL</label>
                <Input
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="text-center text-sm text-muted-foreground">OR</div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Paste content to analyze..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />
              </div>
              <Button 
                onClick={analyzeContent} 
                disabled={analyzing}
                className="w-full"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Content
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Insights
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Generated Leads
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generatedLeads.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High-Value Insights
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.filter(i => i.lead_score >= 70).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Leads
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {generatedLeads.filter(l => l.status === 'new').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Recent Insights
            </CardTitle>
            <CardDescription>
              AI-powered analysis of web content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.slice(0, 5).map((insight) => (
                <div key={insight.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{insight.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getSentimentColor(insight.sentiment.label)}
                      >
                        {insight.sentiment.label}
                      </Badge>
                      <div className={`text-sm font-medium ${getLeadScoreColor(insight.lead_score)}`}>
                        {insight.lead_score}%
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">
                    {insight.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {insight.keywords.slice(0, 3).map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(insight.created_at).toLocaleDateString()}</span>
                    {insight.url && (
                      <a
                        href={insight.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-crm-blue"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Source
                      </a>
                    )}
                  </div>
                </div>
              ))}
              
              {insights.length === 0 && (
                <div className="text-center py-8">
                  <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No insights yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start by analyzing web content to generate insights
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generated Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Generated Leads
            </CardTitle>
            <CardDescription>
              AI-generated leads from content analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedLeads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-sm">
                        {lead.company_name || 'Unknown Company'}
                      </h3>
                      {lead.email && (
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs">{Math.round(lead.confidence_level * 100)}%</span>
                      </div>
                      <Badge
                        variant={lead.status === 'new' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {lead.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {lead.notes && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {lead.notes}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Lead Score: {lead.lead_score}%</span>
                    <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {lead.status === 'new' && (
                    <div className="pt-2 border-t">
                      <ConvertLeadDialog lead={lead} onSuccess={fetchData} />
                    </div>
                  )}
                </div>
              ))}
              
              {generatedLeads.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No leads generated yet</p>
                  <p className="text-sm text-muted-foreground">
                    High-scoring content analysis will automatically generate leads
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}