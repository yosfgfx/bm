import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/MeetRoomBooking/New/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
