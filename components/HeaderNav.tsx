'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Search, UserCircle, Clock, Phone, Mail } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Features', href: '/#features' },
  { label: 'Roles', href: '/#roles' },
  { label: 'Contact', href: '/#contact' },
];

export function HeaderNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar — Forest Green */}
      <div className="nacos-topbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white/90">
            <span className="font-semibold text-[11px] uppercase tracking-wide">Follow Us:</span>
            <div className="flex items-center gap-2">
              <a href="https://nacosmapoly.com" target="_blank" rel="noreferrer"
                className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all text-[10px] font-bold">f</a>
              <a href="https://nacosmapoly.com" target="_blank" rel="noreferrer"
                className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all text-[10px] font-bold">in</a>
              <a href="https://nacosmapoly.com" target="_blank" rel="noreferrer"
                className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all text-[10px] font-bold">ig</a>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-white/85 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Session — 2025 / 2026
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> +234 909 346 3811
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> csdsims@mapoly.edu.ng
            </span>
          </div>
        </div>
      </div>

      {/* Main header — White */}
      <div className="nacos-header">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logos/nacos-logo.png"
              alt="NACOSMAPOLY Logo"
              width={180}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold text-ink-muted hover:text-nacos-green transition-colors rounded-lg hover:bg-nacos-green-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex w-8 h-8 items-center justify-center text-ink-muted hover:text-nacos-green transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <Link href="/login" className="btn-primary text-sm py-2 px-5 hidden sm:inline-flex">
              <UserCircle className="w-4 h-4" />
              Student Portal
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-nacos-green-light text-nacos-green-dark">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-border bg-white px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-ink-muted hover:bg-nacos-green-light hover:text-nacos-green-dark transition-all">
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border">
              <Link href="/login" className="btn-primary w-full justify-center text-sm">
                <UserCircle className="w-4 h-4" /> Student Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
