import { useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { AdminBooking, statusLabels, statusColors } from '../types';
import { X, Calendar, Users, Phone, Mail, MessageCircle } from 'lucide-react';

interface BookingDetailsModalProps {
  booking: AdminBooking;
  onClose: () => void;
  onUpdate: () => void;
}

export default function BookingDetailsModal({ booking, onClose, onUpdate }: BookingDetailsModalProps) {
  const [checkIn, setCheckIn] = useState(booking.check_in);
  const [checkOut, setCheckOut] = useState(booking.check_out);
  const [guestName, setGuestName] = useState(booking.guest_name);
  const [guestCount, setGuestCount] = useState(booking.guest_count?.toString() || '');
  const [childrenCount, setChildrenCount] = useState(booking.children_count?.toString() || '');
  const [guestPhone, setGuestPhone] = useState(booking.guest_phone || '');
  const [guestEmail, setGuestEmail] = useState(booking.guest_email || '');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | 'messenger' | ''>(booking.contact_method || '');
  const [status, setStatus] = useState(booking.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Крайната дата трябва да е след началната дата');
      return;
    }

    if (!guestName.trim()) {
      setError('Моля въведете име');
      return;
    }

    if (contactMethod === 'phone' && !guestPhone.trim()) {
      setError('Моля въведете телефонен номер');
      return;
    }

    if ((contactMethod === 'email' || contactMethod === 'messenger') && !guestEmail.trim()) {
      setError('Моля въведете имейл адрес');
      return;
    }

    setSaving(true);

    const guestCountNum = guestCount ? parseInt(guestCount) : null;
    const childrenCountNum = childrenCount ? parseInt(childrenCount) : null;

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        check_in: checkIn,
        check_out: checkOut,
        guest_name: guestName,
        guest_count: guestCountNum,
        children_count: childrenCountNum,
        guest_phone: guestPhone || null,
        guest_email: guestEmail || null,
        contact_method: contactMethod || null,
        status: status
      })
      .eq('id', booking.id);

    if (updateError) {
      setError('Грешка при запазване');
      console.error(updateError);
      setSaving(false);
      return;
    }

    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
          <h2 className="text-xl font-bold">Редактиране на резервация</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                placeholder="Въведете име"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Users size={16} className="inline mr-1" />
                  Брой гости
                </label>
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  min="0"
                  max="10"
                  placeholder="Брой гости"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Users size={16} className="inline mr-1" />
                  Брой деца
                </label>
                <input
                  type="number"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(e.target.value)}
                  min="0"
                  max="10"
                  placeholder="Брой деца"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Начин на контакт
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
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Phone size={16} className="inline mr-1" />
                  Тел.
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod('email')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    contactMethod === 'email'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Mail size={16} className="inline mr-1" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod('messenger')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    contactMethod === 'messenger'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <MessageCircle size={16} className="inline mr-1" />
                  Msg
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
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
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Запазване...' : 'Запази промените'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
