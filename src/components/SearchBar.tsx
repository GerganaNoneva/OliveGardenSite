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

  const [checkInDay, setCheckInDay] = useState<string>(searchParams.checkIn?.getDate().toString() || '');
  const [checkInMonth, setCheckInMonth] = useState<string>(searchParams.checkIn ? (searchParams.checkIn.getMonth() + 1).toString() : '');
  const [checkInYear, setCheckInYear] = useState<string>(searchParams.checkIn?.getFullYear().toString() || '');

  const [checkOutDay, setCheckOutDay] = useState<string>(searchParams.checkOut?.getDate().toString() || '');
  const [checkOutMonth, setCheckOutMonth] = useState<string>(searchParams.checkOut ? (searchParams.checkOut.getMonth() + 1).toString() : '');
  const [checkOutYear, setCheckOutYear] = useState<string>(searchParams.checkOut?.getFullYear().toString() || '');

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
      checkIn.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      if (date <= checkIn) {
        return t(language, 'search.errors.checkOutBeforeCheckIn');
      }
    }

    return null;
  };


  const updateCheckInDate = (day: string, month: string, year: string) => {
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (!day || !month || !year || isNaN(d) || isNaN(m) || isNaN(y)) {
      setCheckInError(null);
      onSearchChange({ ...searchParams, checkIn: null });
      return;
    }

    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 2024 || y > 2030) {
      setCheckInError(null);
      return;
    }

    const date = new Date(y, m - 1, d);
    if (date.getDate() !== d || date.getMonth() !== m - 1 || date.getFullYear() !== y) {
      setCheckInError(language === 'bg' ? 'Невалидна дата' : 'Invalid date');
      return;
    }

    onSearchChange({ ...searchParams, checkIn: date });
    const error = validateCheckInDate(date);
    setCheckInError(error);
  };

  const updateCheckOutDate = (day: string, month: string, year: string) => {
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (!day || !month || !year || isNaN(d) || isNaN(m) || isNaN(y)) {
      setCheckOutError(null);
      onSearchChange({ ...searchParams, checkOut: null });
      return;
    }

    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 2024 || y > 2030) {
      setCheckOutError(null);
      return;
    }

    const date = new Date(y, m - 1, d);
    if (date.getDate() !== d || date.getMonth() !== m - 1 || date.getFullYear() !== y) {
      setCheckOutError(language === 'bg' ? 'Невалидна дата' : 'Invalid date');
      return;
    }

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
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={language === 'bg' ? 'Ден' : 'Day'}
              min="1"
              max="31"
              className={`w-20 border-2 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-300 bg-gray-50 focus:bg-white ${
                checkInError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
              value={checkInDay}
              onChange={(e) => {
                setCheckInDay(e.target.value);
                updateCheckInDate(e.target.value, checkInMonth, checkInYear);
              }}
            />
            <input
              type="number"
              placeholder={language === 'bg' ? 'Месец' : 'Month'}
              min="1"
              max="12"
              className={`w-24 border-2 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-300 bg-gray-50 focus:bg-white ${
                checkInError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
              value={checkInMonth}
              onChange={(e) => {
                setCheckInMonth(e.target.value);
                updateCheckInDate(checkInDay, e.target.value, checkInYear);
              }}
            />
            <input
              type="number"
              placeholder={language === 'bg' ? 'Година' : 'Year'}
              min="2024"
              max="2030"
              className={`w-28 border-2 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-300 bg-gray-50 focus:bg-white ${
                checkInError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
              value={checkInYear}
              onChange={(e) => {
                setCheckInYear(e.target.value);
                updateCheckInDate(checkInDay, checkInMonth, e.target.value);
              }}
            />
          </div>
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
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={language === 'bg' ? 'Ден' : 'Day'}
              min="1"
              max="31"
              className={`w-20 border-2 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-300 bg-gray-50 focus:bg-white ${
                checkOutError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
              value={checkOutDay}
              onChange={(e) => {
                setCheckOutDay(e.target.value);
                updateCheckOutDate(e.target.value, checkOutMonth, checkOutYear);
              }}
            />
            <input
              type="number"
              placeholder={language === 'bg' ? 'Месец' : 'Month'}
              min="1"
              max="12"
              className={`w-24 border-2 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-300 bg-gray-50 focus:bg-white ${
                checkOutError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
              value={checkOutMonth}
              onChange={(e) => {
                setCheckOutMonth(e.target.value);
                updateCheckOutDate(checkOutDay, e.target.value, checkOutYear);
              }}
            />
            <input
              type="number"
              placeholder={language === 'bg' ? 'Година' : 'Year'}
              min="2024"
              max="2030"
              className={`w-28 border-2 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 transition-all hover:border-gray-300 bg-gray-50 focus:bg-white ${
                checkOutError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
              value={checkOutYear}
              onChange={(e) => {
                setCheckOutYear(e.target.value);
                updateCheckOutDate(checkOutDay, checkOutMonth, e.target.value);
              }}
            />
          </div>
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
                setAdultsError(null);
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
                setAdultsError(null);
                onSearchChange({ ...searchParams, adults: newValue });
              }}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-xl font-bold transition-colors"
            >
              +
            </button>
          </div>
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
