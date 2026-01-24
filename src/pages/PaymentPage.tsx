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
  Shield,
  CreditCard,
  ExternalLink
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
  const [dodoLoading, setDodoLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch active payment methods
  const { data: paymentMethods, isLoading: methodsLoading } = useQuery({
    queryKey: ["active-payment-methods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      console.log("Payment methods loaded:", data);
      return data as PaymentMethod[];
    },
    staleTime: 0,
  });

  // Fetch DodoPayment product IDs from database
  const { data: dodoProducts } = useQuery({
    queryKey: ["dodo-products-analysis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dodo_products")
        .select("product_key, dodo_product_id, price_bdt")
        .eq("product_type", "analysis")
        .eq("is_active", true);
      if (error) throw error;
      // Convert to a map for easy lookup
      const productMap: Record<string, string> = {};
      const priceMap: Record<string, number> = {};
      data?.forEach((p: { product_key: string; dodo_product_id: string; price_bdt: number }) => {
        productMap[p.product_key] = p.dodo_product_id;
        priceMap[p.product_key] = p.price_bdt;
      });
      return { productMap, priceMap };
    },
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

  // Check if selected method is a payment gateway (like DodoPayment)
  // Use explicit check for both the method and its type
  const isPaymentGateway = Boolean(selectedMethod && selectedMethod.type === 'payment_gateway');

  // Handle DodoPayment checkout
  const handleDodoCheckout = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    const productId = dodoProducts?.productMap?.[plan];
    if (!productId) {
      toast.error("Product not configured. Please contact support.");
      return;
    }

    setDodoLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('dodo-checkout', {
        body: {
          productId: productId,
          quantity: 1,
          customerEmail: user.email,
          customerName: user.user_metadata?.full_name || user.email,
          amount: dodoProducts?.priceMap?.[plan] || PLAN_PRICES[plan],
          planType: plan,
          analysisId: analysisId,
          returnUrl: `${window.location.origin}/payment?status=success&plan=${plan}`
        }
      });

      if (error) throw error;

      if (data?.checkoutUrl) {
        // Redirect to DodoPayment checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('DodoPayment error:', error);
      toast.error("Payment gateway error. Please try another method.");
    } finally {
      setDodoLoading(false);
    }
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
      // Create payment record
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
                      {method.type === 'payment_gateway' && (
                        <CreditCard className="h-4 w-4 mb-1 text-primary" />
                      )}
                      <span className="font-medium text-sm text-center">{method.name}</span>
                      {method.type === 'payment_gateway' && (
                        <span className="text-[10px] text-muted-foreground mt-0.5">Online</span>
                      )}
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Show different UI based on payment method type */}
              {isPaymentGateway ? (
                /* DodoPayment / Online Gateway UI */
                <div className="space-y-4">
                  {selectedMethod?.instructions && (
                    <div className="bg-secondary/30 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">{selectedMethod.instructions}</p>
                    </div>
                  )}

                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-center">
                    <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium mb-1">Pay ৳{PLAN_PRICES[plan]}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Secure online payment via {selectedMethod?.name}
                    </p>
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      onClick={handleDodoCheckout}
                      disabled={dodoLoading}
                    >
                      {dodoLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Redirecting...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-5 w-5" />
                          Pay with {selectedMethod?.name}
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    Secure payment powered by {selectedMethod?.name}
                  </p>
                </div>
              ) : (
                /* Manual Payment UI (bKash, Nagad, etc.) */
                <div className="space-y-4">
                  {/* Payment Instructions */}
                  {selectedMethod?.instructions && (
                    <div className="bg-secondary/30 p-4 rounded-lg">
                      <p className="font-medium mb-2">নির্দেশনা:</p>
                      <p className="text-sm text-muted-foreground">{selectedMethod.instructions}</p>
                    </div>
                  )}

                  {/* Payment Number */}
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
              )}
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

export default PaymentPage;
