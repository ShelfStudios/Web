
import React, { useEffect, useState, useRef } from 'react';
import Logo from './Logo';
import ScrambleText from './ScrambleText';

const Hero: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, tx: 0, ty: 0 });
  const [showIndicator, setShowIndicator] = useState(false);
  const indicatorTimerRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  // Canvas Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { x: number; y: number; vx: number; vy: number; baseX: number; baseY: number }[] = [];
    const particleCount = width < 768 ? 50 : 100; // Fewer particles on mobile
    const connectionDistance = 150;
    const mouseRadius = 200;

    // Initialize particles in a grid/random mix
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      particles.forEach(p => {
        // Base movement
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls (soft)
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction (Repulsion)
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseRadius - distance) / mouseRadius;
          const directionX = forceDirectionX * force * 5; // Strength
          const directionY = forceDirectionY * force * 5;

          p.x -= directionX;
          p.y -= directionY;
        } else {
            // Return to base drift slightly
            if (p.x !== p.baseX) {
                p.x -= (p.x - p.baseX) * 0.01;
            }
            if (p.y !== p.baseY) {
                p.y -= (p.y - p.baseY) * 0.01;
            }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#a1054eff';
        ctx.fill();
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(255, 0, 212, 0.15)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Parallax Text Logic
  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);

    const handleMouseMoveDom = (e: MouseEvent) => {
      // Compute logo tilt relative to logo center
      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2); // -1 .. 1
      const dy = (e.clientY - cy) / (rect.height / 2); // -1 .. 1
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      const maxDeg = 8; // maximum tilt in degrees
      const maxTranslate = 10; // px translation for subtle follow
      const rotY = clamp(dx) * maxDeg;
      const rotX = -clamp(dy) * maxDeg;
      const tx = clamp(dx) * maxTranslate;
      const ty = clamp(dy) * maxTranslate;
      setTilt({ x: rotX, y: rotY, tx, ty });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMoveDom);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMoveDom);
      setTilt({ x: 0, y: 0, tx: 0, ty: 0 });
    };
  }, []);

  // Track mobile breakpoint so we can disable/limit heavy parallax on small screens
  useEffect(() => {
    const mm = () => window.innerWidth < 768;
    const onResize = () => setIsMobile(mm());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Scroll indicator: show after 7s if user hasn't scrolled; hide on any scroll
  useEffect(() => {
    // start a 7s timer to show the indicator
    indicatorTimerRef.current = window.setTimeout(() => setShowIndicator(true), 7000) as unknown as number;

    const handleUserScroll = () => {
      // user scrolled, hide indicator and clear timer
      if (indicatorTimerRef.current) {
        window.clearTimeout(indicatorTimerRef.current as number);
        indicatorTimerRef.current = null;
      }
      setShowIndicator(false);
      // remove listener after first scroll
      window.removeEventListener('scroll', handleUserScroll);
    };

    window.addEventListener('scroll', handleUserScroll, { passive: true });

    return () => {
      if (indicatorTimerRef.current) window.clearTimeout(indicatorTimerRef.current as number);
      window.removeEventListener('scroll', handleUserScroll);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden px-6 bg-studio-black">

      {/* Fixed hero overlay */}
      {/* Make this absolutely positioned so it is clipped by the hero section. */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        {/* Interactive Mesh Background */}
        <canvas 
          ref={canvasRef} 
          // Keep the particle canvas fixed so it spans the viewport and can appear
          // behind later sections (contact, etc.). Pointer events disabled.
          className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        />

        {/* Visual container — interactive children will enable pointer events */}
        <div 
          ref={containerRef}
          className="relative z-10 text-center flex flex-col items-center pointer-events-none w-full"
          style={{ 
            // Disable or cap translateY on mobile so the hero doesn't slide off-screen.
            transform: `translateY(${isMobile ? 0 : Math.min(offset * 0.4, 160)}px)` 
          }} 
        >
        
        {/* Main Logo Image */}
        <div className="mb-12 w-[300px] md:w-[700px] lg:w-[800px] animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div
            ref={logoRef}
            className="pointer-events-auto will-change-transform"
            style={{
              transform: `perspective(800px) translate3d(${tilt.tx}px, ${tilt.ty}px, 0) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 140ms ease-out',
              transformStyle: 'preserve-3d'
            }}
          >
            <Logo variant="full" />
          </div>
        </div>
        
        <div className="max-w-xl text-gray-400 text-lg md:text-xl leading-relaxed animate-fade-in-up mb-12 opacity-0 flex flex-col items-center" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <span className="mb-2">Just a nerd with a computer</span>
            <div className="pointer-events-auto">
                <ScrambleText
                  text={[
                    "Call me Cadan :)",
                    "Questions? — shelfstudios@gmail.com",
                    "Wow isnt this cool",
                    "I don't make shelves",
                    "062",
                    "Cadan is a genius -Einstein Probably"
                  ]}
                  className="text-accent"
                  hover={true}
                />
            </div>
        </div>

        <div className="animate-fade-in-up opacity-0 pointer-events-auto" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
            <a 
                href="#work"
                className="group relative inline-block border border-white/20 px-10 py-4 text-sm tracking-widest uppercase text-white overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-glow"
            >
                <span className="relative z-10 font-bold group-hover:text-black transition-colors duration-300">View Projects</span>
                <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </a>
        </div>
        </div>
        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 z-10 transition-opacity duration-500 flex flex-col items-center ${showIndicator ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <span className="text-[10px] uppercase tracking-widest mb-2 block text-center">Scroll</span>
          <svg className="block mx-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
