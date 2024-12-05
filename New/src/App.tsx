import { FC, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { BookingPage } from './pages/BookingPage';
import { LandingPage } from './pages/LandingPage';
import { Admin } from './pages/Admin';
import { AdminLogin } from './components/AdminLogin';
import { ConfirmedAppointments } from './pages/ConfirmedAppointments';
import { NavigationDrawer } from './components/NavigationDrawer';
import { Logo } from './components/Logo';
import './styles/animations.css';

// Import firebase here
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import { CustomRouter } from './components/CustomRouter';
import NotFoundPage from './pages/NotFoundPage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDleVfi3Z9BO5Apxe8_TOzG4FkiQ2giBn8",
  authDomain: "yosfgfx-meetroom.firebaseapp.com",
  databaseURL: "https://yosfgfx-meetroom-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "yosfgfx-meetroom",
  storageBucket: "yosfgfx-meetroom.firebasestorage.app",
  messagingSenderId: "605591505888",
  appId: "1:605591505888:web:74a259ca22cd2ce3aeb985",
  measurementId: "G-ZK83SMYP9M"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const database = getDatabase(firebaseApp);

// Now you have to init the project but before that you need to clean the

const App: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <CustomRouter>
      <div className="animated-gradient min-h-screen">
        <Logo />
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="fixed top-4 left-4 z-30 text-white hover:text-white/80 transition-colors"
          aria-label="فتح القائمة"
          title="فتح القائمة"
        >
          <Menu size={24} />
        </button>
        
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        <Routes>
          <Route path="/" element={<Navigate to="/New" />} />
          <Route path="/New" element={<BookingPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/confirmed" element={<ConfirmedAppointments />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </CustomRouter>
  );
};

export default App;