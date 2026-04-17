
import React from 'react';

interface LogoProps {
  className?: string;
  theme?: 'day' | 'night';
}

export const Logo: React.FC<LogoProps> = ({ className = "", theme = 'day' }) => {
  const textColor = theme === 'day' ? 'text-slate-900' : 'text-white';
  const accentColor = theme === 'day' ? 'text-blue-600' : 'text-orange-500';

  return (
    <div className={`inline-flex items-center justify-center gap-3 select-none font-black w-fit mx-auto ${className} ${textColor}`}>
      {/* Arabic Word - Right side in RTL */}
      <span className="text-3xl md:text-4xl tracking-tight leading-none">معلم</span>
      
      {/* Centered Plus Sign - Using a box to force geometry */}
      <div className={`flex items-center justify-center h-10 w-10 transition-colors duration-500 ${accentColor}`}>
        <span className="text-5xl md:text-6xl mb-2">+</span>
      </div>
      
      {/* English Word - Left side in RTL */}
      <span className={`text-3xl md:text-4xl tracking-tighter transition-colors duration-500 font-sans leading-none ${accentColor}`}>
        Plus
      </span>
    </div>
  );
};

export const THEME_COLORS = {
  day: {
    bg: 'bg-[#fdfbf7]',
    card: 'bg-white',
    text: 'text-slate-900',
    primary: 'bg-blue-600', 
    accent: 'bg-blue-600', 
    border: 'border-orange-100',
    input: 'bg-gray-50',
    secondary: 'text-blue-600',
    muted: 'text-slate-500'
  },
  night: {
    bg: 'bg-[#0a0a0a]',
    card: 'bg-[#161616]',
    text: 'text-gray-100',
    primary: 'bg-orange-600', 
    accent: 'bg-orange-600', 
    border: 'border-gray-800',
    input: 'bg-gray-800',
    secondary: 'text-orange-500',
    muted: 'text-gray-400'
  }
};
