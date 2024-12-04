import { FC } from 'react';
import type { Booking } from '../types/booking';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface BookingDetailsProps {
  details: Booking;
}

export const BookingDetails: FC<BookingDetailsProps> = ({ details }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, d MMMM yyyy', { locale: ar });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'قيد المراجعة';
      case 'approved':
        return 'تم الموافقة';
      case 'rejected':
        return 'تم الرفض';
      default:
        return 'غير معروف';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-300';
      case 'approved':
        return 'text-emerald-300';
      case 'rejected':
        return 'text-red-300';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 space-y-4">
      <h3 className="text-xl font-arabic-bold text-white mb-4">تفاصيل الحجز</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-white/70">الاسم:</p>
          <p className="text-white">{details.name}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-white/70">القسم:</p>
          <p className="text-white">{details.department}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-white/70">التاريخ:</p>
          <p className="text-white">{formatDate(details.date)}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-white/70">الوقت:</p>
          <p className="text-white">{details.time}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-white/70">المدة:</p>
          <p className="text-white">{details.duration} دقيقة</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-white/70">الحالة:</p>
          <p className={getStatusColor(details.status)}>
            {getStatusText(details.status)}
          </p>
        </div>
      </div>
      
      {details.notes && (
        <div className="space-y-2 mt-4">
          <p className="text-white/70">ملاحظات:</p>
          <p className="text-white">{details.notes}</p>
        </div>
      )}
      
      <div className="text-sm text-white/50 mt-4">
        <p>تم إنشاء الطلب: {formatDate(details.createdAt)}</p>
        {details.updatedAt !== details.createdAt && (
          <p>آخر تحديث: {formatDate(details.updatedAt)}</p>
        )}
      </div>
    </div>
  );
};