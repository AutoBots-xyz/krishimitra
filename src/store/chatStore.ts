import { create } from 'zustand';

interface ChatState {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

export const useChatStore = create<ChatState>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
}));
