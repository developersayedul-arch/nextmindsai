import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Sparkles, User, LogOut, History, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminRole();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="section-container flex h-18 items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            className="gradient-gold p-2.5 rounded-xl shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Sparkles className="h-5 w-5 text-primary" />
          </motion.div>
          <div className="flex flex-col">
            <motion.div 
              className="flex items-baseline gap-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span 
                className="font-extrabold text-xl leading-tight tracking-tight text-primary"
                style={{ 
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                Nextminds
              </span>
              <motion.span 
                className="font-extrabold text-xl leading-tight tracking-tight bg-gradient-to-r from-accent via-amber-400 to-accent bg-clip-text text-transparent"
                style={{ 
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                  WebkitBackgroundClip: 'text',
                  backgroundSize: '200% 100%'
                }}
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                AI
              </motion.span>
            </motion.div>
            <span className="text-[10px] text-muted-foreground leading-tight font-medium">Powered by SA Coder</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-all duration-300 hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Home
          </Link>
          <Link 
            to="/mentorship" 
            className={`text-sm font-medium transition-all duration-300 hover:text-primary ${location.pathname === '/mentorship' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Mentorship
          </Link>
          <Link 
            to="/pricing" 
            className={`text-sm font-medium transition-all duration-300 hover:text-primary ${location.pathname === '/pricing' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Pricing
          </Link>
          {user && (
            <Link 
              to="/history" 
              className={`text-sm font-medium transition-all duration-300 hover:text-primary ${location.pathname === '/history' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              History
            </Link>
          )}
          {isAdmin && (
            <Link 
              to="/admin-login" 
              className={`text-sm font-medium transition-all duration-300 hover:text-primary flex items-center gap-1 ${location.pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button variant="gold" size="sm" asChild className="hidden sm:flex">
                <Link to="/analyze" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Analyze করুন
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full border border-border/50 hover:border-primary/30">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-border/50">
                  <DropdownMenuItem asChild>
                    <Link to="/history" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      My Analyses
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin-login" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button variant="gold" size="sm" asChild>
                <Link to="/analyze" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Analyze করুন
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
