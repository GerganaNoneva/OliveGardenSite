import { useState } from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { ContactPreferences, Studio } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import { getStudioName } from '../utils/studioTranslations';

interface ContactModalProps {
  studio: Studio;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  totalPrice: number;
  onSubmit: (preferences: ContactPreferences) => void;
  onClose: () => void;
}

const countries = [
  { name: 'България', code: '+359', flag: '🇧🇬' },
  { name: 'Ελλάδα', code: '+30', flag: '🇬🇷' },
  { name: 'România', code: '+40', flag: '🇷🇴' },
  { name: 'Србија', code: '+381', flag: '🇷🇸' },
  { name: 'Македонија', code: '+389', flag: '🇲🇰' },
  { name: 'Türkiye', code: '+90', flag: '🇹🇷' },
  { name: 'Россия', code: '+7', flag: '🇷🇺' },
  { name: 'Україна', code: '+380', flag: '🇺🇦' },
  { name: 'Deutschland', code: '+49', flag: '🇩🇪' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Italia', code: '+39', flag: '🇮🇹' },
  { name: 'España', code: '+34', flag: '🇪🇸' },
  { name: 'USA', code: '+1', flag: '🇺🇸' },
];

export default function ContactModal({ studio, checkIn, checkOut, adults, children, totalPrice, onSubmit, onClose }: ContactModalProps) {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [country, setCountry] = useState('България');
  const [contactMethods, setContactMethods] = useState<('viber' | 'whatsapp' | 'email')[]>([]);
  const [phoneCountryCode, setPhoneCountryCode] = useState('+359');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleCountryChange = (countryName: string) => {
    setCountry(countryName);
    const selectedCountry = countries.find(c => c.name === countryName);
    if (selectedCountry) {
      setPhoneCountryCode(selectedCountry.code);
    }
  };

  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  const handleContactMethodToggle = (method: 'viber' | 'whatsapp' | 'email') => {
    if (contactMethods.includes(method)) {
      setContactMethods(contactMethods.filter(m => m !== method));
    } else {
      if (contactMethods.length < 3) {
        setContactMethods([...contactMethods, method]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Моля, въведете вашето име');
      return;
    }

    if (!phone.trim()) {
      alert('Моля, въведете телефонен номер');
      return;
    }

    if (contactMethods.length === 0) {
      alert('Моля, изберете поне един начин за контакт');
      return;
    }

    const needsEmail = contactMethods.includes('email');

    if (needsEmail && (!email.trim() || !email.includes('@'))) {
      alert('Моля, въведете валиден имейл адрес');
      return;
    }

    const preferences: ContactPreferences = {
      name: name.trim(),
      country,
      contactMethods,
      phoneCountryCode,
      phone: phone.trim(),
      email: needsEmail ? email.trim() : undefined,
    };

    onSubmit(preferences);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-800">
            {t(language, 'contact.title')}
          </h2>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-lg text-gray-800 mb-3">{t(language, 'contact.bookingDetails')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">{t(language, 'contact.studio')}</span>
                <span className="font-semibold text-gray-900">{getStudioName(studio, language)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">{t(language, 'contact.dates')}</span>
                <span className="font-semibold text-gray-900">
                  {checkIn.toLocaleDateString('bg-BG')} - {checkOut.toLocaleDateString('bg-BG')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">{t(language, 'contact.adults')}</span>
                <span className="font-semibold text-gray-900">{adults}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">{t(language, 'contact.children')}</span>
                <span className="font-semibold text-gray-900">{children}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">{t(language, 'contact.nights')}</span>
                <span className="font-semibold text-gray-900">{nights}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span className="text-gray-700 font-bold">{t(language, 'contact.totalPrice')}</span>
                <span className="font-bold text-lg text-blue-600">€{totalPrice}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t(language, 'contact.name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t(language, 'contact.namePlaceholder')}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t(language, 'contact.country')}
              </label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {countries.map(c => (
                  <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t(language, 'contact.phone')}
              </label>
              <div className="flex gap-2">
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  className="w-36 border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123456789"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t(language, 'contact.contactMethods')}
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: contactMethods.includes('viber') ? '#7360f2' : '#e5e7eb', backgroundColor: contactMethods.includes('viber') ? '#f3f1ff' : 'white' }}>
                  <input
                    type="checkbox"
                    checked={contactMethods.includes('viber')}
                    onChange={() => handleContactMethodToggle('viber')}
                    className="mr-3 w-5 h-5"
                  />
                  <MessageCircle className="mr-2" size={20} style={{ color: '#7360f2' }} />
                  <span className="font-medium">Viber</span>
                </label>

                <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: contactMethods.includes('whatsapp') ? '#25D366' : '#e5e7eb', backgroundColor: contactMethods.includes('whatsapp') ? '#e8f8f0' : 'white' }}>
                  <input
                    type="checkbox"
                    checked={contactMethods.includes('whatsapp')}
                    onChange={() => handleContactMethodToggle('whatsapp')}
                    className="mr-3 w-5 h-5"
                  />
                  <Phone className="mr-2" size={20} style={{ color: '#25D366' }} />
                  <span className="font-medium">WhatsApp</span>
                </label>

                <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: contactMethods.includes('email') ? '#3b82f6' : '#e5e7eb', backgroundColor: contactMethods.includes('email') ? '#eff6ff' : 'white' }}>
                  <input
                    type="checkbox"
                    checked={contactMethods.includes('email')}
                    onChange={() => handleContactMethodToggle('email')}
                    className="mr-3 w-5 h-5"
                  />
                  <Mail className="mr-2" size={20} style={{ color: '#3b82f6' }} />
                  <span className="font-medium">Email</span>
                </label>
              </div>
            </div>

            {contactMethods.includes('email') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t(language, 'contact.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                  required
                />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {t(language, 'contact.cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {t(language, 'contact.continue')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
