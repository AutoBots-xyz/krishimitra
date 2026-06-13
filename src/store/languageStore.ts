import { create } from 'zustand';

interface LanguageState {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'hi' : 'en' })),
}));
