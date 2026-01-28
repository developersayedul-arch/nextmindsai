import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BusinessFormData } from "./AnalyzePage";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Globe,
  Package,
  Truck,
  Megaphone,
  Calendar,
  AlertCircle,
  ArrowRight,
  Target,
  TrendingUp,
  Loader2,
  BarChart3,
  Users,
  DollarSign,
  Gauge,
  Sparkles
} from "lucide-react";

// Analysis result type from AI
interface AnalysisResult {
  businessReality: {
    type: string;
    beginnerFriendly: string;
    biggestRisk: string;
  };
  productDecision: {
    primary: string;
    backup: string;
    reasoning: string;
  };
  sourceGuide: {
    where: string;
    costBreakdown: string;
    commonMistake: string;
  };
  deliveryPlan: {
    method: string;
    payment: string;
    riskWarning: string;
  };
  websiteDecision: {
    verdict: "MUST" | "OPTIONAL" | "NOT NEEDED";
    explanation: string;
    websiteType: string | null;
    features: string[] | null;
    notToBuild: string;
  };
  marketingPlan: {
    first10Customers: string[];
    whereToMarket: string;
    whatToSay: string;
    whatNotToDo: string;
  };
  actionPlan: {
    day1to3: string;
    day4to7: string;
    day8to14: string;
  };
  failureWarning: {
    whereFailOccurs: string;
    moneyLossMistake: string;
  };
  // New sections
  marketDemand?: {
    demandLevel: string;
    trendAnalysis: string;
    seasonalPattern: string;
    targetAudienceSize: string;
  };
  competitorAnalysis?: {
    mainCompetitors: string;
    theirPricing: string;
    theirWeakness: string;
    saturationLevel: string;
  };
  monetizationStrategies?: {
    revenueModel: string;
    pricingRecommendation: string;
    upsellOpportunities: string;
    breakEvenTimeline: string;
  };
  realityScore?: {
    overall: number;
    market: number;
    competition: number;
    executionDifficulty: number;
    profitPotential: number;
    verdict: string;
  };
  differentiatorEngine?: {
    uniqueSellingPoint: string;
    howToBeDifferent: string;
    marketingEmphasis: string;
  };
}

// Validate analysis data structure
const validateAnalysisData = (data: unknown): data is AnalysisResult => {
  if (!data || typeof data !== 'object') return false;
  
  const analysis = data as Record<string, unknown>;
  
  const requiredSections = [
    'businessReality',
    'productDecision', 
    'sourceGuide',
    'deliveryPlan',
    'websiteDecision',
    'marketingPlan',
    'actionPlan',
    'failureWarning'
  ];
  
  return requiredSections.every(section => 
    analysis[section] && typeof analysis[section] === 'object'
  );
};

// Helper function to get score color
const getScoreColor = (score: number): string => {
  if (score >= 7) return "text-success";
  if (score >= 4) return "text-warning";
  return "text-destructive";
};

const getScoreBarColor = (score: number): string => {
  if (score >= 7) return "bg-success";
  if (score >= 4) return "bg-warning";
  return "bg-destructive";
};

