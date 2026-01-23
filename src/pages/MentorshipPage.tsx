import { useState } from "react";
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
  Shield
} from "lucide-react";
import { toast } from "sonner";

const sessionTypes = [
  { 
    value: "business-idea", 
    label: "বিজনেস আইডিয়া ভ্যালিডেশন", 
    price: 499,
    icon: Lightbulb,
    description: "আপনার আইডিয়া কতটা viable তা জানুন",
    duration: 45
  },
  { 
    value: "marketing", 
    label: "মার্কেটিং স্ট্র্যাটেজি", 
    price: 699,
    icon: Megaphone,
    description: "প্রথম ১০০ কাস্টমার পাওয়ার প্ল্যান",
    duration: 60
  },
  { 
    value: "scaling", 
    label: "বিজনেস স্কেলিং", 
    price: 999,
    icon: TrendingUp,
    description: "বিজনেস grow করার গাইডলাইন",
    duration: 60
  },
  { 
    value: "full-consultation", 
    label: "সম্পূর্ণ বিজনেস প্ল্যান", 
    price: 1499,
    icon: Star,
    description: "A-Z বিজনেস রোডম্যাপ",
    duration: 90
  },
  { 
    value: "tech-guidance", 
    label: "টেক ও ওয়েবসাইট গাইডেন্স", 
    price: 599,
    icon: Code,
    description: "ওয়েবসাইট ও এপ ডিসিশন",
    duration: 45
  }
];

const MentorshipPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    whatsappNumber: "",
    businessIdea: "",
    preferredDate: "",
    preferredTime: "",
    topics: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateWhatsApp = (number: string): boolean => {
    const cleaned = number.replace(/[\s-]/g, '');
    const bdPattern = /^(01[3-9]\d{8}|(\+?880)?1[3-9]\d{8})$/;
    return bdPattern.test(cleaned);
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

    setIsSubmitting(true);

    try {
      const sessionDate = new Date(`${formData.preferredDate}T${formData.preferredTime}`);
      const selectedSession = sessionTypes.find(s => s.value === selectedType);

      const { error } = await supabase
        .from("mentorship_sessions")
        .insert({
          user_id: user?.id || null,
          session_type: selectedType,
          session_date: sessionDate.toISOString(),
          duration_minutes: selectedSession?.duration || 60,
          whatsapp_number: formData.whatsappNumber,
          business_idea: formData.businessIdea || null,
          topics: formData.topics.length > 0 ? formData.topics : null,
          price: selectedSession?.price || 499,
          status: "pending",
          payment_status: "unpaid"
        });

      if (error) throw error;

      toast.success("বুকিং সফল হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।");
      navigate("/");
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
            ১:১ মেন্টরশিপ সেশন
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
                    সেশন বুক করুন
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
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
