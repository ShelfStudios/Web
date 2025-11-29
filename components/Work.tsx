
import React, { useRef, useState, useEffect } from 'react';
import { Project } from '../types';

const projects: Project[] = [
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
    // Note: folder is `Linktree` (lowercase t) on disk — keep casing consistent for GitHub Pages
    imageUrl: new URL('../Projects/Linktree/Project Card.png', import.meta.url).href,
    description: "A central location to easily access all of my online content."
  },
  
];

const TiltCard: React.FC<{ project: Project; idx: number }> = ({ project, idx }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isVisible, setIsVisible] = useState<boolean>(!isMobile);
  const [targetTranslatePct, setTargetTranslatePct] = useState<number>(isMobile ? 100 : 0);
  const [currentTranslatePct, setCurrentTranslatePct] = useState<number>(isMobile ? 100 : 0);

  // helpers
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Intensity of rotation
        const rotateX = ((y - centerY) / centerY) * -15; 
        const rotateY = ((x - centerX) / centerX) * 15;

        setRotation({ x: rotateX, y: rotateY });
        setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setRotation({ x: 0, y: 0 });
    };

    // detect mobile viewport and observe visibility for slide-in
    useEffect(() => {
      const mm = window.matchMedia('(max-width: 767px)');
      const onChange = () => {
        setIsMobile(mm.matches);
        // if switching to desktop, ensure visible
        if (!mm.matches) setIsVisible(true);
      };
      onChange();
      mm.addEventListener?.('change', onChange);
      return () => mm.removeEventListener?.('change', onChange);
    }, []);

    useEffect(() => {
      if (!isMobile) return;
      const el = cardRef.current;
      if (!el) return;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          const ratio = e.intersectionRatio; // 0..1
          const eased = easeOutCubic(Math.max(0, Math.min(1, ratio)));
          // translate percent maps 100% (off-screen) at eased=0 to 0% at eased=1
          const pct = Math.max(0, Math.min(100, (1 - eased) * 100));
          setTargetTranslatePct(pct);
          setIsVisible(ratio > 0.02);
        });
      }, { threshold: [0, 0.02, 0.05, 0.1, 0.2, 0.35, 0.55, 0.75, 0.9, 1] });
      obs.observe(el);
      return () => obs.disconnect();
    }, [isMobile]);

    // smooth animation toward targetTranslatePct using RAF
    useEffect(() => {
      let rafId: number | null = null;
      const step = () => {
        setCurrentTranslatePct(prev => {
          const next = lerp(prev, targetTranslatePct, 0.12);
          return Math.abs(next - prev) < 0.05 ? targetTranslatePct : next;
        });
        rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
      };
    }, [targetTranslatePct]);

    const cardContent = (
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`group relative md:cursor-none flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] md:h-[70vh] perspective-1000 mx-4 md:mx-8`} 
          style={{ perspective: "1000px", aspectRatio: isMobile ? '4/3' : undefined, transform: `translate3d(${currentTranslatePct}%, 0, 0)`, opacity: Math.max(0, Math.min(1, 1 - currentTranslatePct / 120)) }}
        >
            <div 
                className="w-full h-full transition-transform duration-100 ease-out relative preserve-3d"
                style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)`,
                    transformStyle: 'preserve-3d'
                }}
            >
                <div className="w-full h-full overflow-hidden relative border border-white/10 rounded-sm shadow-2xl bg-studio-zinc">
                    {/* Holographic Sheen Layer */}
                    <div 
                        className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay transition-opacity duration-500"
                        style={{
                            background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(0,240,255,0.4), transparent 50%)`,
                            opacity: isHovering ? 1 : 0
                        }}
                    />
                    
                    {/* Image */}
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover md:grayscale md:group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                    />
                    
                    {/* Overlay Info */}
                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                         <div className="flex justify-between items-end pt-6">
                           <div className="text-center md:text-left">
                                <span className="text-accent text-xs font-mono uppercase tracking-widest mb-2 block glow-text">{project.category}</span>
                                <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 font-serif italic">{project.title}</h3>
                                <p className="text-gray-400 font-light text-sm tracking-wide">{project.description}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:text-black group-hover:border-accent transition-all duration-300">
                                <span className="text-xl transform -rotate-45 group-hover:rotate-0 transition-transform duration-300">→</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Make specific project cards clickable
    if (project.id === 1) {
      // ItsSpeltCadan -> external shop
      return (
        <a href="https://speltcadan-shop.fourthwall.com/en-gbp" target="_blank" rel="noopener noreferrer" className="no-underline">
          {cardContent}
        </a>
      );
    }

    if (project.id === 2) {
      // LinkTree -> external linktr.ee
      return (
        <a href="https://linktr.ee/shelfstudios" target="_blank" rel="noopener noreferrer" className="no-underline">
          {cardContent}
        </a>
      );
    }

    return cardContent;
};

