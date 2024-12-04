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

const App: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="animated-gradient min-h-screen">
        <Logo />
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="fixed top-4 left-4 z-30 text-white hover:text-white/80 transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/confirmed" element={<ConfirmedAppointments />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;