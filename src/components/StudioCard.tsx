import { Studio } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import { getStudioName, getStudioDescription } from '../utils/studioTranslations';

interface StudioCardProps {
  studio: Studio;
  onViewMore: (studio: Studio) => void;
}

export default function StudioCard({ studio, onViewMore }: StudioCardProps) {
  const { language } = useLanguage();

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-cyan-100">
      <div className="relative h-64">
        <img
          src={studio.main_image}
          alt={getStudioName(studio, language)}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-3 py-2 rounded-lg shadow-lg">
          <div className="text-xs">{language === 'bg' ? 'от' : 'from'}</div>
          <div className="font-bold text-lg">€{studio.price_per_night - studio.low_season_discount}</div>
          <div className="text-xs">{t(language, 'studio.perNight')}</div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{getStudioName(studio, language)}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{getStudioDescription(studio, language)}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{studio.bedrooms} {t(language, 'studio.bedrooms')}</span>
          <span>{studio.bathrooms} {t(language, 'studio.bathrooms')}</span>
          <span>{t(language, 'studio.capacity', { count: studio.capacity })}</span>
        </div>
        <button
          onClick={() => onViewMore(studio)}
          className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
        >
          {t(language, 'studio.viewDetails')}
        </button>
      </div>
    </div>
  );
}
