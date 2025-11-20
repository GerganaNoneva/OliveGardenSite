import { X, Bed, Bath, Users, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Studio, ContactPreferences } from '../types';
import { supabase } from '../lib/supabase';
import { calculateTotalPrice } from '../utils/pricing';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import { getStudioName, getStudioDescription } from '../utils/studioTranslations';
import { translateAmenity } from '../utils/amenityTranslations';
import Calendar from './Calendar';
import ContactModal from './ContactModal';
import ConfirmationModal from './ConfirmationModal';
import SuccessModal from './SuccessModal';

interface StudioDetailsProps {
  studio: Studio;
  onClose: () => void;
  preselectedCheckIn?: Date | null;
  preselectedCheckOut?: Date | null;
  preselectedAdults?: number | null;
  preselectedChildren?: number | null;
}

export interface BookingDateInfo {
  date: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

export default function StudioDetails({ studio, onClose, preselectedCheckIn, preselectedCheckOut, preselectedAdults, preselectedChildren }: StudioDetailsProps) {
  const { language } = useLanguage();
  const [showAvailability, setShowAvailability] = useState(false);
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | null>(preselectedCheckIn || null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | null>(preselectedCheckOut || null);
  const [adults, setAdults] = useState(preselectedAdults || 2);
  const [children, setChildren] = useState(preselectedChildren || 0);
  const [bookedDates, setBookedDates] = useState<BookingDateInfo[]>([]);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [contactPreferences, setContactPreferences] = useState<ContactPreferences | null>(null);
  const [viewerCount] = useState(() => Math.floor(Math.random() * 3) + 2); // Random 2-4

  useEffect(() => {
    fetchBookedDates();
    if (preselectedCheckIn && preselectedCheckOut) {
      setShowAvailability(true);
    }
  }, [studio.id, preselectedCheckIn, preselectedCheckOut]);

  const fetchBookedDates = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('check_in, check_out, status')
      .eq('studio_id', studio.id)
      .eq('status', 'confirmed');

    if (!error && data) {
      const dateInfoMap = new Map<string, BookingDateInfo>();

      data.forEach(booking => {
        const start = new Date(booking.check_in);
        const end = new Date(booking.check_out);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          dateInfoMap.set(dateStr, {
            date: dateStr,
            status: 'confirmed'
          });
        }
      });

      setBookedDates(Array.from(dateInfoMap.values()));
    }
  };

  const handleDateSelect = (checkIn: Date, checkOut: Date | null) => {
    setSelectedCheckIn(checkIn);
    setSelectedCheckOut(checkOut);
    setTotalPrice(null);
  };

  const calculateTotal = () => {
    if (!selectedCheckIn || !selectedCheckOut) {
      alert('Моля изберете начална и крайна дата');
      return;
    }

    if (adults + children > studio.capacity) {
      alert(`Максимален капацитет: ${studio.capacity} човека`);
      return;
    }

    if (adults < 1) {
      alert('Трябва да има поне 1 възрастен');
      return;
    }

    const total = calculateTotalPrice(studio, selectedCheckIn, selectedCheckOut);
    setTotalPrice(total);
    setShowContactModal(true);
  };

  const handleContactSubmit = (preferences: ContactPreferences) => {
    setContactPreferences(preferences);
    setShowContactModal(false);
    setShowConfirmationModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedCheckIn || !selectedCheckOut || !contactPreferences) return;

    const booking = {
      studio_id: studio.id,
      check_in: selectedCheckIn.toISOString().split('T')[0],
      check_out: selectedCheckOut.toISOString().split('T')[0],
      adults,
      children,
      guest_count: adults,
      children_count: children,
      total_price: totalPrice!,
      guest_name: contactPreferences.name,
      guest_country: contactPreferences.country,
      contact_method: contactPreferences.contactMethods.join(', '),
      phone_country_code: contactPreferences.phoneCountryCode,
      guest_phone: contactPreferences.phone,
      guest_email: contactPreferences.email,
      status: 'pending'
    };

    const { error } = await supabase
      .from('bookings')
      .insert([booking]);

    if (error) {
      console.error('Booking error:', error);
      console.error('Booking data:', booking);
      alert(`Грешка при изпращане на резервацията: ${error.message}\n\nМоля опитайте отново.`);
      return;
    }

