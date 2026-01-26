import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  sender_type: "visitor" | "admin";
  message: string;
  created_at: string;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorName, setVisitorName] = useState("");
  const [showNameInput, setShowNameInput] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get or create session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem("chat_session_id");
    if (!sessionId) {
      sessionId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("chat_session_id", sessionId);
    }
    return sessionId;
  };

  // Load existing conversation
  useEffect(() => {
    const loadConversation = async () => {
      const sessionId = getSessionId();
      
      const { data: existingConversation } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("visitor_session_id", sessionId)
        .maybeSingle();

      if (existingConversation) {
        setConversationId(existingConversation.id);
        setVisitorName(existingConversation.visitor_name || "");
        setShowNameInput(false);
        
        // Load messages
        const { data: existingMessages } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("conversation_id", existingConversation.id)
          .order("created_at", { ascending: true });
        
        if (existingMessages) {
          setMessages(existingMessages as Message[]);
        }
      }
    };

    loadConversation();
  }, []);

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startConversation = async () => {
    if (!visitorName.trim()) return;
    
    setIsLoading(true);
    const sessionId = getSessionId();

    try {
      const { data: newConversation, error } = await supabase
        .from("chat_conversations")
        .insert({
          visitor_session_id: sessionId,
          visitor_name: visitorName.trim(),
          status: "open",
        })
        .select()
        .single();

      if (error) throw error;

      setConversationId(newConversation.id);
      setShowNameInput(false);

      // Send welcome message
      await supabase.from("chat_messages").insert({
        conversation_id: newConversation.id,
        sender_type: "admin",
        message: "আসসালামু আলাইকুম! Nextminds AI তে স্বাগতম। কিভাবে সাহায্য করতে পারি?",
      });
    } catch (error) {
      console.error("Error starting conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setIsLoading(true);

    try {
      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        sender_type: "visitor",
        message: messageText,
      });

      // Update last message timestamp
      await supabase
        .from("chat_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showNameInput) {
        startConversation();
      } else {
        sendMessage();
      }
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden mb-2"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-primary-foreground">
              <h3 className="font-bold text-lg">Nextminds AI</h3>
              <p className="text-sm opacity-90">আমরা আপনাকে সাহায্য করতে প্রস্তুত</p>
            </div>

            {/* Messages Area */}
            <ScrollArea className="h-80 p-4">
              {showNameInput ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm">
                      👋 আসসালামু আলাইকুম! চ্যাট শুরু করতে আপনার নাম লিখুন।
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="আপনার নাম"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full"
                    />
                    <Button
                      onClick={startConversation}
                      disabled={!visitorName.trim() || isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "চ্যাট শুরু করুন"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_type === "visitor" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender_type === "visitor"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender_type === "visitor"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && !showNameInput && (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      কোনো মেসেজ নেই
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            {!showNameInput && (
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="মেসেজ লিখুন..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-lg flex items-center justify-center text-primary-foreground transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={
          !isOpen
            ? {
                y: [0, -8, 0],
              }
            : {}
        }
        transition={
          !isOpen
            ? {
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }
            : {}
        }
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
              key="chat"
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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-accent"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
