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
  Sparkles
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
      icon: Lightbulb,
      title: "Business Reality Check",
      description: "আপনার idea কতটা practical তা সৎভাবে জানুন",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Package,
      title: "Product Sourcing",
      description: "কোথা থেকে কিভাবে product সংগ্রহ করবেন",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Truck,
      title: "Delivery Plan",
      description: "Delivery ও payment method সাজেশন",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Megaphone,
      title: "Marketing Strategy",
      description: "প্রথম ১০ customer কিভাবে পাবেন",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Globe,
      title: "Website Decision",
      description: "Website দরকার কি না - সৎ উত্তর পান",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Target,
      title: "14-Day Action Plan",
      description: "Step-by-step execution roadmap",
      color: "from-rose-500 to-red-500"
    }
  ];

  const steps = [
    { number: "১", title: "আপনার Idea লিখুন", description: "যে business করতে চান সেটা বিস্তারিত লিখুন" },
    { number: "২", title: "AI Analysis পান", description: "Brutally honest, practical analysis পাবেন" },
    { number: "৩", title: "Action Plan Follow করুন", description: "14-day roadmap অনুযায়ী কাজ শুরু করুন" }
  ];

  const stats = [
    { value: "5000+", label: "Business Ideas Analyzed", icon: TrendingUp },
    { value: "98%", label: "Customer Satisfaction", icon: Star },
    { value: "1000+", label: "Active Users", icon: Users },
    { value: "50+", label: "Success Stories", icon: Award }
  ];

  const testimonials = [
    {
      name: "রাহাত আহমেদ",
      role: "E-commerce Entrepreneur",
      content: "Nextminds AI আমার business idea কে completely নতুন দৃষ্টিভঙ্গি দিয়েছে। এখন আমি সঠিক পথে আছি।",
      rating: 5,
      avatar: "RA"
    },
    {
      name: "সাবরিনা ইসলাম",
      role: "Startup Founder",
      content: "14-day action plan টা সত্যিই game changer! Step by step guide পেয়ে সব কিছু সহজ হয়ে গেছে।",
      rating: 5,
      avatar: "SI"
    },
    {
      name: "কামরুল হাসান",
      role: "Small Business Owner",
      content: "Website দরকার কি না সেই decision নিতে এত দিন confused ছিলাম। এখন clear picture পেয়েছি।",
      rating: 5,
      avatar: "KH"
    }
  ];

  const faqs = [
    {
      question: "Nextminds AI কিভাবে কাজ করে?",
      answer: "আপনি আপনার business idea লিখবেন, আমাদের AI সেটা analyze করে practical, honest feedback দেবে। সাথে 14-day action plan, product sourcing tips, marketing strategy সব পাবেন।"
    },
    {
      question: "এটা কি শুধু Bangladesh-এর জন্য?",
      answer: "হ্যাঁ! আমাদের সব suggestions Bangladesh market, local suppliers, delivery systems এবং payment methods এর উপর based।"
    },
    {
      question: "Analysis করতে কত সময় লাগে?",
      answer: "মাত্র 2-3 মিনিট! AI instantly আপনার idea analyze করে detailed report generate করে।"
    },
    {
      question: "Payment কিভাবে করব?",
      answer: "bKash, Nagad, Rocket সহ সব popular mobile banking এবং bank transfer এ payment করতে পারবেন।"
    },
    {
      question: "Refund policy কি?",
      answer: "আমরা quality guarantee দিই। Analysis এ satisfied না হলে 7 দিনের মধ্যে full refund পাবেন।"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl float" />
        <div className="absolute top-40 right-[15%] w-96 h-96 bg-accent/10 rounded-full blur-3xl float-delayed" />
        <div className="absolute bottom-20 left-[20%] w-64 h-64 bg-accent/8 rounded-full blur-3xl float-slow" />
        
        {/* Decorative Shapes */}
        <motion.div 
          className="absolute top-32 right-[25%] w-4 h-4 bg-accent rounded-full"
          animate={{ y: [-10, 10, -10], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-48 left-[30%] w-3 h-3 bg-primary rounded-full"
          animate={{ y: [10, -10, 10], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-40 right-[20%] w-2 h-2 bg-accent rounded-full"
          animate={{ y: [-15, 15, -15], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        />
        
        <div className="section-container relative z-10 py-20">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-accent/20"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-foreground">Bangladesh-focused Business Intelligence</span>
              <Shield className="h-4 w-4 text-primary" />
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
            >
              <span className="text-primary">Nextminds</span>
              <span className="text-gradient-gold"> AI</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-4 font-light"
            >
              Idea → Product → Delivery → Marketing → Success
            </motion.p>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Raw business idea কে <span className="text-primary font-medium">complete execution plan</span> এ convert করুন। 
              কোন motivational talk নয় — শুধু <span className="text-accent font-medium">practical, honest guidance</span>।
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button 
                size="xl" 
                className="gradient-gold text-primary font-semibold gold-glow hover:scale-105 transition-all duration-300 px-8 py-6 text-lg rounded-2xl"
                asChild
              >
                <Link to="/analyze" className="flex items-center gap-3">
                  <Zap className="h-5 w-5" />
                  Business Idea Analyze করুন
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="glass-card border-primary/20 hover:border-primary/40 px-6 py-5 text-base rounded-xl"
                asChild
              >
                <Link to="/pricing" className="flex items-center gap-2">
                  Pricing দেখুন
                </Link>
              </Button>
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="mt-8 text-sm text-muted-foreground"
            >
              Powered by <span className="font-semibold text-foreground">SA Coder</span>
            </motion.p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-6 w-6 text-muted-foreground" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="section-container relative z-10">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
                  <stat.icon className="h-7 w-7 text-accent" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-display">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="section-container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              কি কি <span className="text-gradient-gold">পাবেন?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              প্রতিটি business idea-র জন্য complete execution guide
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                className="glass-card p-8 rounded-3xl hover:shadow-card-hover transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-semibold text-xl mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-24 gradient-subtle relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="section-container relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
              Demo
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              দেখুন কিভাবে <span className="text-gradient">কাজ করে</span>
            </h2>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card-strong rounded-3xl p-3 shadow-xl">
              <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-primary/5" />
                <motion.div 
                  className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center gold-glow group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
                </motion.div>
                <div className="absolute bottom-4 left-4 glass-card px-4 py-2 rounded-lg">
                  <p className="text-sm font-medium">2 মিনিটে দেখুন কিভাবে শুরু করবেন</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="section-container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
              Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              কিভাবে <span className="text-gradient-gold">কাজ করে?</span>
            </h2>
            <p className="text-muted-foreground text-lg">৩টি সহজ step-এ আপনার business plan ready</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
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
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-accent/50 to-transparent" />
                )}
                <motion.div 
                  className="w-20 h-20 gradient-gold rounded-3xl flex items-center justify-center text-3xl font-bold text-primary mx-auto mb-6 gold-glow"
                  whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
                >
                  {step.number}
                </motion.div>
                <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 gradient-subtle relative overflow-hidden">
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="section-container relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              আমাদের <span className="text-gradient-gold">Customers</span> বলছেন
            </h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
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
                className="glass-card-strong p-8 rounded-3xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Unique Selling Points */}
      <section className="py-24 bg-background">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                কেন <span className="text-gradient-gold">Nextminds AI?</span>
              </h2>
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {[
                "কোন motivational talk নয় — শুধু সৎ, practical advice",
                "Bangladesh context-এ সব সাজেশন",
                "Website দরকার কি না — honest decision",
                "14-day action plan সাথে পাবেন",
                "Sourcing, delivery, marketing — সব একসাথে"
              ].map((point, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 p-5 glass-card rounded-2xl cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg">{point}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 gradient-subtle">
        <div className="section-container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              সাধারণ <span className="text-gradient-gold">প্রশ্নসমূহ</span>
            </h2>
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
                  className="glass-card-strong rounded-2xl px-6 border-none"
                >
                  <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="section-container relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-8"
            >
              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto">
                <Zap className="h-10 w-10 text-accent" />
              </div>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              আজই শুরু করুন
            </h2>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              আপনার business idea-কে reality তে convert করার প্রথম step নিন।
              <br />
              <span className="text-accent font-medium">1000+</span> entrepreneurs already trust us.
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
                  <Sparkles className="h-5 w-5" />
                  Business Idea Analyze করুন
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

export default Index;
