import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Smartphone, 
  Loader2, 
  CheckCircle2, 
  Copy, 
  Clock,
  ArrowLeft,
  Shield
} from "lucide-react";
import { toast } from "sonner";

const PAYMENT_NUMBERS = {
  bkash: "01712345678",
  nagad: "01812345678",
  rocket: "01912345678"
};

const PLAN_PRICES = {
  single: 299,
  unlimited: 999
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const plan = searchParams.get("plan") as "single" | "unlimited" || "single";
  const analysisId = searchParams.get("analysisId");
  
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket">("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

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
      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          user_id: user!.id,
          analysis_id: analysisId || null,
          transaction_id: transactionId.trim(),
          amount: PLAN_PRICES[plan],
          payment_method: paymentMethod,
          sender_number: senderNumber.trim(),
          status: "pending"
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Create subscription record
      const expiresAt = new Date();
      if (plan === "unlimited") {
        expiresAt.setDate(expiresAt.getDate() + 30);
      } else {
        expiresAt.setDate(expiresAt.getDate() + 7); // Single analysis valid for 7 days
      }

      const { error: subError } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user!.id,
          plan_type: plan,
          expires_at: expiresAt.toISOString(),
          is_active: false, // Will be activated after verification
          payment_id: payment.id
        });

      if (subError) throw subError;

      setSubmitted(true);
      toast.success("Payment তথ্য জমা হয়েছে!");

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
            to="/pricing" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pricing
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="gradient-hero w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              Payment করুন
            </h1>
            <p className="text-muted-foreground">
              {plan === "single" ? "Single Analysis - ৳299" : "Unlimited Monthly - ৳999"}
            </p>
          </div>

          {!submitted ? (
            <div className="bg-card border border-border rounded-2xl p-6">
              {/* Payment Method Selection */}
              <div className="mb-6">
                <Label className="text-base font-medium mb-3 block">Payment Method</Label>
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
                <p className="font-medium mb-3">Payment Steps:</p>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                    <span>নিচের নম্বরে <strong>৳{PLAN_PRICES[plan]}</strong> Send Money করুন</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                    <span>Transaction ID এবং আপনার নম্বর নিচে দিন</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                    <span>আমরা verify করে আপনার plan activate করব</span>
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
                  Amount: ৳{PLAN_PRICES[plan]} (Personal)
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
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Payment Submit করুন
                    </>
                  )}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" />
                Secured by SA Coder
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-warning" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Payment Verification Pending</h2>
              <p className="text-muted-foreground mb-6">
                আপনার payment verify করা হচ্ছে। সাধারণত ১-২ ঘণ্টার মধ্যে activate হবে।
              </p>
              
              <div className="bg-secondary/30 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm"><strong>Transaction ID:</strong> {transactionId}</p>
                <p className="text-sm"><strong>Amount:</strong> ৳{PLAN_PRICES[plan]}</p>
                <p className="text-sm"><strong>Method:</strong> {paymentMethod}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="default" className="flex-1" asChild>
                  <Link to="/history">My Analyses</Link>
                </Button>
                <Button variant="secondary" className="flex-1" asChild>
                  <Link to="/analyze">নতুন Analysis</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Trust Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">SA Coder</span> | 
              Developed & Secured by <span className="font-semibold text-foreground">SA Coder</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
