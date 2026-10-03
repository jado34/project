'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const slides = [
  {
    src: '/images/nacos-ICT-building.jpg',
    label: '8th Governing Council ICT Resource Centre',
    caption: 'MAPOLY ICT Hub — Ojere Campus, Abeokuta',
  },
  {
    src: '/images/images.jpg',
    label: 'Moshood Abiola Polytechnic, Abeokuta',
    caption: 'Computer Science Department · Ojere Campus, Ogun State',
  },
  {
    src: '/images/inner view.jpg',
    label: 'CS Dept. Interior',
    caption: 'Department of Computer Science · Security Tips in Social Media Networks',
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const goTo = useCallback(
    (index: number, dir: 'left' | 'right') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setDirection(dir);
      setTimeout(() => {
        setCurrent(index);
        setIsAnimating(false);
      }, 600);
    },
    [isAnimating]
  );

  const prev = () => goTo((current - 1 + slides.length) % slides.length, 'left');
  const next = useCallback(
    () => goTo((current + 1) % slides.length, 'right'),
    [current, goTo]
  );

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative overflow-hidden bg-black" style={{ minHeight: '90vh' }}>
      {/* ── Slides ── */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-all"
          style={{
            opacity: i === current ? 1 : 0,
            transform:
              i === current
                ? 'scale(1.05)'
                : direction === 'right'
                ? i === (current - 1 + slides.length) % slides.length
                  ? 'scale(1) translateX(-4%)'
                  : 'scale(1.08) translateX(4%)'
                : i === (current + 1) % slides.length
                ? 'scale(1) translateX(4%)'
                : 'scale(1.08) translateX(-4%)',
            transition: 'opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 6s ease-out',
            zIndex: i === current ? 1 : 0,
          }}
        >
          <Image
            src={slide.src}
            alt={slide.label}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* ── Gradient overlays ── */}
      <div className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.20) 100%)',
        }}
      />
      <div className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(to top, rgba(10,26,15,0.95) 0%, rgba(10,26,15,0.3) 40%, transparent 70%)',
        }}
      />
      {/* Animated green accent line */}
      <div
        className="absolute bottom-0 left-0 z-20 h-1 bg-nacos-green"
        style={{
          width: `${((current + 1) / slides.length) * 100}%`,
          transition: 'width 5s linear',
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 flex flex-col justify-center"
        style={{ minHeight: '90vh' }}>
        <div className="max-w-2xl pt-24 pb-32">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-6"
            style={{ animation: 'fadeSlideUp 0.6s ease both', animationDelay: '0.1s' }}
          >
            <span className="flex items-center gap-2 bg-nacos-green/20 border border-nacos-green/50 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-nacos-green animate-pulse" />
              MAPOLY Computer Science Dept. · Session 2025/2026
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6"
            style={{ animation: 'fadeSlideUp 0.7s ease both', animationDelay: '0.2s' }}
          >
            Welcome to{' '}
            <span
              className="text-nacos-green relative inline-block"
              style={{
                textShadow: '0 0 40px rgba(23,185,29,0.4)',
              }}
            >
              CSDSIMS
              {/* Underline accent */}
              <span
                className="absolute -bottom-1 left-0 h-1 bg-nacos-green rounded-full"
                style={{
                  width: '100%',
                  transform: 'scaleX(1)',
                  transition: 'transform 0.3s ease',
                  transformOrigin: 'left',
                }}
              />
            </span>
          </h1>

          {/* Sub */}
          <p
            className="text-lg md:text-xl text-white/75 leading-relaxed mb-8 max-w-xl"
            style={{ animation: 'fadeSlideUp 0.7s ease both', animationDelay: '0.3s' }}
          >
            The official Student Information Management System for the Computer Science
            Department at Moshood Abiola Polytechnic — Abeokuta. One platform for
            registration, results, attendance, and communication.
          </p>

          {/* Bullets */}
          <div
            className="flex flex-col gap-2 mb-8"
            style={{ animation: 'fadeSlideUp 0.7s ease both', animationDelay: '0.4s' }}
          >
            {['Transparent result lifecycle', 'Real-time attendance monitoring', 'Role-based access for every stakeholder'].map((pt) => (
              <div key={pt} className="flex items-center gap-2 text-sm text-white/70">
                <CheckCircle className="w-4 h-4 text-nacos-green shrink-0" />
                {pt}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-3 pt-2"
            style={{ animation: 'fadeSlideUp 0.7s ease both', animationDelay: '0.5s' }}
          >
            <Link
              href="/login"
              className="btn-primary text-sm sm:text-base py-3.5 px-7 shadow-xl hover:shadow-nacos-green/40 hover:-translate-y-0.5 transition-all text-center justify-center font-bold"
            >
              Access Student Portal <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#features"
              className="inline-flex items-center justify-center gap-2 text-sm sm:text-base font-bold py-3.5 px-7 rounded-full border border-white/40 text-white bg-slate-900/60 hover:bg-white hover:text-slate-950 backdrop-blur-md transition-all shadow-lg hover:-translate-y-0.5 text-center"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </div>

      {/* ── Slide caption (bottom right) ── */}
      <div className="absolute bottom-8 right-6 z-20 hidden md:flex items-center gap-2 text-white/60 text-xs font-medium">
        <MapPin className="w-3 h-3 text-nacos-green" />
        <span className="transition-all duration-500">{slides[current].caption}</span>
      </div>

      {/* ── Nav arrows ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 border border-white/20 flex items-center justify-center text-white hover:bg-nacos-green hover:border-nacos-green transition-all backdrop-blur-sm hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 border border-white/20 flex items-center justify-center text-white hover:bg-nacos-green hover:border-nacos-green transition-all backdrop-blur-sm hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 'right' : 'left')}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === current ? '32px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === current ? '#17b91d' : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
