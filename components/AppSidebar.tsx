'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context';
import {
  LayoutDashboard, BookOpen, CalendarCheck, CalendarDays,
  Bell, FolderOpen, Award, Users, CheckCircle2, Shield,
  ChevronRight, LogOut, BarChart3, Radio
} from 'lucide-react';

import { Logo } from './Logo';

const navByRole: Record<string, { href: string; label: string; icon: React.ReactNode }[]> = {
  student: [
    { href: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/student/courses/register', label: 'Course Registration', icon: <BookOpen className="w-4 h-4" /> },
    { href: '/student/results', label: 'CA & Results', icon: <Award className="w-4 h-4" /> },
    { href: '/student/attendance', label: 'Attendance Check-In', icon: <CalendarCheck className="w-4 h-4" /> },
    { href: '/student/timetable', label: 'Timetable', icon: <CalendarDays className="w-4 h-4" /> },
    { href: '/student/materials', label: 'Course Materials', icon: <FolderOpen className="w-4 h-4" /> },
    { href: '/student/announcements', label: 'Announcements', icon: <Bell className="w-4 h-4" /> },
  ],
  lecturer: [
    { href: '/lecturer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/lecturer/courses', label: 'My Courses & Registers', icon: <BookOpen className="w-4 h-4" /> },
    { href: '/lecturer/announcements/new', label: 'Post Announcement', icon: <Bell className="w-4 h-4" /> },
  ],
  adviser: [
    { href: '/adviser/dashboard', label: 'Adviser Center', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/adviser/registrations', label: 'Pending Registrations', icon: <CheckCircle2 className="w-4 h-4" /> },
    { href: '/adviser/students', label: 'Student Cohort', icon: <Users className="w-4 h-4" /> },
  ],
  hod: [
    { href: '/admin/dashboard', label: 'HOD Operations', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/admin/results/approvals', label: 'Broadsheet Approvals', icon: <Award className="w-4 h-4" /> },
    { href: '/admin/users', label: 'User Directory', icon: <Users className="w-4 h-4" /> },
    { href: '/admin/courses', label: 'Course Allocation', icon: <BookOpen className="w-4 h-4" /> },
    { href: '/admin/stats', label: 'Department Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Admin Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/admin/results/approvals', label: 'Broadsheet Approvals', icon: <Award className="w-4 h-4" /> },
    { href: '/admin/users', label: 'User Directory', icon: <Users className="w-4 h-4" /> },
    { href: '/admin/courses', label: 'Course Allocation', icon: <BookOpen className="w-4 h-4" /> },
    { href: '/admin/stats', label: 'Department Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ],
};

export function AppSidebar() {
  const { currentUser, attendanceSessions } = useApp();
  const pathname = usePathname();
  const links = navByRole[currentUser.role] || navByRole.student;

  const activeSessions = attendanceSessions.filter((s) => s.isActive);

  return (
    <aside className="app-sidebar hidden md:flex flex-col w-60 min-h-screen shrink-0 border-r border-slate-200/80 bg-white/80 backdrop-blur-lg">
      {/* Logo Header */}
      <div className="px-4 py-3.5 border-b border-slate-200/80 flex items-center justify-between overflow-hidden min-h-[64px] shrink-0">
        <Logo variant="light" className="max-w-full" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
          Navigation Surface
        </div>

        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 ${isActive
                  ? 'bg-slate-900 text-emerald-400 font-bold shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>{link.icon}</span>
              <span className="flex-1 truncate">{link.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </Link>
          );
        })}

        {/* Live Active Session HUD Callout */}
        {activeSessions.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950 text-parchment border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Live Hall Session</span>
            </div>
            <p className="text-[11px] font-mono text-slate-300 leading-tight">
              {activeSessions[0].courseCode} PIN: <strong className="text-gold">{activeSessions[0].sessionCode}</strong>
            </p>
          </div>
        )}
      </nav>

      {/* User Footer Profile Card */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xs text-slate-900 truncate font-sans">{currentUser.name}</div>
            <div className="text-[9px] font-mono text-emerald-700 font-bold uppercase tracking-wider">
              {currentUser.role}
            </div>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 mt-2 px-3 py-2 text-xs font-mono text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </Link>
      </div>
    </aside>
  );
}
