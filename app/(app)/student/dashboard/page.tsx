'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import {
  Award, BookOpenCheck, CalendarCheck, CalendarDays,
  Bell, ArrowRight, ShieldCheck, AlertTriangle, ChevronRight
} from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser, registrations, results, attendanceSummaries, announcements } = useApp();

  const myRegistrations = registrations.filter((r) => r.studentId === currentUser.id);
  const totalRegisteredUnits = myRegistrations.reduce((sum, r) => sum + r.unitLoad, 0);
  const myAttendance = attendanceSummaries.filter((a) => a.studentId === currentUser.id);
  const lowAttendanceCount = myAttendance.filter((a) => !a.isEligible).length;
  const avgAttendance = myAttendance.length > 0 
    ? (myAttendance.reduce((sum, a) => sum + a.percentage, 0) / myAttendance.length).toFixed(1) + '%'
    : '100%';
  const cgpa = currentUser.cgpa ?? 0.00;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-nacos-green-dark rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-nacos-green/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-nacos-green/20 border border-nacos-green/40 text-nacos-green text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> Official Student Portal · MAPOLY CS
          </div>
          <h1 className="font-black text-2xl md:text-3xl text-white">
            Welcome back, <span className="text-nacos-green">{currentUser.name}</span>
          </h1>
          <p className="text-white/65 text-xs font-mono">
            MATRIC: <span className="text-nacos-green font-bold">{currentUser.matricNo}</span>
            {' · '}LEVEL: <span className="text-nacos-green font-bold">{currentUser.level}</span>
          </p>
        </div>
        <Link href="/student/results"
          className="relative z-10 btn-primary self-start md:self-auto shrink-0">
          View Transcript <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card flex items-center gap-4">
          <div className="icon-box-green"><Award className="w-5 h-5" /></div>
          <div>
            <div className="text-[10px] font-bold uppercase text-ink-light tracking-widest">CGPA</div>
            <div className="text-2xl font-black text-nacos-green">{cgpa.toFixed(2)}</div>
            <div className="text-[10px] text-ink-light font-medium">Academic Standing</div>
          </div>
        </div>

        <div className="stat-card flex items-center gap-4">
          <div className="icon-box-green"><BookOpenCheck className="w-5 h-5" /></div>
          <div>
            <div className="text-[10px] font-bold uppercase text-ink-light tracking-widest">Registered</div>
            <div className="text-2xl font-black text-ink">
              {totalRegisteredUnits}
              <span className="text-sm font-normal text-ink-light"> / 24 CU</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">
              {myRegistrations.length === 0 ? 'Fresh Clean Slate' : myRegistrations.some(r => r.status === 'pending') ? 'Clearance Pending' : 'Approved ✓'}
            </div>
          </div>
        </div>

        <div className="stat-card flex items-center gap-4">
          <div className={`icon-box-green ${lowAttendanceCount > 0 ? '!bg-red-50 !text-red-700' : ''}`}>
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-ink-light tracking-widest">Attendance</div>
            <div className="text-2xl font-black text-ink">{avgAttendance}</div>
            {lowAttendanceCount > 0 ? (
              <div className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />{lowAttendanceCount} Below 75%
              </div>
            ) : (
              <div className="text-[10px] text-nacos-green font-bold">Exam Eligible ✓</div>
            )}
          </div>
        </div>

        <div className="stat-card flex items-center gap-4">
          <div className="icon-box-green" style={{ background: '#EFF6FF', color: '#1E40AF' }}>
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-ink-light tracking-widest">Next Class</div>
            <div className="text-sm font-black text-ink">COM 201 · Mon 09:00</div>
            <div className="text-[10px] text-ink-light">Computer Lab 2</div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Registrations */}
        <div className="lg:col-span-7 nacos-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h2 className="font-bold text-sm text-ink">Active Registrations</h2>
              <p className="text-xs text-ink-light">First Semester 2025/2026</p>
            </div>
            <Link href="/student/courses/register" className="text-xs font-bold text-nacos-green hover:text-nacos-green-mid flex items-center gap-1">
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full nacos-table">
              <thead>
                <tr>
                  <th>Code</th><th>Title</th><th>Units</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myRegistrations.length > 0 ? myRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td className="font-bold text-nacos-green">{reg.courseCode}</td>
                    <td className="font-medium">{reg.courseTitle}</td>
                    <td className="font-mono">{reg.unitLoad} CU</td>
                    <td>
                      <span className={`chip ${reg.status === 'approved' ? 'chip-approved' : 'chip-pending'}`}>
                        {reg.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-ink-light text-xs space-y-2">
                      <p className="font-bold text-slate-700">No courses registered on your profile yet.</p>
                      <p className="text-[11px] text-slate-500">Initialize your clean-slate semester course selections and upload your official MAPOLY portal form.</p>
                      <Link href="/student/courses/register" className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 rounded-xl bg-emerald-700 text-white font-mono text-xs font-bold shadow-sm hover:bg-emerald-800 transition-colors">
                        Select Courses & Upload Portal Form →
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Announcements */}
        <div className="lg:col-span-5 nacos-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-nacos-green" />
              <h2 className="font-bold text-sm text-ink">Department Feed</h2>
            </div>
            <Link href="/student/announcements" className="text-xs font-bold text-nacos-green hover:text-nacos-green-mid">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="p-3 rounded-xl bg-nacos-off-white border border-border space-y-1.5 hover:border-nacos-green/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="chip chip-success">{ann.scope}</span>
                  <span className="text-[9px] text-ink-faint">{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-xs text-ink leading-snug">{ann.title}</h4>
                <p className="text-[11px] text-ink-light line-clamp-2">{ann.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
