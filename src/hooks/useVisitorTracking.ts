import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const generateSessionId = () => {
  const existing = sessionStorage.getItem("visitor_session_id");
  if (existing) return existing;
  
  const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem("visitor_session_id", newId);
  return newId;
};

const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  
  // Device type
  let deviceType = "desktop";
  if (/Mobi|Android/i.test(ua)) deviceType = "mobile";
  else if (/Tablet|iPad/i.test(ua)) deviceType = "tablet";
  
  // Browser
  let browser = "unknown";
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = "Chrome";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
  else if (/Edg/i.test(ua)) browser = "Edge";
  else if (/MSIE|Trident/i.test(ua)) browser = "IE";
  
  // OS
  let os = "unknown";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iOS|iPhone|iPad/i.test(ua)) os = "iOS";
  
  return { deviceType, browser, os, userAgent: ua };
};

export const useVisitorTracking = () => {
  const location = useLocation();
  const visitorIdRef = useRef<string | null>(null);
  const pageStartTimeRef = useRef<number>(Date.now());
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    const initVisitor = async () => {
      const sessionId = generateSessionId();
      const existingVisitorId = sessionStorage.getItem("visitor_id");
      
      if (existingVisitorId) {
        visitorIdRef.current = existingVisitorId;
        return;
      }

      const { deviceType, browser, os, userAgent } = getDeviceInfo();
      
      try {
        const { data, error } = await supabase
          .from("visitors")
          .insert({
            session_id: sessionId,
            user_agent: userAgent,
            device_type: deviceType,
            browser,
            os,
            referrer: document.referrer || null,
            landing_page: window.location.pathname
          })
          .select("id")
          .single();

        if (!error && data) {
          visitorIdRef.current = data.id;
          sessionStorage.setItem("visitor_id", data.id);
        }
      } catch (err) {
        console.error("Error tracking visitor:", err);
      }
    };

    initVisitor();
  }, []);

  useEffect(() => {
    const trackPageView = async () => {
      if (location.pathname === lastPathRef.current) return;
      
      const sessionId = generateSessionId();
      
      // Track duration of previous page
      if (lastPathRef.current && visitorIdRef.current) {
        const duration = Math.round((Date.now() - pageStartTimeRef.current) / 1000);
        
        // Update last page view with duration (optional - could be expensive)
      }
      
      lastPathRef.current = location.pathname;
      pageStartTimeRef.current = Date.now();

      try {
        await supabase
          .from("page_views")
          .insert({
            visitor_id: visitorIdRef.current || null,
            session_id: sessionId,
            page_path: location.pathname,
            page_title: document.title
          });
      } catch (err) {
        console.error("Error tracking page view:", err);
      }
    };

    // Small delay to ensure visitor is created first
    const timeout = setTimeout(trackPageView, 100);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return { sessionId: generateSessionId() };
};
