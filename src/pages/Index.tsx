import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  Package, 
  Truck, 
  Megaphone, 
  Globe,
  Shield,
  Zap,
  Target,
  Play,
  Star,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  Rocket,
  Brain,
  BarChart3,
  Clock,
  Heart,
  Quote,
  BadgeCheck,
  Leaf,
  Layers,
  Gem,
  ArrowUpRight,
  ChevronRight,
  MousePointer2,
  Compass,
  Workflow,
  CircleCheck,
  MessageCircle,
  HelpCircle
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const features = [
    {
      icon: Brain,
      title: "Reality Check",
      subtitle: "Honest Analysis",
      description: "আপনার idea কতটা practical সেটা জানুন",
      stat: "98%",
      statLabel: "Accuracy"
    },
    {
      icon: Package,
      title: "Sourcing Guide",
      subtitle: "Product Finding",
      description: "কোথা থেকে product সংগ্রহ করবেন",
      stat: "500+",
      statLabel: "Suppliers"
    },
    {
      icon: Truck,
      title: "Delivery Setup",
      subtitle: "Logistics",
      description: "Best courier & payment gateway",
      stat: "10+",
      statLabel: "Partners"
    },
    {
      icon: Megaphone,
      title: "Marketing Plan",
      subtitle: "Growth Strategy",
      description: "Zero budget থেকে শুরু করুন",
      stat: "14",
      statLabel: "Day Plan"
    }
  ];

  const processSteps = [
    { 
      phase: "INPUT",
      title: "Share Your Idea", 
      description: "Business idea, budget, এবং location দিন",
      icon: Lightbulb,
      duration: "2 min"
    },
    { 
      phase: "PROCESS",
      title: "AI Analysis", 
      description: "Instant market ও feasibility analysis",
      icon: Brain,
      duration: "30 sec"
    },
    { 
      phase: "OUTPUT",
      title: "Get Roadmap", 
      description: "Complete execution plan download করুন",
      icon: Target,
      duration: "Instant"
    }
  ];

  const metrics = [
    { value: "5K+", label: "Ideas Analyzed", trend: "+23%", icon: BarChart3 },
    { value: "98%", label: "Happy Users", trend: "+5%", icon: Heart },
    { value: "1K+", label: "Active Users", trend: "+45%", icon: Users },
    { value: "50+", label: "Success Stories", trend: "+12%", icon: Award }
  ];

  const testimonials = [
    {
      name: "রাহাত আহমেদ",
      role: "E-commerce",
      content: "14-day plan follow করে ১ মাসে ৫০+ orders পেয়েছি!",
      rating: 5,
      avatar: "RA",
      revenue: "৳50K+"
    },
    {
      name: "সাবরিনা ইসলাম",
      role: "Startup",
      content: "Facebook page ই যথেষ্ট বুঝিয়ে দিল। টাকা বাঁচলো!",
      rating: 5,
      avatar: "SI",
      revenue: "৳30K+"
    },
    {
      name: "কামরুল হাসান",
      role: "Retail",
      content: "Chawkbazar থেকে supplier পেলাম, margin ভালো!",
      rating: 5,
      avatar: "KH",
      revenue: "৳80K+"
    }
  ];

  const faqs = [
    {
      q: "Nextminds AI কিভাবে কাজ করে?",
      a: "আপনি business idea, budget, location দেবেন। AI analyze করে practical feedback, 14-day action plan, sourcing tips সব দেবে।"
    },
    {
      q: "এটা কি শুধু Bangladesh-এর জন্য?",
      a: "হ্যাঁ! সব suggestions Bangladesh market, local suppliers, delivery systems এর উপর based।"
    },
    {
      q: "Analysis করতে কত সময় লাগে?",
      a: "মাত্র 2-3 মিনিট! AI instantly detailed report generate করে। PDF download করতে পারবেন।"
    },
    {
      q: "Payment কিভাবে করব?",
      a: "bKash, Nagad, Rocket সহ সব mobile banking এ payment করতে পারবেন। Card-ও available।"
    }
  ];

  const benefits = [
    "No motivational talk — শুধু practical advice",
    "Bangladesh context — local market focus",
    "14-day action plan included",
    "Sourcing, delivery, marketing — সব একসাথে"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <Layout>
      {/* HERO - Minimal Split Design */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-background">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Gradient Orbs */}
        <motion.div 
          className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-[100px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-[80px]"
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="section-container relative z-10 py-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {/* Tag */}
              <motion.div variants={itemVariants} className="mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Bangladesh's #1 AI Business Analyzer
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
              >
                <span className="text-foreground">Turn your</span>
                <br />
                <span className="text-gradient-coral">Business Idea</span>
                <br />
                <span className="text-foreground">into Reality</span>
              </motion.h1>

              {/* Description */}
              <motion.p 
                variants={itemVariants}
                className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed"
              >
                Get honest, practical analysis for your business idea. 
                No false promises — just <span className="text-foreground font-medium">actionable guidance</span> tailored for Bangladesh market.
              </motion.p>

              {/* CTA */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-10">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    className="gradient-coral text-white font-semibold coral-glow px-8 py-6 text-base rounded-xl border-0"
                    asChild
                  >
                    <Link to="/analyze" className="flex items-center gap-2">
                      Start Free Analysis
                      <ArrowUpRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-6 text-base rounded-xl border-2"
                  asChild
                >
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div variants={itemVariants} className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {["RA", "SI", "KH"].map((a, i) => (
                    <div key={i} className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center text-white text-xs font-bold border-2 border-background">
                      {a}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-accent fill-accent" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">1,000+ trusted users</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Feature Cards Stack */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative h-[500px] lg:h-[550px]">
                {/* Stacked Cards */}
                {[
                  { title: "14-Day Action Plan", desc: "Step-by-step roadmap", icon: Target, rotate: -3, y: 0 },
                  { title: "Market Analysis", desc: "Bangladesh focused insights", icon: BarChart3, rotate: 2, y: 120 },
                  { title: "Sourcing Guide", desc: "Local supplier contacts", icon: Package, rotate: -1, y: 240 },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-0 right-0 mx-auto w-[90%] lg:w-[85%]"
                    style={{ top: card.y }}
                    initial={{ opacity: 0, y: 50, rotate: 0 }}
                    animate={{ opacity: 1, y: 0, rotate: card.rotate }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
                    whileHover={{ y: -5, rotate: 0, zIndex: 10 }}
                  >
                    <div className="glass-card p-6 rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl gradient-coral flex items-center justify-center">
                          <card.icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{card.title}</h3>
                          <p className="text-sm text-muted-foreground">{card.desc}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Floating Badge */}
                <motion.div 
                  className="absolute -right-4 top-[60%] bg-card border border-border rounded-xl p-3 shadow-lg"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-accent" />
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold">2-3 min</div>
                      <div className="text-xs text-muted-foreground">Analysis Time</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <MousePointer2 className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* METRICS - Horizontal Card Strip */}
      <section className="py-6 bg-primary">
        <div className="section-container">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4">
            {metrics.map((metric, i) => (
              <motion.div 
                key={i}
                className="flex items-center gap-3 px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <metric.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{metric.value}</span>
                    <span className="text-xs text-white/60 font-medium">{metric.trend}</span>
                  </div>
                  <span className="text-sm text-white/70">{metric.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES - Bento Grid */}
      <section className="py-24 md:py-32 bg-background">
        <div className="section-container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm font-medium mb-4">
              What You Get
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Complete Business <span className="text-gradient-coral">Toolkit</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to validate and launch your business idea
            </p>
          </motion.div>

          {/* Bento Layout */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className={`group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all ${i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl gradient-coral flex items-center justify-center mb-4 ${i === 0 ? 'w-16 h-16' : ''}`}>
                  <feature.icon className={`text-white ${i === 0 ? 'h-8 w-8' : 'h-6 w-6'}`} />
                </div>

                {/* Content */}
                <div className="mb-4">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">{feature.subtitle}</span>
                  <h3 className={`font-bold mt-1 ${i === 0 ? 'text-2xl' : 'text-lg'}`}>{feature.title}</h3>
                </div>
                
                <p className={`text-muted-foreground mb-4 ${i === 0 ? 'text-base' : 'text-sm'}`}>
                  {feature.description}
                </p>

                {/* Stat */}
                <div className="flex items-baseline gap-1">
                  <span className={`font-bold text-accent ${i === 0 ? 'text-3xl' : 'text-xl'}`}>{feature.stat}</span>
                  <span className="text-xs text-muted-foreground">{feature.statLabel}</span>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROCESS - Timeline Style */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="section-container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Workflow className="h-4 w-4" />
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Three Simple <span className="text-gradient-coral">Steps</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute left-[28px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

              {processSteps.map((step, i) => (
                <motion.div
                  key={i}
                  className={`relative flex items-center gap-6 mb-12 last:mb-0 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-14 h-14 rounded-full gradient-hero flex items-center justify-center text-white font-bold text-lg border-4 border-background z-10">
                    {i + 1}
                  </div>

                  {/* Card */}
                  <div className={`ml-20 md:ml-0 md:w-[calc(50%-40px)] ${i % 2 === 1 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <div className="glass-card p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">{step.phase}</span>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">{step.duration}</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                          <step.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Button size="lg" className="gradient-coral text-white coral-glow border-0 px-8" asChild>
                <Link to="/analyze" className="flex items-center gap-2">
                  Start Your Analysis
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Horizontal Scroll Cards */}
      <section className="py-24 md:py-32 bg-background overflow-hidden">
        <div className="section-container">
          <motion.div 
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-sm font-medium mb-4">
                <MessageCircle className="h-4 w-4" />
                Success Stories
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Real Results from<br />
                <span className="text-gradient-coral">Real Entrepreneurs</span>
              </h2>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-accent fill-accent" />
              ))}
              <span className="ml-2 text-muted-foreground">4.9/5 rating</span>
            </div>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="flex gap-6 px-4 md:px-8 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-[320px] md:w-[380px] snap-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="h-full p-6 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-white font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{t.name}</span>
                        <BadgeCheck className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-sm text-muted-foreground">{t.role}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-accent">{t.revenue}</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-foreground mb-4 leading-relaxed">"{t.content}"</p>

                {/* Rating */}
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-accent fill-accent" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BENEFITS - Split Design */}
      <section className="py-24 md:py-32 bg-primary text-white relative overflow-hidden">
        {/* Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_50%)]" />
        
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium mb-6">
                Why Nextminds AI
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Built for Bangladesh Entrepreneurs
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-lg">
                We understand the local market, suppliers, and challenges. Our AI is trained specifically for Bangladesh business context.
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/analyze">
                  Try It Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </motion.div>

            {/* Right - Checklist */}
            <motion.div
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <CircleCheck className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-medium">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ - Minimal Accordion */}
      <section className="py-24 md:py-32 bg-background">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-sm font-medium mb-4">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Common Questions
              </h2>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <AccordionItem 
                    value={`item-${i}`}
                    className="border border-border rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA - Final */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-primary via-primary to-emerald-700 text-white relative overflow-hidden">
        {/* Decorative */}
        <motion.div 
          className="absolute top-10 right-[10%] w-32 h-32 rounded-full bg-white/10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 left-[5%] w-20 h-20 rounded-2xl bg-accent/30 rotate-12"
          animate={{ rotate: [12, -12, 12] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="section-container relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 mb-8"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Rocket className="h-10 w-10" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
              Join 1,000+ entrepreneurs who transformed their ideas into successful businesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg" asChild>
                  <Link to="/analyze" className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Start Free Analysis
                  </Link>
                </Button>
              </motion.div>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6" asChild>
                <Link to="/pricing">View Plans</Link>
              </Button>
            </div>

            <p className="mt-8 text-sm text-white/50">
              Powered by <span className="font-medium text-white/70">SA Coder</span>
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
