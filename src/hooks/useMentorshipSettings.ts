import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MentorshipSettings {
  is_enabled: boolean;
  coming_soon_message: string | null;
}

interface SessionType {
  id: string;
  session_key: string;
  label_bn: string;
  description_bn: string | null;
  price: number;
  duration_minutes: number;
  display_order: number;
  is_active: boolean;
  icon_name: string | null;
}

export const useMentorshipSettings = () => {
  const [settings, setSettings] = useState<MentorshipSettings | null>(null);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, typesRes] = await Promise.all([
          supabase.from("mentorship_settings").select("is_enabled, coming_soon_message").limit(1).maybeSingle(),
          supabase.from("mentorship_session_types").select("*").eq("is_active", true).order("display_order")
        ]);

        if (settingsRes.data) {
          setSettings(settingsRes.data);
        }
        setSessionTypes(typesRes.data || []);
      } catch (err) {
        console.error("Error fetching mentorship settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { settings, sessionTypes, loading };
};
