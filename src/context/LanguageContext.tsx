'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'ja' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja'); // Default to 'ja' initially

  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator) {
      const browserLanguage = navigator.language.split('-')[0]; // e.g., 'en-US' -> 'en'
      if (browserLanguage === 'ja') {
        setLanguage('ja');
      } else {
        setLanguage('en');
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}