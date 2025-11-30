
import React, { useState, useEffect } from 'react';
import ScrambleText from './ScrambleText';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'Studio', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      className={`relative w-full z-0 transition-all duration-500 ease-in-out px-6 py-4 flex justify-between items-center ${
        scrolled ? 'bg-studio-black/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div />

      <div className="hidden md:flex space-x-12">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-sm font-medium uppercase tracking-widest text-gray-400 hover:text-accent hover:shadow-glow transition-all duration-300 relative group"
          >
            <ScrambleText text={link.name} hover={true} />
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full shadow-glow"></span>
          </a>
        ))}
      </div>

      <button 
        className="md:hidden z-50 flex flex-col space-y-1.5 p-2 group"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <div className={`w-8 h-0.5 bg-white group-hover:bg-accent transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <div className={`w-8 h-0.5 bg-white group-hover:bg-accent transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
        <div className={`w-8 h-0.5 bg-white group-hover:bg-accent transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      <div 
        className={`fixed inset-0 bg-studio-black flex flex-col justify-center items-center space-y-8 transition-transform duration-500 ease-in-out md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="text-5xl font-serif italic text-white hover:text-accent hover:scale-110 transition-all duration-300"
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
