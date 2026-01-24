import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
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
  Flame,
  Gift
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "Business Reality Check",
      description: "আপনার idea কতটা practical তা সৎভাবে জানুন। No sugar-coating, just facts।",
      color: "from-violet-500 to-purple-600",
      delay: 0
    },
    {
      icon: Package,
      title: "Product Sourcing",
      description: "Bangladesh-এ কোথা থেকে কিভাবে product সংগ্রহ করবেন — complete guide।",
      color: "from-blue-500 to-cyan-500",
      delay: 0.1
    },
    {
      icon: Truck,
      title: "Delivery & Payment",
      description: "Pathao, RedX, Steadfast — কোন courier ভালো? Payment gateway কোনটা?",
      color: "from-emerald-500 to-teal-500",
      delay: 0.2
    },
    {
      icon: Megaphone,
      title: "Marketing Strategy",
      description: "প্রথম ১০ customer কিভাবে পাবেন। Zero budget থেকে শুরু করার plan।",
      color: "from-orange-500 to-red-500",
      delay: 0.3
    },
    {
      icon: Globe,
      title: "Website Decision",
      description: "আপনার business-এ website দরকার কি না — honest answer with reasoning।",
      color: "from-indigo-500 to-blue-500",
      delay: 0.4
    },
    {
      icon: Target,
      title: "14-Day Action Plan",
      description: "Day 1 থেকে Day 14 পর্যন্ত exactly কি করবেন — step-by-step roadmap।",
      color: "from-pink-500 to-rose-500",
      delay: 0.5
    }
  ];

  const steps = [
    { 
      number: "১", 
      title: "আপনার Idea লিখুন", 
      description: "যে business করতে চান সেটা বিস্তারিত লিখুন — budget, location সব",
      icon: Lightbulb
    },
    { 
      number: "২", 
      title: "AI Analysis পান", 
      description: "2-3 মিনিটে brutally honest, practical analysis পাবেন",
      icon: Brain
    },
    { 
      number: "৩", 
      title: "Action Plan Follow করুন", 
      description: "14-day roadmap অনুযায়ী কাজ শুরু করুন — success guaranteed",
      icon: Rocket
    }
  ];

  const stats = [
    { value: "5,000+", label: "Ideas Analyzed", icon: BarChart3, color: "from-blue-500 to-cyan-400" },
    { value: "98%", label: "Satisfaction Rate", icon: Heart, color: "from-pink-500 to-rose-400" },
    { value: "1,000+", label: "Active Users", icon: Users, color: "from-violet-500 to-purple-400" },
    { value: "50+", label: "Success Stories", icon: Award, color: "from-amber-500 to-orange-400" }
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
      transition: { staggerChildren: 0.1 }
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
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-[5%] w-80 h-80 bg-primary/15 rounded-full blur-3xl float" />
        <div className="absolute top-32 right-[10%] w-[500px] h-[500px] bg-accent/12 rounded-full blur-3xl float-delayed" />
        <div className="absolute bottom-32 left-[15%] w-72 h-72 bg-purple-500/10 rounded-full blur-3xl float-slow" />
        <div className="absolute bottom-20 right-[25%] w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl float" />
        
        {/* Decorative Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div 
            key={i}
            className={`absolute w-${2 + i % 3} h-${2 + i % 3} rounded-full ${i % 2 === 0 ? 'bg-accent' : 'bg-primary'}`}
            style={{
              top: `${15 + (i * 12)}%`,
              left: `${10 + (i * 15)}%`,
            }}
            animate={{ 
              y: [-15, 15, -15], 
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        
        <div className="section-container relative z-10 py-16">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full text-sm font-medium mb-10 border border-accent/30"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="h-4 w-4 text-accent" />
              </motion.div>
              <span className="text-foreground">Bangladesh's #1 Business Intelligence Platform</span>
              <Shield className="h-4 w-4 text-primary" />
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-tight"
              style={{ 
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              <motion.span 
                className="text-primary inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Nextminds
              </motion.span>
              <motion.span 
                className="inline-block ml-2 md:ml-4 bg-gradient-to-r from-accent via-amber-400 to-orange-400 bg-clip-text text-transparent"
                style={{ 
                  WebkitBackgroundClip: 'text',
                  backgroundSize: '200% 100%'
                }}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  opacity: { duration: 0.6, delay: 0.4 },
                  y: { duration: 0.6, delay: 0.4 },
                  scale: { duration: 0.6, delay: 0.4 },
                  backgroundPosition: { duration: 4, repeat: Infinity, ease: "linear" }
                }}
              >
                AI
              </motion.span>
              <br />
              <motion.span 
                className="text-3xl md:text-4xl lg:text-5xl font-medium text-muted-foreground mt-4 block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Turn Ideas into Action
              </motion.span>
            </motion.h1>
            
            {/* Flow */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-lg md:text-xl text-muted-foreground mb-6"
            >
              {["Idea", "Product", "Delivery", "Marketing", "Success"].map((step, i) => (
                <span key={i} className="flex items-center gap-2 md:gap-4">
                  <span className={i === 4 ? "text-accent font-semibold" : ""}>{step}</span>
                  {i < 4 && <ArrowRight className="h-4 w-4 text-accent" />}
                </span>
              ))}
            </motion.div>
            
            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Raw business idea কে <span className="text-primary font-semibold">complete execution plan</span> এ convert করুন। 
              কোন motivational talk নয়, কোন false promise নয় — শুধু <span className="text-accent font-semibold">practical, honest, actionable guidance</span>।
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="xl" 
                  className="gradient-gold text-primary font-bold gold-glow px-10 py-7 text-lg rounded-2xl shadow-2xl"
                  asChild
                >
                  <Link to="/analyze" className="flex items-center gap-3">
                    <Zap className="h-6 w-6" />
                    Free তে Analyze করুন
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <Button 
                variant="outline" 
                size="lg" 
                className="glass-card border-primary/30 hover:border-primary/50 hover:bg-primary/5 px-8 py-6 text-base rounded-xl"
                asChild
              >
                <Link to="/pricing" className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Pricing দেখুন
                </Link>
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex -space-x-3">
                {["RA", "SI", "KH", "FR", "AB"].map((initial, i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center text-white text-sm font-semibold border-2 border-background"
                  >
                    {initial}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-semibold border-2 border-background">
                  +1k
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">1,000+</span> entrepreneurs trust Nextminds AI
              </p>
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="mt-10 text-sm text-muted-foreground"
            >
              Powered by <span className="font-semibold text-foreground">SA Coder</span>
            </motion.p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-muted-foreground">Scroll to explore</span>
              <ChevronDown className="h-6 w-6 text-muted-foreground" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
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
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
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
      <section className="py-24 md:py-32 bg-background relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="section-container">
          <motion.div 
            className="text-center mb-16 md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-5">
              ✨ Features
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
              আপনি কি কি <span className="text-gradient-gold">পাবেন?</span>
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
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="glass-card p-8 lg:p-10 rounded-3xl hover:shadow-card-hover transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                {/* Glow effect */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`} />
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl md:text-2xl mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-24 gradient-subtle relative overflow-hidden">
        <div className="absolute top-20 right-10 w-80 h-80 bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
        
        <div className="section-container relative z-10">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-5">
              🎬 Demo
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
            <div className="glass-card-strong rounded-3xl p-4 shadow-2xl">
              <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-primary/15 via-background to-accent/15 overflow-hidden flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                
                <motion.div 
                  className="w-24 h-24 rounded-full gradient-gold flex items-center justify-center gold-glow group-hover:scale-110 transition-transform duration-300 shadow-2xl"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ boxShadow: ["0 0 20px rgba(212,175,55,0.3)", "0 0 40px rgba(212,175,55,0.5)", "0 0 20px rgba(212,175,55,0.3)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Play className="h-10 w-10 text-primary ml-1" fill="currentColor" />
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
      <section className="py-24 md:py-32 bg-background">
        <div className="section-container">
          <motion.div 
            className="text-center mb-16 md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-5">
              🚀 Process
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
              কিভাবে <span className="text-gradient-gold">কাজ করে?</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl">মাত্র ৩টি সহজ step-এ আপনার business plan ready</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 lg:gap-12"
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
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-1 bg-gradient-to-r from-accent/60 via-accent/30 to-transparent rounded-full" />
                )}
                
                <motion.div 
                  className="relative mb-8"
                  whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
                >
                  <div className="w-24 h-24 gradient-gold rounded-3xl flex items-center justify-center text-4xl font-bold text-primary mx-auto gold-glow shadow-xl">
                    {step.number}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                </motion.div>
                
                <h3 className="font-bold text-xl md:text-2xl mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA after steps */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="gradient-hero text-white px-8 py-6 text-lg rounded-xl"
              asChild
            >
              <Link to="/analyze" className="flex items-center gap-2">
                এখনই শুরু করুন
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 gradient-subtle relative overflow-hidden">
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="section-container relative z-10">
          <motion.div 
            className="text-center mb-16 md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-5">
              💬 Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
              আমাদের <span className="text-gradient-gold">Customers</span> বলছেন
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
                className="glass-card-strong p-8 lg:p-10 rounded-3xl relative"
              >
                <Quote className="absolute top-6 right-6 h-10 w-10 text-accent/20" />
                
                <div className="flex gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                  ))}
                </div>
                
                <p className="text-foreground text-lg mb-8 leading-relaxed">"{testimonial.content}"</p>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full gradient-hero flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{testimonial.name}</span>
                      {testimonial.verified && (
                        <BadgeCheck className="h-5 w-5 text-primary" />
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
      <section className="py-24 md:py-32 bg-background">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-14"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-5">
                💎 Why Us
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
                কেন <span className="text-gradient-gold">Nextminds AI?</span>
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
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="flex items-center gap-4 p-5 lg:p-6 glass-card rounded-2xl cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <point.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-lg font-medium">{point.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 gradient-subtle">
        <div className="section-container">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-5">
              ❓ FAQ
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
              সাধারণ <span className="text-gradient-gold">প্রশ্নসমূহ</span>
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
                  className="glass-card-strong rounded-2xl px-6 lg:px-8 border-none"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-6">
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
      <section className="py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        {/* Floating elements */}
        <motion.div 
          className="absolute top-20 left-[10%] w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm"
          animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-[15%] w-16 h-16 rounded-full bg-accent/20"
          animate={{ y: [20, -20, 20], scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
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
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button 
                size="xl" 
                className="bg-white text-primary font-bold hover:bg-white/90 px-12 py-8 text-xl rounded-2xl shadow-2xl"
                asChild
              >
                <Link to="/analyze" className="flex items-center gap-4">
                  <Sparkles className="h-6 w-6" />
                  Free তে Business Analyze করুন
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
            </motion.div>
            
            <p className="mt-8 text-white/60 text-sm">
              Powered by <span className="font-semibold text-white/80">SA Coder</span>
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
