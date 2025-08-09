import ja from './ja.json';
import en from './en.json';

const translations = {
  ja,
  en,
};

type Language = keyof typeof translations;
type TranslationKey = keyof typeof ja;

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key] || key;
}
