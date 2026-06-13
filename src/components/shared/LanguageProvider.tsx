"use client";

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';

interface LanguageContextType {
  language: 'en' | 'hi';
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useChatStore();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'hi') {
      document.documentElement.classList.add('lang-hi');
    } else {
      document.documentElement.classList.remove('lang-hi');
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
