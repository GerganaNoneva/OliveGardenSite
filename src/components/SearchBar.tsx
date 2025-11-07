import { Calendar, Users, Baby, Search, AlertCircle } from 'lucide-react';
import { SearchParams } from '../types';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

interface SearchBarProps {
  searchParams: SearchParams;
  onSearchChange: (params: SearchParams) => void;
  onSearch: () => void;
}

export default function SearchBar({ searchParams, onSearchChange, onSearch }: SearchBarProps) {
  const { language } = useLanguage();
  const [checkInError, setCheckInError] = useState<string | null>(null);
  const [checkOutError, setCheckOutError] = useState<string | null>(null);
  const [adultsError, setAdultsError] = useState<string | null>(null);

  const isDateInSeason = (date: Date): boolean => {
    const month = date.getMonth();
    return month >= 4 && month <= 8;
  };

  const validateCheckInDate = (date: Date): string | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return t(language, 'search.errors.pastDate');
    }

    if (!isDateInSeason(date)) {
      return t(language, 'search.errors.seasonOnly');
    }

    return null;
  };

  const validateCheckOutDate = (date: Date): string | null => {
    if (!isDateInSeason(date)) {
      return t(language, 'search.errors.seasonOnly');
    }

    if (searchParams.checkIn) {
      const checkIn = new Date(searchParams.checkIn);
      if (date <= checkIn) {
        return t(language, 'search.errors.checkOutBeforeCheckIn');
      }
    }

    return null;
  };

  const isValidDateString = (value: string): boolean => {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  };

  const handleCheckInChange = (value: string) => {
    if (!value) {
      setCheckInError(null);
      onSearchChange({ ...searchParams, checkIn: null });
      return;
    }

    if (!isValidDateString(value)) {
      setCheckInError(null);
      onSearchChange({ ...searchParams, checkIn: null });
      return;
    }

    const date = new Date(value);
    onSearchChange({ ...searchParams, checkIn: date });

    const error = validateCheckInDate(date);
    setCheckInError(error);
  };

  const handleCheckOutChange = (value: string) => {
    if (!value) {
      setCheckOutError(null);
      onSearchChange({ ...searchParams, checkOut: null });
      return;
    }

    if (!isValidDateString(value)) {
      setCheckOutError(null);
      onSearchChange({ ...searchParams, checkOut: null });
      return;
    }

    const date = new Date(value);
    onSearchChange({ ...searchParams, checkOut: date });

    const error = validateCheckOutDate(date);
    setCheckOutError(error);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 mx-4 -mt-16 relative z-10 max-w-6xl mx-auto border border-cyan-100">
      <div className="text-center mb-6">
        <p className="text-sm text-cyan-700 font-medium bg-cyan-50 inline-block px-4 py-2 rounded-lg">
          {t(language, 'search.seasonInfo')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
        <div className="flex flex-col group">
          <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Calendar size={16} className="text-blue-600" />
            </div>
            {t(language, 'search.checkIn')}
          </label>
          <input
            type="date"
            className={`border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-300 bg-gray-50 focus:bg-white ${
              checkInError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}
            value={searchParams.checkIn?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleCheckInChange(e.target.value)}
          />
          {checkInError && (
            <div className="flex items-center gap-1 mt-2 text-red-600 text-xs">
              <AlertCircle size={14} />
              <span>{checkInError}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col group">
          <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Calendar size={16} className="text-blue-600" />
            </div>
            {t(language, 'search.checkOut')}
          </label>
          <input
            type="date"
            className={`border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-300 bg-gray-50 focus:bg-white ${
              checkOutError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}
            value={searchParams.checkOut?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleCheckOutChange(e.target.value)}
          />
          {checkOutError && (
            <div className="flex items-center gap-1 mt-2 text-red-600 text-xs">
              <AlertCircle size={14} />
              <span>{checkOutError}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col group">
          <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Users size={16} className="text-blue-600" />
            </div>
            {t(language, 'search.adults')}
          </label>
          <input
            type="number"
            min="1"
            max="8"
            placeholder=""
            className={`border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-300 bg-gray-50 focus:bg-white ${
              adultsError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}
            value={searchParams.adults ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setAdultsError(null);
                onSearchChange({
                  ...searchParams,
                  adults: null
                });
              } else {
                const num = parseInt(value);
                if (num < 1) {
                  setAdultsError(t(language, 'search.errors.minAdults'));
                } else if (num > 8) {
                  setAdultsError(language === 'bg' ? 'Максимум 8 възрастни' : 'Maximum 8 adults');
                } else {
                  setAdultsError(null);
                }
                onSearchChange({
                  ...searchParams,
                  adults: num || null
                });
              }
            }}
          />
          {adultsError && (
            <div className="flex items-center gap-1 mt-2 text-red-600 text-xs">
              <AlertCircle size={14} />
              <span>{adultsError}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col group">
          <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Baby size={16} className="text-blue-600" />
            </div>
            {t(language, 'search.children')}
          </label>
          <input
            type="number"
            min="0"
            max="8"
            placeholder=""
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-gray-50 focus:bg-white"
            value={searchParams.children ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                onSearchChange({
                  ...searchParams,
                  children: null
                });
              } else {
                const num = parseInt(value);
                onSearchChange({
                  ...searchParams,
                  children: num >= 0 && num <= 8 ? num : null
                });
              }
            }}
          />
        </div>

        <button
          onClick={onSearch}
          className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <Search size={20} />
          <span>{t(language, 'search.search')}</span>
        </button>
      </div>
    </div>
  );
}
