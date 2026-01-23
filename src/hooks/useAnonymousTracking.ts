import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AnonymousAnalysisData {
  business_type?: string;
  business_idea?: string;
  budget_range?: string;
  location?: string;
  whatsapp_number?: string;
  form_step?: string;
}

export const useAnonymousTracking = () => {
  const sessionId = useRef<string>(
    localStorage.getItem("anonymous_session_id") || 
    `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  );
  const recordId = useRef<string | null>(null);

  // Save session ID to localStorage
  if (!localStorage.getItem("anonymous_session_id")) {
    localStorage.setItem("anonymous_session_id", sessionId.current);
  }

  const getVisitorId = (): string | null => {
    return localStorage.getItem("visitor_id") || null;
  };

  const trackFormStart = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("anonymous_analyses")
        .insert({
          session_id: sessionId.current,
          visitor_id: getVisitorId(),
          form_step: "started",
          user_agent: navigator.userAgent
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error tracking form start:", error);
        return;
      }

      recordId.current = data.id;
    } catch (err) {
      console.error("Error in trackFormStart:", err);
    }
  }, []);

  const updateTracking = useCallback(async (data: AnonymousAnalysisData) => {
    if (!recordId.current) {
      // If no record exists, create one first
      await trackFormStart();
    }

    if (!recordId.current) return;

    try {
      await supabase
        .from("anonymous_analyses")
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq("id", recordId.current);
    } catch (err) {
      console.error("Error updating tracking:", err);
    }
  }, [trackFormStart]);

  const trackBusinessType = useCallback((businessType: string) => {
    updateTracking({ 
      business_type: businessType, 
      form_step: "business_type" 
    });
  }, [updateTracking]);

  const trackBusinessIdea = useCallback((businessIdea: string) => {
    updateTracking({ 
      business_idea: businessIdea, 
      form_step: "business_idea" 
    });
  }, [updateTracking]);

  const trackBudget = useCallback((budget: string) => {
    updateTracking({ 
      budget_range: budget, 
      form_step: "budget" 
    });
  }, [updateTracking]);

  const trackLocation = useCallback((location: string) => {
    updateTracking({ 
      location: location, 
      form_step: "location" 
    });
  }, [updateTracking]);

  const trackWhatsApp = useCallback((whatsapp: string) => {
    updateTracking({ 
      whatsapp_number: whatsapp, 
      form_step: "whatsapp" 
    });
  }, [updateTracking]);

  const markAsCompleted = useCallback(async (userId?: string) => {
    if (!recordId.current) return;

    try {
      await supabase
        .from("anonymous_analyses")
        .update({
          form_step: "completed",
          converted_to_user: !!userId,
          converted_user_id: userId || null,
          converted_at: userId ? new Date().toISOString() : null
        })
        .eq("id", recordId.current);
    } catch (err) {
      console.error("Error marking as completed:", err);
    }
  }, []);

  return {
    sessionId: sessionId.current,
    trackFormStart,
    trackBusinessType,
    trackBusinessIdea,
    trackBudget,
    trackLocation,
    trackWhatsApp,
    markAsCompleted
  };
};