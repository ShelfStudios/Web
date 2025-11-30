
import React, { useState, useEffect, useRef } from 'react';

interface ScrambleTextProps {
  text: string | string[]; // single or multiple messages
  className?: string;
  hover?: boolean;
  intervalMs?: number; // milliseconds between scramble frames (smaller = faster)
  step?: number; // how much to advance per tick (larger = faster reveal)
}

const chars = "!@#$%^&*()_+-=[]{}|;':,./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className = "", hover = false, intervalMs = 50, step = 0.5 }) => {
  const messages = Array.isArray(text) ? text : [text];
  const targetRef = useRef<string>(messages[0]);
  const [display, setDisplay] = useState<string>(targetRef.current);
  const intervalRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const scramble = (to?: string) => {
    const target = to ?? targetRef.current;
    let iteration = 0;

    if (intervalRef.current) window.clearInterval(intervalRef.current as number);

    // Adjust speed based on message length: longer messages reveal faster
    const length = Math.max(1, target.length);
    const lengthFactor = Math.min(3, Math.max(0.6, length / 20)); // scale based on length, clamped
    const localStep = step * lengthFactor; // larger step => faster reveal
    const localIntervalMs = Math.max(8, Math.round(intervalMs / lengthFactor)); // smaller interval => faster updates

    intervalRef.current = window.setInterval(() => {
      setDisplay(
        target
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return target[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
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
    // On mount: pick a random message and animate to it once
    const pickInitial = () => {
      if (messages.length === 1) return messages[0];
      const idx = Math.floor(Math.random() * messages.length);
      return messages[idx];
    };

    const initial = pickInitial();
    targetRef.current = initial;
    setDisplay(initial);
    // always animate once on load so a random message reveals on page load
    scramble(initial);

    // cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current as number);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mobile-only: auto-refresh scramble every 5s
  const autoRef = useRef<number | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mm = window.matchMedia('(max-width: 767px)');

    const startAuto = () => {
      if (autoRef.current) return;
      autoRef.current = window.setInterval(() => {
        if (isHovered) return; // avoid interrupting hover-driven scrambles
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

    // start only if currently on mobile
    if (mm.matches) startAuto();

    const onChange = () => {
      if (mm.matches) startAuto(); else stopAuto();
    };

    try {
      mm.addEventListener?.('change', onChange);
    } catch (err) {
      // some environments may not support addEventListener on MediaQueryList
      try {
        // @ts-ignore - legacy API
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
        // pick a random message different from current
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
        className={`${className} inline-block font-mono`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
    >
      {display}
    </span>
  );
};

export default ScrambleText;
