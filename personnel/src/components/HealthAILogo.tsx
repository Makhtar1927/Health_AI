import React from 'react';
import Image from 'next/image';

interface HealthAILogoProps {
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  pulse?: boolean;
  withText?: boolean;
  subtitle?: string;
  variant?: 'light' | 'dark';
}

export default function HealthAILogo({
  size = 'md',
  className = '',
  pulse = false,
  withText = false,
  subtitle = 'Portail Professionnel Santé',
  variant = 'light',
}: HealthAILogoProps) {
  let dimension = 36;
  if (typeof size === 'number') {
    dimension = size;
  } else if (size === 'xs') {
    dimension = 26;
  } else if (size === 'sm') {
    dimension = 32;
  } else if (size === 'md') {
    dimension = 40;
  } else if (size === 'lg') {
    dimension = 48;
  } else if (size === 'xl') {
    dimension = 60;
  }

  const logoIcon = (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden flex-shrink-0 bg-white shadow-sm border border-slate-200/90 transition-transform ${
        pulse ? 'animate-pulse' : ''
      }`}
      style={{ width: dimension, height: dimension }}
    >
      <Image
        src="/HealthAI_symbole.png"
        alt="Health AI Sénégal"
        width={dimension}
        height={dimension}
        priority
        className="w-full h-full object-contain p-1.5"
      />
    </div>
  );

  if (!withText) {
    return <div className={`inline-flex items-center ${className}`}>{logoIcon}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {logoIcon}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-base sm:text-lg ${variant === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Health<span className="text-emerald-600">AI</span>
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-widest">
            PRO
          </span>
        </div>
        {subtitle && (
          <p className={`text-[10px] font-medium tracking-wide ${variant === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
