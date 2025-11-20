import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Studio, SearchParams } from '../types';
import StudioCard from '../components/StudioCard';
import StudioDetails from '../components/StudioDetails';
import SearchBar from '../components/SearchBar';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function StudiosPage() {
  const { language } = useLanguage();
  const [urlSearchParams] = useSearchParams();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [filteredStudios, setFilteredStudios] = useState<Studio[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);

  const checkInParam = urlSearchParams.get('checkIn');
  const checkOutParam = urlSearchParams.get('checkOut');
  const adultsParam = urlSearchParams.get('adults');
  const childrenParam = urlSearchParams.get('children');

  const parseLocalDate = (dateStr: string | null): Date | null => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const [searchParams, setSearchParams] = useState<SearchParams>({
    checkIn: parseLocalDate(checkInParam),
    checkOut: parseLocalDate(checkOutParam),
    adults: adultsParam ? parseInt(adultsParam) : null,
    children: childrenParam ? parseInt(childrenParam) : null,
  });

  useEffect(() => {
    fetchStudios();
  }, []);

  useEffect(() => {
    if (studios.length > 0 && (checkInParam || checkOutParam || adultsParam || childrenParam)) {
      handleSearch();
    }
  }, [studios]);

  const fetchStudios = async () => {
    try {
      const { data, error } = await supabase
        .from('studios')
        .select('*')
        .order('name');

      if (error) throw error;
      setStudios(data || []);
      setFilteredStudios(data || []);
    } catch (error) {
      console.error('Error fetching studios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    let filtered = [...studios];

    const totalGuests = (searchParams.adults || 0) + (searchParams.children || 0);

    if (totalGuests > 0) {
      filtered = filtered.filter(
        (studio) => studio.capacity >= totalGuests
      );
    }

    if (searchParams.checkIn && searchParams.checkOut) {
      const availableStudios = await Promise.all(
        filtered.map(async (studio) => {
          const isAvailable = await checkStudioAvailability(
            studio.id,
            searchParams.checkIn!,
            searchParams.checkOut!
          );
          return isAvailable ? studio : null;
        })
      );
      filtered = availableStudios.filter((s) => s !== null) as Studio[];
    }

    setFilteredStudios(filtered);
  };

  const checkStudioAvailability = async (
    studioId: number,
    checkIn: Date,
    checkOut: Date
  ): Promise<boolean> => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('check_in_date, check_out_date')
        .eq('studio_id', studioId)
        .in('status', ['confirmed', 'pending']);

      if (error) throw error;

      if (!bookings || bookings.length === 0) return true;

      const checkInTime = checkIn.getTime();
      const checkOutTime = checkOut.getTime();

      for (const booking of bookings) {
        const bookingCheckIn = new Date(booking.check_in_date).getTime();
        const bookingCheckOut = new Date(booking.check_out_date).getTime();

        if (
          (checkInTime >= bookingCheckIn && checkInTime < bookingCheckOut) ||
          (checkOutTime > bookingCheckIn && checkOutTime <= bookingCheckOut) ||
          (checkInTime <= bookingCheckIn && checkOutTime >= bookingCheckOut)
        ) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4 z-40">
        <LanguageSelector />
      </div>

      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white hover:text-cyan-100 mb-6 transition-colors"
          >
            <ArrowLeft size={24} />
            <span>
              {language === 'bg' && 'Назад към начало'}
              {language === 'en' && 'Back to Home'}
              {language === 'ru' && 'Назад на главную'}
              {language === 'sr' && 'Назад на почетну'}
              {language === 'el' && 'Πίσω στην αρχική'}
              {language === 'ro' && 'Înapoi la început'}
            </span>
          </Link>
          <h1 className="text-5xl font-bold mb-4">
            {language === 'bg' && 'Нашите студиа'}
            {language === 'en' && 'Our Studios'}
            {language === 'ru' && 'Наши студии'}
            {language === 'sr' && 'Наше студије'}
            {language === 'el' && 'Τα στούντιό μας'}
            {language === 'ro' && 'Studiourile noastre'}
          </h1>
          <p className="text-xl opacity-90">
            {language === 'bg' && 'Открийте перфектното място за вашата почивка'}
            {language === 'en' && 'Find the perfect place for your vacation'}
            {language === 'ru' && 'Найдите идеальное место для отдыха'}
            {language === 'sr' && 'Пронађите савршено место за одмор'}
            {language === 'el' && 'Βρείτε το τέλειο μέρος για τις διακοπές σας'}
            {language === 'ro' && 'Găsiți locul perfect pentru vacanța dvs.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <SearchBar
            searchParams={searchParams}
            onSearchChange={setSearchParams}
            onSearch={handleSearch}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStudios.map((studio) => (
              <StudioCard
                key={studio.id}
                studio={studio}
                onViewMore={setSelectedStudio}
                checkIn={searchParams.checkIn}
                checkOut={searchParams.checkOut}
                adults={searchParams.adults || 1}
                children={searchParams.children || 0}
              />
            ))}
          </div>
        )}

        {filteredStudios.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {language === 'bg' && 'Няма намерени студиа за избраните критерии'}
              {language === 'en' && 'No studios found for the selected criteria'}
              {language === 'ru' && 'Студии не найдены по выбранным критериям'}
              {language === 'sr' && 'Нема пронађених студија за изабране критеријуме'}
              {language === 'el' && 'Δεν βρέθηκαν στούντιο για τα επιλεγμένα κριτήρια'}
              {language === 'ro' && 'Nu au fost găsite studiouri pentru criteriile selectate'}
            </p>
          </div>
        )}
      </div>

      {selectedStudio && (
        <StudioDetails
          studio={selectedStudio}
          onClose={() => setSelectedStudio(null)}
          preselectedCheckIn={searchParams.checkIn}
          preselectedCheckOut={searchParams.checkOut}
          preselectedAdults={searchParams.adults}
          preselectedChildren={searchParams.children}
        />
      )}
    </div>
  );
}
