import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { BusinessFormData } from "./AnalyzePage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Download,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  FileText
} from "lucide-react";

// Mock AI response generator
const generateMockAnalysis = (data: BusinessFormData) => {
  const isOnline = data.businessType === "online" || data.businessType === "both";
  const lowBudget = data.budgetRange === "under10k";
  
  return {
    businessReality: {
      type: isOnline ? "Product (Online-focused)" : "Product (Offline-focused)",
      beginnerFriendly: lowBudget ? "হ্যাঁ, beginner-friendly" : "মাঝারি — কিছু অভিজ্ঞতা দরকার",
      biggestRisk: "Initial investment recover না হওয়া এবং stock unsold থাকা"
    },
    productDecision: {
      primary: "ঘরে তৈরি আচার — Mango Pickle দিয়ে শুরু করুন",
      backup: "Ready-made packaging এ resell করুন যদি production handle না হয়",
      reasoning: "Homemade food এ trust বেশি, margin ভালো, capital কম লাগে"
    },
    sourceGuide: {
      where: "কাঁচামাল: কারওয়ান বাজার, নিউমার্কেট। Packaging: চকবাজার",
      costBreakdown: "Product: ৳50, Packaging: ৳20, Delivery: ৳60-120, Margin: ৳50-100",
      commonMistake: "বেশি variety দিয়ে শুরু করা — ১টা product দিয়ে শুরু করুন"
    },
    deliveryPlan: {
      method: "Pathao/Steadfast — ঢাকার ভিতরে। বাইরে Sundarban/SA Paribahan",
      payment: "COD recommended শুরুতে — trust build করতে হবে",
      riskWarning: "COD return হলে delivery charge গুনতে হবে — ৳60-120 loss per return"
    },
    websiteDecision: {
      verdict: isOnline && !lowBudget ? "OPTIONAL" : "NOT NEEDED",
      explanation: lowBudget 
        ? "এই budget-এ website unnecessary expense। Facebook/Instagram page দিয়ে শুরু করুন। Website-এর maintenance cost আছে যা এখন দরকার নেই।"
        : "Website থাকলে professional দেখায়, কিন্তু শুরুতে Facebook page-ই যথেষ্ট। ৬ মাস পর consider করুন।",
      websiteType: isOnline && !lowBudget ? "Landing Page with Order Form" : null,
      features: isOnline && !lowBudget ? ["Product showcase", "Order form", "WhatsApp integration"] : null,
      notToBuild: "Full ecommerce with payment gateway — এখন unnecessary"
    },
    marketingPlan: {
      first10Customers: [
        "নিজের Facebook/WhatsApp contact list-এ post করুন",
        "Local Facebook groups-এ join করুন",
        "প্রথম ৫ জনকে discount দিন review এর জন্য",
        "Instagram Reels বানান — product making process দেখান"
      ],
      whereToMarket: "Facebook Groups, Instagram, WhatsApp Status",
      whatToSay: "ঘরে তৈরি, preservative-free, গ্রামের স্বাদ — এই angle use করুন",
      whatNotToDo: "Paid ads এখনই দেবেন না — organic দিয়ে validate করুন"
    },
    actionPlan: {
      day1to3: "Recipe finalize, packaging source করুন, ১০টা sample বানান",
      day4to7: "Friends/family কে taste করান, feedback নিন, price fix করুন",
      day8to14: "Facebook page create, first 10 posts schedule, order নেওয়া শুরু করুন"
    },
    failureWarning: {
      whereFailOccurs: "Marketing-এ consistency না রাখা — ২ সপ্তাহ পর হাল ছেড়ে দেওয়া",
      moneyLossMistake: "বেশি stock করে ফেলা আগেই — demand বুঝে slowly scale করুন"
    }
  };
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BusinessFormData | null>(null);
  const [analysis, setAnalysis] = useState<ReturnType<typeof generateMockAnalysis> | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("businessFormData");
    if (!storedData) {
      navigate("/analyze");
      return;
    }
    
    const data = JSON.parse(storedData) as BusinessFormData;
    setFormData(data);
    setAnalysis(generateMockAnalysis(data));
  }, [navigate]);

  if (!analysis || !formData) {
    return null;
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {showWebsiteSuggestion && (
              <Button variant="hero" size="lg" className="flex-1" asChild>
                <Link to="/website-suggestion">
                  <Globe className="h-5 w-5" />
                  Website Solution দেখুন
                </Link>
              </Button>
            )}
            <Button variant="default" size="lg" className="flex-1" asChild>
              <Link to="/download">
                <Download className="h-5 w-5" />
                PDF Download করুন
              </Link>
            </Button>
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
              Powered by <span className="font-semibold text-foreground">SA Coder</span> | 
              Developed & Secured by <span className="font-semibold text-foreground">SA Coder</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultsPage;
