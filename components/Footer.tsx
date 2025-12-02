import React from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-20 bg-transparent text-gray-10 py-8 px-6">
      <div className="w-full">
        <div className="flex flex-col md:grid md:grid-cols-3 md:items-center md:gap-8 items-start gap-6 px-6 md:px-12">

          {/* NAV first on mobile, right on desktop */}
          <div className="w-full md:col-start-3 md:col-span-1 order-1 md:order-3 flex justify-center md:justify-end">
            <nav className="w-full md:w-auto flex flex-col md:flex-row items-center md:items-center text-sm md:text-sm font-mono uppercase md:tracking-widest md:space-x-8">
              <Link to="/privacy" className="block w-full md:w-auto text-center md:text-left text-gray-300 hover:text-white transition-colors py-2 md:py-0 md:px-2">Privacy</Link>
              <Link to="/terms" className="block w-full md:w-auto text-center md:text-left text-gray-300 hover:text-white transition-colors py-2 md:py-0 md:px-2">Terms</Link>
              <Link to="/sitemap" className="block w-full md:w-auto text-center md:text-left text-gray-300 hover:text-white transition-colors py-2 md:py-0 md:px-2">Sitemap</Link>
            </nav>
          </div>

          {/* Branding beneath nav on mobile, left on desktop */}
          <div className="w-full md:col-start-1 md:col-span-1 md:w-auto order-2 md:order-1 flex flex-col items-center md:flex-row md:items-center md:justify-start gap-4">
            <div className="flex-shrink-0">
              <Logo variant="icon" className="" size="h-36 md:h-40" disableGlow />
            </div>
            <p className="text-center md:text-left text-sm md:text-sm font-mono">© {new Date().getFullYear()} All Rights Reserved.</p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;