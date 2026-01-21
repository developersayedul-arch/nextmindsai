import { Sparkles } from "lucide-react";

const Footer = () => {
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
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">SA Coder</span> • 
              Developed by <span className="font-semibold text-foreground">SA Coder</span> • 
              Secured by <span className="font-semibold text-foreground">SA Coder</span>
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
