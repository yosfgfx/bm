import { FC, useEffect, useState } from 'react';
import { format, addMinutes, isBefore, startOfToday } from 'date-fns';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';
import type { Booking } from '../types/booking';

interface BookingFormProps {
  onSubmit: (formData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
}

const DEPARTMENTS = [
  'الإدارة العامة لمخاطر الصحة الحيوانية',
  'الإدارة العامة لتنظيم الصحة الحيوانية',
  'الإدارة العامة لخدمات الصحة الحيوانية',
  'إدارة الخدمات الفنية للصحة الحيوانية',
  'إدارة الصحة الواحدة',
  'إدارة دعم ومتابعة عمليات الصحة الحيوانية',
  'أخرى'
];

const DURATIONS: { value: string; label: string }[] = [
  { value: '30min', label: 'نصف ساعة' },
  { value: '1hour', label: 'ساعة واحدة' },
  { value: '2hours', label: 'ساعتان' },
  { value: '3hours', label: '3 ساعات' },
  { value: '4hours', label: '4 ساعات' },
];

const WORKING_HOURS = {
  start: '08:00',
  end: '16:00',
};

export const BookingForm: FC<BookingFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: '',
    otherDepartment: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    duration: '1hour',
    notes: '',
  });

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateTimeSlots = (startTime: string, endTime: string, duration: number): string[] => {
    const slots: string[] = [];
    let current = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    while (isBefore(current, end)) {
      slots.push(format(current, 'HH:mm'));
      current = addMinutes(current, duration);
    }

    return slots;
  };

  const checkSlotAvailability = async (date: string, time: string, duration: string): Promise<boolean> => {
    try {
      const bookingsRef = ref(database, 'bookings');
      const snapshot = await get(bookingsRef);
      
      if (!snapshot.exists()) return true;

      const bookings = Object.values(snapshot.val() as Record<string, Booking>);
      const requestedStart = new Date(`${date}T${time}`);
      const requestedEnd = addMinutes(requestedStart, getDurationInMinutes(duration));

      return !bookings.some(booking => {
        if (booking.date !== date) return false;
        
        const bookingStart = new Date(`${booking.date}T${booking.time}`);
        const bookingEnd = addMinutes(bookingStart, getDurationInMinutes(booking.duration));

        return (
          (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
          (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
          (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
        );
      });
    } catch (error) {
      console.error('Error checking slot availability:', error);
      return false;
    }
  };

  const loadAvailableSlots = async () => {
    setIsLoading(true);
    try {
      const allSlots = generateTimeSlots(WORKING_HOURS.start, WORKING_HOURS.end, 30);
      const availableSlots = await Promise.all(
        allSlots.map(async (slot) => {
          const isAvailable = await checkSlotAvailability(formData.date, slot, formData.duration);
          return isAvailable ? slot : null;
        })
      );
      
      setAvailableSlots(availableSlots.filter((slot): slot is string => slot !== null));
      setError('');
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المواعيد المتاحة');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAvailableSlots();
  }, [formData.date, formData.duration]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone || !formData.email || !formData.department) {
      setError('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }

    if (formData.department === 'أخرى' && !formData.otherDepartment) {
      setError('الرجاء تحديد القسم');
      return;
    }

    try {
      const finalDepartment = formData.department === 'أخرى' ? formData.otherDepartment : formData.department;
      const submitData = {
        ...formData,
        department: finalDepartment,
      };
      delete submitData.otherDepartment;
      
      onSubmit(submitData);
    } catch (err) {
      setError('حدث خطأ أثناء إرسال الطلب');
      console.error(err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-1">الاسم</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input-style"
            placeholder="الاسم الكامل"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-1">رقم الجوال</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="input-style"
            placeholder="05xxxxxxxx"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="input-style"
<<<<<<< HEAD
            placeholder="xxxx@weqaa.gov.sa"
=======
            placeholder="xxxxx@weqaa.gov.sa"
>>>>>>> be0b7ce9a796b9c85aa7ea79a65a5b9ac4c3cca8
            required
          />
        </div>

        <div>
          <label className="block text-white mb-1">الإدارة</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="input-style"
            required
          >
            <option value="">اختر الإدارة</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          
          {formData.department === 'أخرى' && (
            <input
              type="text"
              name="otherDepartment"
              value={formData.otherDepartment}
              onChange={handleInputChange}
              className="input-style mt-2"
              placeholder="اكتب مسمى الإدارة"
              required
            />
          )}
        </div>

        <div>
          <label className="block text-white mb-1">التاريخ</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            min={format(startOfToday(), 'dd-MM-yyyy')}
            onChange={handleInputChange}
            className="input-style"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-1">الوقت</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="input-style"
            required
            disabled={isLoading || availableSlots.length === 0}
          >
            <option value="">اختر الوقت</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {isLoading && (
            <p className="text-white/70 text-sm mt-1">جاري تحميل المواعيد المتاحة...</p>
          )}
          {!isLoading && availableSlots.length === 0 && (
            <p className="text-white/70 text-sm mt-1">لا توجد مواعيد متاحة في هذا اليوم</p>
          )}
        </div>

        <div>
          <label className="block text-white mb-1">مدة الاجتماع</label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {DURATIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  formData.duration === value
                    ? 'bg-white/30 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, duration: value }))}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-white mb-1">ملاحظات</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="input-style min-h-[100px]"
            placeholder="أي ملاحظات إضافية..."
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-100 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
      >
        تأكيد الحجز
      </button>
    </form>
  );
};
