import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Crown, 
  ArrowRight,
  Shield,
  Star,
  Gift,
  Infinity,
  Clock,
  MessageCircle,
  FileText,
  TrendingUp,
  Users
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PricingPage = () => {
  const plans = [
    {
      name: "Free",
      price: "৳0",
      period: "forever",
      description: "Basic business analysis দিয়ে শুরু করুন",
      icon: Sparkles,
      gradient: "from-slate-500 to-slate-600",
      bgGradient: "from-slate-500/10 to-slate-600/10",
      features: [
        { text: "Business Reality Check", included: true },
        { text: "Website Decision Engine", included: true },
        { text: "Basic Product Suggestion", included: true },
        { text: "Limited Sourcing Info", included: true },
        { text: "Full Execution Guide", included: false },
        { text: "14-Day Plan", included: false },
        { text: "PDF Download", included: false }
      ],
      cta: "Free তে শুরু করুন",
      ctaLink: "/analyze",
      popular: false
    },
    {
      name: "Single Analysis",
      price: "৳299",
      period: "per analysis",
      description: "একটি business idea-র complete execution guide",
      icon: Zap,
      gradient: "from-primary to-blue-600",
      bgGradient: "from-primary/10 to-blue-600/10",
      features: [
        { text: "সব Free features", included: true },
        { text: "Full Product Sourcing Guide", included: true },
        { text: "Complete Delivery Plan", included: true },
        { text: "Marketing Strategy", included: true },
        { text: "14-Day Action Plan", included: true },
        { text: "Failure Warning Analysis", included: true },
        { text: "PDF Download", included: true }
      ],
      cta: "এখনই কিনুন",
      ctaLink: "/payment?plan=single",
      popular: true
    },
    {
      name: "Unlimited Monthly",
      price: "৳999",
      period: "per month",
      description: "৩০ দিনে unlimited business analysis",
      icon: Crown,
      gradient: "from-accent to-amber-500",
      bgGradient: "from-accent/10 to-amber-500/10",
      features: [
        { text: "সব Single Analysis features", included: true },
        { text: "Unlimited Analysis", included: true },
        { text: "Priority Support", included: true },
        { text: "All PDF Downloads", included: true },
        { text: "Early Access to New Features", included: true },
        { text: "Dedicated WhatsApp Support", included: true },
        { text: "Monthly Business Tips", included: true }
      ],
      cta: "Subscribe করুন",
      ctaLink: "/payment?plan=unlimited",
      popular: false
    }
  ];

  const faqs = [
    {
      q: "Payment কিভাবে করব?",
      a: "bKash, Nagad, বা Rocket দিয়ে payment করতে পারবেন। Card payment-ও available। সব payment methods secure এবং encrypted।"
    },
    {
      q: "Refund policy কি?",
      a: "Analysis generate হওয়ার পর refund দেওয়া হয় না। তবে কোন technical issue থাকলে আমরা সাহায্য করব এবং re-analysis free তে দেব।"
    },
    {
      q: "Unlimited plan-এ কত analysis করা যাবে?",
      a: "Fair use policy-র মধ্যে unlimited। দৈনিক ১০টার বেশি করলে আমরা contact করব। সাধারণ ব্যবহারে কোন limit নেই।"
    },
    {
      q: "Single Analysis কতদিন valid থাকে?",
      a: "Single Analysis purchase করার পর lifetime access পাবেন। PDF download করে রাখতে পারবেন।"
    },
    {
      q: "Unlimited plan cancel করা যাবে?",
      a: "হ্যাঁ, যেকোন সময় cancel করতে পারবেন। Current billing cycle শেষ পর্যন্ত access থাকবে।"
    }
  ];

  const trustBadges = [
    { icon: Shield, text: "Secure Payment" },
    { icon: Clock, text: "Instant Access" },
    { icon: MessageCircle, text: "24/7 Support" },
    { icon: Gift, text: "Money Back Guarantee" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl float" />
        <div className="absolute top-40 right-[15%] w-96 h-96 bg-accent/10 rounded-full blur-3xl float-delayed" />
        
        <div className="section-container relative z-10">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-accent/20"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span>Simple, Transparent Pricing</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              আপনার জন্য{" "}
              <span 
                style={{
                  background: 'linear-gradient(135deg, #e85a3c 0%, #f5734d 50%, #d94a2e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Perfect Plan
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              কোন hidden fee নেই। যা দেখছেন তাই পাবেন। আজই শুরু করুন আপনার business journey।
            </motion.p>

            {/* Trust Badges */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-4 md:gap-8"
            >
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <badge.icon className="h-4 w-4 text-primary" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-20 relative">
        <div className="section-container">
          <motion.div 
            className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={`relative glass-card-strong rounded-3xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-2 border-primary shadow-xl ring-2 ring-primary/20"
                    : "border border-border/50 hover:border-primary/30"
                }`}
              >
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <span className="gradient-gold text-primary px-5 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                      <Star className="h-4 w-4" fill="currentColor" />
                      Most Popular
                    </span>
                  </motion.div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gradient">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className={`flex items-start gap-3 ${!feature.included ? "opacity-50" : ""}`}>
                      {feature.included ? (
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <span className="h-5 w-5 flex items-center justify-center flex-shrink-0 text-muted-foreground">✕</span>
                      )}
                      <span className={`text-sm ${feature.included ? "" : "text-muted-foreground"}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={plan.popular ? "hero" : "hero-outline"} 
                  size="lg" 
                  className={`w-full rounded-xl py-6 ${plan.popular ? "gold-glow" : ""}`}
                  asChild
                >
                  <Link to={plan.ctaLink} className="flex items-center justify-center gap-2">
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 md:py-20 gradient-subtle">
        <div className="section-container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
              Value
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              আপনি কি{" "}
              <span 
                style={{
                  background: 'linear-gradient(135deg, #e85a3c 0%, #f5734d 50%, #d94a2e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                পাচ্ছেন?
              </span>
            </h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              { icon: FileText, title: "Detailed Report", desc: "৮+ পেজের comprehensive analysis" },
              { icon: TrendingUp, title: "Growth Strategy", desc: "Step-by-step marketing plan" },
              { icon: Users, title: "Expert Insights", desc: "BD market-focused suggestions" },
              { icon: Infinity, title: "Lifetime Access", desc: "Download & keep forever" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-2xl text-center"
              >
                <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20">
        <div className="section-container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              সাধারণ{" "}
              <span 
                style={{
                  background: 'linear-gradient(135deg, #e85a3c 0%, #f5734d 50%, #d94a2e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                প্রশ্নসমূহ
              </span>
            </h2>
          </motion.div>

          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`}
                  className="glass-card-strong rounded-2xl px-6 border-none"
                >
                  <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="section-container relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Start?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              আজই আপনার business idea analyze করুন এবং সফলতার দিকে এগিয়ে যান।
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="xl" 
                className="bg-white text-primary font-semibold hover:bg-white/90 px-10 py-7 text-lg rounded-2xl shadow-xl"
                asChild
              >
                <Link to="/analyze" className="flex items-center gap-3">
                  <Zap className="h-5 w-5" />
                  এখনই শুরু করুন
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            
            <p className="mt-6 text-white/60 text-sm">
              Powered by <span className="font-semibold text-white/80">SA Coder</span>
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PricingPage;
