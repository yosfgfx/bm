import { useState, useEffect } from 'react';
import { ref, onValue, set, push, update, get, DatabaseReference } from 'firebase/database';
import { database } from '../config/firebase';
import { useConnectivity } from './useConnectivity';

interface PendingOperation {
  type: 'create' | 'update';
  path: string;
  data: any;
  timestamp: number;
}

const STORAGE_KEY = 'meetingRoom_pendingOperations';

export const useFirebaseSync = <T>(path: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isOnline } = useConnectivity();

  // Load pending operations from localStorage
  const loadPendingOperations = (): PendingOperation[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  // Save pending operations to localStorage
  const savePendingOperations = (operations: PendingOperation[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
  };

  // Add a new pending operation
  const addPendingOperation = (operation: PendingOperation) => {
    const operations = loadPendingOperations();
    operations.push(operation);
    savePendingOperations(operations);
  };

  // Process pending operations when online
  const processPendingOperations = async () => {
    if (!isOnline) return;

    const operations = loadPendingOperations();
    if (operations.length === 0) return;

    const failedOperations: PendingOperation[] = [];

    for (const operation of operations) {
      try {
        const ref = database.ref(operation.path);
        
        if (operation.type === 'create') {
          await push(ref, operation.data);
        } else if (operation.type === 'update') {
          await update(ref, operation.data);
        }
      } catch (error) {
        console.error('Error processing operation:', error);
        failedOperations.push(operation);
      }
    }

    // Save any failed operations back to localStorage
    savePendingOperations(failedOperations);
  };

  // Create data with offline support
  const createData = async (newData: Partial<T>) => {
    try {
      if (!isOnline) {
        addPendingOperation({
          type: 'create',
          path,
          data: newData,
          timestamp: Date.now(),
        });
        return;
      }

      const dbRef = ref(database, path);
      await push(dbRef, {
        ...newData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating data:', error);
      throw error;
    }
  };

  // Update data with offline support
  const updateData = async (id: string, updates: Partial<T>) => {
    try {
      if (!isOnline) {
        addPendingOperation({
          type: 'update',
          path: `${path}/${id}`,
          data: { ...updates, updatedAt: new Date().toISOString() },
          timestamp: Date.now(),
        });
        return;
      }

      const dbRef = ref(database, `${path}/${id}`);
      await update(dbRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  };

  // Subscribe to data changes
  useEffect(() => {
    const dbRef = ref(database, path);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      try {
        const val = snapshot.val();
        if (val) {
          // Store data in localStorage for offline access
          localStorage.setItem(`meetingRoom_${path}`, JSON.stringify(val));
          setData(val);
        } else {
          setData(null);
        }
        setError(null);
      } catch (error) {
        console.error('Error processing snapshot:', error);
        setError(error as Error);
        
        // Try to load from localStorage if online data fetch fails
        const cached = localStorage.getItem(`meetingRoom_${path}`);
        if (cached) {
          setData(JSON.parse(cached));
        }
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Firebase subscription error:', error);
      setError(error as Error);
      setLoading(false);

      // Load from localStorage on error
      const cached = localStorage.getItem(`meetingRoom_${path}`);
      if (cached) {
        setData(JSON.parse(cached));
      }
    });

    return () => unsubscribe();
  }, [path]);

  // Process pending operations when coming online
  useEffect(() => {
    if (isOnline) {
      processPendingOperations();
    }
  }, [isOnline]);

  return {
    data,
    loading,
    error,
    createData,
    updateData,
    isOnline,
  };
};
