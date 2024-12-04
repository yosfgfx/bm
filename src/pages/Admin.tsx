import React, { useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { BookingCard } from '../components/BookingCard';
import { useBookings } from '../hooks/useBookings';

export const Admin = () => {
  const { bookings, updateBookingStatus } = useBookings();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' ? true : booking.status === filter
  );

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <AdminHeader />
        
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex gap-3 mb-6">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === status
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {status === 'all' && 'الكل'}
                {status === 'pending' && 'قيد الانتظار'}
                {status === 'approved' && 'تمت الموافقة'}
                {status === 'rejected' && 'مرفوض'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onStatusChange={updateBookingStatus}
              />
            ))}
            {filteredBookings.length === 0 && (
              <p className="text-center text-white/70 py-8">لا توجد حجوزات في هذه القائمة</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};