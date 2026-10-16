import React from 'react';
import Image from 'next/image';

interface HealthAILogoProps {
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  pulse?: boolean;
}

export default function HealthAILogo({
  size = 'md',
  className = '',
  pulse = false,
}: HealthAILogoProps) {
  let dimension = 36;
  if (typeof size === 'number') {
    dimension = size;
  } else if (size === 'xs') {
    dimension = 28;
  } else if (size === 'sm') {
    dimension = 32;
  } else if (size === 'md') {
    dimension = 40;
  } else if (size === 'lg') {
    dimension = 48;
  } else if (size === 'xl') {
    dimension = 64;
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0 bg-white shadow-xs border border-slate-200/80 ${
        pulse ? 'animate-pulse' : ''
      } ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <Image
        src="/HealthAI_symbole.png"
        alt="Health AI Sénégal"
        width={dimension}
        height={dimension}
        priority
        className="w-full h-full object-contain p-1"
      />
    </div>
  );
}
