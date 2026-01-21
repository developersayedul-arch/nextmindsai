import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface BusinessFormData {
  businessIdea: string;
  businessType: "online" | "offline" | "both";
  budgetRange: "under10k" | "10k-50k" | "above50k";
  location: string;
}

const AnalyzePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BusinessFormData>({
    businessIdea: "",
    businessType: "online",
    budgetRange: "under10k",
    location: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessIdea.trim()) return;

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
            results: data.analysis,
            is_paid: false
          })
          .select()
          .single();

        if (!dbError && analysisRecord) {
          sessionStorage.setItem("analysisId", analysisRecord.id);
        }
      }

      navigate("/results");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Analysis করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

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
                onChange={(e) => setFormData({ ...formData, businessIdea: e.target.value })}
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
                onValueChange={(value: "online" | "offline" | "both") => 
                  setFormData({ ...formData, businessType: value })
                }
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
                onValueChange={(value: "under10k" | "10k-50k" | "above50k") => 
                  setFormData({ ...formData, budgetRange: value })
                }
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
              <Label htmlFor="location" className="text-base font-medium">
                Location <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="location"
                placeholder="যেমন: ঢাকা, চট্টগ্রাম, রাজশাহী..."
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              size="xl" 
              className="w-full"
              disabled={!formData.businessIdea.trim() || isLoading}
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
            Powered by <span className="font-semibold">SA Coder</span> • 
            Developed & Secured by <span className="font-semibold">SA Coder</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyzePage;
