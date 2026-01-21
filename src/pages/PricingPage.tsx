import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Zap, Crown } from "lucide-react";

const PricingPage = () => {
  const plans = [
    {
      name: "Free",
      price: "৳0",
      period: "forever",
      description: "Basic business analysis দিয়ে শুরু করুন",
      icon: Sparkles,
      features: [
        "Business Reality Check",
        "Website Decision Engine",
        "Basic Product Suggestion",
        "Limited Sourcing Info"
      ],
      limitations: [
        "Full Execution Guide নেই",
        "14-Day Plan নেই",
        "PDF Download নেই"
      ],
      cta: "Free তে শুরু করুন",
      ctaVariant: "hero-outline" as const,
      popular: false
    },
    {
      name: "Single Analysis",
      price: "৳299",
      period: "per analysis",
      description: "একটি business idea-র complete execution guide",
      icon: Zap,
      features: [
        "সব Free features",
        "Full Product Sourcing Guide",
        "Complete Delivery Plan",
        "Marketing Strategy",
        "14-Day Action Plan",
        "Failure Warning Analysis",
        "PDF Download"
      ],
      limitations: [],
      cta: "এখনই কিনুন",
      ctaVariant: "hero" as const,
      popular: true
    },
    {
      name: "Unlimited Monthly",
      price: "৳999",
      period: "per month",
      description: "৩০ দিনে unlimited business analysis",
      icon: Crown,
      features: [
        "সব Single Analysis features",
        "Unlimited Analysis",
        "Priority Support",
        "All PDF Downloads",
        "Early Access to New Features"
      ],
      limitations: [],
      cta: "Subscribe করুন",
      ctaVariant: "hero" as const,
      popular: false
    }
  ];

  return (
    <Layout>
      <div className="section-container py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            আপনার প্রয়োজন অনুযায়ী plan বেছে নিন। কোন hidden fee নেই।
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-[1.02] ${
                plan.popular
                  ? "border-primary bg-gradient-to-br from-primary/5 to-transparent shadow-lg"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="gradient-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  plan.popular ? "gradient-hero" : "bg-secondary"
                }`}>
                  <plan.icon className={`h-6 w-6 ${plan.popular ? "text-primary-foreground" : "text-secondary-foreground"}`} />
                </div>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, i) => (
                  <div key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="h-5 w-5 flex items-center justify-center flex-shrink-0">✕</span>
                    <span className="text-sm">{limitation}</span>
                  </div>
                ))}
              </div>

              <Button variant={plan.ctaVariant} size="lg" className="w-full" asChild>
                <Link to={plan.name === "Free" ? "/analyze" : `/payment?plan=${plan.name === "Single Analysis" ? "single" : "unlimited"}`}>
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">সাধারণ প্রশ্ন</h2>
          <div className="space-y-4">
            {[
              {
                q: "Payment কিভাবে করব?",
                a: "bKash, Nagad, বা Rocket দিয়ে payment করতে পারবেন। Card payment-ও available।"
              },
              {
                q: "Refund policy কি?",
                a: "Analysis generate হওয়ার পর refund দেওয়া হয় না। তবে কোন technical issue থাকলে আমরা সাহায্য করব।"
              },
              {
                q: "Unlimited plan-এ কত analysis করা যাবে?",
                a: "Fair use policy-র মধ্যে unlimited। দৈনিক ১০টার বেশি করলে আমরা contact করব।"
              }
            ].map((faq, i) => (
              <div key={i} className="bg-secondary/30 p-4 rounded-lg">
                <p className="font-medium mb-2">{faq.q}</p>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold text-foreground">SA Coder</span> | 
            Developed & Secured by <span className="font-semibold text-foreground">SA Coder</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PricingPage;
