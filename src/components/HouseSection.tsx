import ImageGallery from './ImageGallery';
import { useLanguage } from '../contexts/LanguageContext';

interface HouseSectionProps {
  houseNumber: 1 | 2;
  images: string[];
  description: string;
  mapUrl: string;
}

export default function HouseSection({ houseNumber, images, description, mapUrl }: HouseSectionProps) {
  const { language } = useLanguage();

  const titles = {
    bg: houseNumber === 1 ? 'Olive Garden Apartments' : 'Olive Garden Guesthouse',
    en: houseNumber === 1 ? 'Olive Garden Apartments' : 'Olive Garden Guesthouse',
    ru: houseNumber === 1 ? 'Olive Garden Apartments' : 'Olive Garden Guesthouse',
    sr: houseNumber === 1 ? 'Olive Garden Apartments' : 'Olive Garden Guesthouse',
    el: houseNumber === 1 ? 'Olive Garden Apartments' : 'Olive Garden Guesthouse',
    ro: houseNumber === 1 ? 'Olive Garden Apartments' : 'Olive Garden Guesthouse',
    mk: houseNumber === 1 ? 'Olive Garden Apartments' : 'Olive Garden Guesthouse',
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-cyan-100">
      <div className="p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-6">
          {titles[language]}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <ImageGallery images={images} />
          </div>

          <div className="flex flex-col justify-center">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-4">
            {language === 'bg' && 'Местоположение'}
            {language === 'en' && 'Location'}
            {language === 'ru' && 'Расположение'}
            {language === 'sr' && 'Локација'}
            {language === 'el' && 'Τοποθεσία'}
            {language === 'ro' && 'Locație'}
            {language === 'mk' && 'Локација'}
          </h3>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>
              {language === 'bg' && 'Отвори в Google Maps'}
              {language === 'en' && 'Open in Google Maps'}
              {language === 'ru' && 'Открыть в Google Maps'}
              {language === 'sr' && 'Отвори у Google Maps'}
              {language === 'el' && 'Άνοιγμα στο Google Maps'}
              {language === 'ro' && 'Deschide în Google Maps'}
              {language === 'mk' && 'Отвори во Google Maps'}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
