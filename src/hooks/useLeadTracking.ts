import { supabase } from "@/integrations/supabase/client";

interface LeadData {
  whatsapp_number?: string;
  business_idea?: string;
  business_type?: string;
  budget_range?: string;
  location?: string;
  form_step?: string;
  is_completed?: boolean;
  user_id?: string;
}

export const useLeadTracking = () => {
  const getSessionId = () => sessionStorage.getItem("visitor_session_id") || "";
  const getVisitorId = () => sessionStorage.getItem("visitor_id") || null;

  const trackLead = async (data: LeadData) => {
    const sessionId = getSessionId();
    const visitorId = getVisitorId();

    try {
      // Check if lead exists for this session
      const { data: existingLead } = await supabase
        .from("leads")
        .select("id")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (existingLead) {
        // Update existing lead
        await supabase
          .from("leads")
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingLead.id);
      } else {
        // Create new lead
        await supabase
          .from("leads")
          .insert({
            session_id: sessionId,
            visitor_id: visitorId,
            ...data
          });
      }
    } catch (err) {
      console.error("Error tracking lead:", err);
    }
  };

  const markLeadCompleted = async (userId?: string) => {
    const sessionId = getSessionId();
    
    try {
      await supabase
        .from("leads")
        .update({
          is_completed: true,
          user_id: userId || null,
          updated_at: new Date().toISOString()
        })
        .eq("session_id", sessionId);
    } catch (err) {
      console.error("Error marking lead completed:", err);
    }
  };

  return { trackLead, markLeadCompleted };
};
