
import React, { useState, useEffect, useRef } from 'react';

interface ScrambleTextProps {
  text: string | string[];
  className?: string;
  hover?: boolean;
  intervalMs?: number;
  step?: number;
}

const chars = "!@#$%^&*()_+-=[]{}|;':,./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const mobileChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className = "", hover = false, intervalMs = 50, step = 0.5 }) => {
  const messages = Array.isArray(text) ? text : [text];
  const targetRef = useRef<string>(messages[0]);
  const [display, setDisplay] = useState<string>(targetRef.current);
  const intervalRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const displayRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mm = window.matchMedia('(max-width: 767px)');
    const onChange = () => setIsMobile(mm.matches);
    onChange();
    mm.addEventListener?.('change', onChange);
    return () => mm.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    if (!isMobile || !displayRef.current) return;

    const updateScale = () => {
      const element = displayRef.current;
      if (!element) return;

      const viewportWidth = window.innerWidth;
      const maxWidth = viewportWidth * 0.9;
      const elementWidth = element.scrollWidth;

      if (elementWidth > maxWidth) {
        const calculatedScale = maxWidth / elementWidth;
        setScale(Math.max(0.6, Math.min(1, calculatedScale)));
      } else {
        setScale(1);
      }
    };

    updateScale();

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateScale);
    });

    if (displayRef.current) {
      resizeObserver.observe(displayRef.current);
    }

    window.addEventListener('resize', updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [isMobile, display]);

  const scramble = (to?: string) => {
    const target = to ?? targetRef.current;
    let iteration = 0;

    if (intervalRef.current) window.clearInterval(intervalRef.current as number);

    const length = Math.max(1, target.length);
    const lengthFactor = Math.min(3, Math.max(0.6, length / 20));
    const localStep = step * lengthFactor;
    const localIntervalMs = Math.max(8, Math.round(intervalMs / lengthFactor));

    const charSet = isMobile ? mobileChars : chars;
    
    intervalRef.current = window.setInterval(() => {
      setDisplay(
        target
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return target[index];
            }
            return charSet[Math.floor(Math.random() * charSet.length)];
          })
          .join("")
      );

      if (iteration >= target.length) {
        if (intervalRef.current) window.clearInterval(intervalRef.current as number);
        setDisplay(target);
      }

      iteration += localStep;
    }, localIntervalMs) as unknown as number;
  };

  useEffect(() => {
    const pickInitial = () => {
      if (messages.length === 1) return messages[0];
      const idx = Math.floor(Math.random() * messages.length);
      return messages[idx];
    };

    const initial = pickInitial();
    targetRef.current = initial;
    setDisplay(initial);
    scramble(initial);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current as number);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const autoRef = useRef<number | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mm = window.matchMedia('(max-width: 767px)');

    const startAuto = () => {
      if (autoRef.current) return;
      autoRef.current = window.setInterval(() => {
        if (isHovered) return;
        if (messages.length <= 1) return;

        let next = targetRef.current;
        let attempts = 0;
        while (next === targetRef.current && attempts < 10) {
          next = messages[Math.floor(Math.random() * messages.length)];
          attempts += 1;
        }

        targetRef.current = next;
        scramble(next);
      }, 4000) as unknown as number;
    };

    const stopAuto = () => {
      if (autoRef.current) {
        window.clearInterval(autoRef.current as number);
        autoRef.current = null;
      }
    };

    if (mm.matches) startAuto();

    const onChange = () => {
      if (mm.matches) startAuto(); else stopAuto();
    };

    try {
      mm.addEventListener?.('change', onChange);
    } catch (err) {
      try {
        // @ts-ignore
        mm.addListener?.(onChange);
      } catch (e) {
        console.warn('matchMedia change listener could not be attached', e);
      }
    }

    window.addEventListener('resize', onChange);

    return () => {
      stopAuto();
      try { mm.removeEventListener?.('change', onChange); } catch (e) { try { mm.removeListener?.(onChange); } catch (ee) {/* ignore */} }
      window.removeEventListener('resize', onChange);
    };
  }, [messages, isHovered]);

  
  const handleMouseEnter = () => {
    if (hover) {
        setIsHovered(true);
        if (messages.length === 1) {
          targetRef.current = messages[0];
          scramble();
          return;
        }
        let next = targetRef.current;
        let attempts = 0;
        while (next === targetRef.current && attempts < 10) {
          next = messages[Math.floor(Math.random() * messages.length)];
          attempts += 1;
        }
        targetRef.current = next;
        scramble(next);
    }
  };

  return (
    <span 
        ref={displayRef}
        className={`${className} ${isMobile ? 'inline-block mobile-scramble-text' : 'inline-block'} font-mono`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        style={isMobile ? {
          display: 'inline-block',
          textAlign: 'center',
          transform: scale < 1 ? `scale(${scale})` : 'none',
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease-out'
        } : {}}
    >
      {display}
    </span>
  );
};

export default ScrambleText;