const Work: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [percentage, setPercentage] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  // Default to a large height to ensure sticky works immediately while loading
  const [dynamicHeight, setDynamicHeight] = useState('400vh');
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  // ROBUST HEIGHT CALCULATION
  // This ensures the vertical scroll length EXACTLY matches the horizontal width needed.
  useEffect(() => {
    // detect mobile and update on resize
    const mm = window.matchMedia('(max-width: 767px)');
    const onChangeMobile = () => setIsMobile(mm.matches);
    onChangeMobile();
    mm.addEventListener?.('change', onChangeMobile);

    const updateDimensions = () => {
        if (!trackRef.current) return;
        
        const trackWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Distance the inner content needs to move horizontally
        const horizontalMoveAmount = trackWidth - viewportWidth;
        
        // Total height = The horizontal distance + 1 viewport height (for the view itself)
        // PLUS A BUFFER: Add 50px buffer to ensure we definitely hit the end before releasing
        const totalHeight = horizontalMoveAmount + viewportHeight + 50;
        
        setDynamicHeight(`${totalHeight}px`);
    };

    // Initial calculation
    updateDimensions();

    // Use ResizeObserver to auto-update if images load or content changes
    const resizeObserver = new ResizeObserver(() => {
        updateDimensions();
    });
    
    if (trackRef.current) {
        resizeObserver.observe(trackRef.current);
    }
    
    // Also listen to window resize
    window.addEventListener('resize', updateDimensions);

    return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', updateDimensions);
      mm.removeEventListener?.('change', onChangeMobile);
    };
  }, []);

  // SCROLL SYNC LOGIC
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) return; // on mobile we do not sync scroll to horizontal translate
      if (!containerRef.current || !trackRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // 'top' becomes negative as we scroll down. 
      // So -top is how many pixels we have scrolled INTO the section.
      const scrolledDistance = -containerRect.top;
      
      // The scrollable distance is Total Height - Viewport Height
      const maxScrollDistance = containerRef.current.offsetHeight - viewportHeight;
      
      // Calculate progress (0 to 1)
      let progress = scrolledDistance / maxScrollDistance;
      
      // Clamp values strictly between 0 and 1
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      setPercentage(progress);

      // Translate logic
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxTranslate = trackWidth - viewportWidth;
      
      // Move the track left based on progress
      setTranslateX(progress * maxTranslate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dynamicHeight]);

  // Mobile layout: stacked vertical cards that slide in as they are scrolled into view
  if (isMobile) {
    return (
      <section id="work" className="relative bg-studio-black py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
             <h3 className="text-4xl font-serif italic text-white mb-4">Selected Projects</h3>
             <p className="text-gray-400">Scroll to reveal projects — each panel will slide in from the right as you reach it.</p>
          </div>

          <div className="flex flex-col items-center gap-8">
            {projects.map((project, idx) => (
              <div key={project.id} className="w-full flex justify-center">
                <TiltCard project={project} idx={idx} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-accent font-mono text-xs uppercase tracking-widest">End of Selected Projects</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
        ref={containerRef} 
        id="work" 
        className="relative bg-studio-black"
        style={{ height: dynamicHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        
        {/* Persistent "Projects" Tab / Header */}
        <div className={`absolute top-0 left-0 w-full p-8 md:p-12 z-20 flex justify-between items-start transition-opacity duration-500 ${percentage > 0.98 ? 'opacity-0' : 'opacity-100'}`}>
            <div className="bg-black/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#00F0FF]"></div>
                <span className="text-white font-mono text-sm uppercase tracking-widest">Selected Projects</span>
                <span className="text-gray-500 font-mono text-xs border-l border-gray-700 pl-3">Lifetime</span>
            </div>
            
            <div className="hidden md:block text-right">
                <h2 className="text-6xl font-bold tracking-tighter text-white/10">ARCHIVE</h2>
            </div>
        </div>

        {/* Scroll Progress Bar (Top) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-30">
            <div 
                className="h-full bg-accent shadow-[0_0_20px_#00F0FF] transition-all duration-75 ease-out"
                style={{ width: `${percentage * 100}%` }}
            ></div>
        </div>

        {/* The Moving Track */}
        <div 
            ref={trackRef}
            className="flex items-center w-max px-[5vw] md:px-[10vw]"
            style={{ 
                transform: `translate3d(-${translateX}px, 0, 0)`,
                willChange: 'transform' // Performance optimization
            }}
        >
           {/* Intro Text Block */}
           <div className="w-[80vw] md:w-[30vw] flex-shrink-0 mr-12 md:mr-24 opacity-80 text-center md:text-left">
             <h3 className="text-4xl md:text-7xl font-serif italic text-white mb-8 leading-tight">
                favourite <br/><span className="text-accent not-italic font-sans font-bold tracking-tighter">Projects</span>
             </h3>
             <p className="text-xl text-gray-400 font-light max-w-md leading-relaxed">
                Scroll to discover a selection of my favourite works and click to explore each project in detail!
             </p>

          </div>

          {projects.map((project, idx) => (
            <TiltCard key={project.id} project={project} idx={idx} />
          ))}

          {/* Outro / Call to Action */}
          <div className="w-[80vw] md:w-[40vw] flex-shrink-0 flex items-center justify-center h-[60vh] border-l border-white/10 ml-12 md:ml-24 pl-12">
             <div className="text-center group cursor-pointer">
                 <p className="text-accent font-mono text-xs mb-4 uppercase tracking-widest">End of Selected Works</p>
                 <a href="#contact" className="block text-5xl md:text-8xl font-serif italic text-white group-hover:text-accent transition-colors duration-300">
                    View all <br/> Projects
                 </a>
                 <div className="mt-8 inline-block w-24 h-24 rounded-full border border-white/20 group-hover:bg-accent group-hover:border-accent flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                    <span className="text-3xl text-white group-hover:text-black">→</span>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;