import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, set } from 'firebase/database';

export const useConnectivity = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(new Date());
      
      // Update user's online status in Firebase
      const userStatusRef = ref(database, '.info/connected');
      set(userStatusRef, true)
        .catch(error => console.error('Error updating online status:', error));
    };

    const handleOffline = () => {
      setIsOnline(false);
      
      // Update user's offline status in Firebase
      const userStatusRef = ref(database, '.info/connected');
      set(userStatusRef, false)
        .catch(error => console.error('Error updating offline status:', error));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial online status
    if (navigator.onLine) {
      handleOnline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    lastOnline,
  };
};
