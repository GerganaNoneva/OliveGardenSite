import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

interface BookingDateInfo {
  date: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

interface CalendarDay {
  date: Date;
  dateStr: string;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isBooked: boolean;
  bookingStatus?: 'pending' | 'confirmed' | 'rejected';
  isPast: boolean;
  isSelected: boolean;
  isInRange: boolean;
}

interface CalendarProps {
  bookedDates: BookingDateInfo[];
  selectedCheckIn: Date | null;
  selectedCheckOut: Date | null;
  onDateSelect: (checkIn: Date, checkOut: Date | null) => void;
}

const monthNamesByLanguage = {
  bg: ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  sr: ['Јануар', 'Фебруар', 'Март', 'Април', 'Мај', 'Јун', 'Јул', 'Август', 'Септембар', 'Октобар', 'Новембар', 'Децембар'],
  el: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],
  ro: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie']
};

const dayNamesByLanguage = {
  bg: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  sr: ['Нед', 'Пон', 'Уто', 'Сре', 'Чет', 'Пет', 'Суб'],
  el: ['Κυ', 'Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα'],
  ro: ['Du', 'Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ']
};

export default function Calendar({ bookedDates, selectedCheckIn, selectedCheckOut, onDateSelect }: CalendarProps) {
  const { language } = useLanguage();

  const getInitialMonth = () => {
    if (selectedCheckIn) {
      return new Date(selectedCheckIn.getFullYear(), selectedCheckIn.getMonth(), 1);
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11
    const currentDay = today.getDate();

    // Ако сме между 30 септември и 1 май, показваме май следващата година
    if (currentMonth > 8 || (currentMonth === 8 && currentDay >= 30)) {
      // След 30 септември - показваме май следващата година
      return new Date(currentYear + 1, 4, 1); // May is month 4 (0-indexed)
    } else if (currentMonth < 4) {
      // Преди май - показваме май същата година
      return new Date(currentYear, 4, 1);
    } else {
      // Между май и септември - показваме текущия месец
      return new Date(currentYear, currentMonth, 1);
    }
  };

  const shouldShowTwoMonths = () => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return selectedCheckIn.getMonth() !== selectedCheckOut.getMonth() ||
           selectedCheckIn.getFullYear() !== selectedCheckOut.getFullYear();
  };

  const [currentMonth, setCurrentMonth] = useState(getInitialMonth());
  const [selectingCheckOut, setSelectingCheckOut] = useState(selectedCheckIn !== null && selectedCheckOut === null);

  useEffect(() => {
    if (selectedCheckIn) {
      setCurrentMonth(new Date(selectedCheckIn.getFullYear(), selectedCheckIn.getMonth(), 1));
    }
    if (selectedCheckIn && !selectedCheckOut) {
      setSelectingCheckOut(true);
    } else if (selectedCheckIn && selectedCheckOut) {
      setSelectingCheckOut(false);
    }
  }, [selectedCheckIn, selectedCheckOut]);

  const monthNames = monthNamesByLanguage[language];
  const dayNames = dayNamesByLanguage[language];

  const getBookingInfo = (dateStr: string): BookingDateInfo | null => {
    return bookedDates.find(bd => bd.date === dateStr) || null;
  };

  const isDateBooked = (dateStr: string) => {
    return bookedDates.some(bd => bd.date === dateStr && bd.status === 'confirmed');
  };

  const isDateInSeason = (date: Date) => {
    const month = date.getMonth(); // 0-11
    const day = date.getDate();
    // Сезонът е 1 май (месец 4) до 30 септември (месец 8)
    if (month < 4 || month > 8) return false; // Извън май-септември
    if (month === 4 && day < 1) return false; // Преди 1 май
    if (month === 8 && day > 30) return false; // След 30 септември
    return true;
  };

  const isDateInRange = (date: Date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return date > selectedCheckIn && date < selectedCheckOut;
  };

  const generateCalendarDays = (monthDate: Date): CalendarDay[] => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevLastDay.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const bookingInfo = getBookingInfo(dateStr);
      days.push({
        date,
        dateStr,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: false,
        isBooked: isDateBooked(dateStr),
        bookingStatus: bookingInfo?.status,
        isPast: date < today || !isDateInSeason(date),
        isSelected: false,
        isInRange: false
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const bookingInfo = getBookingInfo(dateStr);
      const isSelected =
        (selectedCheckIn && dateStr === selectedCheckIn.toISOString().split('T')[0]) ||
        (selectedCheckOut && dateStr === selectedCheckOut.toISOString().split('T')[0]);

      days.push({
        date,
        dateStr,
        day,
        month,
        year,
        isCurrentMonth: true,
        isBooked: isDateBooked(dateStr),
        bookingStatus: bookingInfo?.status,
        isPast: date < today || !isDateInSeason(date),
        isSelected,
        isInRange: isDateInRange(date)
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateStr = date.toISOString().split('T')[0];
      const bookingInfo = getBookingInfo(dateStr);
      days.push({
        date,
        dateStr,
        day,
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: false,
        isBooked: isDateBooked(dateStr),
        bookingStatus: bookingInfo?.status,
        isPast: date < today || !isDateInSeason(date),
        isSelected: false,
        isInRange: false
      });
    }

    return days;
  };

  const getAlertMessage = () => {
    const messages = {
      bg: 'Избраният период съдържа заети дати. Моля изберете друг период.',
      en: 'The selected period contains booked dates. Please choose another period.',
      ru: 'Выбранный период содержит занятые даты. Пожалуйста, выберите другой период.',
      sr: 'Изабрани период садржи заузете датуме. Молимо изаберите други период.',
      el: 'Η επιλεγμένη περίοδος περιέχει κλεισμένες ημερομηνίες. Παρακαλώ επιλέξτε άλλη περίοδο.',
      ro: 'Perioada selectată conține date rezervate. Vă rugăm să alegeți o altă perioadă.'
    };
    return messages[language];
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.isPast || day.isBooked) return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      onDateSelect(day.date, null);
      setSelectingCheckOut(true);
    } else if (selectingCheckOut) {
      if (day.date < selectedCheckIn) {
        onDateSelect(day.date, null);
      } else {
        const current = new Date(selectedCheckIn);
        while (current < day.date) {
          current.setDate(current.getDate() + 1);
          if (isDateBooked(current.toISOString().split('T')[0])) {
            alert(getAlertMessage());
            return;
          }
        }
        onDateSelect(selectedCheckIn, day.date);
        setSelectingCheckOut(false);
      }
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const showTwoMonths = shouldShowTwoMonths();
  const days = generateCalendarDays(currentMonth);
  const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  const nextMonthDays = showTwoMonths ? generateCalendarDays(nextMonthDate) : [];

  const renderMonth = (monthDays: CalendarDay[], monthDate: Date) => (
    <div className="flex-1">
      <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
        {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
      </h3>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(name => (
          <div key={name} className="text-center text-sm font-semibold text-gray-600 py-2">
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((day, index) => {
          let bgColor = 'bg-white hover:bg-blue-50';
          let textColor = 'text-gray-800';
          let cursor = 'cursor-pointer';
          let border = 'border border-gray-200';

          if (!day.isCurrentMonth) {
            textColor = 'text-gray-400';
          }

          if (day.isPast) {
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-400';
            cursor = 'cursor-not-allowed';
          }

          // Само потвърдените резервации се показват като заети (червени)
          if (day.bookingStatus === 'confirmed') {
            bgColor = 'bg-red-100';
            textColor = 'text-gray-400';
            cursor = 'cursor-not-allowed';
          }

          if (day.isSelected) {
            bgColor = 'bg-blue-600';
            textColor = 'text-white';
            border = 'border-2 border-blue-600';
          }

          if (day.isInRange && !day.isBooked && !day.isPast) {
            bgColor = 'bg-blue-200';
          }

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={day.isPast || day.isBooked}
              className={`
                ${bgColor} ${textColor} ${cursor} ${border}
                p-3 rounded-lg text-center font-medium
                transition-all duration-200
                ${!(day.isPast || day.isBooked) ? 'hover:scale-105 hover:shadow-md' : ''}
              `}
            >
              {day.day}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {!showTwoMonths && (
          <h3 className="text-xl font-bold text-gray-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
        )}
        {showTwoMonths && <div className="flex-1"></div>}
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {showTwoMonths ? (
        <div className="flex gap-8">
          {renderMonth(days, currentMonth)}
          {renderMonth(nextMonthDays, nextMonthDate)}
        </div>
      ) : (
        renderMonth(days, currentMonth)
      )}

      <div className="flex flex-wrap gap-6 mt-6 text-sm justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-100 rounded border border-gray-300"></div>
          <span className="font-medium">{t(language, 'calendar.booked')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded border border-gray-300"></div>
          <span className="font-medium">{t(language, 'calendar.available')}</span>
        </div>
      </div>
    </div>
  );
}
