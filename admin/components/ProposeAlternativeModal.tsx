import { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { AdminBooking } from '../types';
import { Studio } from '../../src/types';
import { X, Calendar, MessageCircle, Phone, Mail } from 'lucide-react';

interface ProposeAlternativeModalProps {
  booking: AdminBooking;
  studios: Studio[];
  onClose: () => void;
  onPropose: () => void;
}

interface CalendarDay {
  date: Date;
  dateStr: string;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isBooked: boolean;
}

export default function ProposeAlternativeModal({ booking, studios, onClose, onPropose }: ProposeAlternativeModalProps) {
  const [selectedStudio, setSelectedStudio] = useState(booking.studio_id);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [proposing, setProposing] = useState(false);

  const monthNames = ['Май', 'Юни', 'Юли', 'Август', 'Септември'];

  // Функция за определяне на годината на сезона
  const getSeasonYear = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11
    const currentDay = today.getDate();

    // Ако сме след 30 септември (месец 8, ден 30), използваме следващата година
    if (currentMonth > 8 || (currentMonth === 8 && currentDay >= 30)) {
      return currentYear + 1;
    }
    return currentYear;
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedStudio]);

  const fetchBookings = async () => {
    setLoading(true);
    const seasonYear = getSeasonYear();
    const startDate = new Date(seasonYear, 4, 1);
    const endDate = new Date(seasonYear, 8, 30);

    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('studio_id', selectedStudio)
      .gte('check_in', startDate.toISOString().split('T')[0])
      .lte('check_out', endDate.toISOString().split('T')[0])
      .in('status', ['pending', 'in_correspondence', 'confirmed', 'proposed_dates'])
      .order('check_in');

    if (data) {
      setBookings(data);
    }
    setLoading(false);
  };

  const isDateBooked = (dateStr: string): boolean => {
    return bookings.some(b => {
      const checkIn = new Date(b.check_in);
      const checkOut = new Date(b.check_out);
      const date = new Date(dateStr);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date >= checkIn && date <= checkOut;
    });
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
      days.push({
        date,
        dateStr,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: false,
        isPast: date < today,
        isBooked: isDateBooked(dateStr)
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date,
        dateStr,
        day,
        month,
        year,
        isCurrentMonth: true,
        isPast: date < today,
        isBooked: isDateBooked(dateStr)
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date,
        dateStr,
        day,
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: false,
        isPast: date < today,
        isBooked: isDateBooked(dateStr)
      });
    }

    return days;
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.isPast || day.isBooked) return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      setSelectedCheckIn(day.date);
      setSelectedCheckOut(null);
    } else {
      if (day.date < selectedCheckIn) {
        setSelectedCheckIn(day.date);
        setSelectedCheckOut(null);
      } else {
        let current = new Date(selectedCheckIn);
        let hasBooking = false;
        while (current < day.date) {
          current.setDate(current.getDate() + 1);
          if (isDateBooked(current.toISOString().split('T')[0])) {
            hasBooking = true;
            break;
          }
        }

        if (hasBooking) {
          alert('Избраният период съдържа резервирани дати.');
          return;
        }

        setSelectedCheckOut(day.date);
      }
    }
  };

  const isDateSelected = (dateStr: string): boolean => {
    if (!selectedCheckIn) return false;
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    if (selectedCheckOut) {
      const checkIn = new Date(selectedCheckIn);
      const checkOut = new Date(selectedCheckOut);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      return date >= checkIn && date <= checkOut;
    }

    const checkIn = new Date(selectedCheckIn);
    checkIn.setHours(0, 0, 0, 0);
    return date.getTime() === checkIn.getTime();
  };

  const generateProposalMessage = () => {
    if (!selectedCheckIn || !selectedCheckOut) return '';

    const studio = studios.find(s => s.id === selectedStudio);
    const checkInStr = selectedCheckIn.toLocaleDateString('bg-BG');
    const checkOutStr = selectedCheckOut.toLocaleDateString('bg-BG');

    const languageMessages: Record<string, string> = {
      'България': `Здравейте ${booking.guest_name},\n\nБихме искали да Ви предложим алтернативни дати за Вашата резервация в ${studio?.name}:\n\nНастаняване: ${checkInStr}\nНапускане: ${checkOutStr}\n\nМоля, уведомете ни дали тези дати Ви подхождат.\n\nПоздрави,`,
      'Ελλάδα': `Γεια σας ${booking.guest_name},\n\nΘα θέλαμε να σας προτείνουμε εναλλακτικές ημερομηνίες για την κράτησή σας στο ${studio?.name}:\n\nCheck-in: ${checkInStr}\nCheck-out: ${checkOutStr}\n\nΠαρακαλούμε ενημερώστε μας αν αυτές οι ημερομηνίες σας ταιριάζουν.\n\nΜε εκτίμηση,`,
      'România': `Bună ziua ${booking.guest_name},\n\nAm dori să vă propunem date alternative pentru rezervarea dvs. la ${studio?.name}:\n\nCheck-in: ${checkInStr}\nCheck-out: ${checkOutStr}\n\nVă rugăm să ne anunțați dacă aceste date vă convin.\n\nCu stimă,`,
      'default': `Hello ${booking.guest_name},\n\nWe would like to propose alternative dates for your reservation at ${studio?.name}:\n\nCheck-in: ${checkInStr}\nCheck-out: ${checkOutStr}\n\nPlease let us know if these dates suit you.\n\nBest regards,`
    };

    return languageMessages[booking.guest_country || 'default'] || languageMessages['default'];
  };

  const handlePropose = async () => {
    if (!selectedCheckIn || !selectedCheckOut) {
      alert('Моля, изберете период');
      return;
    }

    setProposing(true);

    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'proposed_dates',
        proposed_check_in: selectedCheckIn.toISOString().split('T')[0],
        proposed_check_out: selectedCheckOut.toISOString().split('T')[0],
        proposed_studio_id: selectedStudio
      })
      .eq('id', booking.id);

    if (!error) {
      const message = generateProposalMessage();
      const encodedMessage = encodeURIComponent(message);

      if (booking.contact_method === 'viber' && booking.guest_phone) {
        const phone = `${booking.phone_country_code}${booking.guest_phone}`.replace(/\D/g, '');
        window.open(`viber://chat?number=${phone}&text=${encodedMessage}`, '_blank');
      } else if (booking.contact_method === 'whatsapp' && booking.guest_phone) {
        const phone = `${booking.phone_country_code}${booking.guest_phone}`.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
      } else if (booking.contact_method === 'email' && booking.guest_email) {
        window.location.href = `mailto:${booking.guest_email}?subject=Предложение за алтернативни дати&body=${encodedMessage}`;
      } else if (booking.contact_method === 'messenger') {
        navigator.clipboard.writeText(message);
        alert('Съобщението е копирано. Отваряме Messenger...');
        window.open(`https://m.me/${booking.guest_email?.split('@')[0]}`, '_blank');
      }

      onPropose();
    }

    setProposing(false);
  };

  const renderMonth = (monthIndex: number) => {
    const seasonYear = getSeasonYear();
    const monthDate = new Date(seasonYear, monthIndex, 1);
    const days = generateCalendarDays(monthDate);

    return (
      <div key={monthIndex} className="bg-white rounded-lg border border-gray-200 p-3">
        <h4 className="text-sm font-bold text-gray-800 mb-3 text-center">
          {monthNames[monthIndex - 4]} {seasonYear}
        </h4>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map(name => (
            <div key={name} className="text-center text-[10px] font-semibold text-gray-600 py-1">
              {name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isSelected = isDateSelected(day.dateStr);
            let bgColor = 'bg-white hover:bg-cyan-50';

            if (!day.isCurrentMonth) {
              bgColor = 'bg-gray-50';
            }
            if (day.isPast || day.isBooked) {
              bgColor = 'bg-red-100';
            }
            if (isSelected) {
              bgColor = 'bg-gradient-to-br from-cyan-500 to-teal-500 text-white';
            }

            return (
              <div
                key={index}
                className={`
                  min-h-[35px] p-1 border rounded text-center cursor-pointer
                  ${bgColor}
                  ${day.isPast || day.isBooked ? 'cursor-not-allowed opacity-60' : 'hover:scale-105'}
                  transition-all duration-150
                `}
                onClick={() => handleDateClick(day)}
              >
                <div className={`text-[11px] font-semibold ${!day.isCurrentMonth ? 'text-gray-400' : ''}`}>
                  {day.day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-800">Предложи други дати или студио</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Избери студио:
            </label>
            <select
              value={selectedStudio}
              onChange={(e) => {
                setSelectedStudio(e.target.value);
                setSelectedCheckIn(null);
                setSelectedCheckOut(null);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500"
            >
              {studios.map(studio => (
                <option key={studio.id} value={studio.id}>
                  {studio.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCheckIn && (
            <div className="mb-4 p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg border border-cyan-200">
              <p className="text-sm font-medium text-gray-700">
                Избран период: {selectedCheckIn.toLocaleDateString('bg-BG')}
                {selectedCheckOut && ` - ${selectedCheckOut.toLocaleDateString('bg-BG')}`}
              </p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-600">Зареждане...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[4, 5, 6, 7, 8].map(monthIndex => renderMonth(monthIndex))}
            </div>
          )}

          {selectedCheckIn && selectedCheckOut && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Съобщение към клиента:</h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border">
                {generateProposalMessage()}
              </pre>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Отказ
            </button>
            <button
              onClick={handlePropose}
              disabled={!selectedCheckIn || !selectedCheckOut || proposing}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {proposing ? 'Изпращане...' : 'Предложи'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
