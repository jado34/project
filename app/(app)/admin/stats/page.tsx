'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import {
  Users, BookOpen, Award, CalendarCheck, TrendingUp,
  BarChart3, GraduationCap, ShieldCheck, AlertTriangle
} from 'lucide-react';

// Level distribution mock
const LEVEL_DIST = [
  { level: 'ND1', count: 142, color: '#17b91d' },
  { level: 'ND2', count: 128, color: '#1a7a1e' },
  { level: 'HND1', count: 89, color: '#22c55e' },
  { level: 'HND2', count: 71, color: '#4ade80' },
];
const TOTAL_STUDENTS = LEVEL_DIST.reduce((s, l) => s + l.count, 0);

// Grade distribution mock
const GRADE_DIST = [
  { grade: 'A', count: 312, color: '#17b91d' },
  { grade: 'B', count: 487, color: '#22c55e' },
  { grade: 'C', count: 298, color: '#facc15' },
  { grade: 'D', count: 89, color: '#f97316' },
  { grade: 'F', count: 34, color: '#ef4444' },
];
const TOTAL_GRADES = GRADE_DIST.reduce((s, g) => s + g.count, 0);

export default function AdminStats() {
  const { courses, users, results, courseForms } = useApp();
  const students = users.filter((u) => u.role === 'student');
  const lecturers = users.filter((u) => u.role === 'lecturer');
  const publishedResults = results.filter((r) => r.status === 'Published');
  const pendingResults = results.filter((r) => r.status === 'Draft' || r.status === 'Submitted');

  const verifiedPortalForms = courseForms.filter((f) => f.status === 'verified');
  const pendingPortalForms = courseForms.filter((f) => f.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-nacos-green font-bold text-[10px] uppercase tracking-widest mb-1">
          <BarChart3 className="w-4 h-4" />
          HOD · Department Analytics
        </div>
        <h1 className="font-black text-2xl md:text-3xl text-ink">Department Statistics</h1>
        <p className="text-sm text-ink-light mt-1">Session 2025/2026 · First Semester · Live Overview</p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: TOTAL_STUDENTS, icon: <Users className="w-5 h-5" />, bg: 'bg-nacos-green-light text-nacos-green-dark', sub: 'All levels enrolled' },
          { label: 'Portal Forms Verified', value: verifiedPortalForms.length, icon: <ShieldCheck className="w-5 h-5" />, bg: 'bg-emerald-50 text-emerald-700', sub: `${pendingPortalForms.length} awaiting adviser review` },
          { label: 'Courses This Sem.', value: courses.length, icon: <BookOpen className="w-5 h-5" />, bg: 'bg-amber-50 text-amber-700', sub: 'Department-wide' },
          { label: 'Published Results', value: publishedResults.length, icon: <Award className="w-5 h-5" />, bg: 'bg-purple-50 text-purple-700', sub: `${pendingResults.length} still pending` },
        ].map((stat) => (
          <div key={stat.label} className="nacos-card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-ink-light tracking-widest">{stat.label}</div>
              <div className="text-2xl font-black text-ink">{stat.value}</div>
              <div className="text-[10px] text-ink-light">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Student Level Distribution */}
        <div className="nacos-card p-6 space-y-4">
          <h2 className="font-bold text-base text-ink flex items-center gap-2">
            <Users className="w-4 h-4 text-nacos-green" />
            Enrolment by Level
          </h2>
          <div className="space-y-3">
            {LEVEL_DIST.map((lv) => (
              <div key={lv.level} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-ink">{lv.level}</span>
                  <span className="text-ink-light">{lv.count} students · {((lv.count / TOTAL_STUDENTS) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${(lv.count / TOTAL_STUDENTS) * 100}%`, background: lv.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="nacos-card p-6 space-y-4">
          <h2 className="font-bold text-base text-ink flex items-center gap-2">
            <Award className="w-4 h-4 text-nacos-green" />
            Grade Distribution (All Courses)
          </h2>
          <div className="space-y-3">
            {GRADE_DIST.map((g) => (
              <div key={g.grade} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-ink">Grade {g.grade}</span>
                  <span className="text-ink-light">{g.count} entries · {((g.count / TOTAL_GRADES) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${(g.count / TOTAL_GRADES) * 100}%`, background: g.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Result Status Pipeline */}
        <div className="nacos-card p-6 space-y-4">
          <h2 className="font-bold text-base text-ink flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-nacos-green" />
            Result Pipeline Status
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Draft', count: results.filter(r => r.status === 'Draft').length, color: 'bg-slate-100 text-slate-600 border-slate-200' },
              { label: 'Submitted', count: results.filter(r => r.status === 'Submitted').length, color: 'bg-amber-50 text-amber-700 border-amber-200' },
              { label: 'Approved', count: results.filter(r => r.status === 'Approved').length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { label: 'Published', count: results.filter(r => r.status === 'Published').length, color: 'bg-nacos-green-light text-nacos-green-dark border-nacos-green/20' },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl p-4 border ${s.color} text-center`}>
                <div className="text-2xl font-black">{s.count}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Alert */}
        <div className="nacos-card p-6 space-y-4">
          <h2 className="font-bold text-base text-ink flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Attendance Alerts
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Chidimma Nwosu', matric: 'MAPOLY/ND/CS/2025/0015', level: 'ND1', attendance: 68.5 },
              { name: 'Tobi Salawu', matric: 'MAPOLY/ND/CS/2024/0078', level: 'ND2', attendance: 71.2 },
              { name: 'Rasheed Bello', matric: 'MAPOLY/HND/CS/2024/0033', level: 'HND2', attendance: 72.0 },
            ].map((s) => (
              <div key={s.matric} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200 text-xs">
                <div>
                  <div className="font-semibold text-ink">{s.name}</div>
                  <div className="text-ink-light font-mono">{s.matric} · {s.level}</div>
                </div>
                <span className="font-black text-red-600">{s.attendance}%</span>
              </div>
            ))}
            <p className="text-[10px] text-ink-light">Students with &lt;75% attendance are flagged for exclusion from exams.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
