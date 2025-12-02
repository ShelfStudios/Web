import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';

const Sitemap: React.FC = () => {
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

  return (
    <section id="sitemap" className="relative bg-black min-h-screen overflow-visible">
      <canvas ref={canvasRef} className="absolute left-0 top-0 w-full z-0 opacity-40 pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-8 md:pt-12 pb-12 md:pb-20">
        <div className="transition-fade">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Logo variant="icon" size="h-20" />
            </div>
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-gray-200 hover:text-accent">Home</Link>
              <Link to="/projects" className="text-accent font-medium">Projects</Link>
            </nav>
          </header>
          <h1 className="text-4xl font-serif italic text-white mb-4">Sitemap</h1>
          <p className="text-gray-400">Quick links to the main site pages:</p>

          <div className="mt-6">
            <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-3">Pages</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
              <li><Link to="/" className="hover:text-accent">Home</Link></li>
              <li><Link to="/projects" className="hover:text-accent">Projects</Link></li>
              <li><Link to="/privacy" className="hover:text-accent">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-accent">Terms</Link></li>
            </ul>
          </div>
          <div className="mt-8">
            <Link to="/" className="text-accent">← Back to home</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sitemap;
