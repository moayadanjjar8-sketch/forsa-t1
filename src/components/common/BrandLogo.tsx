import React from 'react';

export interface BrandLogoProps {
  variant?: 'full' | 'horizontal' | 'sub-logo' | 'icon' | 'radar' | 'merchant' | 'admin' | 'sub';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  theme?: 'dark' | 'light' | 'auto';
  showTagline?: boolean;
  className?: string;
  subLabel?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showTagline = true,
  className = '',
  subLabel
}) => {
  // Dimensions per size
  const iconDimensions = {
    xs: { w: 20, h: 20 },
    sm: { w: 28, h: 28 },
    md: { w: 38, h: 38 },
    lg: { w: 52, h: 52 },
    xl: { w: 72, h: 72 },
    '2xl': { w: 100, h: 100 }
  }[size];

  const titleSizes = {
    xs: 'text-xs tracking-wider',
    sm: 'text-sm tracking-wide',
    md: 'text-lg tracking-wider',
    lg: 'text-2xl tracking-widest',
    xl: 'text-3xl tracking-widest',
    '2xl': 'text-4xl tracking-widest'
  }[size];

  const taglineSizes = {
    xs: 'text-[7px]',
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
    '2xl': 'text-base'
  }[size];

  // The Master Vector Icon of FORSA-T (Gold Location Pin with curved dark highway road through center & golden sun disc)
  const ForsaTIconSvg = ({ width, height, className: svgClassName = '' }: { width: number; height: number; className?: string }) => (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-sm ${svgClassName}`}
    >
      <defs>
        {/* Luxury Gold Gradient */}
        <linearGradient id="forsaGoldGrad" x1="40" y1="20" x2="160" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBD38D" />
          <stop offset="35%" stopColor="#ECC94B" />
          <stop offset="70%" stopColor="#D69E2E" />
          <stop offset="100%" stopColor="#B7791F" />
        </linearGradient>

        {/* Inner Sun Disc Gradient */}
        <radialGradient id="forsaSunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF5DB" />
          <stop offset="45%" stopColor="#ECC94B" />
          <stop offset="100%" stopColor="#C05621" />
        </radialGradient>

        {/* Dark Highway Road Gradient */}
        <linearGradient id="forsaRoadGrad" x1="20" y1="140" x2="140" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E2338" />
          <stop offset="50%" stopColor="#252B48" />
          <stop offset="100%" stopColor="#131726" />
        </linearGradient>

        {/* Road Highlight / Perspective Lane Marker */}
        <linearGradient id="forsaRoadLine" x1="20" y1="135" x2="130" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(236, 201, 75, 0.4)" />
          <stop offset="50%" stopColor="rgba(236, 201, 75, 0.9)" />
          <stop offset="100%" stopColor="rgba(236, 201, 75, 0.3)" />
        </linearGradient>

        {/* Drop Shadow Filter */}
        <filter id="forsaGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ECC94B" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* 1. Golden Location Pin Loop Body */}
      <path 
        d="M100 24C65.758 24 38 51.758 38 86C38 126.5 90 178 100 188C110 178 162 126.5 162 86C162 51.758 134.242 24 100 24ZM100 134C73.49 134 52 112.51 52 86C52 59.49 73.49 38 100 38C126.51 38 148 59.49 148 86C148 112.51 126.51 134 100 134Z" 
        fill="url(#forsaGoldGrad)"
        filter="url(#forsaGlow)"
      />

      {/* 2. Inner Golden Sun / Focus Dot */}
      <circle 
        cx="100" 
        cy="78" 
        r="22" 
        fill="url(#forsaSunGrad)" 
      />

      {/* 3. Sweeping Curved Highway Road passing into the pin */}
      <path 
        d="M24 148C42 136 68 132 88 124C114 113.6 128 98 132 94C122 93 105 97 86 106C62 117.5 38 126 24 148Z" 
        fill="url(#forsaRoadGrad)"
      />

      {/* 4. Secondary Road Underpass Shadow & Perspective Curve */}
      <path 
        d="M22 149C36 138 58 132 82 124C98 118.8 115 110 126 96C112 101 92 110 70 120C48 130 32 140 22 149Z" 
        fill="#0D111E" 
        opacity="0.6"
      />

      {/* 5. Center Road Line Glow (Highway dashes) */}
      <path 
        d="M32 142C56 129 84 120 114 102" 
        stroke="url(#forsaRoadLine)" 
        strokeWidth="2.5" 
        strokeDasharray="5 4" 
        strokeLinecap="round" 
      />
    </svg>
  );

  // Sub-Logo Badge / Monogram View (standalone high-impact icon)
  if (variant === 'sub-logo' || variant === 'icon' || variant === 'sub') {
    return (
      <div className={`inline-flex items-center justify-center relative ${className}`}>
        <ForsaTIconSvg width={iconDimensions.w} height={iconDimensions.h} />
      </div>
    );
  }

  // Variant: Sub-logo with App Sub-Module Badge (Radar, Business Owner, Admin)
  if (variant === 'radar' || variant === 'merchant' || variant === 'admin') {
    const badgeDetails = {
      radar: { label: 'RADAR LIVE', bg: 'bg-amber-50 text-amber-900 border-amber-300' },
      merchant: { label: 'BUSINESS OWNER OPS', bg: 'bg-sky-50 text-sky-900 border-sky-300' },
      admin: { label: 'GOVERNANCE', bg: 'bg-rose-50 text-rose-900 border-rose-300' }
    }[variant];

    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <div className="relative">
          <ForsaTIconSvg width={iconDimensions.w} height={iconDimensions.h} />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-heading font-black text-black ${titleSizes} tracking-wider`}>
              FORSA-T
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border font-mono uppercase ${badgeDetails.bg}`}>
              {subLabel || badgeDetails.label}
            </span>
          </div>
          {showTagline && (
            <span className={`font-mono text-black font-bold uppercase tracking-widest ${taglineSizes}`}>
              Location Intelligence
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full Vertical Brand Lockup (Deep black text for high contrast)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {/* Golden Pin Icon */}
        <ForsaTIconSvg width={iconDimensions.w * 1.5} height={iconDimensions.h * 1.5} />
        
        {/* Brand Name FORSA-T in Solid Black */}
        <h1 className={`font-heading font-black tracking-[0.25em] text-black ${titleSizes} mt-3`}>
          FORSA-T
        </h1>

        {/* Subtitle Tagline in Solid Black */}
        {showTagline && (
          <p className={`font-mono font-bold tracking-[0.22em] text-black uppercase ${taglineSizes} mt-1`}>
            LOCATION. REAL TIME. OPPORTUNITY INTELLIGENCE
          </p>
        )}
      </div>
    );
  }

  // Default: Horizontal Navbar / Header Lockup with Solid Black Typography
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <ForsaTIconSvg width={iconDimensions.w} height={iconDimensions.h} />
      
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className={`font-heading font-black tracking-widest text-black ${titleSizes}`}>
            FORSA-T
          </span>
          {subLabel && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-black border border-amber-300 uppercase font-mono">
              {subLabel}
            </span>
          )}
        </div>

        {showTagline && (
          <span className={`font-mono font-bold tracking-[0.14em] text-black uppercase ${taglineSizes}`}>
            Real Time Opportunity Intelligence
          </span>
        )}
      </div>
    </div>
  );
};
