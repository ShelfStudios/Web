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
      entries.forEach(entry => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
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
  #contact .reveal { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .7s cubic-bezier(.16,1,.3,1); }
  #contact .reveal.active { opacity: 1; transform: translateY(0); }

  #contact .info-item { transform: translateX(-8px); transition: transform .6s cubic-bezier(.16,1,.3,1); }
  #contact .reveal.active .info-item { transform: translateX(0); }

  #contact .social-list { display: flex; flex-direction: column; gap: .8rem; }


  #contact .social-offset {
    position: relative;
    top: 15px; 
  }

  @media (max-width: 768px) {
    #contact .social-offset {
      top: 0;
    }
  }

  #contact .social-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: .55rem 1rem;
    border-radius: .6rem;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.03);
    color: white;
    font-weight: 700;
    font-size: 1.05rem;
    width: 9.2rem;
    transition: transform .18s ease, box-shadow .18s ease, background .12s ease;
    margin-bottom: 0.9rem;
  }

  #contact .social-btn.email:hover {
    box-shadow: 
        0 0 22px rgba(229, 255, 0, 0.75),
        0 0 45px rgba(217, 255, 0, 0.3);
    transform: translateY(-4px);
    background: linear-gradient(90deg, rgba(255, 251, 0, 0.1), rgba(205, 220, 0, 0.06));
  }

  #contact .social-btn.ig:hover {
    box-shadow:
      0 0 22px rgba(225,48,108,0.75),
      0 0 45px rgba(131,58,180,0.26);
    transform: translateY(-4px);
    background: linear-gradient(90deg, rgba(225,48,108,0.1), rgba(131,58,180,0.06));
  }

  #contact .social-btn.lt:hover {
    box-shadow:
      0 0 22px rgba(0,200,83,0.75),
      0 0 45px rgba(0,150,60,0.26);
    transform: translateY(-4px);
    background: linear-gradient(90deg, rgba(0,200,83,0.1), rgba(0,150,60,0.06));
  }

  #contact .social-btn.x:hover {
    box-shadow:
      0 0 22px rgba(29,160,242,0.75),
      0 0 45px rgba(29,161,242,0.25);
    transform: translateY(-4px);
    background: linear-gradient(90deg, rgba(29,161,242,0.1), rgba(10,120,200,0.06));
  }

  @media (min-width: 768px) {
    #contact .social-list {
      flex-direction: row;
      gap: 1rem;
    }
  }

  @media (max-width: 640px) {

    #contact .social-btn {
      width: 100%;
      margin-bottom: 1.1rem;
      transform: none !important;
    }

    #contact .social-btn.email {
      box-shadow:
        0 0 22px rgba(229, 255, 0, 0.75),
        0 0 45px rgba(217, 255, 0, 0.3);
      background: linear-gradient(90deg, rgba(255, 251, 0, 0.1), rgba(205, 220, 0, 0.06));
    }
    #contact .social-btn.ig {
      box-shadow:
        0 0 22px rgba(225,48,108,0.75),
        0 0 45px rgba(131,58,180,0.25);
      background: linear-gradient(90deg, rgba(225,48,108,0.1), rgba(131,58,180,0.06));
    }
    #contact .social-btn.lt {
      box-shadow:
        0 0 22px rgba(0,200,83,0.75),
        0 0 45px rgba(0,150,60,0.25);
      background: linear-gradient(90deg, rgba(0,200,83,0.1), rgba(0,150,60,0.06));
    }
    #contact .social-btn.x {
      box-shadow:
        0 0 22px rgba(29,160,242,0.75),
        0 0 45px rgba(29,161,242,0.25);
      background: linear-gradient(90deg, rgba(29,161,242,0.1), rgba(10,120,200,0.06));
    }
  }
`}</style>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <div className="reveal info-item">
            <h2 className="text-4xl md:text-5xl font-serif italic mb-2">Contact</h2>
            <p className="text-accent font-mono uppercase tracking-widest text-xs mb-6">
              Get in touch for enquiries
            </p>

            <div className="hidden md:block mb-4">
              <br /><br />
            </div>

            <p className="text-2xl border-b border-white/20 pb-1 inline-block hover:text-accent hover:border-accent transition-all cursor-pointer">
              Cadan@ShelfStudios.uk
            </p>
          </div>

          <div className="reveal social-list social-offset md:self-end md:items-end flex flex-col items-start md:items-end gap-4">

            <a href="mailto:Cadan@ShelfStudios.uk" 
               className="social-btn email"
               aria-label="Email ShelfStudios">
              Email
            </a>

            <a href="https://instagram.com/shelfstudiosuk" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="social-btn ig">
              Instagram
            </a>

            <a href="https://linktr.ee/shelfstudios" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="social-btn lt">
              LinkTree
            </a>

            <a href="https://x.com/ShelfStudiosUK" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="social-btn x">
              X
            </a>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
