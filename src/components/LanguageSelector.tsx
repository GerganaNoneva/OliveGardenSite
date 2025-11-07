import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { translations } from '../translations';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; flag: string }[] = [
    { code: 'bg', flag: '🇧🇬' },
    { code: 'en', flag: '🇬🇧' },
    { code: 'ru', flag: '🇷🇺' },
    { code: 'sr', flag: '🇷🇸' },
    { code: 'el', flag: '🇬🇷' },
    { code: 'ro', flag: '🇷🇴' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(l => l.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
      >
        <Globe size={20} className="text-blue-600" />
        <span className="text-xl">{currentLanguage?.flag}</span>
        <span className="font-medium text-gray-800">{translations[language].languages[language]}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors ${
                language === lang.code ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className={`font-medium ${language === lang.code ? 'text-blue-600' : 'text-gray-800'}`}>
                {translations[lang.code].languages[lang.code]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
