import { Sparkles } from "lucide-react";
import { useEffect } from "react";

const Footer = () => {
  useEffect(() => {
    // Re-initialize Trustpilot widget after React render
    if ((window as any).Trustpilot) {
      (window as any).Trustpilot.loadFromElement(
        document.querySelector('.trustpilot-widget')
      );
    }
  }, []);

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="section-container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="gradient-hero p-1.5 rounded-md">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Nextminds AI</span>
          </div>
          
          {/* TrustBox widget - Review Collector */}
          <div
            className="trustpilot-widget"
            data-locale="en-US"
            data-template-id="56278e9abfbbba0bdcd568bc"
            data-businessunit-id="698e696f186850d3ad791258"
            data-style-height="52px"
            data-style-width="100%"
            data-token="8ca287ee-7067-44c1-92dd-b1460cb1fa0c"
          >
            <a href="https://www.trustpilot.com/review/nextminds.site" target="_blank" rel="noopener">Trustpilot</a>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">SA Coder</span>
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
