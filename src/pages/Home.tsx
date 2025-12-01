import React from 'react';
import Hero from '../../components/Hero';
import Marquee from '../../components/Marquee';
import About from '../../components/About';
import Work from '../../components/Work';
import MarqueeMid from '../../components/MarqueeMid';
import Contact from '../../components/Contact';

const Home: React.FC = () => {
  return (
    <main className="relative z-10">
      <Hero />
      <Marquee />
      <About />
      <Work />
      <MarqueeMid />
      <Contact />
    </main>
  );
};

export default Home;
