'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function Logo({ variant = 'light', className = '' }: LogoProps) {
  const isDark = variant === 'dark';

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 max-w-full overflow-hidden shrink-0 group ${className}`}
    >
      {/* Official Full Circular NACOS Emblem Seal */}
      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white border border-emerald-500/40 shadow-sm flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-200">
        <div className="w-full h-full rounded-full overflow-hidden relative flex items-center justify-start">
          <Image
            src="/logos/nacos-logo.png"
            alt="NACOS Seal Emblem"
            width={96}
            height={96}
            className="h-full w-auto max-w-none object-contain object-left"
            priority
          />
        </div>
      </div>

      <div className="flex flex-col text-left min-w-0 flex-1">
        <span className={`font-black text-xl tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
          CSDSIMS
        </span>
        <span className={`text-[9.5px] font-mono tracking-wider uppercase font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
          MAPOLY CS Dept.
        </span>
      </div>
    </Link>
  );
}
