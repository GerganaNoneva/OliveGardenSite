import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../src/lib/supabase';
import { Studio } from '../../src/types';
import { AdminBooking, statusColors, statusLabels } from '../types';
import BookingDetailsModal from './BookingDetailsModal';
import CreateBookingModal from './CreateBookingModal';
import { Phone, Mail, MessageCircle, Users, Edit2, Trash2 } from 'lucide-react';

interface AdminCalendarProps {
  studio: Studio;
}

interface CalendarDay {
  date: Date;
  dateStr: string;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  bookings: AdminBooking[];
}

export default function AdminCalendar({ studio }: AdminCalendarProps) {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingBooking, setCreatingBooking] = useState<Date | null>(null);

  const monthNames = [
    'Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни',
    'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'
  ];

  const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

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

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const seasonYear = getSeasonYear();
    const startDate = new Date(seasonYear, 4, 1); // May 1st
    const endDate = new Date(seasonYear, 8, 30); // September 30th

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('studio_id', studio.id)
      .gte('check_in', startDate.toISOString().split('T')[0])
      .lte('check_out', endDate.toISOString().split('T')[0])
      .neq('status', 'rejected')
      .order('check_in');

    if (!error && data) {
      console.log('Fetched bookings for studio:', studio.id, data);
      setBookings(data);
    }
    setLoading(false);
  }, [studio.id]);

  useEffect(() => {
    fetchBookings();

    const channelName = `admin_bookings_${studio.id}_${Date.now()}`;
    const subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `studio_id=eq.${studio.id}`
        },
        (payload) => {
          console.log('Calendar booking change for studio:', studio.id, payload);
          console.log('Refetching bookings after change...');
          fetchBookings();
        }
      )
      .subscribe((status) => {
        console.log('Calendar subscription status:', status);
      });

    return () => {
      console.log('Unsubscribing from channel:', channelName);
      subscription.unsubscribe();
    };
  }, [studio.id, fetchBookings]);

  const getBookingsForDate = (dateStr: string): AdminBooking[] => {
    return bookings.filter(booking => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
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
        bookings: getBookingsForDate(dateStr)
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
        bookings: getBookingsForDate(dateStr)
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
        bookings: getBookingsForDate(dateStr)
      });
    }

    return days;
  };

  const handleDayClick = (day: CalendarDay, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.contact-button')) {
      return;
    }

    if (day.bookings.length > 0) {
      setSelectedBooking(day.bookings[0]);
    } else if (day.isCurrentMonth && !day.isPast) {
      setCreatingBooking(day.date);
    }
  };

  const handleContactClick = (booking: AdminBooking, e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Здравейте ${booking.guest_name}, свързвам се с Вас относно Вашата резервация.`;
    const encodedMessage = encodeURIComponent(message);

    if (booking.contact_method === 'phone' && booking.guest_phone) {
      const phone = booking.guest_phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    } else if (booking.contact_method === 'email' && booking.guest_email) {
      window.location.href = `mailto:${booking.guest_email}?subject=Относно резервацията Ви&body=${encodedMessage}`;
    } else if (booking.contact_method === 'messenger') {
      navigator.clipboard.writeText(message);
      alert('Съобщението е копирано. Отваряме Messenger...');
      window.open(`https://m.me/${booking.guest_email?.split('@')[0]}`, '_blank');
    }
  };

  const handleDeleteBooking = async (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Сигурни ли сте, че искате да изтриете тази резервация?')) {
      return;
    }

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (error) {
      alert('Грешка при изтриване на резервация');
      return;
    }

    fetchBookings();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month}`;
  };

  const handleBookingUpdate = () => {
    setSelectedBooking(null);
    fetchBookings();
  };

  const renderMonth = (monthIndex: number) => {
    const seasonYear = getSeasonYear();
    const monthDate = new Date(seasonYear, monthIndex, 1);
    const days = generateCalendarDays(monthDate);

    const processedBookings = new Set<string>();
    const bookingBlocks: Array<{
      booking: AdminBooking;
      startIndex: number;
      endIndex: number;
      row: number;
      col: number;
      span: number;
    }> = [];

    days.forEach((day, index) => {
      if (day.bookings.length > 0 && day.isCurrentMonth) {
        const booking = day.bookings[0];
        const checkInDate = new Date(booking.check_in).toISOString().split('T')[0];

        if (day.dateStr === checkInDate && !processedBookings.has(booking.id)) {
          processedBookings.add(booking.id);

          const checkIn = new Date(booking.check_in);
          const checkOut = new Date(booking.check_out);

          let currentIndex = index;
          const startRow = Math.floor(currentIndex / 7);
          const startCol = currentIndex % 7;

          while (currentIndex < days.length) {
            const currentDate = new Date(days[currentIndex].dateStr);
            if (currentDate > checkOut || !days[currentIndex].isCurrentMonth) {
              break;
            }

            const row = Math.floor(currentIndex / 7);
            const col = currentIndex % 7;

            let span = 0;
            let endIndex = currentIndex;

            for (let i = currentIndex; i < days.length; i++) {
              const date = new Date(days[i].dateStr);
              const dayRow = Math.floor(i / 7);

              if (dayRow !== row) break;
              if (date > checkOut) break;
              if (!days[i].isCurrentMonth) break;
              if (date >= checkIn && date <= checkOut) {
                span++;
                endIndex = i;
              }
            }

            if (span > 0) {
              bookingBlocks.push({
                booking,
                startIndex: currentIndex,
                endIndex,
                row,
                col,
                span
              });
            }

            currentIndex = endIndex + 1;
            const nextRow = Math.floor(currentIndex / 7);
            if (nextRow !== row) {
              currentIndex = nextRow * 7;
            }
          }
        }
      }
    });

    const getContactIcon = (method: string) => {
      switch (method) {
        case 'phone':
          return <Phone size={14} />;
        case 'email':
          return <Mail size={14} />;
        case 'messenger':
          return <MessageCircle size={14} />;
        default:
          return null;
      }
    };

    const getBookingColors = (booking: AdminBooking, isPast: boolean) => {
      if (isPast) {
        return { bg: 'bg-gray-200', border: 'border-gray-400', text: 'text-gray-700' };
      }

      switch (booking.status) {
        case 'pending':
          return { bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-900' };
        case 'in_correspondence':
          return { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-900' };
        case 'confirmed':
          return { bg: 'bg-cyan-100', border: 'border-cyan-400', text: 'text-cyan-900' };
        case 'proposed_dates':
          return { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-900' };
        case 'rejected':
          return { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-900' };
        default:
          return { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-900' };
      }
    };

    return (
      <div key={monthIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
          {monthNames[monthIndex]} {seasonYear}
        </h3>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(name => (
            <div key={name} className="text-center text-xs font-semibold text-gray-600 py-2">
              {name}
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const hasBooking = bookingBlocks.some(
                block => index >= block.startIndex && index <= block.endIndex
              );

              return (
                <div
                  key={index}
                  className={`
                    min-h-[90px] p-1.5 border rounded cursor-pointer
                    ${!day.isCurrentMonth ? 'bg-gray-50 border-gray-200' : hasBooking ? 'border-transparent' : 'bg-white border-gray-200 hover:bg-gray-50'}
                    transition-colors
                  `}
                  onClick={(e) => !hasBooking && handleDayClick(day, e)}
                >
                  <div className={`text-xs font-semibold ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-800'}`}>
                    {day.day}
                  </div>
                </div>
              );
            })}
          </div>

          {bookingBlocks.map((block, blockIndex) => {
            const colors = getBookingColors(block.booking, days[block.startIndex].isPast);
            const top = block.row * 94 + 2;

            const isFirstBlock = blockIndex === 0 || bookingBlocks[blockIndex - 1].booking.id !== block.booking.id;
            const dateRange = `${formatDate(block.booking.check_in)}-${formatDate(block.booking.check_out)}`;
            const totalGuests = (block.booking.guest_count || 0) + (block.booking.children_count || 0);

            return (
              <div
                key={blockIndex}
                className={`absolute ${colors.bg} ${colors.border} border-2 rounded-lg p-2 cursor-pointer hover:shadow-lg transition-all z-10 overflow-hidden`}
                style={{
                  left: `calc(${block.col} * (100% / 7) + ${block.col * 4}px + 0.5px)`,
                  top: `${top}px`,
                  width: `calc(${block.span} * (100% / 7) + ${(block.span - 1) * 4}px - 1px)`,
                  height: '86px'
                }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (!target.closest('button')) {
                    setSelectedBooking(block.booking);
                  }
                }}
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="min-w-0">
                    <div className={`text-xs font-bold ${colors.text} truncate`}>
                      {block.booking.guest_name}
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] ${colors.text} mt-0.5`}>
                      {totalGuests > 0 && (
                        <div className="flex items-center gap-0.5">
                          <Users size={11} />
                          <span>{totalGuests}</span>
                        </div>
                      )}
                      {isFirstBlock && (
                        <span className="font-medium">{dateRange}</span>
                      )}
                    </div>
                  </div>

                  {isFirstBlock && (
                    <div className="flex gap-1">
                      {block.booking.contact_method && (
                        <button
                          onClick={(e) => handleContactClick(block.booking, e)}
                          className="contact-button flex-1 flex items-center justify-center gap-1 px-1.5 py-1 bg-white bg-opacity-70 hover:bg-opacity-100 rounded text-[10px] font-semibold transition-all border border-gray-400 hover:border-cyan-600 hover:text-cyan-700"
                          title="Свържи се"
                        >
                          {getContactIcon(block.booking.contact_method)}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(block.booking);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 px-1.5 py-1 bg-white bg-opacity-70 hover:bg-opacity-100 rounded text-[10px] font-semibold transition-all border border-gray-400 hover:border-blue-600 hover:text-blue-700"
                        title="Редактирай"
                      >
                        <Edit2 size={11} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteBooking(block.booking.id, e)}
                        className="flex-1 flex items-center justify-center gap-1 px-1.5 py-1 bg-white bg-opacity-70 hover:bg-opacity-100 rounded text-[10px] font-semibold transition-all border border-gray-400 hover:border-red-600 hover:text-red-700"
                        title="Изтрий"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-600">Зареждане на календара...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg border border-cyan-200 p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Легенда на резервациите:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-pink-100 border-2 border-pink-300"></div>
              <span className="font-medium">В очакване на отговор</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-100 border-2 border-amber-300"></div>
              <span className="font-medium">В кореспонденция</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-purple-100 border-2 border-purple-300"></div>
              <span className="font-medium">Предложени други дати</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-cyan-100 border-2 border-cyan-300"></div>
              <span className="font-medium">Потвърдена</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-100 border-2 border-red-300"></div>
              <span className="font-medium">Отхвърлена</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-200 border-2 border-gray-300"></div>
              <span className="font-medium">Минала резервация</span>
            </div>
          </div>
        </div>

        {[4, 5, 6, 7, 8].map(monthIndex => renderMonth(monthIndex))}
      </div>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleBookingUpdate}
        />
      )}

      {creatingBooking && (
        <CreateBookingModal
          studioId={studio.id}
          initialDate={creatingBooking}
          onClose={() => setCreatingBooking(null)}
          onCreate={handleBookingUpdate}
        />
      )}
    </>
  );
}
