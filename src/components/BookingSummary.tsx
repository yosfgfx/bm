import { FC } from 'react';
import type { Booking } from '../types/booking';

interface BookingSummaryProps {
  booking: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
  onConfirm: () => void;
  onEdit: () => void;
}

export const BookingSummary: FC<BookingSummaryProps> = ({ booking, onConfirm, onEdit }) => {
  return (
    <div className="glass-effect rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-white mb-4">ملخص الحجز</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-white/70 text-sm">الاسم</h3>
          <p className="text-white text-lg">{booking.name}</p>
        </div>
        
        <div>
          <h3 className="text-white/70 text-sm">رقم الجوال</h3>
          <p className="text-white text-lg">{booking.phone}</p>
        </div>
        
        <div>
          <h3 className="text-white/70 text-sm">البريد الإلكتروني</h3>
          <p className="text-white text-lg">{booking.email}</p>
        </div>
        
        <div>
          <h3 className="text-white/70 text-sm">القسم</h3>
          <p className="text-white text-lg">{booking.department}</p>
        </div>
        
        <div>
          <h3 className="text-white/70 text-sm">التاريخ</h3>
          <p className="text-white text-lg">{booking.date}</p>
        </div>
        
        <div>
          <h3 className="text-white/70 text-sm">الوقت</h3>
          <p className="text-white text-lg">{booking.time}</p>
        </div>
        
        <div>
          <h3 className="text-white/70 text-sm">المدة</h3>
          <p className="text-white text-lg">
            {booking.duration === '30min' && 'نصف ساعة'}
            {booking.duration === '1hour' && 'ساعة واحدة'}
            {booking.duration === '2hours' && 'ساعتان'}
            {booking.duration === '3hours' && '3 ساعات'}
            {booking.duration === '4hours' && '4 ساعات'}
          </p>
        </div>
      </div>
      
      {booking.notes && (
        <div className="mt-4">
          <h3 className="text-white/70 text-sm">ملاحظات</h3>
          <p className="text-white">{booking.notes}</p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          onClick={onConfirm}
          className="flex-1 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 rounded-lg transition"
        >
          تأكيد الحجز
        </button>
        <button
          onClick={onEdit}
          className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
        >
          تعديل البيانات
        </button>
      </div>
    </div>
  );
};
