import { format, parse, addMinutes, isWithinInterval } from 'date-fns';
import type { Booking, TimeSlot, Duration } from '../types/booking';

const WORKING_HOURS = {
  start: '08:00',
  end: '16:00',
};

const SLOT_DURATION = 30; // minutes

export const generateTimeSlots = (start: string, end: string): string[] => {
  const slots: string[] = [];
  let currentTime = parse(start, 'HH:mm', new Date());
  const endTime = parse(end, 'HH:mm', new Date());

  while (currentTime <= endTime) {
    slots.push(format(currentTime, 'HH:mm'));
    currentTime = addMinutes(currentTime, SLOT_DURATION);
  }

  return slots;
};

export const getDurationInMinutes = (duration: Duration): number => {
  const durationMap: Record<Duration, number> = {
    '30min': 30,
    '1hour': 60,
    '2hours': 120,
    '3hours': 180,
    '4hours': 240,
  };
  return durationMap[duration];
};

export const isSlotAvailable = (
  slot: string,
  date: string,
  bookings: Booking[],
  duration: Duration
): boolean => {
  const slotStart = parse(slot, 'HH:mm', new Date());
  const slotEnd = addMinutes(slotStart, getDurationInMinutes(duration));

  return !bookings.some((booking) => {
    if (booking.date !== date) return false;

    const bookingStart = parse(booking.time, 'HH:mm', new Date());
    const bookingEnd = addMinutes(bookingStart, getDurationInMinutes(booking.duration));

    return isWithinInterval(slotStart, { start: bookingStart, end: bookingEnd }) ||
      isWithinInterval(slotEnd, { start: bookingStart, end: bookingEnd }) ||
      isWithinInterval(bookingStart, { start: slotStart, end: slotEnd });
  });
};

export const getAvailableTimeSlots = async (date: string): Promise<TimeSlot[]> => {
  try {
    // Get all bookings for the selected date
    const response = await fetch(`/api/bookings?date=${date}`);
    const bookings: Booking[] = await response.json();

    // Generate all possible time slots
    const allSlots = generateTimeSlots(WORKING_HOURS.start, WORKING_HOURS.end);

    // Check availability for each slot
    return allSlots.map((time) => ({
      time,
      isAvailable: isSlotAvailable(time, date, bookings, '30min'), // Check with minimum duration
    }));
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return [];
  }
};

// Local Storage Functions
const STORAGE_KEY = 'bookings';

export const saveBookingToLocal = (booking: Booking): void => {
  try {
    const bookings = getLocalBookings();
    bookings.push(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error('Error saving booking to local storage:', error);
  }
};

export const getLocalBookings = (): Booking[] => {
  try {
    const bookings = localStorage.getItem(STORAGE_KEY);
    return bookings ? JSON.parse(bookings) : [];
  } catch (error) {
    console.error('Error reading bookings from local storage:', error);
    return [];
  }
};

export const updateLocalBooking = (id: string, updates: Partial<Booking>): void => {
  try {
    const bookings = getLocalBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    }
  } catch (error) {
    console.error('Error updating booking in local storage:', error);
  }
};

export const getConfirmedBookings = (): Booking[] => {
  return getLocalBookings().filter((booking) => booking.status === 'approved');
};
