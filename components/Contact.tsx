import React, { useEffect, useRef, useState } from 'react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate send
    setIsSent(true);
    setTimeout(() => {
        setIsSent(false);
        setFormState({ name: '', email: '', message: '' });
        alert("Transmission Received.");
    }, 2000);
  };

        const rootRef = useRef<HTMLElement | null>(null);

        useEffect(() => {
            const root = rootRef.current;
            if (!root) return;
            const reveals = Array.from(root.querySelectorAll('.reveal')) as HTMLElement[];
            const io = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    const el = e.target as HTMLElement;
                    if (e.isIntersecting) {
                        el.classList.add('active');
                        io.unobserve(el);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

            reveals.forEach(r => io.observe(r));
            return () => io.disconnect();
        }, []);

        return (
            <section id="contact" className="py-24 px-6 bg-black text-gray-12 border-t border-white/5" ref={rootRef}>
                <div className="max-w-5xl mx-auto">
                    <style>{`
                        /* Scoped contact styles and animations */
                        #contact .reveal { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .7s cubic-bezier(.16,1,.3,1); }
                        #contact .reveal.active { opacity: 1; transform: translateY(0); }
                        #contact .reveal .stagger > * { opacity: 0; transform: translateY(10px); }
                        #contact .reveal.active .stagger > * { opacity: 1; transform: translateY(0); transition: transform .65s cubic-bezier(.16,1,.3,1) .06s, opacity .5s ease .06s; }

                        /* Split grid item micro-motions */
                        #contact .info-item { transform: translateX(-8px); transition: transform .6s cubic-bezier(.16,1,.3,1); }
                        #contact .reveal.active .info-item { transform: translateX(0); }
                        #contact form .group { transform: translateX(8px); opacity: 0; transition: transform .6s cubic-bezier(.16,1,.3,1), opacity .5s ease; }
                        #contact form.reveal.active .group { transform: translateX(0); opacity: 1; }

                        /* Frosted inputs */
                        #contact .frost { background-color: rgba(0,0,0,0.36); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.02); }
                        #contact .frost:focus { border-color: rgba(0,240,255,1); box-shadow: 0 0 0 6px rgba(0,240,255,0.06), 0 10px 40px -12px rgba(0,240,255,0.12); transition: box-shadow .22s ease, border-color .12s ease; }

                        /* Social buttons */
                        #contact .social-list { display: flex; flex-direction: column; gap: 0.6rem; }
                        #contact .social-btn { display: inline-flex; gap: .3rem; align-items: center; padding: .35rem .7rem; border-radius: .5rem; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color: white; text-decoration: none; font-weight:700; font-size:0.95rem; transition: transform .18s ease, box-shadow .18s ease, background .12s ease; width: 7.2rem; justify-content: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                        #contact .social-btn.ig:hover { box-shadow: 0 12px 44px rgba(201, 17, 78, 0.78), 0 0 80px rgba(225,48,108,0.12); transform: translateY(-4px); background: linear-gradient(90deg, rgba(225,48,108,0.075), rgba(131,58,180,0.05)); }
                        #contact .social-btn.lt:hover { box-shadow: 0 12px 44px rgba(0, 200, 83, 0.81), 0 0 80px rgba(0,200,83,0.09); transform: translateY(-4px); background: linear-gradient(90deg, rgba(0,200,83,0.075), rgba(0,150,60,0.04)); }
                        #contact .social-btn.x:hover { box-shadow: 0 12px 44px rgba(29, 160, 242, 0.75), 0 0 80px rgba(29,161,242,0.09); transform: translateY(-4px); background: linear-gradient(90deg, rgba(29,161,242,0.075), rgba(10,120,200,0.04)); }

                        /* Floating micro-animation (icons removed - kept keyframe for potential use) */
                        @keyframes floaty { 0% { transform: translateY(0) } 50% { transform: translateY(-3px) } 100% { transform: translateY(0) } }

                        /* Minor responsive tweaks */
                        @media (min-width: 768px) { #contact .social-list { align-self: flex-start; } }
                        /* Make social buttons full-width on small screens for accessibility */
                        @media (max-width: 640px) {
                            /* Buttons: full width and centered text */
                            #contact .social-list .social-btn { width: 100%; justify-content: center; padding-left: .9rem; }

                            /* Stack grid into a single column and increase vertical spacing */
                            #contact .grid { grid-template-columns: 1fr; gap: 1.25rem; }

                            /* Center small info blocks and ensure reveal animations don't translate side-to-side */
                            #contact .info-item { transform: none; text-align: center; }
                            #contact .reveal .stagger > * { text-align: center; }

                            /* Make form groups appear naturally stacked and remove the left/right translate used on desktop */
                            #contact form .group { transform: none; opacity: 1; }

                            /* Ensure the container has comfortable padding on small screens */
                            #contact .max-w-5xl { padding-left: 1rem; padding-right: 1rem; }

                            /* Reduce visual density: slightly smaller paddings inside service cards */
                            #contact .group.p-8 { padding: 1rem; }
                        }
                    `}</style>

                    {/* Header */}
                    <div className="text-center mb-10 reveal">
                        <h2 className="text-4xl md:text-5xl font-serif italic mb-2">Contact</h2>
                        <p className="text-accent font-mono uppercase tracking-widest text-xs">Get in touch — let's build something</p>
                    </div>

                    {/* Grid: left = info & socials, right = form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8 reveal stagger">
                            <div className="info-item">
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 font-mono">Email</h3>
                                <p className="text-2xl border-b border-white/20 pb-1 inline-block hover:text-accent hover:border-accent transition-all cursor-pointer">ShelfStudios@gmail.com</p>
                            </div>

                            <div className="info-item">
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 font-mono"></h3>
                                <p className="text-lg text-gray-300"></p>
                            </div>

                            <div className="info-item">
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 font-mono">Network</h3>
                                <div className="social-list">
                                    <a href="https://instagram.com/shelfstudiosuk" target="_blank" rel="noopener noreferrer" className="social-btn ig" aria-label="Instagram - ShelfStudios">
                                            <span>Instagram</span>
                                    </a>

                                    <a href="https://linktr.ee/shelfstudios" target="_blank" rel="noopener noreferrer" className="social-btn lt" aria-label="LinkTree - ShelfStudios">
                                        <span>LinkTree</span>
                                    </a>

                                    <a href="https://x.com/ShelfStudiosUK" target="_blank" rel="noopener noreferrer" className="social-btn x" aria-label="X - ShelfStudios">
                                        <span>X</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6 reveal form stagger">
                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 font-mono">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formState.name}
                                    onChange={e => setFormState({...formState, name: e.target.value})}
                                    className="w-full bg-transparent frost border border-white/10 rounded-md py-3 px-3 focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-accent transition-all text-lg"
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 font-mono">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formState.email}
                                    onChange={e => setFormState({...formState, email: e.target.value})}
                                    className="w-full bg-transparent frost border border-white/10 rounded-md py-3 px-3 focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-accent transition-all text-lg"
                                    placeholder="you@email.com"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 font-mono">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formState.message}
                                    onChange={e => setFormState({...formState, message: e.target.value})}
                                    className="w-full bg-transparent frost border border-white/10 rounded-md py-3 px-3 focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-accent transition-all text-lg resize-none"
                                    placeholder="Tell us about your project..."
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={isSent}
                                    className={`text-accent font-bold uppercase tracking-widest text-sm md:text-base hover:text-white transition-colors ${isSent ? 'opacity-60 pointer-events-none' : ''}`}
                                >
                                    {isSent ? 'Sent' : 'Send'}
                                </button>

                                <div className="text-sm text-gray-500">Or reach out via social links</div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        );
};

export default Contact;