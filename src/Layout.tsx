import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isFirst = useRef(true);
  useEffect(() => {
    // mark that the first render has happened so subsequent navigations animate
    isFirst.current = false;
  }, []);

  

  return (
    <div className="min-h-screen bg-black text-studio-gray font-sans antialiased relative">
      
      {/* Slide animation for page enters. Uses pathname as key so new pages animate in. */}
      <style>{`
        .page-slide-enter { animation: slideIn 820ms cubic-bezier(.22,.9,.28,1) both; will-change: transform, opacity; }
        @keyframes slideIn {
          from { transform: translateX(6%); opacity: 0; }
          60% { opacity: 0.6; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <main className="relative z-10">
        <div key={location.pathname} className={`${isFirst.current ? '' : 'page-slide-enter'} min-h-screen bg-black`}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
