import { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { Studio } from '../../src/types';
import { LogOut, Calendar as CalendarIcon, ClipboardList } from 'lucide-react';
import StudioSelector from './StudioSelector';
import AdminCalendar from './AdminCalendar';
import BookingRequests from './BookingRequests';

interface DashboardProps {
  session: any;
}

export default function Dashboard({ session }: DashboardProps) {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'calendar' | 'requests'>('requests');

  useEffect(() => {
    fetchStudios();
  }, []);

  const fetchStudios = async () => {
    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .order('name');

    if (!error && data) {
      setStudios(data);
      if (data.length > 0) {
        setSelectedStudio(data[0]);
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Зареждане...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <ClipboardList size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Администраторски панел
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">{session.user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Изход</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ClipboardList size={20} />
              <span>Заявки за резервации</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <CalendarIcon size={20} />
              <span>Календар</span>
            </button>
          </div>
        </div>

        <main>
          <div style={{ display: activeTab === 'requests' ? 'block' : 'none' }}>
            <BookingRequests studios={studios} />
          </div>
          <div style={{ display: activeTab === 'calendar' ? 'block' : 'none' }}>
            <div className="space-y-6">
              <StudioSelector
                studios={studios}
                selectedStudio={selectedStudio}
                onSelect={setSelectedStudio}
              />
              {selectedStudio && (
                <AdminCalendar studio={selectedStudio} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
