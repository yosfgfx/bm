import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, CloudIcon } from '@heroicons/react/24/outline';

export const SuccessPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message, bookingData, isOffline } = location.state || {
    message: 'تمت العملية بنجاح',
    bookingData: null,
    isOffline: false,
  };

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-lg mx-auto glass-effect rounded-xl p-8">
        <div className="flex justify-center mb-6">
          {isOffline ? (
            <CloudIcon className="h-16 w-16 text-yellow-400" />
          ) : (
            <CheckCircleIcon className="h-16 w-16 text-emerald-400" />
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          {isOffline ? 'تم الحفظ محلياً' : 'تم بنجاح!'}
        </h1>
        <p className="text-white/80 mb-8">{message}</p>
        
        {bookingData && (
          <div className="text-right bg-white/5 rounded-lg p-4 mb-8">
            <h2 className="text-white text-lg mb-4">تفاصيل الحجز:</h2>
            <div className="space-y-2 text-white/70">
              <p>التاريخ: {bookingData.date}</p>
              <p>الوقت: {bookingData.time}</p>
              <p>المدة: {
                {
                  '30min': 'نصف ساعة',
                  '1hour': 'ساعة واحدة',
                  '2hours': 'ساعتان',
                  '3hours': '3 ساعات',
                  '4hours': '4 ساعات',
                }[bookingData.duration]
              }</p>
            </div>
          </div>
        )}
        
        {isOffline && (
          <div className="bg-yellow-500/20 text-yellow-100 p-4 rounded-lg mb-8">
            سيتم مزامنة الحجز تلقائياً مع النظام عند عودة الاتصال بالإنترنت
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
          >
            العودة للرئيسية
          </button>
          <button
            onClick={() => navigate('/booking')}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
          >
            حجز جديد
          </button>
        </div>
      </div>
    </div>
  );
};