    try {
      const contactMethodsStr = contactPreferences.contactMethods.join(', ');
      const contactValues = [];
      if (contactPreferences.phone) {
        contactValues.push(`${contactPreferences.phoneCountryCode} ${contactPreferences.phone}`);
      }
      if (contactPreferences.email) {
        contactValues.push(contactPreferences.email);
      }

      const smsData = {
        studioName: studio.name,
        startDate: selectedCheckIn.toLocaleDateString('bg-BG'),
        endDate: selectedCheckOut.toLocaleDateString('bg-BG'),
        totalPrice: totalPrice!,
        customerName: contactPreferences.name,
        contactMethod: contactMethodsStr,
        contactValue: contactValues.join(', ')
      };

      console.log('Sending SMS notification with data:', smsData);

      const smsResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-admin-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smsData)
      });

      const smsResult = await smsResponse.json();
      console.log('SMS notification result:', smsResult);

      if (!smsResponse.ok) {
        console.error('SMS notification failed:', smsResult);
      } else {
        console.log('SMS sent successfully!');
      }
    } catch (smsError) {
      console.error('SMS notification error:', smsError);
    }

    setShowConfirmationModal(false);
    setShowSuccessModal(true);
    await fetchBookedDates();
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setShowAvailability(false);
    setSelectedCheckIn(null);
    setSelectedCheckOut(null);
    setTotalPrice(null);
    setContactPreferences(null);
    setAdults(2);
    setChildren(0);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-lg">
            <h2 className="text-2xl font-bold text-gray-800">{getStudioName(studio, language)}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <img
                src={studio.main_image}
                alt={getStudioName(studio, language)}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            </div>

            {studio.images && studio.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{t(language, 'studio.gallery')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {studio.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${getStudioName(studio, language)} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t(language, 'studio.description')}</h3>
              <p className="text-gray-600 leading-relaxed">{getStudioDescription(studio, language)}</p>
            </div>

            {studio.name === 'Апартамент №1' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="11" width="20" height="9" rx="1" />
                    <path d="M2 11V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" />
                    <line x1="12" y1="11" x2="12" y2="20" />
                  </svg>
                  <span className="font-medium">3 {language === 'bg' ? 'двойни легла' : language === 'en' ? 'double beds' : language === 'ru' ? 'двуспальные кровати' : language === 'sr' ? 'брачна кревета' : language === 'el' ? 'διπλά κρεβάτια' : language === 'ro' ? 'paturi duble' : language === 'mk' ? 'брачни кревети' : 'double beds'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="9" width="18" height="9" rx="1" />
                    <path d="M3 9V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2" />
                    <rect x="5" y="15" width="5" height="3" />
                    <rect x="14" y="15" width="5" height="3" />
                  </svg>
                  <span className="font-medium">1 {language === 'bg' ? 'разтегателен диван' : language === 'en' ? 'sofa bed' : language === 'ru' ? 'раскладной диван' : language === 'sr' ? 'раскладив кауч' : language === 'el' ? 'καναπές-κρεβάτι' : language === 'ro' ? 'canapea extensibilă' : language === 'mk' ? 'разложлив диван' : 'sofa bed'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Bath className="text-gray-700" size={24} />
                  <span className="font-medium">2 {language === 'bg' ? 'бани' : language === 'en' ? 'bathrooms' : language === 'ru' ? 'ванные комнаты' : language === 'sr' ? 'купатила' : language === 'el' ? 'μπάνια' : language === 'ro' ? 'băi' : language === 'mk' ? 'бањи' : 'bathrooms'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span className="font-medium">6 + 2 {language === 'bg' ? 'гости' : language === 'en' ? 'guests' : language === 'ru' ? 'гостей' : language === 'sr' ? 'гостију' : language === 'el' ? 'επισκέπτες' : language === 'ro' ? 'oaspeți' : language === 'mk' ? 'гости' : 'guests'}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Bed className="text-blue-600" size={20} />
                  <span>{studio.bedrooms} {t(language, 'studio.bedrooms')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Bath className="text-blue-600" size={20} />
                  <span>{studio.bathrooms} {t(language, 'studio.bathrooms')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Bed className="text-blue-600" size={20} />
                  <span>{studio.beds} {t(language, 'studio.beds')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="text-blue-600" size={20} />
                  <span>{t(language, 'studio.capacity', { count: studio.capacity })}</span>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t(language, 'studio.amenities')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studio.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <Check className="text-green-600" size={18} />
                    <span>{translateAmenity(amenity, language)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{t(language, 'studio.priceInfo')}</h3>
                {studio.name === 'Апартамент №1' ? (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{t(language, 'studio.lowSeason')}</span>
                      <span className="font-semibold text-green-600">€{studio.price_per_night}/{t(language, 'studio.perNight')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{t(language, 'studio.highSeason')}</span>
                      <span className="font-semibold text-orange-600">€{studio.price_per_night + studio.high_season_markup}/{t(language, 'studio.perNight')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{t(language, 'studio.basePrice')}</span>
                      <span className="font-semibold text-gray-800">€{studio.price_per_night}/{t(language, 'studio.perNight')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{t(language, 'studio.lowSeason')}</span>
                      <span className="font-semibold text-green-600">€{studio.price_per_night - studio.low_season_discount}/{t(language, 'studio.perNight')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{t(language, 'studio.highSeason')}</span>
                      <span className="font-semibold text-orange-600">€{studio.price_per_night + studio.high_season_markup}/{t(language, 'studio.perNight')}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                {!showAvailability && (
                  <>
                    <div className="flex items-center gap-2 animate-pulse">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 font-semibold text-sm">
                        {t(language, 'studio.viewers', { count: viewerCount, name: getStudioName(studio, language) })}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowAvailability(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      {t(language, 'studio.viewAvailability')}
                    </button>
                  </>
                )}
              </div>

              {showAvailability && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{t(language, 'studio.selectDatesAndGuests')}</h3>

                  <div className="mb-6">
                    <Calendar
                      bookedDates={bookedDates}
                      selectedCheckIn={selectedCheckIn}
                      selectedCheckOut={selectedCheckOut}
                      onDateSelect={handleDateSelect}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {t(language, 'search.adults')}
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-xl font-bold transition-colors"
                        >
                          −
                        </button>
                        <span className="text-2xl font-semibold w-12 text-center">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(Math.min(studio.capacity, adults + 1))}
                          className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-xl font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {language === 'bg' ? 'Деца (до 7 години)' : language === 'en' ? 'Children (up to 7 years)' : language === 'ru' ? 'Дети (до 7 лет)' : language === 'sr' ? 'Деца (до 7 година)' : language === 'el' ? 'Παιδιά (έως 7 ετών)' : language === 'ro' ? 'Copii (până la 7 ani)' : language === 'mk' ? 'Деца (до 7 години)' : 'Children (up to 7 years)'}
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-xl font-bold transition-colors"
                        >
                          −
                        </button>
                        <span className="text-2xl font-semibold w-12 text-center">{children}</span>
                        <button
                          type="button"
                          onClick={() => setChildren(Math.min(5, children + 1))}
                          className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-xl font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedCheckIn && selectedCheckOut && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-800 text-center">
                        {t(language, 'studio.selectedDates', { checkIn: selectedCheckIn.toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-US'), checkOut: selectedCheckOut.toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-US') })}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={calculateTotal}
                    disabled={!selectedCheckIn || !selectedCheckOut}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {t(language, 'studio.sendBookingRequest')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showContactModal && totalPrice && selectedCheckIn && selectedCheckOut && (
        <ContactModal
          studio={studio}
          checkIn={selectedCheckIn}
          checkOut={selectedCheckOut}
          adults={adults}
          children={children}
          totalPrice={totalPrice}
          onSubmit={handleContactSubmit}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {showConfirmationModal && contactPreferences && selectedCheckIn && selectedCheckOut && totalPrice && (
        <ConfirmationModal
          studio={studio}
          checkIn={selectedCheckIn}
          checkOut={selectedCheckOut}
          adults={adults}
          children={children}
          totalPrice={totalPrice}
          contactPreferences={contactPreferences}
          onConfirm={handleConfirmBooking}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}

      {showSuccessModal && (
        <SuccessModal onClose={handleSuccessClose} />
      )}
    </>
  );
}
