import React from 'react';

interface PixoraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showBadge?: boolean;
}

export const PixoraLogo: React.FC<PixoraLogoProps> = ({
  size = 'md',
  variant = 'light',
  showBadge = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const isLight = variant === 'light';

  return (
    <div className="flex items-center gap-2.5 select-none group cursor-pointer">
      {/* Light-theme native vector mark: Crisp layered lens with gradient ribbon */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        >
          <defs>
            <linearGradient id="pixora-grad" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#54224A" />
              <stop offset="45%" stopColor="#7D4472" />
              <stop offset="100%" stopColor="#A77A9D" />
            </linearGradient>
            <linearGradient id="pixora-accent" x1="14" y1="6" x2="34" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F9C3A8" />
              <stop offset="100%" stopColor="#EA8A68" />
            </linearGradient>
            <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#54224A" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Clean White Pill Container with gentle border */}
          <rect 
            x="1" 
            y="1" 
            width="38" 
            height="38" 
            rx="11" 
            fill={isLight ? '#FFFAF5' : '#2A0E22'} 
            stroke={isLight ? '#F1DCCB' : '#54224A'} 
            strokeWidth="1.5" 
            filter="url(#soft-shadow)"
          />

          {/* Letter P Ribbon Structure */}
          <path 
            d="M12 10H22C26.4183 10 30 13.5817 30 18C30 22.4183 26.4183 26 22 26H17.5V30H12V10Z" 
            fill="url(#pixora-grad)" 
          />

          {/* Inner Negative Space Loop */}
          <circle cx="21" cy="18" r="4" fill={isLight ? '#FFFAF5' : '#2A0E22'} />

          {/* Precision AI Text Reticle Node */}
          <circle cx="28" cy="12" r="2.2" fill="url(#pixora-accent)" />
          <circle cx="28" cy="12" r="1.2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex items-center gap-1.5">
        <span 
          className={`font-bold tracking-tight ${textSizes[size]} ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
          style={{ letterSpacing: '-0.035em' }}
        >
          Pixora
        </span>

        {showBadge && (
          <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border ${
            isLight 
              ? 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60' 
              : 'bg-indigo-500/10 text-peach-300 border-indigo-500/30'
          }`}>
            AI
          </span>
        )}
      </div>
    </div>
  );
};
