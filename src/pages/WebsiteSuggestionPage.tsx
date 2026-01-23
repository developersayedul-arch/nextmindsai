import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  CheckCircle2, 
  ExternalLink, 
  MessageCircle, 
  FileText,
  ArrowLeft,
  Shield,
  Zap,
  Users,
  Code,
  Smartphone,
  ShoppingCart
} from "lucide-react";

const WebsiteSuggestionPage = () => {
  const services = [
    {
      icon: Globe,
      title: "ল্যান্ডিং পেজ",
      description: "অর্ডার ফর্ম ও WhatsApp ইন্টিগ্রেশন সহ",
      price: "৳4,999",
      features: ["Mobile-optimized", "WhatsApp integration", "Order form", "SSL certificate"],
      whatsappMessage: "আসসালামু আলাইকুম, আমি Landing Page সার্ভিস নিতে চাই।"
    },
    {
      icon: ShoppingCart,
      title: "ই-কমার্স ওয়েবসাইট",
      description: "পেমেন্ট গেটওয়ে সহ সম্পূর্ণ অনলাইন স্টোর",
      price: "৳14,999",
      features: ["Product catalog", "Cart & checkout", "Payment integration", "Admin panel"],
      whatsappMessage: "আসসালামু আলাইকুম, আমি E-commerce Website সার্ভিস নিতে চাই।"
    },
    {
      icon: Smartphone,
      title: "মোবাইল এপ",
      description: "Android ও iOS এপ ডেভেলপমেন্ট",
      price: "৳29,999",
      features: ["Cross-platform", "Push notifications", "Admin dashboard", "App store publish"],
      whatsappMessage: "আসসালামু আলাইকুম, আমি Mobile App সার্ভিস নিতে চাই।"
    },
    {
      icon: Code,
      title: "কাস্টম সফটওয়্যার",
      description: "আপনার বিজনেসের জন্য কাস্টম সলিউশন",
      price: "৳49,999",
      features: ["Custom features", "Database design", "API development", "Ongoing support"],
      whatsappMessage: "আসসালামু আলাইকুম, আমি Custom Software সার্ভিস নিতে চাই।"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "SA Coder Verified",
      description: "কোয়ালিটি নিশ্চিত সলিউশন"
    },
    {
      icon: Zap,
      title: "দ্রুত ডেলিভারি",
      description: "৭-৩০ দিনের মধ্যে রেডি"
    },
    {
      icon: Users,
      title: "সাপোর্ট",
      description: "Launch পরেও সাপোর্ট পাবেন"
    }
  ];

  const whatsappNumber = "8801712345678";

  const getWhatsAppLink = (message: string) => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <Layout>
      <div className="section-container py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link 
            to="/results" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            ফলাফলে ফিরে যান
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="gradient-hero w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-3">SA Coder সার্ভিস</h1>
            <p className="text-lg text-muted-foreground">
              আপনার বিজনেসের জন্য <span className="font-semibold text-foreground">প্রফেশনাল</span> ডিজিটাল সলিউশন
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {services.map((service, i) => (
              <div key={i} className="result-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 gradient-hero rounded-lg flex items-center justify-center">
                    <service.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl mb-4">
                  <p className="text-sm text-muted-foreground">শুরু হচ্ছে</p>
                  <p className="text-2xl font-bold">{service.price}</p>
                </div>

                <div className="space-y-2 mb-4">
                  {service.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(getWhatsAppLink(service.whatsappMessage), "_blank")}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp এ যোগাযোগ
                </Button>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="text-center p-4 bg-secondary/30 rounded-xl">
                <div className="w-10 h-10 gradient-hero rounded-lg flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
            <p className="text-sm">
              <span className="font-semibold">মনে রাখবেন:</span> Website শুধু তখনই দরকার যখন আপনার business 
              validate হয়ে গেছে। প্রথমে social media দিয়ে test করুন, তারপর website consider করুন।
            </p>
          </div>

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

export default WebsiteSuggestionPage;
