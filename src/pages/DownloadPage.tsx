import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { BusinessFormData } from "./AnalyzePage";
import { 
  Download, 
  FileText, 
  CheckCircle2, 
  ArrowLeft,
  Lock,
  Sparkles
} from "lucide-react";

const DownloadPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BusinessFormData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("businessFormData");
    if (!storedData) {
      navigate("/analyze");
      return;
    }
    setFormData(JSON.parse(storedData) as BusinessFormData);
  }, [navigate]);

  const handleDownload = async () => {
    setIsDownloading(true);
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDownloading(false);
    setDownloaded(true);
  };

  if (!formData) return null;

  return (
    <Layout>
      <div className="section-container py-12 md:py-20">
        <div className="max-w-xl mx-auto">
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
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Download Your Plan</h1>
            <p className="text-muted-foreground">
              আপনার complete business execution guide PDF হিসেবে download করুন
            </p>
          </div>

          {/* Download Card */}
          <div className="result-card text-center">
            {!downloaded ? (
              <>
                <div className="w-20 h-24 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-6 relative">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 gradient-hero rounded-full flex items-center justify-center">
                    <Download className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-2">Business Execution Plan</h2>
                <p className="text-muted-foreground mb-6">
                  "{formData.businessIdea.slice(0, 40)}..."
                </p>

                <div className="space-y-2 text-left bg-secondary/30 p-4 rounded-lg mb-6">
                  <p className="text-sm font-medium mb-2">PDF includes:</p>
                  {[
                    "Complete Business Analysis",
                    "Product Sourcing Guide",
                    "Delivery & Payment Plan",
                    "Marketing Strategy",
                    "14-Day Action Plan",
                    "Failure Prevention Tips"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      {item}
                    </div>
                  ))}
                </div>

                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      Download PDF
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                  <Lock className="h-3 w-3" />
                  Secure download
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </div>

                <h2 className="text-xl font-semibold mb-2">Download Complete!</h2>
                <p className="text-muted-foreground mb-6">
                  আপনার PDF সফলভাবে download হয়েছে
                </p>

                <div className="bg-secondary/30 p-4 rounded-lg mb-6">
                  <p className="text-sm text-center">
                    <span className="font-medium">Watermark:</span><br />
                    Generated by Nextminds AI — Powered by SA Coder
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="default" className="flex-1" onClick={() => setDownloaded(false)}>
                    Download Again
                  </Button>
                  <Button variant="secondary" className="flex-1" asChild>
                    <Link to="/analyze">
                      New Analysis
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Upgrade CTA */}
          {!downloaded && (
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl text-center">
              <Sparkles className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm mb-2">
                <span className="font-semibold">Unlimited downloads?</span> Upgrade to Monthly plan
              </p>
              <Button variant="hero-outline" size="sm" asChild>
                <Link to="/pricing">See Pricing</Link>
              </Button>
            </div>
          )}

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

export default DownloadPage;
