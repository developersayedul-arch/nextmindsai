import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = "8801585796477";
  const defaultMessage = "আসসালামু আলাইকুম, আমি Nextminds AI সম্পর্কে জানতে চাই।";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute bottom-16 right-0 w-72 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden mb-2"
          >
            <div className="bg-green-600 p-4 text-white">
              <h3 className="font-bold text-lg">Nextminds AI</h3>
              <p className="text-sm text-green-100">সাধারণত ১ ঘণ্টার মধ্যে উত্তর দিই</p>
            </div>
            <div className="p-4 bg-muted/30">
              <div className="bg-white dark:bg-card p-3 rounded-lg shadow-sm">
                <p className="text-sm text-foreground">
                  👋 আসসালামু আলাইকুম! আপনার বিজনেস আইডিয়া নিয়ে কথা বলতে চান?
                </p>
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                চ্যাট শুরু করুন
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full shadow-lg flex items-center justify-center text-white transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={!isOpen ? { 
          y: [0, -8, 0],
        } : {}}
        transition={!isOpen ? {
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        } : {}}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="whatsapp"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Ping animation */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingWhatsApp;
