import React, { useState } from 'react';
import { Header } from '../components/Header';
import { BookingForm } from '../components/BookingForm';
import { BookingSummary } from '../components/BookingSummary';
import { TodayAppointments } from '../components/TodayAppointments';
import { ConnectivityStatus } from '../components/ConnectivityStatus';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import type { Booking } from '../types/booking';

export const BookingPage = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { createData, isOnline } = useFirebaseSync<Booking>('bookings');

  const handleBookingSubmit = (data: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    setBookingData(data);
    setError('');
  };

  const handleConfirmBooking = async () => {
    if (!bookingData) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      await createData({
        ...bookingData,
        status: 'pending',
      });

      // Show appropriate message based on connection status
      const message = isOnline
        ? 'تم إرسال طلب الحجز بنجاح وسيتم مراجعته من قبل المسؤول'
        : 'تم حفظ طلب الحجز محلياً وسيتم مزامنته تلقائياً عند عودة الاتصال';

      navigate('/success', { 
        state: { 
          message,
          bookingData,
          isOffline: !isOnline,
        } 
      });
    } catch (err) {
      console.error('Error submitting booking:', err);
      setError('حدث خطأ أثناء إرسال طلب الحجز. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBooking = () => {
    setBookingData(null);
    setError('');
  };

  return (
    <div className="min-h-screen gradient-bg pt-32 pb-8 px-4">
      <ConnectivityStatus />
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
            
            {!isOnline && (
              <div className="bg-yellow-500/20 text-yellow-100 p-4 rounded-lg mb-6">
                أنت حالياً غير متصل بالإنترنت. سيتم حفظ الحجز محلياً ومزامنته تلقائياً عند عودة الاتصال.
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 text-red-100 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {bookingData ? (
                  <BookingSummary
                    booking={bookingData}
                    onConfirm={handleConfirmBooking}
                    onEdit={handleEditBooking}
                  />
                ) : (
                  <BookingForm onSubmit={handleBookingSubmit} />
                )}
              </div>
              <div>
                <TodayAppointments />
              </div>
            </div>
            
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};