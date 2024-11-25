import { FC, useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { AppointmentCard } from '../components/AppointmentCard';
import { getConfirmedBookings } from '../utils/bookingUtils';
import type { Booking } from '../types/booking';

export const ConfirmedAppointments: FC = () => {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = () => {
      try {
        const confirmedBookings = getConfirmedBookings();
        setAppointments(confirmedBookings);
      } catch (error) {
        console.error('Error loading confirmed appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bookings') {
        loadAppointments();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen gradient-bg pt-32 pb-8 px-4">
      <div className="container mx-auto">
        <div className="space-y-6 container-animation">
          <Header />
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-arabic-bold text-white mb-6">
              الحجوزات المؤكدة
            </h2>
            {isLoading ? (
              <div className="text-center text-white/70">جاري التحميل...</div>
            ) : appointments.length === 0 ? (
              <div className="glass-effect rounded-xl p-6 text-center text-white/70">
                لا توجد حجوزات مؤكدة حالياً
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    name={appointment.name}
                    date={new Date(appointment.date)}
                    time={appointment.time}
                    room={appointment.room || 'لم يتم تحديد القاعة'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
