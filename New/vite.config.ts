import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/MeetRoomBooking/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
