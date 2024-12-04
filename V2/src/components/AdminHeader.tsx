import type { FC } from 'react';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminHeader: FC = () => {
  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Building2 className="h-10 w-10 text-white" />
          <div>
            <h1 className="text-2xl font-['SSTArabic-Bold'] text-white">إدارة حجوزات القاعات</h1>
            <p className="text-white/80 text-sm">قطاع الصحة الحيوانية</p>
          </div>
        </div>
        <Link 
          to="/"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
};