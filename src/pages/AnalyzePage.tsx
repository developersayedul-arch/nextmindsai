import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLeadTracking } from "@/hooks/useLeadTracking";
import { useAnonymousTracking } from "@/hooks/useAnonymousTracking";
import { useAnalysisLimit } from "@/hooks/useAnalysisLimit";
import { Sparkles, ArrowRight, Loader2, Lock, Crown } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

export interface BusinessFormData {
  businessIdea: string;
  businessType: "online" | "offline" | "both";
  budgetRange: "under10k" | "10k-50k" | "above50k";
  location: string;
  whatsappNumber: string;
}

// Validate Bangladesh WhatsApp number format
const validateWhatsAppNumber = (number: string): boolean => {
  // Remove spaces and dashes
  const cleaned = number.replace(/[\s-]/g, '');
  // Bangladesh number: starts with 01, followed by 9 digits OR +880 followed by 10 digits
  const bdPattern = /^(01[3-9]\d{8}|(\+?880)?1[3-9]\d{8})$/;
  return bdPattern.test(cleaned);
};

const AnalyzePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trackLead, markLeadCompleted } = useLeadTracking();
  const { 
    trackFormStart, 
    trackBusinessType, 
    trackBusinessIdea, 
    trackBudget, 
    trackLocation, 
    trackWhatsApp,
    markAsCompleted 
  } = useAnonymousTracking();
  const {
    canAnalyze,
    remainingFreeAnalyses,
    needsSubscription,
    hasActiveSubscription,
    isLoading: limitLoading,
    freeLimit
  } = useAnalysisLimit();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BusinessFormData>({
    businessIdea: "",
    businessType: "online",
    budgetRange: "under10k",
    location: "",
    whatsappNumber: ""
  });
  const [whatsappError, setWhatsappError] = useState<string>("");

  // Track form interactions for lead capture and anonymous tracking
  useEffect(() => {
    trackLead({ form_step: "started" });
    trackFormStart();
  }, [trackFormStart]);

  // Track when user fills in WhatsApp number
  const handleWhatsAppChange = (value: string) => {
    setFormData({ ...formData, whatsappNumber: value });
    if (whatsappError) setWhatsappError("");
    
    if (value.length >= 11) {
      trackLead({ 
        whatsapp_number: value,
        form_step: "whatsapp_entered"
      });
      trackWhatsApp(value);
    }
  };

  // Track when user fills in business idea
  const handleBusinessIdeaChange = (value: string) => {
    setFormData({ ...formData, businessIdea: value });
    
    if (value.length > 20) {
      trackLead({ 
        business_idea: value,
        form_step: "idea_entered"
      });
      trackBusinessIdea(value);
    }
  };

  // Track business type change
  const handleBusinessTypeChange = (value: "online" | "offline" | "both") => {
    setFormData({ ...formData, businessType: value });
    trackBusinessType(value);
  };

  // Track budget change
  const handleBudgetChange = (value: "under10k" | "10k-50k" | "above50k") => {
    setFormData({ ...formData, budgetRange: value });
    trackBudget(value);
  };

  // Track location change
  const handleLocationChange = (value: string) => {
    setFormData({ ...formData, location: value });
    if (value.length > 2) {
      trackLocation(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate WhatsApp number
    if (!formData.whatsappNumber.trim()) {
      setWhatsappError("WhatsApp নম্বর দিতে হবে");
      return;
    }
    
    if (!validateWhatsAppNumber(formData.whatsappNumber)) {
      setWhatsappError("সঠিক বাংলাদেশী WhatsApp নম্বর দিন (যেমন: 01712345678)");
      return;
    }
    
    setWhatsappError("");
    
    if (!formData.businessIdea.trim()) return;

    // Track full form data
    trackLead({
      whatsapp_number: formData.whatsappNumber,
      business_idea: formData.businessIdea,
      business_type: formData.businessType,
      budget_range: formData.budgetRange,
      location: formData.location || undefined,
      form_step: "submitting"
    });

    setIsLoading(true);

    try {
      // Call the AI edge function
      const { data, error } = await supabase.functions.invoke("analyze-business", {
        body: {
          businessIdea: formData.businessIdea,
          businessType: formData.businessType,
          budgetRange: formData.budgetRange,
          location: formData.location
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      // Store form data and results
      sessionStorage.setItem("businessFormData", JSON.stringify(formData));
      sessionStorage.setItem("analysisResults", JSON.stringify(data.analysis));

      // Save to database if user is logged in
      if (user) {
        const { data: analysisRecord, error: dbError } = await supabase
          .from("analyses")
          .insert({
            user_id: user.id,
            business_idea: formData.businessIdea,
            business_type: formData.businessType,
            budget_range: formData.budgetRange,
            location: formData.location || null,
            whatsapp_number: formData.whatsappNumber,
            results: data.analysis,
            is_paid: false
          })
          .select()
          .single();

        if (!dbError && analysisRecord) {
          sessionStorage.setItem("analysisId", analysisRecord.id);
        }

        // Mark lead as completed
        markLeadCompleted(user.id);
        markAsCompleted(user.id);
      } else {
        // Mark lead as completed even without user
        markLeadCompleted();
        markAsCompleted();
      }

      navigate("/results");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Analysis করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  // Show subscription required message if user has exhausted free analyses
  if (needsSubscription) {
    return (
      <Layout>
        <div className="section-container py-12 md:py-20">
          <div className="max-w-2xl mx-auto">
            <Card className="border-primary/20">
              <CardContent className="pt-8 pb-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Lock className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">Free Analysis শেষ হয়ে গেছে!</h1>
                  <p className="text-muted-foreground">
                    আপনি ইতিমধ্যে {freeLimit}টি ফ্রি analysis ব্যবহার করেছেন।
                    আরও analysis করতে subscription নিন।
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Crown className="h-5 w-5" />
                    <span className="font-semibold">Premium Subscription</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Unlimited analysis + Full Report Access + Priority Support
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="hero" size="lg">
                    <Link to="/pricing">
                      <Crown className="h-5 w-5 mr-2" />
                      Subscription নিন
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/history">
                      আগের Analysis দেখুন
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-container py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="gradient-hero w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Business Idea Analyze করুন</h1>
            <p className="text-muted-foreground">
              আপনার idea সম্পর্কে বিস্তারিত লিখুন — আমরা honest, practical analysis দেব
            </p>
            
            {/* Free analysis counter for logged in users */}
            {user && !hasActiveSubscription && (
              <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Free Analysis বাকি: {remainingFreeAnalyses}/{freeLimit}
              </div>
            )}
            
            {user && hasActiveSubscription && (
              <div className="mt-4 inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                <Crown className="h-4 w-4" />
                Premium Subscriber — Unlimited Analysis
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="businessIdea" className="text-base font-medium">
                আপনার Business Idea <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="businessIdea"
                placeholder="উদাহরণ: আমি অনলাইনে ঘরে তৈরি আচার বিক্রি করতে চাই। ঢাকার বাইরে delivery দিতে চাই..."
                className="min-h-[150px] text-base"
                value={formData.businessIdea}
                onChange={(e) => handleBusinessIdeaChange(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                যত বিস্তারিত লিখবেন, তত ভালো analysis পাবেন
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Business Type</Label>
              <RadioGroup
                value={formData.businessType}
                onValueChange={handleBusinessTypeChange}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { value: "online", label: "Online" },
                  { value: "offline", label: "Offline" },
                  { value: "both", label: "Both" }
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.businessType === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                    <span className="font-medium">{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Budget Range</Label>
              <RadioGroup
                value={formData.budgetRange}
                onValueChange={handleBudgetChange}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {[
                  { value: "under10k", label: "৳10,000 এর নিচে" },
                  { value: "10k-50k", label: "৳10,000 - ৳50,000" },
                  { value: "above50k", label: "৳50,000+" }
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`budget-${option.value}`}
                    className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.budgetRange === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={`budget-${option.value}`} className="sr-only" />
                    <span className="font-medium">{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label htmlFor="whatsappNumber" className="text-base font-medium">
                WhatsApp নম্বর <span className="text-destructive">*</span>
              </Label>
              <Input
                id="whatsappNumber"
                placeholder="যেমন: 01712345678"
                value={formData.whatsappNumber}
                onChange={(e) => handleWhatsAppChange(e.target.value)}
                className={whatsappError ? "border-destructive" : ""}
                required
              />
              {whatsappError && (
                <p className="text-sm text-destructive">{whatsappError}</p>
              )}
              <p className="text-sm text-muted-foreground">
                আপনার WhatsApp নম্বর দিন যেখানে আমরা যোগাযোগ করতে পারি
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="location" className="text-base font-medium">
                Location <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="location"
                placeholder="যেমন: ঢাকা, চট্টগ্রাম, রাজশাহী..."
                value={formData.location}
                onChange={(e) => handleLocationChange(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              size="xl" 
              className="w-full"
              disabled={!formData.businessIdea.trim() || !formData.whatsappNumber.trim() || isLoading || limitLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  AI Analyzing... (30-60 সেকেন্ড)
                </>
              ) : (
                <>
                  Analyze করুন
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Powered by <span className="font-semibold">SA Coder</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyzePage;
