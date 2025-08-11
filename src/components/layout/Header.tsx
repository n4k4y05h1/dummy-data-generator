'use client';

import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/lib/i18n';
import { Github } from 'lucide-react';

export default function Header() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">{getTranslation(language, 'app_title')}</h1>
      <div className="flex items-center gap-4">
                {(['ja', 'en'] as const).map((lang) => (
          <label key={lang} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="header-language"
              value={lang}
              checked={language === lang}
              onChange={() => setLanguage(lang)}
              className="h-4 w-4 text-blue-400 focus:ring-blue-300 border-gray-300"
            />
            <span className="text-white">{getTranslation(language, lang === 'ja' ? 'japanese' : 'english')}</span>
          </label>
        ))}
        <div className="h-6 border-l border-gray-400"></div>
        <a href="https://github.com/n4k4y05h1/dummy-data-generator" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                    <Github className="h-6 w-6" />
        </a>
      </div>
    </header>
  );
}