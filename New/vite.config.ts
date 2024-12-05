import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://yosfgfx.github.io/MeetRoomBooking/New', // Ensure this matches the GitHub Pages base path
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets'
  }
});
