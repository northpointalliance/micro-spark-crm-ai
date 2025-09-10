import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisRequest {
  url: string;
  content?: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANALYZE-WEB-CONTENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Create Supabase client for auth
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Create Supabase service client for database operations
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id });

    // Get request data
    const { url, content }: AnalysisRequest = await req.json();
    if (!url && !content) throw new Error("URL or content is required");

    logStep("Processing content", { url, hasContent: !!content });

    // Fetch content if URL provided and no content given
    let webContent = content;
    if (!webContent && url) {
      try {
        const response = await fetch(url);
        webContent = await response.text();
        logStep("Fetched web content", { contentLength: webContent.length });
      } catch (error) {
        logStep("Error fetching content", { error: error.message });
        throw new Error(`Failed to fetch content from URL: ${error.message}`);
      }
    }

    // Simple content analysis (in a real app, you'd use OpenAI or similar)
    const analysis = analyzeContent(webContent || "", url);
    logStep("Content analyzed", analysis);

    // Store insight in database
    const { data: insight, error: insertError } = await serviceClient
      .from("insights")
      .insert({
        user_id: user.id,
        title: analysis.title,
        url,
        content: webContent?.substring(0, 5000), // Store first 5k chars
        summary: analysis.summary,
        sentiment: analysis.sentiment,
        keywords: analysis.keywords,
        lead_score: analysis.leadScore,
        actionable_items: analysis.actionableItems,
        source_type: 'web'
      })
      .select()
      .single();

    if (insertError) throw new Error(`Failed to save insight: ${insertError.message}`);
    
    logStep("Insight saved", { insightId: insight.id });

    // Generate leads from the insight if lead score is high enough
    if (analysis.leadScore >= 60) {
      const leads = generateLeads(analysis, insight.id, user.id);
      
      if (leads.length > 0) {
        const { error: leadsError } = await serviceClient
          .from("generated_leads")
          .insert(leads);
        
        if (leadsError) {
          logStep("Error saving leads", { error: leadsError.message });
        } else {
          logStep("Generated leads saved", { count: leads.length });
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      insight,
      analysis
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function analyzeContent(content: string, url?: string) {
  // Simple keyword-based analysis (in production, use OpenAI GPT-4)
  const businessKeywords = ['company', 'business', 'startup', 'enterprise', 'organization', 'corp', 'inc', 'ltd'];
  const leadKeywords = ['hiring', 'looking for', 'seeking', 'need', 'require', 'opportunity', 'partnership'];
  const contactKeywords = ['contact', 'email', 'phone', 'reach out', '@', '.com'];
  
  const contentLower = content.toLowerCase();
  
  // Extract potential company names (simple pattern matching)
  const companyPatterns = [
    /([A-Z][a-z]+\s+(Inc|Corp|LLC|Ltd|Company))/g,
    /([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:is|was|will|has)/g
  ];
  
  const companies = [];
  for (const pattern of companyPatterns) {
    const matches = content.match(pattern);
    if (matches) companies.push(...matches.slice(0, 3)); // Limit to 3
  }

  // Extract emails
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = content.match(emailPattern)?.slice(0, 5) || [];

  // Calculate lead score
  let leadScore = 0;
  leadScore += businessKeywords.filter(kw => contentLower.includes(kw)).length * 10;
  leadScore += leadKeywords.filter(kw => contentLower.includes(kw)).length * 15;
  leadScore += contactKeywords.filter(kw => contentLower.includes(kw)).length * 5;
  leadScore += emails.length * 20;
  leadScore += companies.length * 10;
  leadScore = Math.min(leadScore, 100);

  // Determine sentiment (simple approach)
  const positiveWords = ['great', 'excellent', 'amazing', 'fantastic', 'good', 'best', 'success'];
  const negativeWords = ['bad', 'terrible', 'awful', 'worst', 'fail', 'problem', 'issue'];
  
  const positiveCount = positiveWords.filter(word => contentLower.includes(word)).length;
  const negativeCount = negativeWords.filter(word => contentLower.includes(word)).length;
  
  let sentimentScore = 0.5; // Neutral
  if (positiveCount > negativeCount) sentimentScore = 0.7;
  else if (negativeCount > positiveCount) sentimentScore = 0.3;

  // Generate actionable items
  const actionableItems = [];
  if (emails.length > 0) {
    actionableItems.push({
      type: 'contact',
      priority: 'high',
      action: `Reach out to ${emails.length} potential contact${emails.length > 1 ? 's' : ''}`,
      details: emails.slice(0, 3)
    });
  }
  if (companies.length > 0) {
    actionableItems.push({
      type: 'research',
      priority: 'medium',
      action: `Research ${companies.length} identified compan${companies.length > 1 ? 'ies' : 'y'}`,
      details: companies.slice(0, 3)
    });
  }
  if (leadScore >= 70) {
    actionableItems.push({
      type: 'follow_up',
      priority: 'high',
      action: 'High-value lead identified - prioritize follow-up',
      details: 'Content indicates strong business opportunity'
    });
  }

  return {
    title: extractTitle(content, url),
    summary: content.substring(0, 300) + (content.length > 300 ? '...' : ''),
    sentiment: {
      score: sentimentScore,
      label: sentimentScore > 0.6 ? 'positive' : sentimentScore < 0.4 ? 'negative' : 'neutral'
    },
    keywords: [...businessKeywords.filter(kw => contentLower.includes(kw)), 
               ...leadKeywords.filter(kw => contentLower.includes(kw))].slice(0, 10),
    leadScore,
    actionableItems,
    extractedEmails: emails,
    extractedCompanies: companies
  };
}

function extractTitle(content: string, url?: string): string {
  // Try to extract title from HTML
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) return titleMatch[1].trim();
  
  // Try to extract from first heading
  const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return h1Match[1].trim();
  
  // Use URL or generic title
  if (url) {
    const urlObj = new URL(url);
    return `Content from ${urlObj.hostname}`;
  }
  
  return 'Web Content Analysis';
}

function generateLeads(analysis: any, insightId: string, userId: string) {
  const leads = [];
  
  // Generate leads from extracted emails and companies
  if (analysis.extractedEmails?.length > 0 && analysis.extractedCompanies?.length > 0) {
    for (let i = 0; i < Math.min(analysis.extractedEmails.length, 3); i++) {
      const email = analysis.extractedEmails[i];
      const company = analysis.extractedCompanies[i] || analysis.extractedCompanies[0];
      
      leads.push({
        user_id: userId,
        insight_id: insightId,
        company_name: company,
        email: email,
        lead_source: 'web_analysis',
        lead_score: analysis.leadScore,
        confidence_level: 0.7,
        notes: `Generated from web content analysis. Sentiment: ${analysis.sentiment.label}`,
        actionable_insights: {
          keywords: analysis.keywords,
          sentiment: analysis.sentiment,
          actionItems: analysis.actionableItems
        },
        status: 'new'
      });
    }
  }
  
  return leads;
}