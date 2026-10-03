'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context';
import {
  Bell, ChevronRight, Radio, Pin, Check, ArrowRight, Menu, X,
  LayoutDashboard, BookOpen, CalendarCheck, CalendarDays, FolderOpen,
  Award, Users, CheckCircle2, Shield, BarChart3, LogOut
} from 'lucide-react';
import { Logo } from './Logo';
import { CommandPalette } from './CommandPalette';

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

export function AppTopBar() {
  const { currentUser, announcements, attendanceSessions } = useApp();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  const activeLiveSessions = attendanceSessions.filter((s) => s.isActive);
  const links = navByRole[currentUser.role] || navByRole.student;

  // Filter announcements for current role/level
  const myAnnouncements = announcements.filter((a) => {
    if (a.scope === 'department') return true;
    if (a.scope === 'level' && a.targetLevel === currentUser.level) return true;
    return true;
  });

  const unreadCount = myAnnouncements.filter((a) => !readIds.includes(a.id)).length;

  // Handle click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const markAllAsRead = () => {
    setReadIds(myAnnouncements.map((a) => a.id));
  };

  const markSingleAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      setReadIds((prev) => [...prev, id]);
    }
  };

  return (
    <header className="h-16 glass-panel border-b border-slate-200/80 flex items-center px-4 md:px-6 justify-between shrink-0 sticky top-0 z-30 transition-all">
      {/* Left: Mobile Hamburger Toggle + Breadcrumbs & Telemetry */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Toggle Mobile Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-600" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span className="font-bold text-slate-700">DIMS MAPOLY</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
              {currentUser.role.toUpperCase()}
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">
            2025/2026 Session · First Semester
          </div>
        </div>

        {/* Live Active Session Indicator Badge */}
        {activeLiveSessions.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-[11px] font-mono font-bold border border-emerald-700 shadow-sm animate-in fade-in">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>LIVE HALL SESSION ACTIVE (PIN: {activeLiveSessions[0].sessionCode})</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <CommandPalette />

        {/* Notification Bell & Dropdown */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-emerald-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            title={`${unreadCount} Unread Departmental Announcements`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white font-mono font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Interactive Notification Popover Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Dropdown Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Department Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">MAPOLY Computer Science Dept</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              {/* Announcements List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {myAnnouncements.length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-slate-400">
                    No active notifications at this time.
                  </div>
                ) : (
                  myAnnouncements.map((ann) => {
                    const isRead = readIds.includes(ann.id);
                    return (
                      <div
                        key={ann.id}
                        onClick={() => markSingleAsRead(ann.id)}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer space-y-1.5 ${
                          !isRead ? 'bg-emerald-50/40 border-l-4 border-emerald-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-slate-900 leading-snug flex items-center gap-1.5">
                            {ann.pinned && <Pin className="w-3 h-3 text-amber-500 shrink-0" />}
                            <span>{ann.title}</span>
                          </h4>
                          {!isRead && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-normal">
                          {ann.body}
                        </p>

                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                          <span>By: <strong className="text-slate-700">{ann.authorName}</strong> ({ann.authorRole})</span>
                          <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
                <Link
                  href={currentUser.role === 'student' ? '/student/announcements' : '/lecturer/announcements/new'}
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 font-mono inline-flex items-center gap-1.5"
                >
                  <span>View All Department Bulletins</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shadow-md">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <span>{currentUser.name.charAt(0)}</span>
            )}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1]?.charAt(0)}.
            </div>
            <div className="text-[10px] font-mono text-emerald-700 font-extrabold uppercase">
              {currentUser.role}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Mobile Navigation Surface Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide Drawer Content */}
          <div className="relative w-80 max-w-[85vw] bg-slate-900 text-white min-h-screen flex flex-col z-50 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <Logo variant="dark" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 p-4 space-y-1 overflow-y-auto font-mono text-xs">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                MAPOLY CS Navigation Surface
              </div>

              {links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className={isActive ? 'text-slate-950' : 'text-emerald-400'}>{link.icon}</span>
                    <span className="flex-1 truncate font-sans text-xs font-semibold">{link.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 shrink-0 text-slate-950" />}
                  </Link>
                );
              })}
            </div>

            {/* User Profile Card & Sign Out */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3 font-mono">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-white truncate font-sans">{currentUser.name}</div>
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    {currentUser.role} · MAPOLY CS
                  </div>
                </div>
              </div>

              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
