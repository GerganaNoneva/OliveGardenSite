import { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { AdminBooking, statusLabels, statusColors } from '../types';
import { Studio } from '../../src/types';
import { Phone, Mail, MessageCircle, Calendar, Users, CreditCard, Clock } from 'lucide-react';
import ProposeAlternativeModal from './ProposeAlternativeModal';

interface BookingRequestsProps {
  studios: Studio[];
}

export default function BookingRequests({ studios }: BookingRequestsProps) {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [changingStatus, setChangingStatus] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);
  const [proposingForBooking, setProposingForBooking] = useState<AdminBooking | null>(null);

  useEffect(() => {
    fetchBookings();

    const channelName = `bookings_changes_${Date.now()}`;
    const subscription = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, (payload) => {
        console.log('Booking change:', payload);

        if (payload.eventType === 'UPDATE' && payload.new) {
          setBookings(prevBookings => {
            const updatedBooking = payload.new as AdminBooking;
            const exists = prevBookings.some(b => b.id === updatedBooking.id);

            if (exists) {
              return prevBookings.map(b =>
                b.id === updatedBooking.id ? updatedBooking : b
              );
            }
            return prevBookings;
          });
        } else if (payload.eventType === 'INSERT' && payload.new) {
          setBookings(prevBookings => {
            const newBooking = payload.new as AdminBooking;
            const exists = prevBookings.some(b => b.id === newBooking.id);
            return exists ? prevBookings : [newBooking, ...prevBookings];
          });
        } else if (payload.eventType === 'DELETE' && payload.old) {
          setBookings(prevBookings =>
            prevBookings.filter(b => b.id !== (payload.old as any).id)
          );
        }
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showStatusDropdown) {
        setShowStatusDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showStatusDropdown]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  };

  const currentBookings = bookings.filter(b =>
    b.status === 'pending' || b.status === 'in_correspondence' || b.status === 'proposed_dates'
  );

  const pastBookings = bookings.filter(b =>
    b.status === 'rejected' || b.status === 'confirmed'
  );

  const handleStatusChange = async (bookingId: string, newStatus: AdminBooking['status']) => {
    setChangingStatus(bookingId);
    setShowStatusDropdown(null);

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      setChangingStatus(null);
      return;
    }

    const updateData: Partial<AdminBooking> = { status: newStatus };

    // Ако статусът се променя на "confirmed" и има предложени дати, използвай ги
    if (newStatus === 'confirmed' && booking.proposed_check_in && booking.proposed_check_out && booking.proposed_studio_id) {
      updateData.check_in = booking.proposed_check_in;
      updateData.check_out = booking.proposed_check_out;
      updateData.studio_id = booking.proposed_studio_id;
    }

    const { error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId);

    if (error) {
      console.error('Error updating booking:', error);
    }

    setChangingStatus(null);
  };

  const getStudioName = (studioId: string) => {
    const studio = studios.find(s => s.id === studioId);
    return studio?.name || 'Неизвестно студио';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleContactClick = (booking: AdminBooking) => {
    const { contact_method, guest_phone, phone_country_code, guest_email } = booking;

    if (contact_method === 'email' && guest_email) {
      window.location.href = `mailto:${guest_email}`;
    } else if (contact_method === 'viber' && guest_phone) {
      const phone = phone_country_code ? `${phone_country_code}${guest_phone}` : guest_phone;
      window.open(`viber://chat?number=${phone.replace(/\D/g, '')}`, '_blank');
    } else if (contact_method === 'whatsapp' && guest_phone) {
      const phone = phone_country_code ? `${phone_country_code}${guest_phone}` : guest_phone;
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
    } else if (contact_method === 'messenger' && guest_email) {
      window.open(`https://m.me/${guest_email.split('@')[0]}`, '_blank');
    }
  };

  const getContactIcon = (method: string) => {
    switch (method) {
      case 'email':
        return <Mail size={18} />;
      case 'viber':
      case 'whatsapp':
        return <Phone size={18} />;
      case 'messenger':
        return <MessageCircle size={18} />;
      default:
        return <Mail size={18} />;
    }
  };

  const getContactLabel = (method: string) => {
    switch (method) {
      case 'email':
        return 'Имейл';
      case 'viber':
        return 'Viber';
      case 'whatsapp':
        return 'WhatsApp';
      case 'messenger':
        return 'Messenger';
      default:
        return method;
    }
  };

  const getContactValue = (booking: AdminBooking) => {
    const { contact_method, guest_email, guest_phone, phone_country_code } = booking;

    if (contact_method === 'email' && guest_email) {
      return guest_email;
    } else if (guest_phone) {
      return phone_country_code ? `${phone_country_code} ${guest_phone}` : guest_phone;
    }
    return 'Няма информация';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Зареждане на заявки...</div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Няма заявки за резервации</h3>
        <p className="text-gray-600">Когато клиент направи заявка, тя ще се появи тук</p>
      </div>
    );
  }

  const renderBookingCard = (booking: AdminBooking) => (
    <div
      key={booking.id}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h3 className="text-xl font-semibold text-gray-900">
                {getStudioName(booking.studio_id)}
              </h3>
              <div className="relative">
                <button
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setShowStatusDropdown(showStatusDropdown === booking.id ? null : booking.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity ${statusColors[booking.status]}`}
                  title="Двоен клик за смяна на статут"
                >
                  {statusLabels[booking.status]}
                </button>
                {showStatusDropdown === booking.id && (
                  <div
                    className="absolute top-full mt-2 left-0 min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {(['pending', 'in_correspondence', 'proposed_dates', 'confirmed', 'rejected'] as AdminBooking['status'][]).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(booking.id, status)}
                        disabled={status === booking.status || changingStatus === booking.id}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-3 ${status === booking.status ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''}`}
                      >
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
                          {statusLabels[status]}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>Подадена на {formatDate(booking.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Период</div>
                <div className="font-medium">
                  {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                </div>
              </div>
            </div>

            {booking.proposed_check_in && booking.proposed_check_out && (
              <div className="flex items-center gap-3 text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-200">
                <Calendar size={18} className="text-purple-600" />
                <div>
                  <div className="text-xs text-purple-600 font-medium">Предложени дати</div>
                  <div className="font-medium text-sm">
                    {formatDate(booking.proposed_check_in)} - {formatDate(booking.proposed_check_out)}
                  </div>
                  {booking.proposed_studio_id && booking.proposed_studio_id !== booking.studio_id && (
                    <div className="text-xs text-purple-600 mt-1">
                      Студио: {getStudioName(booking.proposed_studio_id)}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 text-gray-700">
              <Users size={18} className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Гости</div>
                <div className="font-medium">
                  {booking.adults} възрастни
                  {booking.children > 0 && `, ${booking.children} деца`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <CreditCard size={18} className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Обща цена</div>
                <div className="font-bold text-lg text-gray-900">
                  {booking.total_price} лв.
                </div>
              </div>
            </div>

            <button
              onClick={() => setProposingForBooking(booking)}
              className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm"
            >
              Предложи други дати/студио
            </button>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Информация за клиента</div>
              <div className="font-semibold text-gray-900 mb-3 text-lg">
                {booking.guest_name}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <span className="text-gray-600">Предпочитан контакт:</span>
                <span className="font-medium">{getContactLabel(booking.contact_method)}</span>
              </div>

              <div className="text-sm text-gray-700 mb-3">
                {getContactValue(booking)}
              </div>

              <button
                onClick={() => handleContactClick(booking)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {getContactIcon(booking.contact_method)}
                <span>Свържи се чрез {getContactLabel(booking.contact_method)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Заявки за резервации
          </h2>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'current'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Текущи заявки ({currentBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'past'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Минали заявки ({pastBookings.length})
          </button>
        </div>

        {activeTab === 'current' && (
          <div className="grid gap-4">
            {currentBookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Няма текущи заявки</h3>
                <p className="text-gray-600">Заявките в очакване и в кореспонденция ще се появят тук</p>
              </div>
            ) : (
              currentBookings.map(renderBookingCard)
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="grid gap-4">
            {pastBookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Няма минали заявки</h3>
                <p className="text-gray-600">Запазените и отхвърлените заявки ще се появят тук</p>
              </div>
            ) : (
              pastBookings.map(renderBookingCard)
            )}
          </div>
        )}
      </div>

      {proposingForBooking && (
        <ProposeAlternativeModal
          booking={proposingForBooking}
          studios={studios}
          onClose={() => setProposingForBooking(null)}
          onPropose={() => {
            setProposingForBooking(null);
            fetchBookings();
          }}
        />
      )}
    </>
  );
}

