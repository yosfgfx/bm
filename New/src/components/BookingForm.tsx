import { FC, useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { Booking, Duration, TimeSlot } from '../types/booking';
import { getAvailableTimeSlots } from '../utils/bookingUtils';

interface BookingFormProps {
  onSubmit: (booking: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
}

const DURATIONS: { value: Duration; label: string }[] = [
  { value: '30min', label: 'نصف ساعة' },
  { value: '1hour', label: 'ساعة واحدة' },
  { value: '2hours', label: 'ساعتان' },
  { value: '3hours', label: '3 ساعات' },
  { value: '4hours', label: '4 ساعات' },
];

const DEPARTMENTS = [
  'قسم الصحة الحيوانية',
  'قسم المختبرات',
  'قسم الرقابة',
  'قسم التفتيش',
  'قسم الإدارة',
];

export const BookingForm: FC<BookingFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    duration: '1hour' as Duration,
    notes: '',
  });

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTimeSlots = async () => {
      setIsLoading(true);
      try {
        const slots = await getAvailableTimeSlots(formData.date);
        setAvailableSlots(slots);
        setError('');
      } catch (err) {
        setError('حدث خطأ أثناء تحميل المواعيد المتاحة');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTimeSlots();
  }, [formData.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone || !formData.email || !formData.department) {
      setError('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }

    try {
      onSubmit(formData);
    } catch (err) {
      setError('حدث خطأ أثناء إرسال الطلب');
      console.error(err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            placeholder="example@domain.com"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-1">القسم</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="input-style"
            required
          >
            <option value="">اختر القسم</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white mb-1">التاريخ</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            min={format(new Date(), 'yyyy-MM-dd')}
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
              <option key={slot.time} value={slot.time} disabled={!slot.isAvailable}>
                {slot.time}
              </option>
            ))}
          </select>
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
                onClick={() => setFormData((prev) => ({ ...prev, duration: value }))}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-white mb-1">ملاحظات</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          className="input-style min-h-[100px]"
          placeholder="أي ملاحظات إضافية..."
        />
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-100 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'جاري الإرسال...' : 'إرسال الطلب'}
        </button>
      </div>
    </form>
  );
};