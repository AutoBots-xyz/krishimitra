"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function MessageBubble({ message }: { message: any }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`relative max-w-[85%] md:max-w-[75%] px-6 py-5 ${
          isUser 
            ? 'bg-primary text-white rounded-[1.5rem] rounded-br-sm shadow-md' 
            : 'glass text-text rounded-[1.5rem] rounded-tl-sm border border-primary/10 shadow-sm bg-white/60'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-primary/10">
            <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
            </div>
            <span className="font-display font-semibold text-primary text-lg">Krishi Mitra</span>
          </div>
        )}
        
        <div className={`whitespace-pre-wrap leading-relaxed ${isUser ? 'font-medium' : 'font-light'} text-[15px] md:text-base`}>
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}
