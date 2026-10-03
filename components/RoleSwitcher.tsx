'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import { UserRole } from '@/lib/types';
import { UserCheck, Shield, GraduationCap, BookOpen, Users, UserCog } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, setCurrentUserRole } = useApp();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; activeClass: string }[] = [
    {
      role: 'student',
      label: 'Student',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      activeClass: 'bg-emerald-600 text-white shadow-emerald-500/30 border-emerald-500',
    },
    {
      role: 'lecturer',
      label: 'Lecturer',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      activeClass: 'bg-amber-600 text-white shadow-amber-500/30 border-amber-500',
    },
    {
      role: 'adviser',
      label: 'Adviser',
      icon: <Users className="w-3.5 h-3.5" />,
      activeClass: 'bg-blue-600 text-white shadow-blue-500/30 border-blue-500',
    },
    {
      role: 'hod',
      label: 'HOD',
      icon: <Shield className="w-3.5 h-3.5" />,
      activeClass: 'bg-purple-700 text-white shadow-purple-500/30 border-purple-600',
    },
    {
      role: 'admin',
      label: 'Admin',
      icon: <UserCog className="w-3.5 h-3.5" />,
      activeClass: 'bg-rose-700 text-white shadow-rose-500/30 border-rose-600',
    },
  ];

  return (
    <div className="bg-white/90 border border-slate-200/90 rounded-xl p-1 flex items-center gap-1 shadow-sm backdrop-blur-md">
      <div className="hidden xl:flex items-center gap-1 px-2 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Role:</span>
      </div>
      <div className="flex items-center gap-0.5">
        {roles.map((r) => {
          const isActive = currentUser.role === r.role;
          return (
            <button
              key={r.role}
              onClick={() => setCurrentUserRole(r.role)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all duration-200 border ${
                isActive
                  ? `${r.activeClass} shadow-md scale-[1.02]`
                  : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={`Switch workspace view to ${r.label}`}
            >
              {r.icon}
              <span className="hidden md:inline">{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
