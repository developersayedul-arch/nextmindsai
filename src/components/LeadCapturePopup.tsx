import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLeadTracking } from "@/hooks/useLeadTracking";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

const LeadCapturePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [hasShown, setHasShown] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const { trackLead } = useLeadTracking();

  // Show popup after 30 seconds or on exit intent
  useEffect(() => {
    // Don't show on admin or auth pages
    if (location.pathname.startsWith("/admin") || location.pathname === "/auth") {
      return;
    }

    // Check if already captured
    const captured = sessionStorage.getItem("lead_captured");
    if (captured) return;

    // Timer for delayed popup
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    }, 45000); // Show after 45 seconds

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown, location.pathname]);

  const validateWhatsApp = (number: string): boolean => {
    const cleaned = number.replace(/[\s-]/g, '');
    const bdPattern = /^(01[3-9]\d{8}|(\+?880)?1[3-9]\d{8})$/;
    return bdPattern.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!whatsappNumber.trim()) {
      setError("WhatsApp নম্বর দিন");
      return;
    }

    if (!validateWhatsApp(whatsappNumber)) {
      setError("সঠিক বাংলাদেশী নম্বর দিন (যেমন: 01712345678)");
      return;
    }

    await trackLead({
      whatsapp_number: whatsappNumber,
      form_step: "popup_captured"
    });

    sessionStorage.setItem("lead_captured", "true");
    setIsOpen(false);
    toast.success("ধন্যবাদ! আমরা শীঘ্রই যোগাযোগ করব।");
  };

  const handleClose = () => {
    setIsOpen(false);
    // Track that user closed without providing info
    trackLead({
      form_step: "popup_dismissed"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
        
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl">
            ফ্রি Business Consultation চান?
          </DialogTitle>
          <DialogDescription>
            আপনার WhatsApp নম্বর দিন, আমাদের এক্সপার্ট আপনাকে গাইড করবে
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="popup-whatsapp">WhatsApp নম্বর</Label>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="popup-whatsapp"
                placeholder="01712345678"
                value={whatsappNumber}
                onChange={(e) => {
                  setWhatsappNumber(e.target.value);
                  setError("");
                }}
                className={`pl-10 ${error ? "border-destructive" : ""}`}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button type="submit" className="w-full" variant="hero">
            <MessageCircle className="h-4 w-4 mr-2" />
            ফ্রি Consultation নিন
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            আমরা শুধু business related তথ্য শেয়ার করব। Spam করা হবে না।
          </p>
        </form>

        <div className="flex items-center gap-2 pt-4 border-t border-border">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium"
              >
                {i}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">১০০+</span> উদ্যোক্তা ইতিমধ্যে consultation নিয়েছেন
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCapturePopup;
