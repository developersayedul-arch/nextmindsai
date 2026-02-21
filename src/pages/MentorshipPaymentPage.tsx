import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Loader2, 
  CheckCircle2, 
  Copy, 
  ArrowLeft,
  Shield,
  Users,
  MessageCircle
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

  useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0 && !selectedMethodId) {
      setSelectedMethodId(paymentMethods[0].id);
    }
  }, [paymentMethods, selectedMethodId]);

  const selectedMethod = paymentMethods?.find((m) => m.id === selectedMethodId);

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
      const { error: paymentError } = await supabase
        .from("payments")
        .insert({
          user_id: user?.id || null,
          analysis_id: null,
          transaction_id: transactionId.trim(),
          amount: price,
          payment_method: selectedMethod.name,
          sender_number: senderNumber.trim(),
          status: "pending",
          notes: `Mentorship Session: ${SESSION_LABELS[sessionType]} (Session ID: ${sessionId || "Direct"})`
        });

      if (paymentError) throw paymentError;

      if (sessionId) {
        const { error: sessionError } = await supabase
          .from("mentorship_sessions")
          .update({ payment_status: "paid" })
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
              <Link to="/mentorship">ফিরে যান</Link>
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
            to="/mentorship" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            মেন্টরশিপে ফিরে যান
          </Link>

          <div className="text-center mb-8">
            <div className="gradient-hero w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">মেন্টরশিপ পেমেন্ট</h1>
            <p className="text-muted-foreground">
              {SESSION_LABELS[sessionType]} - ৳{price}
            </p>
          </div>

          {!submitted ? (
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="mb-6">
                <Label className="text-base font-medium mb-3 block">পেমেন্ট মেথড</Label>
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
                      Amount: ৳{price} {selectedMethod.account_name && `(${selectedMethod.account_name})`}
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

                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3" />
                  Powered by SA Coder
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">পেমেন্ট তথ্য জমা হয়েছে!</h2>
              <p className="text-muted-foreground mb-6">
                আপনার পেমেন্ট verify করা হচ্ছে। শীঘ্রই WhatsApp এ কনফার্মেশন পাবেন।
              </p>
              
              <div className="bg-secondary/30 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm"><strong>সেশন:</strong> {SESSION_LABELS[sessionType]}</p>
                <p className="text-sm"><strong>Transaction ID:</strong> {transactionId}</p>
                <p className="text-sm"><strong>Amount:</strong> ৳{price}</p>
                <p className="text-sm"><strong>Method:</strong> {selectedMethod?.name}</p>
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
