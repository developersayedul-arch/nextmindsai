import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { 
  Globe, 
  CheckCircle2, 
  MessageCircle, 
  ArrowLeft,
  Shield,
  Zap,
  Users,
  Code,
  Smartphone,
  ShoppingCart,
  Send,
  Star,
  Clock,
  Headphones,
  Award,
  Sparkles,
  ArrowRight,
  FileText,
  Layout as LayoutIcon,
  Palette
} from "lucide-react";

const ServicesPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    businessIdea: "",
    serviceInterest: "",
    budgetRange: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    {
      icon: Globe,
      title: "ল্যান্ডিং পেজ",
      titleEn: "Landing Page",
      description: "অর্ডার ফর্ম ও WhatsApp ইন্টিগ্রেশন সহ",
      price: "৳4,999",
      priceNote: "থেকে শুরু",
      features: ["Mobile-optimized design", "WhatsApp integration", "Order form", "SSL certificate", "১ মাস ফ্রি সাপোর্ট"],
      deliveryTime: "৫-৭ দিন",
      popular: false
    },
    {
      icon: ShoppingCart,
      title: "ই-কমার্স ওয়েবসাইট",
      titleEn: "E-commerce Website",
      description: "পেমেন্ট গেটওয়ে সহ সম্পূর্ণ অনলাইন স্টোর",
      price: "৳14,999",
      priceNote: "থেকে শুরু",
      features: ["Product catalog", "Cart & checkout", "bKash/Nagad integration", "Admin panel", "৩ মাস ফ্রি সাপোর্ট"],
      deliveryTime: "১৫-২০ দিন",
      popular: true
    },
    {
      icon: Smartphone,
      title: "মোবাইল এপ",
      titleEn: "Mobile App",
      description: "Android ও iOS এপ ডেভেলপমেন্ট",
      price: "৳29,999",
      priceNote: "থেকে শুরু",
      features: ["Cross-platform (Android + iOS)", "Push notifications", "Admin dashboard", "App store publish", "৬ মাস ফ্রি সাপোর্ট"],
      deliveryTime: "৩০-৪৫ দিন",
      popular: false
    },
    {
      icon: Code,
      title: "কাস্টম সফটওয়্যার",
      titleEn: "Custom Software",
      description: "আপনার বিজনেসের জন্য কাস্টম সলিউশন",
      price: "৳49,999",
      priceNote: "থেকে শুরু",
      features: ["Custom features", "Database design", "API development", "Ongoing support", "Source code handover"],
      deliveryTime: "৪৫-৬০ দিন",
      popular: false
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "SA Coder Verified",
      description: "কোয়ালিটি নিশ্চিত সলিউশন"
    },
    {
      icon: Clock,
      title: "দ্রুত ডেলিভারি",
      description: "সময়মতো delivery guarantee"
    },
    {
      icon: Headphones,
      title: "24/7 সাপোর্ট",
      description: "Launch পরেও continuous সাপোর্ট"
    },
    {
      icon: Award,
      title: "100+ Projects",
      description: "Proven track record"
    }
  ];

  const testimonials = [
    {
      name: "রাফি আহমেদ",
      business: "Fashion Store",
      content: "E-commerce site বানিয়ে ১ মাসে ২০০+ orders পেয়েছি!",
      rating: 5
    },
    {
      name: "সানজিদা ইসলাম",
      business: "Beauty Products",
      content: "Landing page এ WhatsApp orders আসছে প্রতিদিন।",
      rating: 5
    },
    {
      name: "কামাল হোসেন",
      business: "Restaurant",
      content: "Mobile app এ food order system চালু করেছি। Customer happy!",
      rating: 5
    }
  ];

  const whatsappNumber = "8801585796477";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.whatsapp.trim() || !formData.serviceInterest) {
      toast.error("নাম, WhatsApp নম্বর এবং সার্ভিস সিলেক্ট করুন");
      return;
    }

    // Validate WhatsApp number
    const phoneRegex = /^01[3-9]\d{8}$/;
    const cleanPhone = formData.whatsapp.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast.error("সঠিক WhatsApp নম্বর দিন (যেমন: 01712345678)");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('website_leads')
        .insert({
          name: formData.name.trim(),
          whatsapp_number: cleanPhone,
          email: formData.email.trim() || null,
          business_idea: formData.businessIdea.trim() || null,
          service_interest: formData.serviceInterest,
          budget_range: formData.budgetRange || null,
          source: 'services_page'
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("ধন্যবাদ! আমরা শীঘ্রই যোগাযোগ করব।");
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <motion.div 
          className="absolute top-20 right-10 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="section-container relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            হোমে ফিরে যান
          </Link>

          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              SA Coder Web Development Services
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              আপনার বিজনেসের জন্য{" "}
              <span 
                style={{
                  background: 'linear-gradient(135deg, #e85a3c 0%, #f5734d 50%, #d94a2e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                প্রফেশনাল
              </span>{" "}
              ওয়েব সলিউশন
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Landing page থেকে শুরু করে custom software — সব ধরনের digital solution এক জায়গায়
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Strip */}
      <section className="py-6 bg-primary text-white">
        <div className="section-container">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{benefit.title}</div>
                  <div className="text-sm text-white/70">{benefit.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">আমাদের সার্ভিস সমূহ</h2>
            <p className="text-muted-foreground">আপনার প্রয়োজন অনুযায়ী সার্ভিস বেছে নিন</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className={`relative result-card hover:shadow-xl transition-all ${service.popular ? 'ring-2 ring-accent' : ''}`}
              >
                {service.popular && (
                  <div className="absolute -top-3 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 gradient-coral rounded-xl flex items-center justify-center shadow-lg">
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.titleEn}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{service.description}</p>

                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{service.price}</span>
                    <span className="text-sm text-muted-foreground">{service.priceNote}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>ডেলিভারি: {service.deliveryTime}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {service.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-secondary/30">
        <div className="section-container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">আমাদের ক্লায়েন্টরা কী বলছেন</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div 
                key={i}
                className="glass-card p-6 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.business}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="contact-form" className="py-16 md:py-24">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                ফ্রি কনসালটেশন নিন
              </h2>
              <p className="text-muted-foreground">
                ফর্ম পূরণ করুন, আমরা ২৪ ঘন্টার মধ্যে WhatsApp এ যোগাযোগ করব
              </p>
            </motion.div>

            {isSubmitted ? (
              <motion.div 
                className="text-center glass-card p-10 rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-20 h-20 gradient-coral rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">ধন্যবাদ!</h3>
                <p className="text-muted-foreground mb-6">
                  আপনার রিকোয়েস্ট পেয়েছি। আমরা শীঘ্রই WhatsApp এ যোগাযোগ করব।
                </p>
                <Button 
                  className="gradient-coral text-white"
                  onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("আসসালামু আলাইকুম, আমি Website/App সার্ভিস নিতে চাই।")}`, "_blank")}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  এখনই WhatsApp এ মেসেজ করুন
                </Button>
              </motion.div>
            ) : (
              <motion.form 
                onSubmit={handleSubmit}
                className="glass-card p-8 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="name">আপনার নাম *</Label>
                    <Input
                      id="name"
                      placeholder="যেমন: মোঃ করিম"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp নম্বর *</Label>
                    <Input
                      id="whatsapp"
                      placeholder="01712345678"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label htmlFor="email">ইমেইল (ঐচ্ছিক)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-2"
                  />
                </div>

                <div className="mb-6">
                  <Label>কোন সার্ভিসে আগ্রহী? *</Label>
                  <RadioGroup 
                    value={formData.serviceInterest}
                    onValueChange={(value) => setFormData({...formData, serviceInterest: value})}
                    className="mt-3 grid grid-cols-2 gap-3"
                  >
                    {services.map((service, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem value={service.titleEn} id={`service-${i}`} />
                        <Label htmlFor={`service-${i}`} className="cursor-pointer">
                          {service.title}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="mb-6">
                  <Label>আপনার বাজেট রেঞ্জ</Label>
                  <RadioGroup 
                    value={formData.budgetRange}
                    onValueChange={(value) => setFormData({...formData, budgetRange: value})}
                    className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3"
                  >
                    {["৳5K-10K", "৳10K-25K", "৳25K-50K", "৳50K+"].map((range, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem value={range} id={`budget-${i}`} />
                        <Label htmlFor={`budget-${i}`} className="cursor-pointer">{range}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="mb-6">
                  <Label htmlFor="businessIdea">আপনার বিজনেস সম্পর্কে বলুন (ঐচ্ছিক)</Label>
                  <Textarea
                    id="businessIdea"
                    placeholder="আপনি কী ধরনের বিজনেস করতে চান বা করছেন..."
                    value={formData.businessIdea}
                    onChange={(e) => setFormData({...formData, businessIdea: e.target.value})}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full gradient-coral text-white py-6 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "জমা হচ্ছে..."
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      ফ্রি কনসালটেশন বুক করুন
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  অথবা সরাসরি{" "}
                  <button
                    type="button"
                    onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
                    className="text-primary font-medium hover:underline"
                  >
                    WhatsApp এ মেসেজ করুন
                  </button>
                </p>
              </motion.form>
            )}
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <section className="py-8 bg-muted/30 border-t">
        <div className="section-container text-center">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold text-foreground">SA Coder</span> — Trusted by 100+ businesses
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
