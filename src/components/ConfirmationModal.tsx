import { Studio, ContactPreferences } from '../types';
import { Calendar, Users, Baby, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import { getStudioName } from '../utils/studioTranslations';

interface ConfirmationModalProps {
  studio: Studio;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  totalPrice: number;
  contactPreferences: ContactPreferences;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  studio,
  checkIn,
  checkOut,
  adults,
  children,
  totalPrice,
  contactPreferences,
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  const { language } = useLanguage();
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getContactMethodIcons = () => {
    return contactPreferences.contactMethods.map(method => {
      switch (method) {
        case 'viber':
          return <MessageCircle key={method} size={20} style={{ color: '#7360f2' }} />;
        case 'whatsapp':
          return <Phone key={method} size={20} style={{ color: '#25D366' }} />;
        case 'email':
          return <Mail key={method} size={20} style={{ color: '#3b82f6' }} />;
      }
    });
  };

  const getContactMethodLabels = () => {
    return contactPreferences.contactMethods.map(method => {
      switch (method) {
        case 'viber':
          return 'Viber';
        case 'whatsapp':
          return 'WhatsApp';
        case 'email':
          return 'Email';
      }
    }).join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t(language, 'confirmation.title')}
          </h2>
          <p className="text-gray-600">
            {t(language, 'confirmation.subtitle')}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-200">
            <img
              src={studio.main_image}
              alt={getStudioName(studio, language)}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800">{getStudioName(studio, language)}</h3>
              <p className="text-gray-600 text-sm">{studio.bedrooms} {t(language, 'studio.bedrooms')} • {studio.bathrooms} {t(language, 'studio.bathrooms')}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={18} className="text-blue-600" />
                <span className="font-medium">{t(language, 'confirmation.checkIn')}</span>
              </div>
              <span className="text-gray-800">{formatDate(checkIn)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={18} className="text-blue-600" />
                <span className="font-medium">{t(language, 'confirmation.checkOut')}</span>
              </div>
              <span className="text-gray-800">{formatDate(checkOut)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={18} className="text-blue-600" />
                <span className="font-medium">{t(language, 'confirmation.adults')}</span>
              </div>
              <span className="text-gray-800">{adults}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Baby size={18} className="text-blue-600" />
                <span className="font-medium">{t(language, 'confirmation.childrenLabel')}</span>
              </div>
              <span className="text-gray-800">{children}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="font-semibold text-gray-700">{t(language, 'confirmation.nights')}</span>
              <span className="text-gray-800">{nights}</span>
            </div>

            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
              <span className="text-lg font-bold text-gray-800">{t(language, 'confirmation.totalPrice')}</span>
              <span className="text-2xl font-bold text-blue-600">€{totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">{t(language, 'confirmation.contactData')}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Име:</span>
              <span className="font-medium text-gray-800">{contactPreferences.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-blue-600" />
              <span className="text-gray-700">Държава:</span>
              <span className="font-medium text-gray-800">{contactPreferences.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-blue-600" />
              <span className="text-gray-700">Телефон:</span>
              <span className="font-medium text-gray-800">
                {contactPreferences.phoneCountryCode} {contactPreferences.phone}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">{getContactMethodIcons()}</div>
              <span className="text-gray-700">{t(language, 'confirmation.contactMethods')}</span>
              <span className="font-medium text-gray-800">{getContactMethodLabels()}</span>
            </div>
            {contactPreferences.email && (
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-blue-600" />
                <span className="text-gray-700">Email:</span>
                <span className="font-medium text-gray-800">{contactPreferences.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>{t(language, 'confirmation.importantNote')}</strong> {t(language, 'confirmation.importantText')}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {t(language, 'confirmation.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {t(language, 'confirmation.sendRequest')}
          </button>
        </div>
      </div>
    </div>
  );
}
