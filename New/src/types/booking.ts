export type Duration = '30min' | '1hour' | '2hours' | '3hours' | '4hours';

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  department: string;
  date: string;
  time: string;
  duration: Duration;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  room?: string;
  notes?: string;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export interface AvailabilityResponse {
  date: string;
  slots: TimeSlot[];
}