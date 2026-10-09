import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isDark?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  isDark = false,
  className = '',
}) => {
  // Dimensions
  const iconDimensions = {
    sm: { w: 32, h: 32 },
    md: { w: 42, h: 42 },
    lg: { w: 64, h: 64 },
    xl: { w: 96, h: 96 },
  }[size];

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }[size];

  const subtextSizeClasses = {
    sm: 'text-[9px] tracking-widest',
    md: 'text-[10px] tracking-widest',
    lg: 'text-xs tracking-widest',
    xl: 'text-sm tracking-widest',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 3D Chef-Hat S Emblem */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center transition-transform hover:scale-105"
        style={{ width: iconDimensions.w, height: iconDimensions.h }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Defs for gradients & shadows */}
          <defs>
            <linearGradient id="starchesOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA048" />
              <stop offset="50%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#E55500" />
            </linearGradient>
            <linearGradient id="starchesShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D94E00" />
              <stop offset="100%" stopColor="#A83200" />
            </linearGradient>
            <filter id="hatShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Speed / motion swoosh lines on the left */}
          <path
            d="M 12 36 L 24 36"
            stroke="#FF6B00"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 8 46 L 22 46"
            stroke="#FF6B00"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 14 56 L 26 56"
            stroke="#FF6B00"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* 3D Dynamic 'S' Ribbon Body */}
          <path
            d="M 68 28 C 55 24 38 27 34 38 C 30 49 46 53 58 57 C 72 61 74 76 63 84 C 52 92 34 90 26 80"
            stroke="url(#starchesShadowGrad)"
            strokeWidth="15"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 66 26 C 54 22 38 25 34 36 C 30 47 46 51 58 55 C 72 59 74 74 63 82 C 52 90 34 88 26 78"
            stroke="url(#starchesOrangeGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          {/* Subtle glossy 3D highlight */}
          <path
            d="M 60 25 C 50 23 40 26 36 34"
            stroke="#FFE3C2"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* White Chef's Hat perched on top of S */}
          <g filter="url(#hatShadow)" transform="translate(42, 10) rotate(-6)">
            {/* Hat puffs */}
            <path
              d="M 14 18 C 10 14 12 6 20 6 C 24 2 34 2 38 6 C 44 4 48 10 46 16 C 50 20 46 26 40 26 L 16 26 C 12 26 10 21 14 18 Z"
              fill="#FFFFFF"
            />
            {/* Hat brim band */}
            <rect
              x="16"
              y="23"
              width="26"
              height="6"
              rx="2.5"
              fill="#F0EFE9"
              stroke="#D6D3CD"
              strokeWidth="0.8"
            />
            {/* Hat crease lines */}
            <path
              d="M 23 11 C 24 16 25 21 25 24"
              stroke="#E2DFD8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 33 10 C 33 15 32 20 32 24"
              stroke="#E2DFD8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* Typography Brand Mark */}
      {variant !== 'icon' && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center">
            <span
              className={`font-black tracking-tight ${textSizeClasses} ${
                isDark ? 'text-white' : 'text-[#1A1D20]'
              }`}
              style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
            >
              starches
            </span>
          </div>
          <div className="flex items-center gap-1.5 -mt-1">
            <span className="h-[1.5px] w-2.5 bg-[#FF6B00] rounded-full inline-block"></span>
            <span
              className={`font-bold uppercase text-[#FF6B00] ${subtextSizeClasses}`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              FOOD DELIVERY
            </span>
            <span className="h-[1.5px] w-2.5 bg-[#FF6B00] rounded-full inline-block"></span>
          </div>
        </div>
      )}
    </div>
  );
};
