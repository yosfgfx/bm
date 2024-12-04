import { BrowserRouter, HashRouter } from 'react-router-dom';

export const CustomRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <HashRouter basename="/">
      {children}
    </HashRouter>
  );
}; 