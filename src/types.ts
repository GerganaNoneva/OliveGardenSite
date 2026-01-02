export interface Studio {
  id: string;
  name: string;
  description: string;
  name_en?: string;
  name_ru?: string;
  name_sr?: string;
  name_el?: string;
  name_ro?: string;
  description_en?: string;
  description_ru?: string;
  description_sr?: string;
  description_el?: string;
  description_ro?: string;
  price_per_night: number;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  amenities: string[];
  images: string[];
  main_image: string;
  created_at: string;
  low_season_discount: number;
  high_season_markup: number;
}

export interface Booking {
  id?: string;
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
  contact_method: string;
  status: string;
}

export interface ContactPreferences {
  name: string;
  country: string;
  contactMethods: ('viber' | 'whatsapp' | 'email')[];
  phoneCountryCode: string;
  phone: string;
  email?: string;
}

export interface SearchParams {
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number | null;
  children: number | null;
}
