import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar, Clock, Mail, Phone, User } from 'lucide-react';
import type { Booking } from '../types/booking';

interface BookingCardProps {
  booking: Booking;
  onStatusChange: (id: string, status: 'approved' | 'rejected') => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onStatusChange }) => {
  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-200',
    approved: 'bg-green-500/20 text-green-200',
    rejected: 'bg-red-500/20 text-red-200'
  };

  const formattedDate = format(new Date(booking.date), 'dd MMMM yyyy', { locale: ar });

  return (
    <div className="glass-effect rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-white/70" />
            <h3 className="text-lg font-['SSTArabic-Bold'] text-white">{booking.name}</h3>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Phone className="h-4 w-4" />
            <p>{booking.phone}</p>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Mail className="h-4 w-4" />
            <p>{booking.email}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[booking.status]}`}>
          {booking.status === 'pending' && 'قيد الانتظار'}
          {booking.status === 'approved' && 'تم الموافقة'}
          {booking.status === 'rejected' && 'تم الرفض'}
        </span>
      </div>

      <div className="flex gap-4 text-white/80">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <p>{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <p>{booking.time}</p>
        </div>
      </div>

      {booking.status === 'pending' && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onStatusChange(booking.id, 'approved')}
            className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-200 py-2 rounded-lg transition"
          >
            موافقة
          </button>
          <button
            onClick={() => onStatusChange(booking.id, 'rejected')}
            className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-200 py-2 rounded-lg transition"
          >
            رفض
          </button>
        </div>
      )}
    </div>
  );
};