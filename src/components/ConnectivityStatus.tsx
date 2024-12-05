import { FC, useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export const ConnectivityStatus: FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass-effect rounded-xl p-4 flex items-center gap-3 bg-red-500/20 text-white">
          <WifiOff className="h-5 w-5" />
          <p>
            لا يوجد اتصال بالإنترنت. سيتم حفظ البيانات محلياً وستتم المزامنة عند عودة الاتصال.
          </p>
        </div>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="fixed top-4 right-4 z-50 animate-fade-in">
        <div className="glass-effect rounded-xl px-4 py-2 flex items-center gap-2 bg-emerald-500/20 text-emerald-300">
          <Wifi className="h-4 w-4" />
          <p className="text-sm">أنت متصل الآن</p>
        </div>
      </div>
    );
  }

  return null;
};
