import { FC, useEffect, useState } from 'react';
import { format, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { Booking } from '../types/booking';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';

interface AppointmentCardProps {
  booking: Booking;
  isCurrentMeeting: boolean;
}

const AppointmentCard: FC<AppointmentCardProps> = ({ booking, isCurrentMeeting }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isCurrentMeeting) return;

    const startTime = new Date(`${booking.date}T${booking.time}`);
    const endTime = new Date(startTime.getTime() + getDurationInMinutes(booking.duration) * 60000);
    
    const updateProgress = () => {
      const now = new Date();
      const totalDuration = differenceInSeconds(endTime, startTime);
      const elapsed = differenceInSeconds(now, startTime);
      const newProgress = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(newProgress);
    };

    const timer = setInterval(updateProgress, 1000);
    updateProgress();

    return () => clearInterval(timer);
  }, [booking, isCurrentMeeting]);

  const getDurationInMinutes = (duration: string): number => {
    switch (duration) {
      case '30min': return 30;
      case '1hour': return 60;
      case '2hours': return 120;
      case '3hours': return 180;
      case '4hours': return 240;
      default: return 60;
    }
  };

  const formatDuration = (duration: string): string => {
    switch (duration) {
      case '30min': return 'نصف ساعة';
      case '1hour': return 'ساعة';
      case '2hours': return 'ساعتان';
      case '3hours': return '٣ ساعات';
      case '4hours': return '٤ ساعات';
      default: return duration;
    }
  };

  return (
    <div className={`glass-effect rounded-xl p-4 ${
      isCurrentMeeting ? 'border-2 border-white/30 shadow-lg' : ''
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-2xl font-bold text-white">{booking.time}</h3>
          <p className="text-white/70 text-sm">{formatDuration(booking.duration)}</p>
        </div>
        <div className="text-right">
          <p className="text-white font-bold">{booking.name}</p>
          <p className="text-white/70 text-sm">{booking.department}</p>
        </div>
      </div>
      
      {isCurrentMeeting && (
        <div className="mt-3">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/50 text-xs mt-1 text-center">
            {Math.round(progress)}% مكتمل
          </p>
        </div>
      )}
    </div>
  );
};

export const TodayAppointments: FC = () => {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [currentMeeting, setCurrentMeeting] = useState<string | null>(null);

  useEffect(() => {
    const bookingsRef = ref(database, 'bookings');
    
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const today = format(new Date(), 'yyyy-MM-dd');
      const todayBookings = Object.values<Booking>(data)
        .filter(booking => booking.date === today)
        .sort((a, b) => a.time.localeCompare(b.time));

      setAppointments(todayBookings);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkCurrentMeeting = () => {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      
      const current = appointments.find(booking => {
        const startTime = new Date(`${booking.date}T${booking.time}`);
        const endTime = new Date(startTime.getTime() + getDurationInMinutes(booking.duration) * 60000);
        return now >= startTime && now <= endTime;
      });

      setCurrentMeeting(current?.id || null);
    };

    const timer = setInterval(checkCurrentMeeting, 60000);
    checkCurrentMeeting();

    return () => clearInterval(timer);
  }, [appointments]);

  if (appointments.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-6 text-center text-white/70">
        لا توجد حجوزات لهذا اليوم
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">اجتماعات اليوم</h2>
      {appointments.map(booking => (
        <AppointmentCard
          key={booking.id}
          booking={booking}
          isCurrentMeeting={booking.id === currentMeeting}
        />
      ))}
    </div>
  );
};
