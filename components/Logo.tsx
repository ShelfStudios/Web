
import React, { useState, useEffect } from 'react';

interface LogoProps {
    className?: string;
    variant?: 'full' | 'icon';
    disableGlow?: boolean;
    size?: string;
    skipReveal?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", variant = 'full', disableGlow = false, size = 'h-12', skipReveal = false }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (skipReveal) {
            setLoaded(true);
            return;
        }
        // Trigger animation after mount
        const timer = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(timer);
    }, [skipReveal]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
        {!disableGlow && (
            /* Backing Glow for dark mode integration */
            <div className={`absolute inset-0 bg-accent/0 blur-[90px] rounded-full transition-opacity duration-[2000ms] ${loaded ? 'opacity-40' : 'opacity-0'}`}></div>
        )}
        
        {/* 
            Container for the Apple-style smooth reveal 
            - Starts slightly larger (scale-110)
            - Starts blurry (blur-lg)
            - Starts transparent (opacity-0)
            - Transitions to clean, sharp state
        */}
        <div 
            className={`
                relative transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                ${loaded ? 'opacity-100 blur-0 scale-100 translate-y-0' : 'opacity-0 blur-xl scale-110 translate-y-4'}
            `}
        >
            {
                // Resolve asset path at build/runtime so it works both locally and when
                // the site is hosted on GitHub Pages under a subpath.
            }
            <img 
                src={new URL('../Assets/logo.png', import.meta.url).href}
                alt="ShelfStudios Logo" 
                className={`
                    object-contain ${!disableGlow ? 'drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]' : ''}
                    ${variant === 'full' ? 'h-auto w-full max-h-[600px]' : `${size} w-auto`}
                `}
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />
        </div>
    </div>
  );
};

export default Logo;
