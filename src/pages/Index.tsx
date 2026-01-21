import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
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
  Target
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Lightbulb,
      title: "Business Reality Check",
      description: "আপনার idea কতটা practical তা সৎভাবে জানুন"
    },
    {
      icon: Package,
      title: "Product Sourcing",
      description: "কোথা থেকে কিভাবে product সংগ্রহ করবেন"
    },
    {
      icon: Truck,
      title: "Delivery Plan",
      description: "Delivery ও payment method সাজেশন"
    },
    {
      icon: Megaphone,
      title: "Marketing Strategy",
      description: "প্রথম ১০ customer কিভাবে পাবেন"
    },
    {
      icon: Globe,
      title: "Website Decision",
      description: "Website দরকার কি না - সৎ উত্তর পান"
    },
    {
      icon: Target,
      title: "14-Day Action Plan",
      description: "Step-by-step execution roadmap"
    }
  ];

  const steps = [
    { number: "১", title: "আপনার Idea লিখুন", description: "যে business করতে চান সেটা বিস্তারিত লিখুন" },
    { number: "২", title: "AI Analysis পান", description: "Brutally honest, practical analysis পাবেন" },
    { number: "৩", title: "Action Plan Follow করুন", description: "14-day roadmap অনুযায়ী কাজ শুরু করুন" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-subtle" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="section-container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Bangladesh-focused Business Guide
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-primary">
              Nextminds AI
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Idea → Product → Delivery → Marketing → Website Decision
            </p>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Raw business idea কে complete execution plan এ convert করুন। 
              কোন motivational talk নয় — শুধু practical, honest guidance।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/analyze" className="flex items-center gap-2">
                  Business Idea Analyze করুন
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/pricing">
                  Pricing দেখুন
                </Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Powered by <span className="font-semibold">SA Coder</span>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">কি কি পাবেন?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              প্রতিটি business idea-র জন্য complete execution guide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-card p-6 rounded-xl hover:scale-[1.02] transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="gradient-hero w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 gradient-subtle">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">কিভাবে কাজ করে?</h2>
            <p className="text-muted-foreground">৩টি সহজ step-এ আপনার business plan ready</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Selling Points */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">কেন Nextminds AI?</h2>
            </div>

            <div className="space-y-4">
              {[
                "কোন motivational talk নয় — শুধু সৎ, practical advice",
                "Bangladesh context-এ সব সাজেশন",
                "Website দরকার কি না — honest decision",
                "14-day action plan সাথে পাবেন",
                "Sourcing, delivery, marketing — সব একসাথে"
              ].map((point, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="section-container text-center">
          <div className="max-w-2xl mx-auto">
            <Zap className="h-12 w-12 text-primary-foreground/80 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              আজই শুরু করুন
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              আপনার business idea-কে reality তে convert করার প্রথম step নিন
            </p>
            <Button 
              variant="hero" 
              size="xl" 
              className="bg-background text-foreground hover:bg-background/90" 
              asChild
            >
              <Link to="/analyze" className="flex items-center gap-2">
                Business Idea Analyze করুন
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
