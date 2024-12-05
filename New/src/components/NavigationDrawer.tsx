import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { useConnectivity } from '../hooks/useConnectivity';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { path: '/', label: 'الرئيسية', icon: HomeIcon },
  { path: '/booking', label: 'حجز قاعة', icon: CalendarDaysIcon },
  { path: '/my-bookings', label: 'الحجوزات', icon: ClockIcon },
  { path: '/admin/bookings', label: 'إدارة الحجوزات', icon: Cog6ToothIcon, adminOnly: true },
  { path: '/admin/settings', label: 'الإعدادات', icon: Cog6ToothIcon, adminOnly: true },
];

export const NavigationDrawer: FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAdmin, signOut } = useAuth();
  const { isOnline } = useConnectivity();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white/10 backdrop-blur-xl p-6 shadow-xl transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* User Status */}
        <div className="mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <UserCircleIcon className="w-8 h-8 text-white" />
            <div>
              <p className="text-white font-medium">
                {isAdmin ? 'مدير النظام' : 'مستخدم'}
              </p>
              <p className="text-white/70 text-sm">
                {isOnline ? 'متصل' : 'غير متصل'}
              </p>
            </div>
          </div>
          {!isOnline && (
            <p className="text-yellow-400/80 text-sm mt-2">
              سيتم مزامنة البيانات عند عودة الاتصال
            </p>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navItems
            .filter(item => !item.adminOnly || (item.adminOnly && isAdmin))
            .map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive(path)
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
        </nav>

        {/* Sign Out Button */}
        <button
          onClick={() => {
            signOut();
            onClose();
          }}
          className="flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition mt-auto absolute bottom-6 right-6 left-6"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </>
  );
};
