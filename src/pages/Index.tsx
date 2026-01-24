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
  ChevronDown,
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
  CircleDot
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
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    {
      icon: Brain,
      title: "Business Reality Check",
      description: "আপনার idea কতটা practical তা সৎভাবে জানুন। No sugar-coating, just facts।",
      gradient: "from-emerald-500 to-teal-600",
      delay: 0
    },
    {
      icon: Package,
      title: "Product Sourcing",
      description: "Bangladesh-এ কোথা থেকে কিভাবে product সংগ্রহ করবেন — complete guide।",
      gradient: "from-cyan-500 to-blue-600",
      delay: 0.1
    },
    {
      icon: Truck,
      title: "Delivery & Payment",
      description: "Pathao, RedX, Steadfast — কোন courier ভালো? Payment gateway কোনটা?",
      gradient: "from-violet-500 to-purple-600",
      delay: 0.2
    },
    {
      icon: Megaphone,
      title: "Marketing Strategy",
      description: "প্রথম ১০ customer কিভাবে পাবেন। Zero budget থেকে শুরু করার plan।",
      gradient: "from-rose-500 to-pink-600",
      delay: 0.3
    },
    {
      icon: Globe,
      title: "Website Decision",
      description: "আপনার business-এ website দরকার কি না — honest answer with reasoning।",
      gradient: "from-amber-500 to-orange-600",
      delay: 0.4
    },
    {
      icon: Target,
      title: "14-Day Action Plan",
      description: "Day 1 থেকে Day 14 পর্যন্ত exactly কি করবেন — step-by-step roadmap।",
      gradient: "from-lime-500 to-green-600",
      delay: 0.5
    }
  ];

  const steps = [
    { 
      number: "01", 
      title: "আপনার Idea লিখুন", 
      description: "যে business করতে চান সেটা বিস্তারিত লিখুন — budget, location সব",
      icon: Lightbulb,
      color: "bg-emerald-500"
    },
    { 
      number: "02", 
      title: "AI Analysis পান", 
      description: "2-3 মিনিটে brutally honest, practical analysis পাবেন",
      icon: Brain,
      color: "bg-accent"
    },
    { 
      number: "03", 
      title: "Action Plan Follow করুন", 
      description: "14-day roadmap অনুযায়ী কাজ শুরু করুন — success guaranteed",
      icon: Rocket,
      color: "bg-primary"
    }
  ];

  const stats = [
    { value: "5,000+", label: "Ideas Analyzed", icon: BarChart3 },
    { value: "98%", label: "Satisfaction Rate", icon: Heart },
    { value: "1,000+", label: "Active Users", icon: Users },
    { value: "50+", label: "Success Stories", icon: Award }
  ];

  const testimonials = [
    {
      name: "রাহাত আহমেদ",
      role: "E-commerce Entrepreneur",
      content: "Nextminds AI আমার business idea কে completely নতুন দৃষ্টিভঙ্গি দিয়েছে। 14-day plan follow করে ১ মাসে ৫০+ orders পেয়েছি!",
      rating: 5,
      avatar: "RA",
      verified: true
    },
    {
      name: "সাবরিনা ইসলাম",
      role: "Startup Founder",
      content: "Website বানাবো কি না decide করতে পারছিলাম না। Nextminds বুঝিয়ে দিল যে আমার case-এ Facebook page ই যথেষ্ট। টাকা বাঁচলো!",
      rating: 5,
      avatar: "SI",
      verified: true
    },
    {
      name: "কামরুল হাসান",
      role: "Small Business Owner",
      content: "Product sourcing এর suggestions অসাধারণ ছিল! Chawkbazar থেকে supplier পেয়ে গেলাম, margin অনেক ভালো হচ্ছে।",
      rating: 5,
      avatar: "KH",
      verified: true
    },
    {
      name: "ফারিয়া রহমান",
      role: "Home Business Owner",
      content: "Housewife হয়ে business করা সহজ না। কিন্তু Nextminds এর step-by-step guide follow করে এখন monthly ৩০k+ income!",
      rating: 5,
      avatar: "FR",
      verified: true
    }
  ];

  const faqs = [
    {
      question: "Nextminds AI কিভাবে কাজ করে?",
      answer: "আপনি আপনার business idea, budget, location লিখবেন। আমাদের AI সেটা analyze করে practical, honest feedback দেবে। সাথে 14-day action plan, product sourcing tips, marketing strategy — সব পাবেন।"
    },
    {
      question: "এটা কি শুধু Bangladesh-এর জন্য?",
      answer: "হ্যাঁ! আমাদের সব suggestions Bangladesh market, local suppliers, delivery systems এবং payment methods এর উপর based। Dhaka, Chittagong, Sylhet — সব city cover করি।"
    },
    {
      question: "Analysis করতে কত সময় লাগে?",
      answer: "মাত্র 2-3 মিনিট! AI instantly আপনার idea analyze করে detailed report generate করে। Report টা PDF হিসেবে download করে রাখতে পারবেন।"
    },
    {
      question: "Free version-এ কি কি পাবো?",
      answer: "Free-তে Basic Reality Check এবং Website Decision পাবেন। Full sourcing guide, marketing strategy, এবং 14-day plan এর জন্য paid plan নিতে হবে।"
    },
    {
      question: "Payment কিভাবে করব?",
      answer: "bKash, Nagad, Rocket সহ সব popular mobile banking এ payment করতে পারবেন। Card payment-ও available। সব transaction secure।"
    },
    {
      question: "Refund policy কি?",
      answer: "আমরা quality guarantee দিই। Analysis এ satisfied না হলে বা technical issue হলে আমরা re-analysis free তে দেব অথবা refund process করব।"
    }
  ];

  const whyChooseUs = [
    { icon: BadgeCheck, text: "কোন motivational talk নয় — শুধু সৎ, practical advice" },
    { icon: Globe, text: "Bangladesh context-এ সব সাজেশন — local suppliers, local market" },
    { icon: Target, text: "Website দরকার কি না — honest decision with reasoning" },
    { icon: Clock, text: "14-day action plan সাথে পাবেন — step by step execution" },
    { icon: Package, text: "Sourcing, delivery, marketing — সব একসাথে এক report-এ" },
    { icon: Shield, text: "No fake promises — যা possible তাই বলি" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <Layout>
      {/* Hero Section - Emerald & Coral Theme */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Aurora Background */}
        <div className="absolute inset-0 aurora-bg" />
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        
        {/* Animated Blobs */}
        <motion.div 
          className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] blob-animate"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-accent/15 rounded-full blur-[140px] blob-animate"
          style={{ animationDelay: '-4s' }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px]"
          animate={{ y: [-30, 30, -30] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i}
              className={`absolute w-3 h-3 rounded-full ${i % 2 === 0 ? 'bg-accent/40' : 'bg-primary/30'}`}
              style={{
                top: `${20 + i * 15}%`,
                left: `${5 + i * 20}%`,
              }}
              animate={{ 
                y: [-20, 20, -20], 
                x: [-10, 10, -10],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
          
          {/* Floating Rings */}
          <motion.div 
            className="absolute top-[25%] right-[12%] w-20 h-20 border-2 border-accent/20 rounded-full"
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-[30%] left-[8%] w-16 h-16 border border-primary/20 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="section-container relative z-10 py-20"
        >
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2.5 glass-card px-5 py-2.5 rounded-full text-sm font-medium mb-10 border border-primary/20"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Leaf className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-foreground/90">Bangladesh's #1 Business Intelligence Platform</span>
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-[1.1]"
              style={{ 
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              <span className="text-primary">Nextminds</span>
              <motion.span 
                className="ml-2 md:ml-4 bg-gradient-to-r from-accent via-orange-400 to-rose-500 bg-clip-text text-transparent"
                style={{ 
                  WebkitBackgroundClip: 'text',
                  backgroundSize: '200% 100%'
                }}
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                AI
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-2xl md:text-3xl font-medium text-foreground/70 mb-8"
            >
              Turn Ideas into Action
            </motion.p>
            
            {/* Flow Diagram */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm md:text-base text-muted-foreground mb-8"
            >
              {["Idea", "Analysis", "Strategy", "Execution", "Success"].map((step, i) => (
                <span key={i} className="flex items-center gap-2 md:gap-3">
                  <motion.span 
                    className={`px-3 py-1.5 rounded-lg ${i === 4 ? "bg-accent/15 text-accent font-semibold" : "bg-secondary/80"}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {step}
                  </motion.span>
                  {i < 4 && (
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    >
                      <ArrowRight className="h-4 w-4 text-primary/50" />
                    </motion.div>
                  )}
                </span>
              ))}
            </motion.div>
            
            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Raw business idea কে <span className="text-primary font-semibold">complete execution plan</span> এ convert করুন। 
              কোন motivational talk নয়, শুধু <span className="text-accent font-semibold">practical, honest, actionable guidance</span>।
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="xl" 
                  className="gradient-coral text-white font-bold coral-glow px-10 py-7 text-lg rounded-2xl shadow-2xl border-0"
                  asChild
                >
                  <Link to="/analyze" className="flex items-center gap-3">
                    <Zap className="h-6 w-6" />
                    Free তে Analyze করুন
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="glass-card border-primary/25 hover:border-primary/40 hover:bg-primary/5 px-8 py-6 text-base rounded-xl"
                  asChild
                >
                  <Link to="/pricing" className="flex items-center gap-2">
                    <Gem className="h-5 w-5" />
                    Pricing দেখুন
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex -space-x-3">
                {["RA", "SI", "KH", "FR", "AB"].map((initial, i) => (
                  <motion.div 
                    key={i} 
                    className="w-11 h-11 rounded-full gradient-hero flex items-center justify-center text-white text-sm font-semibold border-3 border-background shadow-md"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    {initial}
                  </motion.div>
                ))}
                <motion.div 
                  className="w-11 h-11 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold border-3 border-background"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  +1k
                </motion.div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">1,000+</span> entrepreneurs trust us
                </span>
              </div>
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="mt-12 text-sm text-muted-foreground"
            >
              Powered by <span className="font-semibold text-primary">SA Coder</span>
            </motion.p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-muted-foreground">Scroll to explore</span>
              <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
                <motion.div 
                  className="w-1.5 h-3 rounded-full bg-accent"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="section-container relative z-10">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group"
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-5 shadow-lg group-hover:bg-white/15 transition-colors"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </motion.div>
                <motion.div 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-white/70 text-sm md:text-base font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 md:py-36 bg-background relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="section-container">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Layers className="h-4 w-4" />
              Features
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              আপনি কি কি <span className="text-gradient-coral">পাবেন?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl">
              প্রতিটি business idea-র জন্য complete execution guide — সব এক জায়গায়
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="glass-card p-8 lg:p-10 rounded-3xl hover:shadow-card-hover transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                {/* Glow effect */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />
                
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg relative overflow-hidden`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <feature.icon className="h-8 w-8 text-white relative z-10" />
                  <motion.div 
                    className="absolute inset-0 bg-white/20"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  />
                </motion.div>
                <h3 className="font-bold text-xl md:text-2xl mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-28 gradient-subtle relative overflow-hidden">
        <motion.div 
          className="absolute top-20 right-10 w-80 h-80 bg-accent/8 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-10 w-72 h-72 bg-primary/8 rounded-full blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="section-container relative z-10">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-6">
              <Play className="h-4 w-4" />
              Demo
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
              দেখুন কিভাবে <span className="text-gradient">কাজ করে</span>
            </h2>
            <p className="text-muted-foreground text-lg">২ মিনিটে সব বুঝে যাবেন</p>
          </motion.div>

          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card-strong rounded-3xl p-3 md:p-4 shadow-2xl">
              <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                <motion.div 
                  className="w-24 h-24 rounded-full gradient-coral flex items-center justify-center coral-glow shadow-2xl relative overflow-hidden"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: [
                      "0 0 30px hsl(12 85% 60% / 0.3)",
                      "0 0 50px hsl(12 85% 60% / 0.5)",
                      "0 0 30px hsl(12 85% 60% / 0.3)"
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Play className="h-10 w-10 text-white ml-1.5" fill="currentColor" />
                </motion.div>
                
                <div className="absolute bottom-5 left-5 glass-card px-5 py-3 rounded-xl">
                  <p className="text-sm font-semibold">2:30 - Quick Demo Video</p>
                </div>
                
                <div className="absolute top-5 right-5 glass-card px-4 py-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Coming Soon</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-28 md:py-36 bg-background">
        <div className="section-container">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-6">
              <CircleDot className="h-4 w-4" />
              Process
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
              কিভাবে <span className="text-gradient-coral">কাজ করে?</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl">মাত্র ৩টি সহজ step-এ আপনার business plan ready</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 lg:gap-16 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="text-center relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-[3px]">
                    <div className="h-full bg-gradient-to-r from-primary/40 to-transparent rounded-full" />
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-accent rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '50%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.3, duration: 0.8 }}
                    />
                  </div>
                )}
                
                <motion.div 
                  className="relative mb-8"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-28 h-28 ${step.color} rounded-3xl flex items-center justify-center text-3xl font-bold text-white mx-auto shadow-xl relative overflow-hidden`}>
                    {step.number}
                    <motion.div 
                      className="absolute inset-0 bg-white/10"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                    />
                  </div>
                  <motion.div 
                    className="absolute -bottom-2 -right-2 md:right-[calc(50%-3.5rem)] w-12 h-12 rounded-xl bg-card border-2 border-border flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 10 }}
                  >
                    <step.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                </motion.div>
                
                <h3 className="font-bold text-xl md:text-2xl mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA after steps */}
          <motion.div 
            className="text-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button 
                size="lg" 
                className="gradient-hero text-white px-10 py-7 text-lg rounded-2xl shadow-xl"
                asChild
              >
                <Link to="/analyze" className="flex items-center gap-3">
                  এখনই শুরু করুন
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-28 md:py-36 gradient-subtle relative overflow-hidden">
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-[120px]" />
        
        <div className="section-container relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-6">
              <Quote className="h-4 w-4" />
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
              আমাদের <span className="text-gradient-coral">Customers</span> বলছেন
            </h2>
            <p className="text-muted-foreground text-lg">Real success stories from real entrepreneurs</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="glass-card-strong p-8 lg:p-10 rounded-3xl relative group"
              >
                <Quote className="absolute top-6 right-6 h-12 w-12 text-accent/10 group-hover:text-accent/20 transition-colors" />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                  ))}
                </div>
                
                <p className="text-foreground text-lg mb-8 leading-relaxed">"{testimonial.content}"</p>
                
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    whileHover={{ rotate: 5 }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{testimonial.name}</span>
                      {testimonial.verified && (
                        <BadgeCheck className="h-5 w-5 text-accent" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-28 md:py-36 bg-background">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-6">
                <Gem className="h-4 w-4" />
                Why Us
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
                কেন <span className="text-gradient-coral">Nextminds AI?</span>
              </h2>
              <p className="text-muted-foreground text-lg">কারণ আমরা different</p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 gap-4 lg:gap-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {whyChooseUs.map((point, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  whileHover={{ x: 8, scale: 1.01 }}
                  className="flex items-center gap-5 p-5 lg:p-6 glass-card rounded-2xl cursor-pointer group"
                >
                  <motion.div 
                    className="w-14 h-14 rounded-xl gradient-coral flex items-center justify-center flex-shrink-0 shadow-lg"
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <point.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <span className="text-lg font-medium">{point.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-28 md:py-36 gradient-subtle">
        <div className="section-container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" />
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
              সাধারণ <span className="text-gradient-coral">প্রশ্নসমূহ</span>
            </h2>
            <p className="text-muted-foreground text-lg">আপনার প্রশ্নের উত্তর এখানে</p>
          </motion.div>

          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="glass-card-strong rounded-2xl px-6 lg:px-8 border-none overflow-hidden"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-6 [&[data-state=open]>svg]:text-accent">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Floating elements */}
        <motion.div 
          className="absolute top-20 left-[10%] w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm"
          animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-[15%] w-16 h-16 rounded-2xl bg-accent/30"
          animate={{ y: [20, -20, 20], scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-[40%] right-[8%] w-8 h-8 rounded-full bg-white/15"
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <div className="section-container relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block mb-10"
            >
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto shadow-2xl">
                <Rocket className="h-12 w-12 text-accent" />
              </div>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              আজই শুরু করুন
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto">
              আপনার business idea-কে reality তে convert করার প্রথম step নিন।
              <br />
              <span className="text-accent font-semibold">1,000+</span> entrepreneurs already trust us.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button 
                size="xl" 
                className="bg-white text-primary font-bold hover:bg-white/95 px-12 py-8 text-xl rounded-2xl shadow-2xl"
                asChild
              >
                <Link to="/analyze" className="flex items-center gap-4">
                  <Sparkles className="h-6 w-6" />
                  Free তে Business Analyze করুন
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
            </motion.div>
            
            <p className="mt-10 text-white/60 text-sm">
              Powered by <span className="font-semibold text-white/80">SA Coder</span>
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
