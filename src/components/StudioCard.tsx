import { Studio } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import { getStudioName, getStudioDescription } from '../utils/studioTranslations';
import { calculateTotalPrice } from '../utils/pricing';

interface StudioCardProps {
  studio: Studio;
  onViewMore: (studio: Studio) => void;
  checkIn?: Date | null;
  checkOut?: Date | null;
  adults?: number;
  children?: number;
}

export default function StudioCard({
  studio,
  onViewMore,
  checkIn,
  checkOut,
  adults = 1,
  children = 0
}: StudioCardProps) {
  const { language } = useLanguage();

  const calculateNights = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalGuests = adults + children;
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const totalPrice = checkIn && checkOut ? calculateTotalPrice(studio, checkIn, checkOut) : 0;

  const nightsText = {
    bg: nights === 1 ? '1 нощувка' : `${nights} нощувки`,
    en: nights === 1 ? '1 night' : `${nights} nights`,
    ru: nights === 1 ? '1 ночь' : `${nights} ночей`,
    sr: nights === 1 ? '1 ноћ' : `${nights} ноћи`,
    el: nights === 1 ? '1 βράδυ' : `${nights} βράδια`,
    ro: nights === 1 ? '1 noapte' : `${nights} nopți`,
    mk: nights === 1 ? '1 ноќ' : `${nights} ноќи`,
  };

  const guestsText = {
    bg: `${totalGuests} ${totalGuests === 1 ? 'възрастен' : 'възрастни'}`,
    en: `${totalGuests} ${totalGuests === 1 ? 'adult' : 'adults'}`,
    ru: `${totalGuests} ${totalGuests === 1 ? 'взрослый' : 'взрослых'}`,
    sr: `${totalGuests} ${totalGuests === 1 ? 'одрасла особа' : 'одрасле особе'}`,
    el: `${totalGuests} ${totalGuests === 1 ? 'ενήλικας' : 'ενήλικες'}`,
    ro: `${totalGuests} ${totalGuests === 1 ? 'adult' : 'adulți'}`,
    mk: `${totalGuests} ${totalGuests === 1 ? 'возрасен' : 'возрасни'}`,
  };

  const priceText = {
    bg: 'Цена',
    en: 'Price',
    ru: 'Цена',
    sr: 'Цена',
    el: 'Τιμή',
    ro: 'Preț',
    mk: 'Цена',
  };

  const taxesText = {
    bg: 'Включва данъци и такси',
    en: 'Includes taxes and fees',
    ru: 'Включая налоги и сборы',
    sr: 'Укључује порезе и таксе',
    el: 'Συμπεριλαμβάνονται φόροι και τέλη',
    ro: 'Include taxe și comisioane',
    mk: 'Вклучува даноци и такси',
  };

  const availabilityButtonText = {
    bg: 'Виж наличността',
    en: 'See availability',
    ru: 'Посмотреть доступность',
    sr: 'Погледај доступност',
    el: 'Δείτε διαθεσιμότητα',
    ro: 'Vezi disponibilitatea',
    mk: 'Погледни достапност',
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-cyan-100">
      <div className="relative h-64">
        <img
          src={studio.main_image}
          alt={getStudioName(studio, language)}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{getStudioName(studio, language)}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{getStudioDescription(studio, language)}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{studio.bedrooms} {t(language, 'studio.bedrooms')}</span>
          <span>{studio.bathrooms} {t(language, 'studio.bathrooms')}</span>
          <span>{t(language, 'studio.capacity', { count: studio.capacity })}</span>
        </div>

        {checkIn && checkOut && nights > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm text-gray-600">
                <div className="font-semibold">{nightsText[language]}, {guestsText[language]}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">BGN {totalPrice}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">{priceText[language]} BGN {totalPrice}</div>
              <div className="text-xs text-gray-500">{taxesText[language]}</div>
            </div>
          </div>
        )}

        <button
          onClick={() => onViewMore(studio)}
          className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
        >
          {checkIn && checkOut ? availabilityButtonText[language] : t(language, 'studio.viewDetails')}
        </button>
      </div>
    </div>
  );
}
