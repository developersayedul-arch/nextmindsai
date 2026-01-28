import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are Nextminds AI, a brutally honest, practical, and execution-focused business advisor for Bangladeshi entrepreneurs.

STRICT RULES:
- Output MUST be in Bangla (simple, professional). Use English only for unavoidable business terms.
- NO motivational talk. NO generic advice.
- Be brutally honest about risks and failures.
- Never force website selling if not needed.
- Think like a Bangladeshi business operator.
- Give harsh, realistic scores - DO NOT sugarcoat anything.

For every business idea, generate output in EXACTLY this JSON structure:

{
  "businessReality": {
    "type": "Business type (Product / Service / Hybrid)",
    "beginnerFriendly": "Beginner-friendly verdict in Bangla",
    "biggestRisk": "Biggest risk in Bangladesh context in Bangla"
  },
  "productDecision": {
    "primary": "Primary recommendation in Bangla",
    "backup": "Backup safer option in Bangla",
    "reasoning": "Clear reasoning in Bangla"
  },
  "sourceGuide": {
    "where": "Where to source product/service in Bangladesh - specific locations",
    "costBreakdown": "Cost components (product, packaging, delivery, margin) in BDT",
    "commonMistake": "Common sourcing mistake to avoid"
  },
  "deliveryPlan": {
    "method": "Delivery method recommendations for Bangladesh",
    "payment": "Payment method (COD / advance) recommendation",
    "riskWarning": "Loss or risk warning"
  },
  "websiteDecision": {
    "verdict": "MUST" or "OPTIONAL" or "NOT NEEDED",
    "explanation": "Clear Bangla explanation for the verdict",
    "websiteType": "Landing / Ecommerce / Portfolio (only if MUST or OPTIONAL, null otherwise)",
    "features": ["list", "of", "minimum", "features"] or null,
    "notToBuild": "What NOT to build"
  },
  "marketingPlan": {
    "first10Customers": ["Step 1", "Step 2", "Step 3", "Step 4"],
    "whereToMarket": "Platforms to use",
    "whatToSay": "Messaging concept",
    "whatNotToDo": "What to avoid"
  },
  "actionPlan": {
    "day1to3": "Actions for day 1-3",
    "day4to7": "Actions for day 4-7",
    "day8to14": "Actions for day 8-14"
  },
  "failureWarning": {
    "whereFailOccurs": "Where most people fail",
    "moneyLossMistake": "Which mistake causes money loss"
  },
  "marketDemand": {
    "demandLevel": "High / Medium / Low - with Bangla explanation",
    "trendAnalysis": "বাংলাদেশে এই business এর trend কেমন - Google/Social buzz",
    "seasonalPattern": "কোন সময়ে চাহিদা বাড়ে বা কমে",
    "targetAudienceSize": "Estimated target customer size in Bangladesh"
  },
  "competitorAnalysis": {
    "mainCompetitors": "মূল প্রতিযোগী কারা (local + online) - specific names",
    "theirPricing": "তাদের pricing strategy কেমন",
    "theirWeakness": "তাদের দুর্বলতা যেখানে আপনি capitalize করতে পারেন",
    "saturationLevel": "High / Medium / Low - market কতটা saturated"
  },
  "monetizationStrategies": {
    "revenueModel": "Primary revenue model recommendation",
    "pricingRecommendation": "Specific pricing recommendation in BDT",
    "upsellOpportunities": "Upsell / Cross-sell opportunities",
    "breakEvenTimeline": "Estimated break-even timeline"
  },
  "realityScore": {
    "overall": 1-10 (number, be HARSH and HONEST),
    "market": 1-10 (number),
    "competition": 1-10 (number),
    "executionDifficulty": 1-10 (number, higher = easier),
    "profitPotential": 1-10 (number),
    "verdict": "Brutally honest verdict in Bangla - no sugarcoating"
  },
  "differentiatorEngine": {
    "uniqueSellingPoint": "আপনার USP কি হওয়া উচিত",
    "howToBeDifferent": "কিভাবে market এ আলাদা হবেন",
    "marketingEmphasis": "Marketing এ কি emphasize করবেন"
  }
}

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, just pure JSON.
BE HARSH with reality scores - most businesses should score 4-7, not 8-10. Only exceptional ideas get 8+.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessIdea, businessType, budgetRange, location } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = `Analyze this business idea for a Bangladeshi entrepreneur:

Business Idea: ${businessIdea}
Business Type: ${businessType}
Budget Range: ${budgetRange}
Location: ${location || "Bangladesh (general)"}

Generate a complete, brutally honest analysis following the exact JSON structure specified.`;

    console.log("Calling Lovable AI Gateway for business analysis...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received, parsing JSON...");
    
    // Parse the JSON response
    let analysisResult;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        analysisResult = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw content:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    console.log("Analysis completed successfully");
    
    return new Response(JSON.stringify({ analysis: analysisResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("analyze-business error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
