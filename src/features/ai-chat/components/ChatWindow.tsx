"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MapPin, Leaf, Languages, Sparkles, History } from "lucide-react";
import MessageBubble from "@/features/ai-chat/components/MessageBubble";
import ChatHistorySidebar from "@/features/ai-chat/components/ChatHistorySidebar";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { useFarmerStore } from "@/store/farmerStore";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function ChatWindow() {
  const { language, toggleLanguage } = useLanguage();
  const { profile } = useFarmerStore();
  const locationLabel = profile?.district && profile?.state
    ? `${profile.district}, ${profile.state}`
    : "Bhopal, MP";
  const cropLabel = profile?.primary_crop ?? "Wheat & Soy";

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: language === 'hi' 
        ? "नमस्ते! मैं कृषि मित्र हूँ। मैं खेती, फसल की बीमारियों और मौसम से जुड़ी आपकी कैसे मदद कर सकता हूँ?" 
        : "Hello! I am Krishi Mitra. How can I help you with farming, crop diseases, or weather today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSaveChat = async () => {
    if (messages.length <= 1) return;
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (!userId) {
        alert(language === 'hi' ? "कृपया पहले लॉगिन करें" : "Please login first to save chat.");
        setSaving(false);
        return;
      }
      
      // Ensure the user exists in the farmers table to satisfy the foreign key constraint
      await supabase.from('farmers').upsert({ 
        id: userId, 
        full_name: userData?.user?.user_metadata?.full_name || 'Guest Farmer' 
      }, { onConflict: 'id' });
      
      const title = messages.find(m => m.role === 'user')?.content?.slice(0, 40) + "..." || "Chat Session";
      
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({ farmer_id: userId, title, language })
        .select()
        .single();
        
      if (sessionError) throw sessionError;
      
      const messageInserts = messages.map(msg => ({
        session_id: sessionData.id,
        role: msg.role,
        content: msg.content
      }));
      
      const { error: msgError } = await supabase
        .from('chat_messages')
        .insert(messageInserts);
        
      if (msgError) throw msgError;
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving chat:", err);
      alert("Failed to save chat");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newMsg], language })
      });
      const data = await res.json();
      setMessages(prev => [...prev, data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = language === 'hi' 
    ? ["मेरे धान में पत्ती झुलसा है, क्या करूँ?", "गेहूं के लिए MSP क्या है?", "काली मिट्टी के लिए खाद"]
    : ["What is the MSP for wheat?", "Best fertilizer for black soil", "My rice has blast disease"];

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] md:h-[calc(100vh-100px)] -m-4 md:-m-8 bg-transparent relative">
      
      {/* ─── EDITORIAL HEADER ─── */}
      <div className="px-6 py-5 md:py-8 z-10 shrink-0 border-b border-primary/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto flex justify-between items-start">
          <div>
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-secondary mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> AI Agronomist
            </span>
            <h1 className="font-display text-4xl text-primary font-bold leading-tight">Krishi Mitra</h1>
            
            {/* Context chips */}
            <div className="flex gap-2 mt-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs px-3 py-1 bg-primary/5 text-primary rounded-full font-medium">
                <MapPin className="w-3 h-3 text-secondary" /> {locationLabel}
              </div>
              <div className="flex items-center gap-1.5 text-xs px-3 py-1 bg-primary/5 text-primary rounded-full font-medium">
                <Leaf className="w-3 h-3 text-success" /> {cropLabel}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-primary/10 text-primary hover:bg-primary/5 transition-colors"
              title="View Chat History"
            >
              <History className="w-4 h-4" />
            </button>
            <button 
              onClick={handleSaveChat}
              disabled={saving || messages.length <= 1}
              className={`flex items-center justify-center px-4 h-10 rounded-full shadow-sm border border-primary/10 transition-colors text-sm font-medium ${saved ? 'bg-success text-white border-success' : 'bg-white text-primary hover:bg-primary/5 disabled:opacity-50'}`}
              title="Save Chat to History"
            >
              {saving ? "Saving..." : saved ? "Saved!" : "Save to History"}
            </button>

          </div>
        </div>
      </div>

      {/* ─── MESSAGES AREA ─── */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 relative no-scrollbar">
        <div id="chat-container" className="max-w-3xl mx-auto space-y-8 p-4 bg-background">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="glass text-text rounded-2xl rounded-tl-sm px-6 py-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} className="h-10" />
        </div>
      </div>

      {/* ─── FLOATING INPUT DOCK ─── */}
      <div className="shrink-0 pb-6 px-4 md:pb-8 md:px-8 z-20 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          
          {/* Suggestions */}
          {messages.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 overflow-x-auto pb-4 no-scrollbar"
            >
              {suggestions.map((sug, i) => (
                <button 
                  key={i} 
                  onClick={() => setInput(sug)}
                  className="whitespace-nowrap text-[13px] bg-white border border-primary/10 text-text px-4 py-2 rounded-full font-medium shadow-sm hover:border-secondary transition-colors"
                >
                  {sug}
                </button>
              ))}
            </motion.div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSend} className="relative group">
            <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full transition-opacity opacity-0 group-hover:opacity-100" />
            <div className="relative flex items-center glass rounded-full p-2 border border-primary/15 shadow-lg bg-white/70">
              <input
                type="text"
                placeholder={language === 'hi' ? "अपना सवाल यहाँ लिखें..." : "Ask your agronomy question..."}
                className="flex-1 bg-transparent px-5 py-3 text-base text-text placeholder:text-muted/60 focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="w-[52px] h-[52px] bg-primary text-white rounded-full flex items-center justify-center disabled:bg-black disabled:text-white hover:bg-[#153a27] transition-all shrink-0 shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>

        </div>
      </div>

      <ChatHistorySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onSelectSession={(sessionMessages) => {
          setMessages(sessionMessages);
        }} 
      />
    </div>
  );
}
