import React from 'react';
import Footer from '../components/Footer';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-studio-black text-studio-gray font-sans antialiased relative">
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
