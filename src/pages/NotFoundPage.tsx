import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white text-center">
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-9xl font-bold mb-4">404</h1>
        
        <div className="relative">
          <div className="h-px w-full bg-white/20 absolute top-1/2 transform -translate-y-1/2" />
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full relative">
            الصفحة غير موجودة
          </span>
        </div>

        <p className="text-xl text-white/80 mt-4">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Link
            to="/"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-all duration-300"
          >
            <Home size={20} />
            <span>العودة للرئيسية</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-all duration-300"
          >
            <ArrowLeft size={20} />
            <span>الرجوع للخلف</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 