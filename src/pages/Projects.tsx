import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects, TiltCard } from '../../components/Work';
import Logo from '../../components/Logo';

const Projects: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, height);
    canvas.width = width;
    canvas.height = docHeight;
    canvas.style.height = docHeight + 'px';

    const particles: { x: number; y: number; vx: number; vy: number; baseX: number; baseY: number }[] = [];
    const perScreenCount = width < 768 ? 50 : 100;
    const particleCount = Math.max(10, Math.ceil(perScreenCount * (docHeight / Math.max(1, height))));
    const connectionDistance = 150;
    const mouseRadius = 200;

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * docHeight;
      particles.push({ x, y, baseX: x, baseY: y, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let rafId = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, docHeight);

      const viewportTop = window.scrollY || 0;
      const viewportBottom = viewportTop + height;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > docHeight) p.vy *= -1;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          const forceDirectionX = dx / (distance || 1);
          const forceDirectionY = dy / (distance || 1);
          const force = (mouseRadius - distance) / mouseRadius;
          const directionX = forceDirectionX * force * 5;
          const directionY = forceDirectionY * force * 5;

          p.x -= directionX;
          p.y -= directionY;
        } else {
          if (p.x !== p.baseX) p.x -= (p.x - p.baseX) * 0.01;
          if (p.y !== p.baseY) p.y -= (p.y - p.baseY) * 0.01;
        }

        if (p.y > viewportTop - 10 && p.y < viewportBottom + 10) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#bd1b9ac5';
          ctx.fill();
        }
      });

      ctx.strokeStyle = 'rgba(255, 0, 212, 0.12)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const sx = particles[i].x;
          const sy = particles[i].y;
          const tx = particles[j].x;
          const ty = particles[j].y;

          if (sy < viewportTop - connectionDistance || sy > viewportBottom + connectionDistance) continue;
          if (ty < viewportTop - connectionDistance || ty > viewportBottom + connectionDistance) continue;

          const dx = sx - tx;
          const dy = sy - ty;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(tx, ty);
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, height);
      canvas.width = width;
      canvas.height = docHeight;
      canvas.style.height = docHeight + 'px';
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);
  const cardEls = useRef<Record<number, HTMLDivElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [activeMap, setActiveMap] = useState<Record<number, boolean>>({});

  

  // IntersectionObserver: mark cards as active when >50% visible
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        setActiveMap((prev) => {
          const next = { ...prev };
          entries.forEach((entry) => {
            const idStr = entry.target.getAttribute?.('data-project-id');
            if (!idStr) return;
            const id = parseInt(idStr, 10);
            next[id] = (entry.intersectionRatio || 0) > 0.5;
          });
          return next;
        });
      },
      { threshold: [0, 0.5, 1] }
    );

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

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

  return (
    <section id="projects" className="relative bg-black min-h-screen md:h-screen overflow-visible">
      <canvas ref={canvasRef} className="absolute left-0 top-0 w-full z-0 opacity-40 pointer-events-none" />
      {/* Page-specific CSS overrides to remove card shadow on this page only */}
      <style>{`#projects .shadow-2xl{box-shadow:none !important;} #projects .bg-studio-zinc{background:transparent !important;}`}</style>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8 md:pt-12 pb-12 md:pb-20">
        <div className="transition-fade">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Logo variant="icon" size="h-20" />
            </div>
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-gray-200 hover:text-accent">Home</Link>
            </nav>
          </header>
          <h1 className="text-5xl md:text-6xl font-serif italic text-white mb-4">Projects</h1>
          <p className="text-gray-400 max-w-2xl">All projects uploaded to the website :)</p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {projects.map((project, idx) => {
              let override: string | undefined = undefined;
              // Explicit override for LinkTree project to use 'Project Card 2.png'
              if (project.title === 'LinkTree' || project.id === 2) {
                override = new URL('../../Projects/Linktree/Project Card 2.png', import.meta.url).href;
              } else if (project.imageUrl.includes('Project Card.png')) {
                override = project.imageUrl.replace('Project Card.png', 'Project Card 2.png');
              }

              return (
                <div key={project.id} className="w-full flex justify-center">
                  <TiltCard project={project} idx={idx} isActive={false} compact disableGreyscale hideArrow imageOverride={override} hideOverlay />
                </div>
              );
            })}
          </div>

          <div className="mt-12">
            <Link to="/" className="text-accent">← Back to home</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
