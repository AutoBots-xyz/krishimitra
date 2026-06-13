"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MapPin, Leaf, Languages } from "lucide-react";
import MessageBubble from "@/features/ai-chat/components/MessageBubble";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { useFarmerStore } from "@/store/farmerStore";

export default function ChatWindow() {
  const { language, toggleLanguage } = useLanguage();
  const { profile } = useFarmerStore();
  const locationLabel = profile?.district && profile?.state
    ? `${profile.district}, ${profile.state}`
    : "Your Location";
  const cropLabel = profile?.primary_crop ?? "Your Crops";
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
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
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
    <div className="flex flex-col h-[calc(100vh-130px)] md:h-[calc(100vh-100px)] -m-4 md:-m-8 bg-mist">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-sm z-10 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky rounded-full flex items-center justify-center text-xl">👳🏽‍♂️</div>
          <div>
            <h1 className="font-display text-heading-3 text-soil leading-tight">Krishi Mitra</h1>
            <p className="text-xs text-neutral-400">AI Agronomist • Online</p>
          </div>
        </div>
        <button 
          onClick={toggleLanguage} 
          className="flex items-center gap-1 text-xs font-semibold text-indigo bg-sky/50 px-3 py-1.5 rounded-pill"
        >
          <Languages className="w-4 h-4" /> {language === 'en' ? 'हिन्दी' : 'English'}
        </button>
      </div>

      {/* Context Chips */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 bg-mist border-b border-neutral-100 shadow-sm">
        <div className="flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-md text-neutral-800 shadow-low whitespace-nowrap">
          <MapPin className="w-3 h-3 text-harvest" /> {locationLabel}
        </div>
        <div className="flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-md text-neutral-800 shadow-low whitespace-nowrap">
          <Leaf className="w-3 h-3 text-leaf" /> {cropLabel}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-low text-neutral-800 rounded-2xl rounded-bl-sm px-4 py-3 border border-neutral-100 flex items-center gap-1">
              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-neutral-100 shrink-0">
        {messages.length === 1 && (
          <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
            {suggestions.map((sug, i) => (
              <button 
                key={i} 
                onClick={() => setInput(sug)}
                className="whitespace-nowrap text-xs bg-sky text-indigo px-3 py-2 rounded-pill font-medium hover:bg-sky/80 transition"
              >
                {sug}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            placeholder={language === 'hi' ? "अपना सवाल पूछें..." : "Type your question..."}
            className="flex-1 bg-mist border-0 rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-indigo outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="w-12 h-12 bg-harvest text-soil rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-harvest/90 transition-colors shrink-0 shadow-mid"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
