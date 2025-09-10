import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Brain, TrendingUp, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickInsight {
  id: string;
  title: string;
  lead_score: number;
  actionable_items: any[];
  created_at: string;
}

export default function InsightsCard() {
  const [recentInsights, setRecentInsights] = useState<QuickInsight[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [highValueInsights, setHighValueInsights] = useState(0);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      // Get recent insights
      const { data: insights, error: insightsError } = await supabase
        .from("insights")
        .select("id, title, lead_score, actionable_items, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      if (insightsError) throw insightsError;

      // Get total leads count
      const { count: leadsCount, error: leadsError } = await supabase
        .from("generated_leads")
        .select("*", { count: 'exact', head: true });

      if (leadsError) throw leadsError;

      setRecentInsights(insights || []);
      setTotalLeads(leadsCount || 0);
      setHighValueInsights(insights?.filter(i => i.lead_score >= 70).length || 0);
    } catch (error) {
      console.error("Error fetching insights:", error);
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Insights
          </CardTitle>
          <CardDescription>Web intelligence and lead generation</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/insights">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Generated Leads</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{totalLeads}</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-muted-foreground">High-Value</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{highValueInsights}</div>
          </div>
        </div>

        {/* Recent Insights */}
        {recentInsights.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Recent Insights</h4>
            {recentInsights.map((insight) => (
              <div key={insight.id} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-900 line-clamp-1">
                    {insight.title}
                  </h5>
                  <Badge
                    variant="secondary"
                    className={`ml-2 ${getLeadScoreColor(insight.lead_score)}`}
                  >
                    {insight.lead_score}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {insight.actionable_items?.length || 0} actionable item{insight.actionable_items?.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(insight.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No insights yet</p>
            <Button size="sm" className="mt-2" asChild>
              <Link to="/insights">Start Analyzing</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}