import React, { useRef, useEffect } from 'react';

const MarqueeMid: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group) return;

    const setWidth = () => {
      const w = group.getBoundingClientRect().width;
      track.style.setProperty('--group-width', `${w}px`);
    };

    setWidth();
    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(setWidth);
      ro.observe(group);
    } catch (err) {
      console.warn('ResizeObserver not available or failed, marquee-mid will fallback to window resize.', err);
    }

    window.addEventListener('resize', setWidth);
    return () => {
      if (ro) {
        try { ro.disconnect(); } catch (e) { /* ignore */ }
      }
      window.removeEventListener('resize', setWidth);
    };
  }, []);

  return (
    <div className="bg-accent py-4 overflow-hidden border-y border-black relative z-20 rotate-0 scale-105 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
      <div ref={trackRef} className="animate-marquee-mid whitespace-nowrap flex" style={{'--group-width': '0px'} as React.CSSProperties}>
        <div ref={groupRef} className="flex space-x-8">
          {[...Array(10)].map((_, i) => (
            <span key={`a-${i}`} className="text-black font-bold text-xl md:text-3xl tracking-widest uppercase font-mono">
              3D MODELLING   //   3D PRINTING   //   GAMES DESIGN   //   CONCEPTING   //   2D ART   //   PHOTOGRAPHY   //   UI DESIGN   //   CONTENT CREATION   //
            </span>
          ))}
        </div>

        <div className="flex space-x-8">
          {[...Array(10)].map((_, i) => (
            <span key={`b-${i}`} className="text-black font-bold text-xl md:text-3xl tracking-widest uppercase font-mono">
              3D MODELLING   //   3D PRINTING   //   GAMES DESIGN   //   CONCEPTING   //   2D ART   //   PHOTOGRAPHY   //   UI DESIGN   //   CONTENT CREATION   //
            </span>
          ))}
        </div>
      </div>
      <style>{`
        .animate-marquee-mid {
          --group-width: 0px;
          display: flex;
          animation: marquee-mid var(--marquee-duration, 250s) linear infinite;
        }

        @keyframes marquee-mid {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(var(--group-width) * -1)); }
        }

        /* Mobile-only: slightly faster marquee (duration can be adjusted) */
        @media (max-width: 767px) {
          .animate-marquee-mid { --marquee-duration: 190s; }
        }
      `}</style>
    </div>
  );
};

export default MarqueeMid;
