import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertTriangle,
  Lock,
  Mail
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("সঠিক email দিন"),
  password: z.string().min(6, "Password কমপক্ষে ৬ অক্ষর হতে হবে")
});

const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  
  let deviceType = "desktop";
  if (/Mobi|Android/i.test(ua)) deviceType = "mobile";
  else if (/Tablet|iPad/i.test(ua)) deviceType = "tablet";
  
  let browser = "unknown";
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = "Chrome";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
  else if (/Edg/i.test(ua)) browser = "Edge";
  
  let os = "unknown";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iOS|iPhone|iPad/i.test(ua)) os = "iOS";
  
  return { deviceType, browser, os, userAgent: ua };
};

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  const logLoginAttempt = async (
    attemptEmail: string, 
    success: boolean, 
    failureReason?: string
  ) => {
    const { deviceType, browser, os, userAgent } = getDeviceInfo();
    
    try {
      await supabase.from("admin_login_attempts").insert({
        email: attemptEmail,
        success,
        user_agent: userAgent,
        device_type: deviceType,
        browser,
        os,
        failure_reason: failureReason || null
      });
    } catch (err) {
      console.error("Failed to log login attempt:", err);
    }
  };

  const checkRateLimit = async (attemptEmail: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc("check_admin_rate_limit", {
        _email: attemptEmail
      });
      
      if (error) {
        console.error("Rate limit check error:", error);
        return true; // Allow on error
      }
      
      return data === true;
    } catch (err) {
      console.error("Rate limit check failed:", err);
      return true;
    }
  };

  const checkWhitelist = async (attemptEmail: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc("is_admin_whitelisted", {
        _email: attemptEmail
      });
      
      if (error) {
        console.error("Whitelist check error:", error);
        return false;
      }
      
      return data === true;
    } catch (err) {
      console.error("Whitelist check failed:", err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate input
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      // Check rate limiting
      const isAllowed = await checkRateLimit(email);
      if (!isAllowed) {
        setIsBlocked(true);
        setBlockTimeRemaining(30);
        await logLoginAttempt(email, false, "Rate limit exceeded");
        setError("অনেক বার ভুল প্রচেষ্টা। ৩০ মিনিট পর আবার চেষ্টা করুন।");
        setIsLoading(false);
        
        // Start countdown
        const interval = setInterval(() => {
          setBlockTimeRemaining(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsBlocked(false);
              return 0;
            }
            return prev - 1;
          });
        }, 60000); // Update every minute
        
        return;
      }

      // Check whitelist
      const isWhitelisted = await checkWhitelist(email);
      if (!isWhitelisted) {
        await logLoginAttempt(email, false, "Email not whitelisted");
        setError("এই email admin panel access করতে পারবে না।");
        setIsLoading(false);
        return;
      }

      // Attempt login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        await logLoginAttempt(email, false, authError.message);
        
        if (authError.message.includes("Invalid login credentials")) {
          setError("Email বা password ভুল হয়েছে।");
        } else {
          setError(authError.message);
        }
        setIsLoading(false);
        return;
      }

      // Check if user has admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        await logLoginAttempt(email, false, "User is not an admin");
        await supabase.auth.signOut();
        setError("আপনার admin access নেই।");
        setIsLoading(false);
        return;
      }

      // Success!
      await logLoginAttempt(email, true);
      toast.success("সফলভাবে Admin Login হয়েছে!");
      navigate("/admin");
      
    } catch (err) {
      console.error("Login error:", err);
      await logLoginAttempt(email, false, "Unknown error");
      setError("Login করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="section-container py-12 md:py-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="bg-gradient-to-br from-red-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-background" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Admin Security Portal</h1>
            <p className="text-sm text-muted-foreground">
              Authorized personnel only • All attempts are logged
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-600 dark:text-amber-400">Security Notice</p>
                <p className="text-muted-foreground mt-1">
                  This portal is monitored. All login attempts are recorded with IP, device, and location data.
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            {isBlocked ? (
              <div className="text-center py-8">
                <Lock className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-destructive mb-2">
                  Account Temporarily Locked
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  অনেক বার ভুল প্রচেষ্টার কারণে আপনার account লক করা হয়েছে।
                </p>
                <p className="text-2xl font-bold">
                  {blockTimeRemaining} মিনিট বাকি
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Admin Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="h-12"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      className="h-12 pr-12"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      Secure Admin Login
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-xs text-muted-foreground">
              🔒 256-bit SSL Encrypted • Session Monitored
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by <span className="font-semibold">SA Coder</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLoginPage;
