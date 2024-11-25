import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Calendar, Home, Settings, ClipboardList } from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationDrawer: FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const navigationItems = [
    { path: '/', label: 'الرئيسية', icon: Home },
    { path: '/booking', label: 'حجز القاعات', icon: Calendar },
    { path: '/confirmed', label: 'الحجوزات المؤكدة', icon: ClipboardList },
    ...(isAdmin ? [{ path: '/admin', label: 'لوحة التحكم', icon: Settings }] : []),
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#2b435a] transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-white hover:text-white/80"
          >
            <X size={24} />
          </button>
          <div className="mt-12 space-y-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition ${
                    location.pathname === item.path ? 'bg-white/20' : ''
                  }`}
                  onClick={onClose}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
