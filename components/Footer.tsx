import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-10 py-6 px-6">
      <div className="w-full mx-auto flex flex-row justify-between items-center">
        <div className="mb-0 flex items-center gap-4">
          <Logo variant="icon" className="h-24" size="h-24" disableGlow />
          <p className="text-xs font-mono">© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
        <div className="flex space-x-6 text-xs font-mono uppercase tracking-widest">
          <a href="#" className="hover:text-accent transition-colors">Privacy</a>
          <a href="#" className="hover:text-accent transition-colors">Terms</a>
          <a href="#" className="hover:text-accent transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;