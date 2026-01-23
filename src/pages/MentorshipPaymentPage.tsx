import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Smartphone, 
  Loader2, 
  CheckCircle2, 
  Copy, 
  Clock,
  ArrowLeft,
  Shield,
  Users,
  MessageCircle
} from "lucide-react";
import { toast } from "sonner";

const PAYMENT_NUMBERS = {
  bkash: "01712345678",
  nagad: "01812345678",
  rocket: "01912345678"
};

const SESSION_PRICES: Record<string, number> = {
  "business-idea": 499,
  "marketing": 699,
  "scaling": 999,
  "full-consultation": 1499,
  "tech-guidance": 599
};

const SESSION_LABELS: Record<string, string> = {
  "business-idea": "বিজনেস আইডিয়া ভ্যালিডেশন",
  "marketing": "মার্কেটিং স্ট্র্যাটেজি",
  "scaling": "বিজনেস স্কেলিং",
  "full-consultation": "সম্পূর্ণ বিজনেস প্ল্যান",
  "tech-guidance": "টেক ও ওয়েবসাইট গাইডেন্স"
};

const MentorshipPaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const sessionId = searchParams.get("sessionId");
  const sessionType = searchParams.get("type") || "business-idea";
  const price = SESSION_PRICES[sessionType] || 499;
  
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket">("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast.success("নম্বর copy হয়েছে!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionId.trim()) {
      toast.error("Transaction ID দিন");
      return;
    }
    if (!senderNumber.trim()) {
      toast.error("আপনার নম্বর দিন");
      return;
    }

    setLoading(true);

    try {
      // Create payment record for mentorship
      const { error: paymentError } = await supabase
        .from("payments")
        .insert({
          user_id: user?.id || null,
          analysis_id: null,
          transaction_id: transactionId.trim(),
          amount: price,
          payment_method: paymentMethod,
          sender_number: senderNumber.trim(),
          status: "pending",
          notes: `Mentorship Session: ${SESSION_LABELS[sessionType]} (Session ID: ${sessionId || "Direct"})`
        });

      if (paymentError) throw paymentError;

      // Update mentorship session payment status if sessionId exists
      if (sessionId) {
        const { error: sessionError } = await supabase
          .from("mentorship_sessions")
          .update({ 
            payment_status: "paid"
          })
          .eq("id", sessionId);

        if (sessionError) {
          console.error("Session update error:", sessionError);
        }
      }

      setSubmitted(true);
      toast.success("পেমেন্ট তথ্য জমা হয়েছে!");

    } catch (error) {
      console.error("Payment error:", error);
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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
        <div className="max-w-lg mx-auto">
          {/* Back Link */}
          <Link 
            to="/mentorship" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            মেন্টরশিপে ফিরে যান
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="gradient-hero w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              মেন্টরশিপ পেমেন্ট
            </h1>
            <p className="text-muted-foreground">
              {SESSION_LABELS[sessionType]} - ৳{price}
            </p>
          </div>

          {!submitted ? (
            <div className="bg-card border border-border rounded-2xl p-6">
              {/* Payment Method Selection */}
              <div className="mb-6">
                <Label className="text-base font-medium mb-3 block">পেমেন্ট মেথড</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v: "bkash" | "nagad" | "rocket") => setPaymentMethod(v)}
                  className="grid grid-cols-3 gap-3"
                >
                  {(["bkash", "nagad", "rocket"] as const).map((method) => (
                    <Label
                      key={method}
                      className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === method
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value={method} className="sr-only" />
                      <span className="font-medium capitalize">{method}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Payment Instructions */}
              <div className="bg-secondary/30 p-4 rounded-lg mb-6">
                <p className="font-medium mb-3">পেমেন্ট স্টেপস:</p>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">১</span>
                    <span>নিচের নম্বরে <strong>৳{price}</strong> Send Money করুন</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">২</span>
                    <span>Transaction ID এবং আপনার নম্বর নিচে দিন</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">৩</span>
                    <span>আমরা verify করে আপনাকে WhatsApp এ জানাব</span>
                  </li>
                </ol>
              </div>

              {/* Payment Number */}
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} নম্বর:
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    {PAYMENT_NUMBERS[paymentMethod]}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyNumber(PAYMENT_NUMBERS[paymentMethod])}
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Amount: ৳{price} (Personal)
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    placeholder="যেমন: TXN123456789"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderNumber">আপনার {paymentMethod} নম্বর</Label>
                  <Input
                    id="senderNumber"
                    placeholder="01XXXXXXXXX"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      সাবমিট হচ্ছে...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      পেমেন্ট সাবমিট করুন
                    </>
                  )}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" />
                Powered by SA Coder
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">পেমেন্ট তথ্য জমা হয়েছে!</h2>
              <p className="text-muted-foreground mb-6">
                আপনার পেমেন্ট verify করা হচ্ছে। শীঘ্রই WhatsApp এ কনফার্মেশন পাবেন।
              </p>
              
              <div className="bg-secondary/30 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm"><strong>সেশন:</strong> {SESSION_LABELS[sessionType]}</p>
                <p className="text-sm"><strong>Transaction ID:</strong> {transactionId}</p>
                <p className="text-sm"><strong>Amount:</strong> ৳{price}</p>
                <p className="text-sm"><strong>Method:</strong> {paymentMethod}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="default" className="flex-1" asChild>
                  <Link to="/mentorship">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    আরও সেশন দেখুন
                  </Link>
                </Button>
                <Button variant="secondary" className="flex-1" asChild>
                  <Link to="/">হোম পেইজে যান</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Trust Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">SA Coder</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MentorshipPaymentPage;
