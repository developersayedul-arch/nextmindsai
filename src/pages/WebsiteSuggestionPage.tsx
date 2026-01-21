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
  Users
} from "lucide-react";

const WebsiteSuggestionPage = () => {
  const websiteFeatures = [
    "Mobile-optimized design",
    "WhatsApp integration",
    "Order form with notification",
    "Product showcase",
    "Fast loading speed",
    "SSL security certificate"
  ];

  const benefits = [
    {
      icon: Shield,
      title: "SA Coder Verified",
      description: "Quality assured website solutions"
    },
    {
      icon: Zap,
      title: "Quick Delivery",
      description: "৭-১০ দিনের মধ্যে ready"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Launch পরেও support পাবেন"
    }
  ];

  return (
    <Layout>
      <div className="section-container py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link 
            to="/results" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="gradient-hero w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Website Solution</h1>
            <p className="text-lg text-muted-foreground">
              এই business-এর জন্য <span className="font-semibold text-foreground">SA Coder verified</span> website solution available
            </p>
          </div>

          {/* Main Card */}
          <div className="result-card mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-success/20 text-success px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Recommended for Your Business
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Landing Page with Order Form</h2>
            <p className="text-muted-foreground mb-6">
              আপনার business-এর জন্য একটি professional landing page যেখানে customers সরাসরি order দিতে পারবে। 
              WhatsApp-এ notification পাবেন প্রতিটি order-এ।
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {websiteFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 bg-secondary/30 p-3 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                  <p className="text-3xl font-bold">৳4,999</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Delivery time</p>
                  <p className="font-semibold">৭-১০ দিন</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="lg" className="flex-1">
                <ExternalLink className="h-5 w-5" />
                View Sample
              </Button>
              <Button variant="default" size="lg" className="flex-1">
                <FileText className="h-5 w-5" />
                Request Quote
              </Button>
              <Button variant="secondary" size="lg" className="flex-1">
                <MessageCircle className="h-5 w-5" />
                Talk to Expert
              </Button>
            </div>
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
              Powered by <span className="font-semibold text-foreground">SA Coder</span> | 
              Developed & Secured by <span className="font-semibold text-foreground">SA Coder</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WebsiteSuggestionPage;
