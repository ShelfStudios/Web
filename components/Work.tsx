import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 1,
    title: "ItsSpeltCadan",
    category: "Content Creation",
    imageUrl: new URL('../Projects/ItsSpeltCadan/Project Card.png', import.meta.url).href,
    description: "Cadan's content creation journey."
  },
  {
    id: 2,
    title: "LinkTree",
    category: "Link Hub",
    imageUrl: new URL('../Projects/Linktree/Project Card.png', import.meta.url).href,
    description: "A central location to easily access all of my online content."
  },
];

export const TiltCard: React.FC<{ project: Project; idx: number; isActive?: boolean; registerEl?: (el: HTMLDivElement | null) => void; compact?: boolean; disableGreyscale?: boolean; hideArrow?: boolean; imageOverride?: string; hideOverlay?: boolean }> = ({ project, idx, isActive = false, registerEl, compact = false, disableGreyscale = false, hideArrow = false, imageOverride, hideOverlay = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (isMobile) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Track mouse position for glow effect
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  useEffect(() => {
    const mm = window.matchMedia('(max-width: 767px)');
    const onChange = () => setIsMobile(mm.matches);
    onChange();
    mm.addEventListener?.('change', onChange);
    return () => mm.removeEventListener?.('change', onChange);
  }, []);


  useEffect(() => {
    if (!isMobile) {
      if (moverRef.current) {
        moverRef.current.style.transform = '';
        moverRef.current.style.opacity = '';
        moverRef.current.style.filter = '';
      }
      setScrollProgress(0);
      return;
    }

    const card = cardRef.current;
    if (!card) return;

    let rafId: number | null = null;

    const updateScrollProgress = () => {
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      
      const cardCenter = rect.top + rect.height / 2;
      const distanceFromCenter = cardCenter - viewportCenter;
      
      const animationRange = viewportHeight * 0.8;
      const normalizedDistance = distanceFromCenter / animationRange;
      
      let progress = 1 - (normalizedDistance + 0.5);
      progress = Math.max(0, Math.min(1, progress));
      
      const eased = easeOutCubic(progress);
      
      setScrollProgress(eased);
      
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateScrollProgress);
      }
    };

    updateScrollProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollProgress);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isMobile]);

  const cardContent = (
    <div
      ref={(el) => {
        cardRef.current = el;
        registerEl?.(el);
      }}
      onMouseEnter={handleMouseEnter}
      data-project-id={project.id}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={
        compact
          ? `group relative flex-shrink-0 w-full max-w-sm h-64 perspective-1000 mx-2 ${!isMobile ? 'transition-all duration-500' : ''}`
          : `group relative md:cursor-none flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] md:h-[70vh] perspective-1000 mx-4 md:mx-8 ${!isMobile ? 'transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]' : ''}`
      }
      style={{
        perspective: '1000px',
        aspectRatio: isMobile ? '4/3' : undefined,
        willChange: isMobile ? 'auto' : 'transform, opacity',
        ...(isMobile ? {
          touchAction: 'pan-y',
          WebkitTouchCallout: 'none'
        } : {})
      }}
    >
      <div 
        ref={moverRef} 
        className="w-full h-full"
        style={isMobile ? {
          opacity: Math.max(0, Math.min(1, scrollProgress * 1.2)),
          transform: `
            translate3d(
              ${(1 - scrollProgress) * 30 * (idx % 2 === 0 ? 1 : -1)}px, 
              ${(1 - scrollProgress) * 50}px, 
              ${(1 - scrollProgress) * -100}px
            ) 
            scale(${0.85 + scrollProgress * 0.15}) 
            rotateY(${(1 - scrollProgress) * 15 * (idx % 2 === 0 ? 1 : -1)}deg)
            rotateX(${(1 - scrollProgress) * 8}deg)
          `,
          filter: `
            blur(${(1 - Math.sqrt(scrollProgress)) * 6}px) 
            brightness(${0.6 + scrollProgress * 0.4})
            contrast(${0.9 + scrollProgress * 0.1})
          `,
          willChange: 'transform, opacity, filter',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          transition: 'none'
        } : {}}
      >
        <div
          className="w-full h-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] relative preserve-3d"
          style={{
              transform: `scale3d(${isHovering ? 1.08 : 1}, ${isHovering ? 1.08 : 1}, 1) translateZ(${isHovering ? 30 : 0}px)`,
              transformStyle: 'preserve-3d',
              filter: isHovering ? 'brightness(1.15) contrast(1.05)' : 'brightness(1) contrast(1)'
            }}
        >
          <div className="w-full h-full overflow-hidden relative rounded-sm shadow-2xl bg-studio-zinc">
            {/* Animated border glow on hover */}
            <div
              className="absolute inset-0 z-30 pointer-events-none rounded-sm transition-opacity duration-500"
              style={{
                opacity: isHovering ? 1 : 0,
                boxShadow: isHovering 
                  ? `0 0 40px rgba(0,240,255,0.6), 0 0 80px rgba(0,240,255,0.3), inset 0 0 40px rgba(0,240,255,0.1)`
                  : 'none',
                border: isHovering ? '2px solid rgba(0,240,255,0.5)' : '2px solid transparent',
                transition: 'opacity 0.5s ease, box-shadow 0.5s ease, border 0.5s ease'
              }}
            />
            {/* Enhanced glow effect */}
            <div
              className="absolute inset-0 z-20 pointer-events-none mix-blend-screen transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(0,240,255,0.6) 0%, rgba(0,240,255,0.2) 30%, transparent 70%)`,
                opacity: (isHovering || isActive) ? 1 : 0,
                filter: 'blur(20px)'
              }}
            />
            {/* Secondary glow layer for depth */}
            <div
              className="absolute inset-0 z-19 pointer-events-none transition-opacity duration-700"
              style={{
                background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(0,240,255,0.3), transparent 60%)`,
                opacity: (isHovering || isActive) ? 1 : 0,
                filter: 'blur(40px)'
              }}
            />
            <img
              src={imageOverride ?? project.imageUrl}
              alt={project.title}
              className={`w-full h-full object-cover transition-all duration-700 scale-110 group-hover:scale-105`}
              style={{
                filter: disableGreyscale
                  ? 'grayscale(0) contrast(1.1) saturate(1.2)'
                  : isMobile
                    ? 'grayscale(0) contrast(1.1) saturate(1.2)'
                    : (isHovering || isActive)
                      ? 'grayscale(0) contrast(1.1) saturate(1.2)'
                      : 'grayscale(1) contrast(1) saturate(1)',
                transition: 'filter 0.7s ease'
              }}
            />
                <div className={compact ? (hideOverlay ? "absolute inset-x-0 bottom-0 w-full p-3 md:p-6 bg-transparent z-10 translate-y-3 group-hover:translate-y-0 transition-all duration-350" : "absolute inset-x-0 bottom-0 w-full p-3 md:p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-10 translate-y-3 group-hover:translate-y-0 transition-all duration-350") : (hideOverlay ? "absolute inset-x-0 bottom-0 w-full p-4 md:p-8 bg-transparent z-10 translate-y-4 group-hover:translate-y-0 transition-all duration-500" : "absolute inset-x-0 bottom-0 w-full p-4 md:p-8 bg-gradient-to-t from-black/98 via-black/80 to-transparent z-10 translate-y-4 group-hover:translate-y-0 transition-all duration-500")}>
              <div className="relative w-full h-full">
                <div className="flex flex-col justify-end h-full">
                  <div className="text-left">
                    <span className={compact ? "text-accent text-[10px] font-mono uppercase tracking-widest block" : "text-accent text-xs font-mono uppercase tracking-widest mb-2 block glow-text"}>
                      {project.category}
                    </span>
                    <h3 className={compact ? "text-lg md:text-2xl font-bold text-white mb-1 font-serif italic" : "text-2xl md:text-5xl font-bold text-white mb-2 font-serif italic"}>
                      {project.title}
                    </h3>
                    {!isMobile && !compact && (
                      <p className="text-gray-400 font-light text-sm tracking-wide">{project.description}</p>
                    )}
                  </div>
                </div>
                {!hideArrow && (
                  <div className="absolute right-4 md:right-8 bottom-4 md:bottom-6 flex-shrink-0 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 bg-transparent md:group-hover:bg-accent md:group-hover:text-black md:group-hover:border-accent">
                    <span className="text-xl transform -rotate-45 md:group-hover:rotate-0 transition-transform duration-300">
                      →
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (project.id === 1) {
    return (
      <a
        href="https://speltcadan-shop.fourthwall.com/en-gbp"
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline"
      >
        {cardContent}
      </a>
    );
  }

  if (project.id === 2) {
    return (
      <a
        href="https://linktr.ee/shelfstudios"
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

const Work: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<Record<number, HTMLDivElement | null>>({});
  const [activeId, setActiveId] = useState<number | null>(null);
  const [percentage, setPercentage] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [dynamicHeight, setDynamicHeight] = useState('400vh');
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const mm = window.matchMedia('(max-width: 767px)');
    const onChangeMobile = () => setIsMobile(mm.matches);
    onChangeMobile();
    mm.addEventListener?.('change', onChangeMobile);

    const updateDimensions = () => {
      if (!trackRef.current) return;

      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const horizontalMoveAmount = trackWidth - viewportWidth;
      const totalHeight = horizontalMoveAmount + viewportHeight + 50;

      setDynamicHeight(`${totalHeight}px`);
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => updateDimensions());
    if (trackRef.current) resizeObserver.observe(trackRef.current);

    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
      mm.removeEventListener?.('change', onChangeMobile);
    };
  }, []);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    setActiveId(null);

    if (isMobile) return;

    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);
    observerRef.current = new IntersectionObserver((entries) => {
      let bestId: number | null = null;
      let bestRatio = 0;
      for (const entry of entries) {
        const idStr = entry.target.getAttribute?.('data-project-id');
        if (!idStr) continue;
        const ratio = entry.intersectionRatio || 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = parseInt(idStr, 10);
        }
      }
      if (bestId !== null && bestRatio >= 0.9) setActiveId(bestId);
      else setActiveId(null);
    }, { threshold: thresholds });

    Object.values(cardEls.current).forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [isMobile]);

  const makeRegister = (id: number) => (el: HTMLDivElement | null) => {
    const prev = cardEls.current[id];
    if (prev && observerRef.current) observerRef.current.unobserve(prev);
    if (el) {
      cardEls.current[id] = el;
      if (observerRef.current) observerRef.current.observe(el);
    } else {
      delete cardEls.current[id];
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) return;
      if (!containerRef.current || !trackRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const scrolledDistance = -containerRect.top;
      const maxScrollDistance = containerRef.current.offsetHeight - viewportHeight;

      let progress = scrolledDistance / maxScrollDistance;
      progress = Math.max(0, Math.min(1, progress));

      setPercentage(progress);

      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxTranslate = trackWidth - viewportWidth;

      setTranslateX(progress * maxTranslate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dynamicHeight]);

  if (isMobile) {
    return (
      <section 
        id="work" 
        className="relative bg-studio-black py-12 px-6"
        style={{
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h3 className="text-4xl font-serif italic text-white mb-4">Selected Projects</h3>
            <p className="text-gray-400">
              Scroll to reveal projects — each panel will slide in from the right as you reach it.
            </p>
          </div>

          <div className="flex flex-col items-center gap-8">
            {projects.map((project, idx) => (
              <div 
                key={project.id} 
                className="w-full flex justify-center"
              >
                <TiltCard
                  project={project}
                  idx={idx}
                  isActive={activeId === project.id}
                  registerEl={makeRegister(project.id)}
                />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/projects" className="inline-block bg-accent text-black px-6 py-3 rounded-full font-mono text-sm uppercase tracking-widest">View all projects</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} id="work" className="relative bg-studio-black" style={{ height: dynamicHeight }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">

        <div
          className={`absolute top-0 left-0 w-full p-8 md:p-12 z-20 flex justify-between items-start transition-opacity duration-500 ${
            percentage > 0.98 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="bg-black/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#00F0FF]"></div>
            <span className="text-white font-mono text-sm uppercase tracking-widest">Selected Projects</span>
            <span className="text-gray-500 font-mono text-xs border-l border-gray-700 pl-3">Lifetime</span>
          </div>

          <div className="hidden md:block text-right">
            <h2 className="text-6xl font-bold tracking-tighter text-white/10">ARCHIVE</h2>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-30">
          <div
            className="h-full bg-accent shadow-[0_0_20px_#00F0FF] transition-all duration-75 ease-out"
            style={{ width: `${percentage * 100}%` }}
          ></div>
        </div>

        <div
          ref={trackRef}
          className="flex items-center w-max px-[5vw] md:px-[10vw]"
          style={{
            transform: `translate3d(-${translateX}px, 0, 0)`,
            willChange: 'transform'
          }}
        >
          <div className="w-[80vw] md:w-[30vw] flex-shrink-0 mr-12 md:mr-24 opacity-80 text-center md:text-left">
            <h3 className="text-4xl md:text-7xl font-serif italic text-white mb-8 leading-tight">
              favourite <br />
              <span className="text-accent not-italic font-sans font-bold tracking-tighter">Projects</span>
            </h3>
            <p className="text-xl text-gray-400 font-light max-w-md leading-relaxed">
              Scroll to discover a selection of my favourite works and click to explore each project in detail!
            </p>
          </div>

          {projects.map((project, idx) => (
            <TiltCard
              key={project.id}
              project={project}
              idx={idx}
              isActive={activeId === project.id}
              registerEl={makeRegister(project.id)}
            />
          ))}

          <div className="w-[80vw] md:w-[40vw] flex-shrink-0 flex items-center justify-center h-[60vh] border-l border-white/10 ml-auto">
            <div className="flex flex-col items-center group cursor-pointer text-center">
              <p className="hidden md:block text-accent font-mono text-xs mb-4 uppercase tracking-widest">End of Selected Works</p>
              <div className="block text-5xl md:text-8xl font-serif italic text-white group-hover:text-accent transition-colors duration-300">
                View all <br /> Projects
              </div>
              <Link to="/projects" className="mt-6 md:mt-8 mx-auto block w-24 h-24 rounded-full border border-white/20 group-hover:bg-accent group-hover:border-accent flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                <span className="text-3xl text-white group-hover:text-black">→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Work;
