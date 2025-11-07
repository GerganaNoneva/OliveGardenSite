export interface AdminBooking {
  id: string;
  studio_id: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  total_price: number;
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  phone_country_code?: string;
  guest_country?: string;
  contact_method: 'viber' | 'whatsapp' | 'messenger' | 'email';
  status: 'pending' | 'in_correspondence' | 'rejected' | 'confirmed' | 'proposed_dates';
  proposed_check_in?: string;
  proposed_check_out?: string;
  proposed_studio_id?: string;
  created_at: string;
}

export const statusLabels: Record<AdminBooking['status'], string> = {
  pending: 'В очакване на отговор',
  in_correspondence: 'В кореспонденция',
  rejected: 'Отхвърлена',
  confirmed: 'Потвърдена',
  proposed_dates: 'Предложени други дати'
};

export const statusColors: Record<AdminBooking['status'], string> = {
  pending: 'bg-pink-100 text-pink-800 border-pink-300',
  in_correspondence: 'bg-amber-100 text-amber-800 border-amber-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
  confirmed: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  proposed_dates: 'bg-purple-100 text-purple-800 border-purple-300'
};
