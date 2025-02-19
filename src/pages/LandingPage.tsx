import { FC } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';
import { Header } from '../components/Header';
import { TodayAppointments } from '../components/TodayAppointments';
import { ConnectivityStatus } from '../components/ConnectivityStatus';
import { Footer } from '../components/Footer';

export const LandingPage: FC = () => {
  const navigate = useNavigate();
  const today = new Date();

  return (
    <div className="min-h-screen gradient-bg pt-32 pb-8 px-4">
      <ConnectivityStatus />
      <div className="container mx-auto">
        <div className="space-y-6 container-animation">
          <Header />
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-right">
                  <h2 className="text-4xl font-['SSTArabic-Bold'] text-white mb-2">
                    {format(today, 'EEEE', { locale: ar })}
                  </h2>
                  <p className="text-xl text-white/80">
                    {format(today, 'd MMMM yyyy', { locale: ar })}
                  </p>
                </div>
                
                <button
                  onClick={() => navigate('/booking')}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all transform hover:scale-105"
                >
                  <CalendarPlus className="h-5 w-5" />
                  <span>حجز موعد جديد</span>
                </button>
              </div>
            </div>

            <TodayAppointments />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};
