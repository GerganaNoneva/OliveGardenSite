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
  const [checkInValue, setCheckInValue] = useState('');
  const [checkOutValue, setCheckOutValue] = useState('');

  const isDateInSeason = (date: Date): boolean => {
    const month = date.getMonth();
    const day = date.getDate();

    if (month === 4 && day >= 1) return true;
    if (month >= 5 && month <= 7) return true;
    if (month === 8 && day <= 30) return true;

    return false;
  };

  const formatDateInput = (value: string): string => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const parseDateFromInput = (value: string): Date | null => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length === 8) {
      const day = parseInt(numbers.slice(0, 2));
      const month = parseInt(numbers.slice(2, 4));
      const year = parseInt(numbers.slice(4, 8));

      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2024) {
        return new Date(year, month - 1, day);
      }
    }

    return null;
  };

  const handleCheckInInput = (value: string) => {
    const formatted = formatDateInput(value);
    setCheckInValue(formatted);

    if (!value) {
      setCheckInError(null);
      onSearchChange({ ...searchParams, checkIn: null });
      return;
    }

    const date = parseDateFromInput(formatted);
    if (date) {
      onSearchChange({ ...searchParams, checkIn: date });

      if (!isDateInSeason(date)) {
        setCheckInError(language === 'bg' ? 'Датата трябва да е между 1 май и 30 септември' : 'Date must be between May 1 and September 30');
      } else {
        setCheckInError(null);
      }
    }
  };

  const handleCheckOutInput = (value: string) => {
    const formatted = formatDateInput(value);
    setCheckOutValue(formatted);

    if (!value) {
      setCheckOutError(null);
      onSearchChange({ ...searchParams, checkOut: null });
      return;
    }

    const date = parseDateFromInput(formatted);
    if (date) {
      onSearchChange({ ...searchParams, checkOut: date });

      if (!isDateInSeason(date)) {
        setCheckOutError(language === 'bg' ? 'Датата трябва да е между 1 май и 30 септември' : 'Date must be between May 1 and September 30');
      } else {
        setCheckOutError(null);
      }
    }
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
          <label htmlFor="checkin-input" className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Calendar size={16} className="text-blue-600" />
            </div>
            {t(language, 'search.checkIn')}
          </label>
          <input
            id="checkin-input"
            type="text"
            placeholder={language === 'bg' ? 'ДД/ММ/ГГГГ' : 'DD/MM/YYYY'}
            maxLength={10}
            className={`border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-300 bg-gray-50 focus:bg-white ${
              checkInError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}
            value={checkInValue}
            onChange={(e) => handleCheckInInput(e.target.value)}
          />
          {checkInError && (
            <div className="flex items-center gap-1 mt-2 text-red-600 text-xs">
              <AlertCircle size={14} />
              <span>{checkInError}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col group">
          <label htmlFor="checkout-input" className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Calendar size={16} className="text-blue-600" />
            </div>
            {t(language, 'search.checkOut')}
          </label>
          <input
            id="checkout-input"
            type="text"
            placeholder={language === 'bg' ? 'ДД/ММ/ГГГГ' : 'DD/MM/YYYY'}
            maxLength={10}
            className={`border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-300 bg-gray-50 focus:bg-white ${
              checkOutError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}
            value={checkOutValue}
            onChange={(e) => handleCheckOutInput(e.target.value)}
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const newValue = Math.max(1, (searchParams.adults ?? 1) - 1);
                onSearchChange({ ...searchParams, adults: newValue });
              }}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-xl font-bold transition-colors"
            >
              −
            </button>
            <span className="text-2xl font-semibold w-12 text-center">{searchParams.adults ?? 1}</span>
            <button
              type="button"
              onClick={() => {
                const newValue = Math.min(8, (searchParams.adults ?? 1) + 1);
                onSearchChange({ ...searchParams, adults: newValue });
              }}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-xl font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col group">
          <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Baby size={16} className="text-blue-600" />
            </div>
            {t(language, 'search.children')}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const newValue = Math.max(0, (searchParams.children ?? 0) - 1);
                onSearchChange({ ...searchParams, children: newValue });
              }}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-xl font-bold transition-colors"
            >
              −
            </button>
            <span className="text-2xl font-semibold w-12 text-center">{searchParams.children ?? 0}</span>
            <button
              type="button"
              onClick={() => {
                const newValue = Math.min(8, (searchParams.children ?? 0) + 1);
                onSearchChange({ ...searchParams, children: newValue });
              }}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-xl font-bold transition-colors"
            >
              +
            </button>
          </div>
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
