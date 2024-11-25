import React, { useState } from 'react';
import { Header } from '../components/Header';
import { BookingForm } from '../components/BookingForm';
import { BookingDetails } from '../components/BookingDetails';
import { Footer } from '../components/Footer';
import { saveBookingToLocal } from '../utils/bookingUtils';
import type { Booking } from '../types/booking';
import { v4 as uuidv4 } from 'uuid';

export const BookingPage = () => {
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBookingSubmit = (formData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newBooking: Booking = {
      id: uuidv4(),
      ...formData,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    try {
      saveBookingToLocal(newBooking);
      setBookingDetails(newBooking);
      setShowSuccess(true);

      // Show success message for 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error saving booking:', error);
      // You might want to show an error message here
    }
  };

  return (
    <div className="min-h-screen gradient-bg pt-32 pb-8 px-4">
      <div className="container mx-auto">
        <div className="space-y-6 container-animation">
          <Header />
          <div className="max-w-4xl mx-auto space-y-6">
            {showSuccess && (
              <div className="glass-effect rounded-xl p-4 bg-emerald-500/20 text-emerald-100">
                <p className="text-center">
                  تم إرسال طلب الحجز بنجاح! سيتم مراجعة طلبك من قبل المسؤول.
                </p>
              </div>
            )}
            
            <BookingForm onSubmit={handleBookingSubmit} />
            
            {bookingDetails && (
              <BookingDetails details={bookingDetails} />
            )}
            
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};