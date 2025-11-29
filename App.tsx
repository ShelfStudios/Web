
import React, { useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Marquee from './components/Marquee';
import MarqueeMid from './components/MarqueeMid';

function App() {
  // Global Scroll Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% of the element is visible
      rootMargin: "0px 0px -50px 0px"
    });

    // Select all elements with the 'reveal' class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-studio-black text-studio-gray font-sans antialiased relative">
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <About />
        <Work />
        <MarqueeMid />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;