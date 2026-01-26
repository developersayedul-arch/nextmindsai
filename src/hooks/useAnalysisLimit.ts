import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const FREE_ANALYSIS_LIMIT = 3;

export const useAnalysisLimit = () => {
  const { user } = useAuth();
  const [analysisCount, setAnalysisCount] = useState<number>(0);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch analysis count for user
        const { count, error: countError } = await supabase
          .from("analyses")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (countError) {
          console.error("Error fetching analysis count:", countError);
        } else {
          setAnalysisCount(count || 0);
        }

        // Check for active subscription
        const { data: subscriptions, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .gte("expires_at", new Date().toISOString());

        if (subError) {
          console.error("Error fetching subscriptions:", subError);
        } else {
          setHasActiveSubscription((subscriptions?.length || 0) > 0);
        }
      } catch (err) {
        console.error("Error in useAnalysisLimit:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const canAnalyze = !user || analysisCount < FREE_ANALYSIS_LIMIT || hasActiveSubscription;
  const remainingFreeAnalyses = Math.max(0, FREE_ANALYSIS_LIMIT - analysisCount);
  const needsSubscription = user && analysisCount >= FREE_ANALYSIS_LIMIT && !hasActiveSubscription;

  return {
    analysisCount,
    hasActiveSubscription,
    canAnalyze,
    remainingFreeAnalyses,
    needsSubscription,
    isLoading,
    freeLimit: FREE_ANALYSIS_LIMIT
  };
};