const getScoreBgColor = (score: number): string => {
  if (score >= 7) return "bg-success/10 border-success/20";
  if (score >= 4) return "bg-warning/10 border-warning/20";
  return "bg-destructive/10 border-destructive/20";
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BusinessFormData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedFormData = sessionStorage.getItem("businessFormData");
      const storedResults = sessionStorage.getItem("analysisResults");
      
      if (!storedFormData || !storedResults) {
        navigate("/analyze");
        return;
      }
      
      const parsedFormData = JSON.parse(storedFormData);
      const parsedResults = JSON.parse(storedResults);
      
      // Validate form data
      if (!parsedFormData.businessIdea) {
        setError("Business idea পাওয়া যায়নি। আবার চেষ্টা করুন।");
        return;
      }
      
      // Validate analysis structure
      if (!validateAnalysisData(parsedResults)) {
        setError("Analysis ডেটা সঠিকভাবে load হয়নি। আবার analyze করুন।");
        return;
      }
      
      setFormData(parsedFormData as BusinessFormData);
      setAnalysis(parsedResults as AnalysisResult);
    } catch (parseError) {
      console.error("Error parsing analysis data:", parseError);
      setError("ডেটা প্রসেস করতে সমস্যা হয়েছে। আবার analyze করুন।");
    }
  }, [navigate]);

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="section-container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-destructive/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">কিছু ভুল হয়েছে</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button variant="hero" asChild>
              <Link to="/analyze">
                আবার Analyze করুন
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!analysis || !formData) {
    return (
      <Layout>
        <div className="section-container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading analysis...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const showWebsiteSuggestion = analysis.websiteDecision.verdict !== "NOT NEEDED";

  return (
    <Layout>
      <div className="section-container py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-4">
            <CheckCircle2 className="h-4 w-4" />
            Analysis Complete
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">আপনার Business Analysis</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            "{formData.businessIdea.slice(0, 50)}..." এর জন্য complete execution guide
          </p>
        </div>

        {/* Results Grid */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Business Reality Check */}
          <div className="result-card animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="gradient-hero p-2 rounded-lg">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold">১. Business Reality Check</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-secondary/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Business Type</p>
                <p className="font-medium">{analysis.businessReality.type}</p>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Beginner Friendly?</p>
                <p className="font-medium">{analysis.businessReality.beginnerFriendly}</p>
              </div>
              <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
                <p className="text-sm text-warning mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> সবচেয়ে বড় Risk
                </p>
                <p className="font-medium text-sm">{analysis.businessReality.biggestRisk}</p>
              </div>
            </div>
          </div>

          {/* Product Decision */}
          <div className="result-card animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="gradient-hero p-2 rounded-lg">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold">২. Product / Service Decision</h2>
            </div>
            <div className="space-y-3">
              <div className="highlight-box">
                <p className="text-sm text-muted-foreground mb-1">Primary Recommendation</p>
                <p className="font-medium">{analysis.productDecision.primary}</p>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Backup Option</p>
                <p className="font-medium">{analysis.productDecision.backup}</p>
              </div>
              <p className="text-sm text-muted-foreground italic">
                💡 {analysis.productDecision.reasoning}
              </p>
            </div>
          </div>

          {/* Source Guide */}
          <div className="result-card animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="gradient-hero p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold">৩. Product Source Guide</h2>
            </div>
            <div className="space-y-3">
              <div className="bg-secondary/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">কোথা থেকে সংগ্রহ করবেন</p>
                <p className="font-medium">{analysis.sourceGuide.where}</p>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Cost Breakdown</p>
                <p className="font-medium">{analysis.sourceGuide.costBreakdown}</p>
              </div>
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                <p className="text-sm text-destructive mb-1 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> Common Mistake
                </p>
                <p className="font-medium text-sm">{analysis.sourceGuide.commonMistake}</p>
              </div>
            </div>
          </div>

          {/* Delivery Plan */}
          <div className="result-card animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="gradient-hero p-2 rounded-lg">
                <Truck className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold">৪. Delivery & Fulfillment Plan</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-secondary/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Delivery Method</p>
                <p className="font-medium">{analysis.deliveryPlan.method}</p>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <p className="font-medium">{analysis.deliveryPlan.payment}</p>
              </div>
            </div>
            <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg mt-4">
              <p className="text-sm text-warning mb-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Risk Warning
              </p>
              <p className="font-medium text-sm">{analysis.deliveryPlan.riskWarning}</p>
            </div>
          </div>

          {/* Website Decision - HIGHLIGHTED */}
          <div className="result-card animate-slide-up border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: "400ms" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="gradient-hero p-2 rounded-lg">
                <Globe className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold">৫. Website Decision Engine</h2>
              <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
                analysis.websiteDecision.verdict === "MUST" 
                  ? "bg-success/20 text-success" 
                  : analysis.websiteDecision.verdict === "OPTIONAL"
                  ? "bg-warning/20 text-warning"
                  : "bg-muted text-muted-foreground"
              }`}>
                {analysis.websiteDecision.verdict}
              </span>
            </div>
            <div className="highlight-box mb-4">
              <p className="font-medium">{analysis.websiteDecision.explanation}</p>
            </div>
            {analysis.websiteDecision.websiteType && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Recommended Type</p>
                  <p className="font-medium">{analysis.websiteDecision.websiteType}</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Features</p>
                  <ul className="space-y-1">
                    {analysis.websiteDecision.features?.map((f, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-success" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <p className="text-sm text-destructive mt-4 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              <span className="font-medium">যা বানাবেন না:</span> {analysis.websiteDecision.notToBuild}
            </p>
          </div>

          {/* Marketing Plan */}
          <div className="result-card animate-slide-up" style={{ animationDelay: "500ms" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="gradient-hero p-2 rounded-lg">
                <Megaphone className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold">৬. Marketing & First Customer Plan</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">প্রথম ১০ Customer পাওয়ার উপায়:</p>
                <ul className="space-y-2">
                  {analysis.marketingPlan.first10Customers.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">কোথায় Market করবেন</p>
                  <p className="font-medium">{analysis.marketingPlan.whereToMarket}</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">কি বলবেন</p>
                  <p className="font-medium">{analysis.marketingPlan.whatToSay}</p>
                </div>
              </div>
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                <p className="text-sm text-destructive mb-1 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> যা করবেন না
                </p>
                <p className="font-medium text-sm">{analysis.marketingPlan.whatNotToDo}</p>
              </div>
            </div>
          </div>

          {/* 14-Day Action Plan */}
          <div className="result-card animate-slide-up" style={{ animationDelay: "600ms" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="gradient-hero p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold">৭. 14-Day Action Plan</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                <p className="font-semibold text-primary mb-1">Day 1-3</p>
                <p>{analysis.actionPlan.day1to3}</p>
              </div>
              <div className="bg-primary/5 border-l-4 border-primary/70 p-4 rounded-r-lg">
                <p className="font-semibold text-primary mb-1">Day 4-7</p>
                <p>{analysis.actionPlan.day4to7}</p>
              </div>
              <div className="bg-primary/5 border-l-4 border-primary/50 p-4 rounded-r-lg">
                <p className="font-semibold text-primary mb-1">Day 8-14</p>
                <p>{analysis.actionPlan.day8to14}</p>
              </div>
            </div>
          </div>

          {/* Failure Warning */}
          <div className="result-card animate-slide-up border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent" style={{ animationDelay: "700ms" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-destructive p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
              </div>
              <h2 className="text-xl font-semibold">৮. Failure Warning</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-destructive/10 p-4 rounded-lg">
                <p className="text-sm text-destructive font-medium mb-1">যেখানে বেশিরভাগ মানুষ Fail করে</p>
                <p>{analysis.failureWarning.whereFailOccurs}</p>
              </div>
              <div className="bg-destructive/10 p-4 rounded-lg">
                <p className="text-sm text-destructive font-medium mb-1">যে ভুলে টাকা লস হয়</p>
                <p>{analysis.failureWarning.moneyLossMistake}</p>
              </div>
            </div>
          </div>

          {/* NEW SECTIONS - Market Demand Analysis */}
          {analysis.marketDemand && (
            <div className="result-card animate-slide-up" style={{ animationDelay: "800ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="gradient-hero p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-semibold">৯. Market Demand Analysis</h2>
              </div>
              <div className="space-y-3">
                <div className="highlight-box">
                  <p className="text-sm text-muted-foreground mb-1">চাহিদার মাত্রা</p>
                  <p className="font-medium">{analysis.marketDemand.demandLevel}</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Trend Analysis</p>
                  <p className="font-medium">{analysis.marketDemand.trendAnalysis}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Seasonal Pattern</p>
                    <p className="font-medium">{analysis.marketDemand.seasonalPattern}</p>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Target Audience Size</p>
                    <p className="font-medium">{analysis.marketDemand.targetAudienceSize}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Competitor Analysis */}
          {analysis.competitorAnalysis && (
            <div className="result-card animate-slide-up" style={{ animationDelay: "900ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="gradient-hero p-2 rounded-lg">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-semibold">১০. Competitor Analysis</h2>
                <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
                  analysis.competitorAnalysis.saturationLevel.toLowerCase().includes("high")
                    ? "bg-destructive/20 text-destructive"
                    : analysis.competitorAnalysis.saturationLevel.toLowerCase().includes("medium")
                    ? "bg-warning/20 text-warning"
                    : "bg-success/20 text-success"
                }`}>
                  Saturation: {analysis.competitorAnalysis.saturationLevel.split("-")[0].trim()}
                </span>
              </div>
              <div className="space-y-3">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">মূল প্রতিযোগী</p>
                  <p className="font-medium">{analysis.competitorAnalysis.mainCompetitors}</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">তাদের Pricing</p>
                  <p className="font-medium">{analysis.competitorAnalysis.theirPricing}</p>
                </div>
                <div className="highlight-box">
                  <p className="text-sm text-muted-foreground mb-1">তাদের দুর্বলতা (আপনার সুযোগ)</p>
                  <p className="font-medium">{analysis.competitorAnalysis.theirWeakness}</p>
                </div>
              </div>
            </div>
          )}

          {/* Monetization Strategies */}
          {analysis.monetizationStrategies && (
            <div className="result-card animate-slide-up" style={{ animationDelay: "1000ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="gradient-hero p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-semibold">১১. Monetization Strategies</h2>
              </div>
              <div className="space-y-3">
                <div className="highlight-box">
                  <p className="text-sm text-muted-foreground mb-1">Revenue Model</p>
                  <p className="font-medium">{analysis.monetizationStrategies.revenueModel}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                    <p className="text-sm text-success mb-1">Pricing Recommendation</p>
                    <p className="font-medium">{analysis.monetizationStrategies.pricingRecommendation}</p>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Break-even Timeline</p>
                    <p className="font-medium">{analysis.monetizationStrategies.breakEvenTimeline}</p>
                  </div>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Upsell / Cross-sell</p>
                  <p className="font-medium">{analysis.monetizationStrategies.upsellOpportunities}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reality Score - HIGHLIGHTED */}
          {analysis.realityScore && (
            <div className="result-card animate-slide-up border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent" style={{ animationDelay: "1100ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="gradient-hero p-2 rounded-lg">
                  <Gauge className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-semibold">১২. Reality Score (Harsh & Honest)</h2>
              </div>
              
              {/* Overall Score */}
              <div className={`p-6 rounded-xl mb-6 border ${getScoreBgColor(analysis.realityScore.overall)}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold">Overall Viability</span>
                  <span className={`text-4xl font-bold ${getScoreColor(analysis.realityScore.overall)}`}>
                    {analysis.realityScore.overall}/10
                  </span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${getScoreBarColor(analysis.realityScore.overall)}`}
                    style={{ width: `${analysis.realityScore.overall * 10}%` }}
                  />
                </div>
              </div>

              {/* Category Scores */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Market Demand</span>
                    <span className={`font-bold ${getScoreColor(analysis.realityScore.market)}`}>
                      {analysis.realityScore.market}/10
                    </span>
                  </div>
                  <Progress value={analysis.realityScore.market * 10} className="h-2" />
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Competition Level</span>
                    <span className={`font-bold ${getScoreColor(analysis.realityScore.competition)}`}>
                      {analysis.realityScore.competition}/10
                    </span>
                  </div>
                  <Progress value={analysis.realityScore.competition * 10} className="h-2" />
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Execution Ease</span>
                    <span className={`font-bold ${getScoreColor(analysis.realityScore.executionDifficulty)}`}>
                      {analysis.realityScore.executionDifficulty}/10
                    </span>
                  </div>
                  <Progress value={analysis.realityScore.executionDifficulty * 10} className="h-2" />
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Profit Potential</span>
                    <span className={`font-bold ${getScoreColor(analysis.realityScore.profitPotential)}`}>
                      {analysis.realityScore.profitPotential}/10
                    </span>
                  </div>
                  <Progress value={analysis.realityScore.profitPotential * 10} className="h-2" />
                </div>
              </div>

              {/* Verdict */}
              <div className={`p-4 rounded-lg border ${getScoreBgColor(analysis.realityScore.overall)}`}>
                <p className={`font-semibold mb-1 ${getScoreColor(analysis.realityScore.overall)}`}>
                  সৎ মতামত (Harsh Verdict)
                </p>
                <p className="font-medium">{analysis.realityScore.verdict}</p>
              </div>
            </div>
          )}

          {/* Differentiator Engine */}
          {analysis.differentiatorEngine && (
            <div className="result-card animate-slide-up border-2 border-success/20 bg-gradient-to-br from-success/5 to-transparent" style={{ animationDelay: "1200ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-success p-2 rounded-lg">
                  <Sparkles className="h-5 w-5 text-success-foreground" />
                </div>
                <h2 className="text-xl font-semibold">১৩. Differentiator Engine</h2>
              </div>
              <div className="space-y-4">
                <div className="highlight-box">
                  <p className="text-sm text-muted-foreground mb-1">আপনার Unique Selling Point</p>
                  <p className="font-medium text-lg">{analysis.differentiatorEngine.uniqueSellingPoint}</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">কিভাবে আলাদা হবেন</p>
                  <p className="font-medium">{analysis.differentiatorEngine.howToBeDifferent}</p>
                </div>
                <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                  <p className="text-sm text-success mb-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Marketing এ Emphasize করুন
                  </p>
                  <p className="font-medium">{analysis.differentiatorEngine.marketingEmphasis}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {showWebsiteSuggestion && (
              <Button variant="hero" size="lg" className="flex-1" asChild>
                <Link to="/website-suggestion">
                  <Globe className="h-5 w-5" />
                  Website Solution দেখুন
                </Link>
              </Button>
            )}
            <Button variant="secondary" size="lg" asChild>
              <Link to="/analyze">
                নতুন Idea Analyze করুন
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Branding Footer */}
          <div className="text-center pt-8 border-t border-border mt-8">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">SA Coder</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultsPage;
