import React, { useEffect, useState, useRef } from 'react';
import Logo from './Logo';
import ScrambleText from './ScrambleText';

const Hero: React.FC = () => {
  const offsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, tx: 0, ty: 0 });
  const [showIndicator, setShowIndicator] = useState(false);
  const indicatorTimerRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [allowTextInline, setAllowTextInline] = useState(false);
  const logoWrapperRef = useRef<HTMLDivElement | null>(null);
  const [allowLogoInline, setAllowLogoInline] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    const showDelay = 200;
    const enableInlineDelay = 380;

    const showTimer = window.setTimeout(() => setLogoVisible(true), showDelay) as unknown as number;
    const inlineTimer = window.setTimeout(() => setAllowLogoInline(true), enableInlineDelay) as unknown as number;

    return () => {
      window.clearTimeout(showTimer as number);
      window.clearTimeout(inlineTimer as number);
    };
  }, []);

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
    const particleCount = width < 768 ? 50 : 100;
    const connectionDistance = 150;
    const mouseRadius = 200;

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

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseRadius - distance) / mouseRadius;
          const directionX = forceDirectionX * force * 5;
          const directionY = forceDirectionY * force * 5;

          p.x -= directionX;
          p.y -= directionY;
        } else {
          if (p.x !== p.baseX) p.x -= (p.x - p.baseX) * 0.01;
          if (p.y !== p.baseY) p.y -= (p.y - p.baseY) * 0.01;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#bd1b9ac5';
        ctx.fill();
      });

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

  useEffect(() => {
    const handleScroll = () => {
      targetOffsetRef.current = window.scrollY;
    };

    const handleMouseMoveDom = (e: MouseEvent) => {
      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));

      const maxDeg = 8;
      const maxTranslate = 10;

      const rotY = clamp(dx) * maxDeg;
      const rotX = -clamp(dy) * maxDeg;
      const tx = clamp(dx) * maxTranslate;
      const ty = clamp(dy) * maxTranslate;

      setTilt({ x: rotX, y: rotY, tx, ty });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMoveDom);

    const rafIdRef = { current: 0 } as { current: number };
    let animated = window.scrollY;
    targetOffsetRef.current = animated;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const writeVars = (vars: Record<string, string | number>) => {
      const el = containerRef.current;
      if (!el) return;
      for (const k in vars) el.style.setProperty(k, String(vars[k]));
    };

    let sectionTopCached = 0;
    let aboutTopCached = 0;

    const cachePositions = () => {
      const section = sectionRef.current as HTMLElement | null;
      const aboutEl = document.getElementById('about');
      if (!section || !aboutEl) return;

      const sectionRect = section.getBoundingClientRect();
      const aboutRect = aboutEl.getBoundingClientRect();

      sectionTopCached = window.scrollY + sectionRect.top;
      aboutTopCached = window.scrollY + aboutRect.top;
    };

    cachePositions();
    window.addEventListener('resize', cachePositions);

    const loop = () => {
      const target = targetOffsetRef.current || 0;
      animated = lerp(animated, target, 0.18);

      offsetRef.current = animated;

      let fadeOpacityLocal = 1;
      let hideProgressLocal = 0;

      if (isMobile) {
        fadeOpacityLocal = 1;
        hideProgressLocal = 0;
      } else if (sectionTopCached && aboutTopCached) {
        const fadeStart = sectionTopCached + (aboutTopCached - sectionTopCached) * 0.5;
        const fadeEnd = aboutTopCached;
        const range = fadeEnd - fadeStart;

        if (range <= 0) {
          fadeOpacityLocal = 0;
          hideProgressLocal = 1;
        } else {
          const progress = (animated - fadeStart) / range;
          const clamped = Math.max(0, Math.min(1, progress));
          fadeOpacityLocal = 1 - clamped;
          hideProgressLocal = clamped;
        }
      } else {
        fadeOpacityLocal = Math.max(0.2, 1 - animated / 800);
        hideProgressLocal = Math.min(1, animated / 800);
      }

      const baseMultiplier = isMobile ? 0.25 : 1.2;
      const extraShift = window.innerHeight * 0.9;

      const translated = isMobile
        ? Math.min(animated * baseMultiplier, 220)
        : Math.min(animated * baseMultiplier + hideProgressLocal * extraShift, window.innerHeight * 1.8);

      const blurAmountLocal = Math.pow(hideProgressLocal, 0.6) * 12;
      const brightnessLocal = 1 - hideProgressLocal * 0.6;

      const elementOpacityLocal = Math.max(0, fadeOpacityLocal * (1 - hideProgressLocal * 0.95));
      const logoScaleLocal = 1 - hideProgressLocal * 0.08;
      const logoOffsetYLocal = -hideProgressLocal * 60;
      const textOffsetYLocal = -hideProgressLocal * 40;
      const buttonOffsetYLocal = -hideProgressLocal * 28;

      writeVars({
        '--hero-translate': `${translated}px`,
        '--hero-blur': `${blurAmountLocal}px`,
        '--hero-brightness': String(brightnessLocal),
        '--hero-opacity': String(fadeOpacityLocal),
        '--hero-dim': String(hideProgressLocal * 0.6),
        '--element-opacity': String(elementOpacityLocal),
        '--logo-scale': String(logoScaleLocal),
        '--logo-ty': `${logoOffsetYLocal}px`,
        '--text-ty': `${textOffsetYLocal}px`,
        '--button-ty': `${buttonOffsetYLocal}px`
      });

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    const textEl = textRef.current;
    let animationListener: ((e: AnimationEvent) => void) | null = null;
    let fallbackTimer: number | null = null;
    if (textEl) {
      animationListener = (e: AnimationEvent) => {
        setAllowTextInline(true);
        if (animationListener && textEl) textEl.removeEventListener('animationend', animationListener as any);
        if (fallbackTimer) { window.clearTimeout(fallbackTimer); fallbackTimer = null; }
      };
      textEl.addEventListener('animationend', animationListener as any);

      fallbackTimer = window.setTimeout(() => {
        setAllowTextInline(true);
        if (animationListener && textEl) textEl.removeEventListener('animationend', animationListener as any);
      }, 1200) as unknown as number;
    } else {
      setAllowTextInline(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMoveDom);
      window.removeEventListener('resize', cachePositions);
      cancelAnimationFrame(rafIdRef.current);
      setTilt({ x: 0, y: 0, tx: 0, ty: 0 });
    };
  }, []);

  useEffect(() => {
    const mm = () => window.innerWidth < 768;
    const onResize = () => setIsMobile(mm());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const smoothTransition =
    'transform 320ms cubic-bezier(0.33,1,0.68,1), opacity 220ms linear, filter 220ms linear';

  useEffect(() => {
    indicatorTimerRef.current = window.setTimeout(() => setShowIndicator(true), 7000) as unknown as number;

    const handleUserScroll = () => {
      if (indicatorTimerRef.current) {
        window.clearTimeout(indicatorTimerRef.current as number);
        indicatorTimerRef.current = null;
      }
      setShowIndicator(false);
      window.removeEventListener('scroll', handleUserScroll);
    };

    window.addEventListener('scroll', handleUserScroll, { passive: true });

    return () => {
      if (indicatorTimerRef.current)
        window.clearTimeout(indicatorTimerRef.current as number);
      window.removeEventListener('scroll', handleUserScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden px-6 bg-studio-black">

      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">

        <canvas 
          ref={canvasRef}
          className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        />

        <div
          ref={containerRef}
          className="relative z-0 text-center flex flex-col items-center pointer-events-none w-full"
          style={{
            transform: 'translateY(var(--hero-translate,0px))',
            opacity: 'var(--hero-opacity,1)',
            filter: 'blur(var(--hero-blur,0px)) brightness(var(--hero-brightness,1))',
            willChange: 'transform, opacity, filter',
            transition: 'opacity 220ms linear, transform 160ms linear, filter 220ms linear'
          }}
        >

          <div ref={logoWrapperRef} className="mb-12 w-[300px] md:w-[700px] lg:w-[800px]"
            style={{
              animationFillMode: 'forwards',
              opacity: logoVisible ? '1' : '0',
              transform: logoVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 220ms ease, transform 220ms ease'
            }}>
            <div
              ref={logoRef}
              className="pointer-events-auto will-change-transform"
              style={{
                transform: allowLogoInline
                  ? `translateY(var(--logo-ty,0px)) scale(var(--logo-scale,1)) perspective(800px) translate3d(${tilt.tx}px, ${tilt.ty}px, 0) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                  : undefined,
                transition: smoothTransition,
                transformStyle: 'preserve-3d',
                opacity: 'var(--element-opacity,1)',
                filter: 'brightness(calc(1 - var(--hero-dim)*0.8))'
              }}
            >
              <Logo variant="full" skipReveal />
            </div>
          </div>

          <div
            className="max-w-xl text-gray-400 text-lg md:text-xl leading-relaxed animate-fade-in-up mb-12 flex flex-col items-center"
              ref={textRef}
              style={{
                animationDelay: '0s',
                animationFillMode: 'forwards',
                transform: allowTextInline ? 'translateY(var(--text-ty,0px))' : undefined,
                transition: smoothTransition,
                opacity: 'var(--element-opacity,1)',
                filter: 'brightness(calc(1 - var(--hero-dim)*0.8))'
              }}
          >
            <span className="mb-2">Just a nerd with a computer</span>

            <div
              className="pointer-events-auto"
              style={{
                transition: smoothTransition,
                opacity: 'var(--element-opacity,1)',
                filter: 'brightness(calc(1 - var(--hero-dim)*0.8))'
              }}
            >
              <ScrambleText
                text={[
                  "Call me Cadan :)",
                  "Questions? — shelfstudios@gmail.com",
                  "Wow isnt this cool",
                  "I don't make shelves",
                  "062",
                  "Cadan is a genius -Einstein Probably",
                  "Shelf yourself - Stay a while!",
                  "Shelf: Stronger than your last relationship"
                ]}
                className="text-accent"
                hover={true}
              />
            </div>
          </div>

          <div
            className="animate-fade-in-up pointer-events-auto"
            style={{
              animationDelay: '0.8s',
              animationFillMode: 'both',
              transform: 'translateY(var(--button-ty,0px))',
              transition: smoothTransition,
              opacity: 'var(--element-opacity,1)',
              filter: 'brightness(calc(1 - var(--hero-dim)*0.8))'
            }}
          >
            <a
              href="#work"
              className="group relative inline-block border border-white/20 px-10 py-4 text-sm tracking-widest uppercase text-white overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-glow"
            >
              <span className="relative z-10 font-bold group-hover:text-black transition-colors duration-300">
                View Projects
              </span>
              <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </a>
          </div>
        </div>

        <div
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 z-10 transition-opacity duration-500 flex flex-col items-center ${
            showIndicator ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <span className="text-[10px] uppercase tracking-widest mb-2 block text-center">
            Scroll
          </span>
          <svg
            className="block mx-auto"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
