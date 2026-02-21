import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { Leaf, User, LogOut, History, Shield, Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/services', label: t.nav.services },
    { path: '/mentorship', label: t.nav.mentorship },
    { path: '/pricing', label: t.nav.pricing },
    { path: '/blog', label: t.nav.blog },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/85 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/70">
      <div className="section-container flex h-18 items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            className="relative gradient-coral p-2.5 rounded-2xl shadow-lg overflow-hidden"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Leaf className="h-5 w-5 text-white relative z-10" />
            <motion.div 
              className="absolute inset-0 bg-white/20"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
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
                className="font-extrabold text-xl leading-tight tracking-tight bg-gradient-to-r from-accent via-orange-400 to-accent bg-clip-text text-transparent"
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

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl ${
                location.pathname === link.path 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                  layoutId="activeNav"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
          {user && (
            <Link 
              to="/history" 
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl ${
                location.pathname === '/history' 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              {t.nav.history}
            </Link>
          )}
          {isAdmin && (
            <Link 
              to="/admin-login" 
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl flex items-center gap-1.5 ${
                location.pathname.startsWith('/admin') 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="gold" size="sm" asChild className="hidden sm:flex gradient-coral coral-glow border-0 text-white">
                  <Link to="/analyze" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    {t.nav.analyze}
                  </Link>
                </Button>
              </motion.div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full border-2 border-border/50 hover:border-primary/40 hover:bg-primary/5">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-border/30 p-2">
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link to="/history" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      {t.nav.history}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild className="rounded-lg">
                      <Link to="/admin-login" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={signOut} className="text-destructive rounded-lg">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t.common.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex hover:bg-primary/5">
                <Link to="/auth">{t.common.login}</Link>
              </Button>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="gold" size="sm" asChild className="gradient-coral coral-glow border-0 text-white">
                  <Link to="/analyze" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.nav.analyze}</span>
                    <span className="sm:hidden">Start</span>
                  </Link>
                </Button>
              </motion.div>
            </>
          )}
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-xl"
          >
            <nav className="section-container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl ${
                    location.pathname === link.path 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link 
                  to="/history" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl"
                >
                  {t.nav.history}
                </Link>
              )}
              {!user && (
                <Link 
                  to="/auth" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl"
                >
                  {t.common.login}
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
