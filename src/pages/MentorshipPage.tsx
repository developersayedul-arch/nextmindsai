import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMentorshipSettings } from "@/hooks/useMentorshipSettings";
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Lightbulb,
  TrendingUp,
  Megaphone,
  Code,
  ArrowRight,
  MessageCircle,
  Star,
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  Rocket
} from "lucide-react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  Megaphone,
  TrendingUp,
  Star,
  Code
};

interface SessionType {
  value: string;
  label: string;
  price: number;
  icon: LucideIcon;
  description: string;
  duration: number;
}

const MentorshipPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings, sessionTypes: dbSessionTypes, loading: settingsLoading } = useMentorshipSettings();
  
  // Transform DB session types to component format
  const sessionTypes: SessionType[] = dbSessionTypes.map(s => ({
    value: s.session_key,
    label: s.label_bn,
    price: s.price,
    icon: iconMap[s.icon_name || "Lightbulb"] || Lightbulb,
    description: s.description_bn || "",
    duration: s.duration_minutes
  }));

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    whatsappNumber: "",
    businessIdea: "",
    preferredDate: "",
    preferredTime: "",
    topics: [] as string[],
    // Guest booking fields
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateWhatsApp = (number: string): boolean => {
    const cleaned = number.replace(/[\s-]/g, '');
    const bdPattern = /^(01[3-9]\d{8}|(\+?880)?1[3-9]\d{8})$/;
    return bdPattern.test(cleaned);
  };

  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      toast.error("সেশন টাইপ সিলেক্ট করুন");
      return;
    }

    if (!formData.whatsappNumber || !validateWhatsApp(formData.whatsappNumber)) {
      toast.error("সঠিক WhatsApp নম্বর দিন");
      return;
    }

    if (!formData.preferredDate || !formData.preferredTime) {
      toast.error("তারিখ ও সময় সিলেক্ট করুন");
      return;
    }

    // Validate guest booking fields if not logged in
    if (!user) {
      if (!formData.email || !validateEmail(formData.email)) {
        toast.error("সঠিক Email দিন");
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        toast.error("Password কমপক্ষে ৬ অক্ষরের হতে হবে");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Password match করছে না");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let currentUserId = user?.id;

      // Auto-create account for guest users
      if (!user && formData.email && formData.password) {
        const redirectUrl = `${window.location.origin}/`;
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });

        if (authError) {
          // Check if user already exists
          if (authError.message.includes("already registered")) {
            toast.error("এই Email দিয়ে আগেই account আছে। Login করুন।");
            setIsSubmitting(false);
            return;
          }
          throw authError;
        }

        if (authData.user) {
          currentUserId = authData.user.id;
          toast.success("Account তৈরি হয়েছে!");
        }
      }

      const sessionDate = new Date(`${formData.preferredDate}T${formData.preferredTime}`);
      const selectedSession = sessionTypes.find(s => s.value === selectedType);

      const { data: session, error } = await supabase
        .from("mentorship_sessions")
        .insert({
          user_id: currentUserId || null,
          session_type: selectedType,
          session_date: sessionDate.toISOString(),
          duration_minutes: selectedSession?.duration || 60,
          whatsapp_number: formData.whatsappNumber,
          business_idea: formData.businessIdea || null,
          topics: formData.topics.length > 0 ? formData.topics : null,
          price: selectedSession?.price || 499,
          status: "pending",
          payment_status: "unpaid"
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("বুকিং সফল হয়েছে! এখন পেমেন্ট করুন।");
      
      // Navigate to payment page with session info
      navigate(`/mentorship/payment?sessionId=${session.id}&type=${selectedType}`);
    } catch (err) {
      console.error("Error booking session:", err);
      toast.error("বুকিং করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const topicOptions = [
    "বিজনেস আইডিয়া ভ্যালিডেশন",
    "মার্কেট রিসার্চ",
    "প্রোডাক্ট সোর্সিং",
    "প্রাইসিং স্ট্র্যাটেজি",
    "মার্কেটিং প্ল্যান",
    "সোশ্যাল মিডিয়া",
    "ওয়েবসাইট/এপ ডিসিশন",
    "স্কেলিং প্ল্যান"
  ];

  // Loading state
  if (settingsLoading) {
    return (
      <Layout>
        <div className="section-container py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Coming Soon state - when mentorship is disabled
  if (settings && !settings.is_enabled) {
    return (
      <Layout>
        <div className="section-container py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 gradient-hero rounded-full mb-6">
              <Rocket className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              মেন্টরশিপ সেশন{" "}
              <span 
                style={{
                  background: 'linear-gradient(135deg, #e85a3c 0%, #f5734d 50%, #d94a2e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                শীঘ্রই আসছে
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {settings.coming_soon_message || "মেন্টরশিপ সেশন শীঘ্রই আসছে! Stay tuned."}
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-secondary/30 rounded-xl">
                <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">এক্সপার্ট মেন্টর</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-xl">
                <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">ফ্লেক্সিবল সময়</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-xl">
                <MessageCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">ফলো-আপ সাপোর্ট</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              হোমে ফিরুন
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-container py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Users className="h-4 w-4" />
            SA Coder Expert Team
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            ১:১{" "}
            <span 
              style={{
                background: 'linear-gradient(135deg, #e85a3c 0%, #f5734d 50%, #d94a2e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              মেন্টরশিপ সেশন
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            আপনার বিজনেস আইডিয়া থেকে শুরু করে স্কেলিং পর্যন্ত — 
            এক্সপার্ট গাইডেন্স পান প্রতিটি স্টেপে
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-secondary/30 rounded-xl">
            <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold mb-2">এক্সপার্ট মেন্টর</h3>
            <p className="text-sm text-muted-foreground">
              অভিজ্ঞ বিজনেস এক্সপার্টদের কাছ থেকে গাইডেন্স
            </p>
          </div>
          <div className="text-center p-6 bg-secondary/30 rounded-xl">
            <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold mb-2">ফ্লেক্সিবল সময়</h3>
            <p className="text-sm text-muted-foreground">
              আপনার সুবিধামতো সময়ে সেশন বুক করুন
            </p>
          </div>
          <div className="text-center p-6 bg-secondary/30 rounded-xl">
            <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold mb-2">ফলো-আপ সাপোর্ট</h3>
            <p className="text-sm text-muted-foreground">
              সেশনের পরেও WhatsApp এ সাপোর্ট পাবেন
            </p>
          </div>
        </div>

        {/* Session Types */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-center">সেশন টাইপ সিলেক্ট করুন</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessionTypes.map((type) => (
              <Card 
                key={type.value}
                className={`cursor-pointer transition-all ${
                  selectedType === type.value 
                    ? "border-primary ring-2 ring-primary/20" 
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedType(type.value)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedType === type.value ? "gradient-hero" : "bg-secondary"
                    }`}>
                      <type.icon className={`h-5 w-5 ${
                        selectedType === type.value ? "text-primary-foreground" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{type.label}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-primary">৳{type.price}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {type.duration} মিনিট
                        </span>
                      </div>
                    </div>
                    {selectedType === type.value && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        {selectedType && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>বুকিং ফর্ম</CardTitle>
              <CardDescription>
                আপনার তথ্য দিন, আমরা কনফার্ম করে জানাব
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>WhatsApp নম্বর *</Label>
                  <Input
                    placeholder="01712345678"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>পছন্দের তারিখ *</Label>
                  <Input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>পছন্দের সময় *</Label>
                <Input
                  type="time"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  সকাল ১০টা থেকে রাত ১০টার মধ্যে বুক করতে পারবেন
                </p>
              </div>

              <div className="space-y-2">
                <Label>বিজনেস আইডিয়া (ঐচ্ছিক)</Label>
                <Textarea
                  placeholder="আপনার বিজনেস আইডিয়া সম্পর্কে সংক্ষেপে লিখুন..."
                  value={formData.businessIdea}
                  onChange={(e) => setFormData({ ...formData, businessIdea: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>যে বিষয়গুলো আলোচনা করতে চান (ঐচ্ছিক)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {topicOptions.map((topic) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={topic}
                        checked={formData.topics.includes(topic)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, topics: [...formData.topics, topic] });
                          } else {
                            setFormData({ ...formData, topics: formData.topics.filter(t => t !== topic) });
                          }
                        }}
                      />
                      <label htmlFor={topic} className="text-sm cursor-pointer">
                        {topic}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guest Booking Account Section - Only show if not logged in */}
              {!user && (
                <div className="border border-primary/20 bg-primary/5 p-4 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">Account তৈরি করুন</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    বুকিং করতে আপনার একটি account তৈরি হবে। পরে login করে বুকিং ট্র্যাক করতে পারবেন।
                  </p>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email *
                    </Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        Password *
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="কমপক্ষে ৬ অক্ষর"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        Confirm Password *
                      </Label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="আবার Password দিন"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    ইতিমধ্যে account আছে?{" "}
                    <a href="/auth" className="text-primary hover:underline font-medium">
                      Login করুন
                    </a>
                  </p>
                </div>
              )}

              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">সেশন ফি</span>
                  <span className="text-xl font-bold">
                    ৳{sessionTypes.find(s => s.value === selectedType)?.price}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  * বুকিং কনফার্ম হলে পেমেন্ট করতে হবে
                </p>
              </div>

              <Button 
                onClick={handleSubmit} 
                className="w-full" 
                variant="hero" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "বুক হচ্ছে..."
                ) : (
                  <>
                    বুক করুন ও পেমেন্ট করুন
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-2">
                বুক করার পর bKash/Nagad দিয়ে পেমেন্ট করতে পারবেন
              </p>
            </CardContent>
          </Card>
        )}

        {/* Trust Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold text-foreground">SA Coder</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default MentorshipPage;
