import { useState, useEffect } from 'react';
import type { Booking } from '../types/booking';

const STORAGE_KEY = 'bookings';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: 'approved' | 'rejected') => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  return {
    bookings,
    addBooking,
    updateBookingStatus,
  };
};