import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { AuthProvider } from '../contexts/AuthContext';
import { database } from '../config/firebase';
import { ref, set, remove } from 'firebase/database';

describe('MeetRoom App Tests', () => {
  // Clean up database before each test
  beforeEach(async () => {
    await remove(ref(database, 'bookings'));
  });

  // Clean up after all tests
  afterEach(async () => {
    await remove(ref(database, 'bookings'));
  });

  describe('Navigation Tests', () => {
    it('should navigate to booking page', async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </AuthProvider>
      );

      const bookingLink = screen.getByText('حجز قاعة');
      fireEvent.click(bookingLink);

      await waitFor(() => {
        expect(screen.getByText('حجز قاعة اجتماعات')).toBeInTheDocument();
      });
    });

    it('should show admin routes for admin users', async () => {
      // Mock admin login
      localStorage.setItem('isAdmin', 'true');

      render(
        <AuthProvider>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </AuthProvider>
      );

      expect(screen.getByText('إدارة الحجوزات')).toBeInTheDocument();
      expect(screen.getByText('الإعدادات')).toBeInTheDocument();

      localStorage.removeItem('isAdmin');
    });
  });

  describe('Booking Form Tests', () => {
    it('should validate required fields', async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/booking']}>
            <App />
          </MemoryRouter>
        </AuthProvider>
      );

      const submitButton = screen.getByText('تأكيد الحجز');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('الرجاء تعبئة جميع الحقول المطلوبة')).toBeInTheDocument();
      });
    });

    it('should prevent booking outside working hours', async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/booking']}>
            <App />
          </MemoryRouter>
        </AuthProvider>
      );

      // Try to select time outside working hours
      const timeSelect = screen.getByLabelText('الوقت');
      fireEvent.change(timeSelect, { target: { value: '18:00' } });

      expect(timeSelect.value).not.toBe('18:00');
    });
  });

  describe('Offline Functionality Tests', () => {
    it('should store booking locally when offline', async () => {
      // Mock offline status
      window.addEventListener('offline', () => {});
      Object.defineProperty(navigator, 'onLine', { value: false });

      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/booking']}>
            <App />
          </MemoryRouter>
        </AuthProvider>
      );

      // Fill out booking form
      fireEvent.change(screen.getByLabelText('الاسم'), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText('القسم'), {
        target: { value: 'الإدارة العامة لمخاطر الصحة الحيوانية' },
      });
      // ... fill other required fields

      const submitButton = screen.getByText('تأكيد الحجز');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(localStorage.getItem('meetingRoom_pendingOperations')).toBeTruthy();
      });

      // Restore online status
      Object.defineProperty(navigator, 'onLine', { value: true });
    });
  });

  describe('Admin Approval Tests', () => {
    it('should show pending bookings to admin', async () => {
      // Create a test booking
      const testBooking = {
        name: 'Test User',
        department: 'Test Department',
        date: '2024-01-01',
        time: '10:00',
        duration: '1hour',
        status: 'pending',
      };

      await set(ref(database, 'bookings/test'), testBooking);

      // Login as admin
      localStorage.setItem('isAdmin', 'true');

      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/admin/bookings']}>
            <App />
          </MemoryRouter>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('معلق')).toBeInTheDocument();
      });

      localStorage.removeItem('isAdmin');
    });
  });

  describe('Firebase Integration Tests', () => {
    it('should sync data with Firebase when online', async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/booking']}>
            <App />
          </MemoryRouter>
        </AuthProvider>
      );

      // Fill out and submit booking form
      fireEvent.change(screen.getByLabelText('الاسم'), {
        target: { value: 'Test User' },
      });
      // ... fill other required fields

      const submitButton = screen.getByText('تأكيد الحجز');
      fireEvent.click(submitButton);

      await waitFor(async () => {
        const snapshot = await get(ref(database, 'bookings'));
        expect(snapshot.exists()).toBe(true);
      });
    });
  });
});
