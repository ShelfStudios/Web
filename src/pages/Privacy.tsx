import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';

const Privacy: React.FC = () => {
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
    <section id="privacy" className="relative bg-black min-h-screen overflow-visible">
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
        <h1 className="text-4xl font-serif italic text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-6">Last updated: December 01, 2025</p>

        <section className="mb-6">
          <p className="text-gray-300">ShelfStudios ("we", "us", "our") is committed to protecting your privacy. This Notice explains what information we collect, why we collect it, and how you can exercise your privacy rights. If you have questions, please contact us at <a className="text-accent" href="mailto:cadan@shelfstudios.uk">cadan@shelfstudios.uk</a>.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl text-white mb-2">Quick summary</h2>
          <ul className="list-disc ml-6 text-gray-400">
            <li>We collect information you provide (e.g. contact details) and certain technical information automatically (e.g. IP address, browser).</li>
            <li>We use information to operate and improve our services, respond to enquiries, prevent fraud, and meet legal obligations.</li>
            <li>We do not sell personal data. We may share data with service providers who help deliver the service.</li>
            <li>You may have rights to access, correct, or delete your data depending on your jurisdiction; contact us to exercise these rights.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl text-white mb-2">What information we collect</h2>
          <p className="text-gray-400">We collect information you provide directly (for example when you email us or use a contact form) and certain information automatically when you visit the site.</p>
          <ul className="list-disc ml-6 mt-3 text-gray-400">
            <li>Contact details: name, email address, phone number (if provided).</li>
            <li>Usage and device data: IP address, browser type, device, pages visited and timestamps.</li>
            <li>Any other information you choose to send to us.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl text-white mb-2">How we use your information</h2>
          <p className="text-gray-400">We use personal data to:</p>
          <ul className="list-disc ml-6 mt-3 text-gray-400">
            <li>Provide and maintain our website and services.</li>
            <li>Respond to enquiries, support requests and communications.</li>
            <li>Improve site performance, security and user experience.</li>
            <li>Comply with legal obligations and protect our rights.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl text-white mb-2">Cookies and tracking</h2>
          <p className="text-gray-400">We use cookies and similar technologies for essential site functionality, analytics and (where permitted) for advertising. You can control cookies through your browser settings; some features may require cookies to work correctly.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl text-white mb-2">Sharing and disclosure</h2>
          <p className="text-gray-400">We do not sell personal information. We may share information with third-party service providers who perform services on our behalf (such as analytics) and when required by law or to protect rights and safety.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl text-white mb-2">Data retention and security</h2>
          <p className="text-gray-400">We retain personal data only as long as necessary for the purposes described and to comply with legal obligations. We implement reasonable technical and organisational measures to protect data, but no system is completely secure.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl text-white mb-2">Your rights</h2>
          <p className="text-gray-400">Depending on where you live, you may have rights to access, correct, delete or restrict processing of your personal data. To make a request, contact us at <a className="text-accent" href="mailto:cadan@shelfstudios.uk">cadan@shelfstudios.uk</a>. We will respond in accordance with applicable law.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl text-white mb-2">Changes to this policy</h2>
          <p className="text-gray-400">We may update this policy periodically. The "Last updated" date at the top indicates when it was last revised.</p>
        </section>

        <div className="mt-8">
          <Link to="/" className="text-accent">← Back to home</Link>
        </div>
      </div>
    </div>
    </section>
  );
};

export default Privacy;
