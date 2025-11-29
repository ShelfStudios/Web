import React from 'react';

const MarqueeMid: React.FC = () => {
  return (
    <div className="bg-accent py-4 overflow-hidden border-y border-black relative z-20 rotate-0 scale-105 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
      <div className="animate-marquee-mid whitespace-nowrap flex space-x-8">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-black font-bold text-xl md:text-3xl tracking-widest uppercase font-mono">
            3D MODELLING   //   3D PRINTING   //   GAMES DESIGN   //   CONCEPTING   //   2D ART   //   PHOTOGRAPHY   //   UI DESIGN   //   CONTENT CREATION   //
          </span>
        ))}
      </div>
      <style>{`
        .animate-marquee-mid {
          animation: marquee-mid 20s linear infinite;
        }
        @keyframes marquee-mid {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default MarqueeMid;
