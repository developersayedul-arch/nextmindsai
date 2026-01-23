import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  History, 
  Loader2, 
  Calendar, 
  ArrowRight, 
  Trash2,
  Crown,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface Analysis {
  id: string;
  business_idea: string;
  business_type: string;
  budget_range: string;
  is_paid: boolean;
  created_at: string;
  results: any;
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchAnalyses();
    }
  }, [user, authLoading, navigate]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error("Error fetching analyses:", error);
      toast.error("Analysis history load করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase
        .from("analyses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setAnalyses(analyses.filter(a => a.id !== id));
      toast.success("Analysis মুছে ফেলা হয়েছে");
    } catch (error) {
      console.error("Error deleting analysis:", error);
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  const viewAnalysis = (analysis: Analysis) => {
    // Store the analysis data and navigate to results
    sessionStorage.setItem("businessFormData", JSON.stringify({
      businessIdea: analysis.business_idea,
      businessType: analysis.business_type,
      budgetRange: analysis.budget_range,
      location: ""
    }));
    sessionStorage.setItem("analysisResults", JSON.stringify(analysis.results));
    sessionStorage.setItem("analysisId", analysis.id);
    navigate("/results");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getBudgetLabel = (range: string) => {
    const labels: Record<string, string> = {
      "under10k": "৳10,000 এর নিচে",
      "10k-50k": "৳10,000 - ৳50,000",
      "above50k": "৳50,000+"
    };
    return labels[range] || range;
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-container py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="gradient-hero w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-3">আপনার Analysis History</h1>
            <p className="text-muted-foreground">
              আপনার সব business analysis এখানে save আছে
            </p>
          </div>

          {analyses.length === 0 ? (
            <div className="text-center py-16 bg-secondary/30 rounded-2xl">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">কোন Analysis নেই</h3>
              <p className="text-muted-foreground mb-6">
                আপনার প্রথম business idea analyze করুন
              </p>
              <Button variant="hero" asChild>
                <Link to="/analyze">
                  নতুন Analysis শুরু করুন
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {analysis.is_paid && (
                          <span className="bg-warning/20 text-warning px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                            <Crown className="h-3 w-3" /> Premium
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(analysis.created_at)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                        {analysis.business_idea}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="bg-secondary px-2 py-0.5 rounded">
                          {analysis.business_type === "online" ? "Online" : 
                           analysis.business_type === "offline" ? "Offline" : "Both"}
                        </span>
                        <span className="bg-secondary px-2 py-0.5 rounded">
                          {getBudgetLabel(analysis.budget_range)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => viewAnalysis(analysis)}
                      >
                        দেখুন
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => deleteAnalysis(analysis.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {analyses.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="hero" size="lg" asChild>
                <Link to="/analyze">
                  নতুন Analysis শুরু করুন
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}

          {/* Trust Footer */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">SA Coder</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HistoryPage;
