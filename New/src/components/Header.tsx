import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export const Header: FC = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/admin-login');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <img 
        src={`${import.meta.env.BASE_URL}/New/public/images/header-request.jpg`}
        alt="Header" 
        className="w-full h-48 object-cover rounded-2xl mb-4"
      />
      <div className="glass-effect rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white font-['SSTArabic-Bold']">
            حجز القاعات
          </h1>
          <p className="text-white/80 mt-1">
            قم بحجز القاعة المناسبة لاجتماعك
          </p>
        </div>
        <button
          onClick={handleAdminClick}
          className="button-primary"
        >
          {isAdmin ? 'لوحة التحكم' : 'تسجيل الدخول'}
        </button>
      </div>
    </div>
  );
};