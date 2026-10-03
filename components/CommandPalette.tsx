'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import { UserRole } from '@/lib/types';
import {
  Search,
  Command,
  Radio,
  BookOpen,
  Award,
  Users,
  CalendarCheck,
  Megaphone,
  Sparkles,
  ArrowRight,
  X,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Action' | 'Role Switch';
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pinInput, setPinInput] = useState('');
  const router = useRouter();

  const {
    currentUser,
    setCurrentUserRole,
    attendanceSessions,
    checkInStudentWithPin,
    showToast,
  } = useApp();

  const activeLiveSessions = attendanceSessions.filter((s) => s.isActive);

  // Global keydown handler for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const handleSwitchRole = (role: UserRole) => {
    setCurrentUserRole(role);
    setOpen(false);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    checkInStudentWithPin(pinInput);
    setPinInput('');
    setOpen(false);
  };

  const items: CommandItem[] = [
    // Live Action
    {
      id: 'cmd_pin_checkin',
      title: 'Live Classroom PIN Check-In',
      category: 'Action',
      icon: <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />,
      badge: activeLiveSessions.length > 0 ? `${activeLiveSessions.length} ACTIVE` : 'READY',
      action: () => handleNavigate('/student/attendance'),
    },
    // Navigation
    {
      id: 'nav_student_dash',
      title: 'Student Academic Portal & CGPA',
      category: 'Navigation',
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
      action: () => handleNavigate('/student/dashboard'),
    },
    {
      id: 'nav_student_reg',
      title: 'Course Registration Sheet',
      category: 'Navigation',
      icon: <CalendarCheck className="w-4 h-4 text-blue-400" />,
      action: () => handleNavigate('/student/courses/register'),
    },
    {
      id: 'nav_lecturer_dash',
      title: 'Lecturer Command Center',
      category: 'Navigation',
      icon: <Award className="w-4 h-4 text-gold" />,
      action: () => handleNavigate('/lecturer/dashboard'),
    },
    {
      id: 'nav_lecturer_gradebook',
      title: 'Lecturer Broadsheet & Score Entry (COM 201)',
      category: 'Navigation',
      icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
      action: () => handleNavigate('/lecturer/courses/crs_201/grading'),
    },
    {
      id: 'nav_hod_approval',
      title: 'HOD Broadsheet Approvals',
      category: 'Navigation',
      icon: <ShieldCheck className="w-4 h-4 text-violet-400" />,
      action: () => handleNavigate('/admin/results/approvals'),
    },
    // Role Switches
    {
      id: 'role_student',
      title: 'Switch View to Student (Olamide Adeleke)',
      category: 'Role Switch',
      icon: <Users className="w-4 h-4 text-emerald-400" />,
      badge: 'STUDENT',
      action: () => handleSwitchRole('student'),
    },
    {
      id: 'role_lecturer',
      title: 'Switch View to Lecturer (Dr. K. A. Mustapha)',
      category: 'Role Switch',
      icon: <Users className="w-4 h-4 text-gold" />,
      badge: 'LECTURER',
      action: () => handleSwitchRole('lecturer'),
    },
    {
      id: 'role_adviser',
      title: 'Switch View to Level Adviser (Mrs. Babalola)',
      category: 'Role Switch',
      icon: <Users className="w-4 h-4 text-blue-400" />,
      badge: 'ADVISER',
      action: () => handleSwitchRole('adviser'),
    },
    {
      id: 'role_hod',
      title: 'Switch View to HOD (Dr. A. O. Adebayo)',
      category: 'Role Switch',
      icon: <Users className="w-4 h-4 text-violet-400" />,
      badge: 'HOD',
      action: () => handleSwitchRole('hod'),
    },
    {
      id: 'role_admin',
      title: 'Switch View to Super Admin',
      category: 'Role Switch',
      icon: <Users className="w-4 h-4 text-rose-400" />,
      badge: 'ADMIN',
      action: () => handleSwitchRole('admin'),
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900/5 hover:bg-slate-900/10 border border-slate-200/80 text-xs font-mono text-slate-600 hover:text-slate-900 transition-all duration-200"
        title="Open Command Palette (Cmd+K)"
      >
        <Search className="w-3.5 h-3.5 text-slate-400" />
        <span>Search or Jump...</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] font-mono border border-slate-200 shadow-2xl text-slate-500 font-bold">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div
        className="bg-slate-900 text-parchment max-w-xl w-full rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-slate-950/50">
          <Search className="w-5 h-5 text-gold shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search commands, courses, portals, or roles (or type 6-digit PIN)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-white font-sans text-sm placeholder:text-slate-500 focus:outline-none focus:ring-0 p-0"
          />
          <button
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN Quick Check-In Bar */}
        <div className="px-4 py-2.5 bg-emerald-950/50 border-b border-emerald-500/20 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-300">
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>Have a Live Class PIN?</span>
          </div>
          <form onSubmit={handlePinSubmit} className="flex items-center gap-2">
            <input
              type="text"
              maxLength={6}
              placeholder="6-digit PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              className="w-24 px-2 py-1 bg-slate-900 border border-emerald-500/40 text-white rounded font-mono text-xs focus:ring-1 focus:ring-emerald-400"
            />
            <button
              type="submit"
              disabled={pinInput.length < 6}
              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold rounded text-[11px]"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Command Items List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5 font-sans">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-slate-400">
              No matching commands or portals found for &quot;{query}&quot;.
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full text-left p-3 rounded-xl hover:bg-white/10 flex items-center justify-between gap-3 text-xs transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 border border-white/5 text-slate-300 group-hover:border-gold/30">
                    {item.icon}
                  </div>
                  <div>
                    <span className="font-semibold text-white block">{item.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono font-bold text-gold border border-gold/30">
                      {item.badge}
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer HUD Telemetry */}
        <div className="p-3 bg-slate-950 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Active Role: <strong className="text-white uppercase">{currentUser.role}</strong></span>
          </div>
          <span className="text-[10px] text-slate-500">Press <kbd className="px-1 bg-slate-800 text-slate-300 rounded">ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
};
