import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  account_number: string | null;
  account_name: string | null;
  instructions: string | null;
  is_active: boolean;
  display_order: number;
}

const PLAN_PRICES: Record<string, number> = {
  single: 299,
  unlimited: 999
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const plan = searchParams.get("plan") as "single" | "unlimited" || "single";
  const analysisId = searchParams.get("analysisId");
  
  const [selectedMethodId, setSelectedMethodId] = useState<string>("");
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch active manual payment methods only
  const { data: paymentMethods, isLoading: methodsLoading } = useQuery({
    queryKey: ["active-payment-methods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("is_active", true)
        .neq("type", "payment_gateway")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as PaymentMethod[];
    },
    staleTime: 0,
  });

  // Set first method as default when loaded
  useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0 && !selectedMethodId) {
      setSelectedMethodId(paymentMethods[0].id);
    }
  }, [paymentMethods, selectedMethodId]);

  const selectedMethod = paymentMethods?.find((m) => m.id === selectedMethodId);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const copyNumber = (number: string | null) => {
    if (!number) return;
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
    if (!selectedMethod) {
      toast.error("পেমেন্ট মেথড সিলেক্ট করুন");
      return;
    }

    setLoading(true);

    try {
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          user_id: user!.id,
          analysis_id: analysisId || null,
          transaction_id: transactionId.trim(),
          amount: PLAN_PRICES[plan],
          payment_method: selectedMethod.name,
          sender_number: senderNumber.trim(),
          status: "pending"
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      const expiresAt = new Date();
      if (plan === "unlimited") {
        expiresAt.setDate(expiresAt.getDate() + 30);
      } else {
        expiresAt.setDate(expiresAt.getDate() + 7);
      }

      const { error: subError } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user!.id,
          plan_type: plan,
          expires_at: expiresAt.toISOString(),
          is_active: false,
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

  if (authLoading || methodsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <Layout>
        <div className="section-container py-12 md:py-20">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-muted-foreground">কোন পেমেন্ট মেথড পাওয়া যায়নি। পরে আবার চেষ্টা করুন।</p>
            <Button asChild className="mt-4">
              <Link to="/pricing">ফিরে যান</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-container py-12 md:py-20">
        <div className="max-w-lg mx-auto">
          <Link 
            to="/pricing" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pricing
          </Link>

          <div className="text-center mb-8">
            <div className="gradient-hero w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment করুন</h1>
            <p className="text-muted-foreground">
              {plan === "single" ? "Single Analysis - ৳299" : "Unlimited Monthly - ৳999"}
            </p>
          </div>

          {!submitted ? (
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="mb-6">
                <Label className="text-base font-medium mb-3 block">Payment Method</Label>
                <RadioGroup
                  value={selectedMethodId}
                  onValueChange={setSelectedMethodId}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                >
                  {paymentMethods.map((method) => (
                    <Label
                      key={method.id}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedMethodId === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value={method.id} className="sr-only" />
                      <span className="font-medium text-sm text-center">{method.name}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                {selectedMethod?.instructions && (
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <p className="font-medium mb-2">নির্দেশনা:</p>
                    <p className="text-sm text-muted-foreground">{selectedMethod.instructions}</p>
                  </div>
                )}

                {selectedMethod?.account_number && (
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      {selectedMethod.name} নম্বর:
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {selectedMethod.account_number}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyNumber(selectedMethod.account_number)}
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Amount: ৳{PLAN_PRICES[plan]} {selectedMethod.account_name && `(${selectedMethod.account_name})`}
                    </p>
                  </div>
                )}

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
                    <Label htmlFor="senderNumber">আপনার নম্বর</Label>
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

                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3" />
                  Powered by SA Coder
                </p>
              </div>
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
                <p className="text-sm"><strong>Method:</strong> {selectedMethod?.name}</p>
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

export default PaymentPage;
