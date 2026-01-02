import { useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { X, Calendar, Users, Phone, Mail, MessageCircle } from 'lucide-react';

interface CreateBookingModalProps {
  studioId: string;
  initialDate: Date;
  onClose: () => void;
  onCreate: () => void;
}

export default function CreateBookingModal({ studioId, initialDate, onClose, onCreate }: CreateBookingModalProps) {
  const [checkIn, setCheckIn] = useState(initialDate.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | 'messenger' | ''>('');
  const [status, setStatus] = useState<'pending' | 'in_correspondence' | 'confirmed' | 'proposed_dates'>('confirmed');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!checkOut) {
      setError('Моля въведете крайна дата');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Крайната дата трябва да е след началната дата');
      return;
    }

    if (!guestName.trim()) {
      setError('Моля въведете име на госта');
      return;
    }

    if (contactMethod && contactMethod === 'phone' && !guestPhone.trim()) {
      setError('Моля въведете телефонен номер');
      return;
    }

    if (contactMethod && (contactMethod === 'email' || contactMethod === 'messenger') && !guestEmail.trim()) {
      setError('Моля въведете имейл адрес');
      return;
    }

    setCreating(true);

    const guestCountNum = guestCount ? parseInt(guestCount) : null;

    const { error: insertError } = await supabase
      .from('bookings')
      .insert({
        studio_id: studioId,
        check_in: checkIn,
        check_out: checkOut,
        guest_name: guestName,
        guest_count: guestCountNum,
        children_count: 0,
        guest_phone: guestPhone || null,
        guest_email: guestEmail || null,
        contact_method: contactMethod || null,
        status: status,
        total_price: 0
      });

    if (insertError) {
      setError('Грешка при създаване на резервация');
      setCreating(false);
      return;
    }

    onCreate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-teal-600 text-white p-6 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold">Създаване на служебна резервация</h2>
            <p className="text-cyan-50 text-sm mt-1">Добавете нова резервация в системата</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Дата на настаняване *
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Дата на напускане *
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Име на гост *
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Въведете име на госта"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Users size={16} className="inline mr-1" />
                Брой гости (опционално)
              </label>
              <input
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                min="0"
                max="10"
                placeholder="Оставете празно за служебна резервация"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Начин на контакт (опционално)
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setContactMethod('')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    contactMethod === ''
                      ? 'bg-gray-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Няма
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod('phone')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    contactMethod === 'phone'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Phone size={16} className="inline mr-1" />
                  Телефон
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod('email')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    contactMethod === 'email'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Mail size={16} className="inline mr-1" />
                  Имейл
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod('messenger')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    contactMethod === 'messenger'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <MessageCircle size={16} className="inline mr-1" />
                  Messenger
                </button>
              </div>
            </div>

            {contactMethod === 'phone' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Телефонен номер *
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+359 888 123 456"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            {(contactMethod === 'email' || contactMethod === 'messenger') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Имейл адрес *
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Статус на резервацията *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              >
                <option value="pending">В очакване на отговор</option>
                <option value="in_correspondence">В кореспонденция</option>
                <option value="confirmed">Потвърдена</option>
                <option value="proposed_dates">Предложени други дати</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Отказ
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-teal-700 transition-colors disabled:opacity-50"
            >
              {creating ? 'Създаване...' : 'Създай резервация'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
