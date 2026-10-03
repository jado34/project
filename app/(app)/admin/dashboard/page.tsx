'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { Shield, Award, Users, BarChart3, CalendarDays, ArrowRight, ChevronRight, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, results, courses } = useApp();
  const pendingApprovals = results.filter((r) => r.status === 'Submitted');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-nacos-green-dark rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 w-48 h-48 bg-nacos-green/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-nacos-green/20 border border-nacos-green/40 text-nacos-green text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-1">
            <Shield className="w-3 h-3" /> HOD Command Center · MAPOLY CS
          </div>
          <h1 className="font-black text-2xl md:text-3xl text-white">
            Department Operations & <span className="text-nacos-green">Broadsheet Governance</span>
          </h1>
          <p className="text-white/60 text-xs font-mono">
            HOD: <span className="text-nacos-green font-bold">{currentUser.name}</span>
            {' · '}DEPT: <span className="text-nacos-green font-bold">Computer Science</span>
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <Link
            href="/admin/users"
            className="px-4 py-2.5 bg-nacos-green hover:bg-nacos-green-mid text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-lg transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add & Manage Users
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Dept. Enrollment', value: '1,420', icon: <Users className="w-5 h-5" />, iconBg: 'bg-blue-50 text-blue-700' },
          { label: 'Overall Pass Rate', value: '91.4%', icon: <BarChart3 className="w-5 h-5" />, iconBg: 'bg-nacos-green-light text-nacos-green-dark' },
          { label: 'Broadsheets Pending', value: String(pendingApprovals.length), icon: <Award className="w-5 h-5" />, iconBg: 'bg-amber-50 text-amber-700' },
          { label: 'Active Courses', value: String(courses.length), icon: <CalendarDays className="w-5 h-5" />, iconBg: 'bg-purple-50 text-purple-700' },
        ].map((m) => (
          <div key={m.label} className="stat-card flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${m.iconBg}`}>{m.icon}</div>
            <div>
              <div className="text-[10px] font-bold uppercase text-ink-light tracking-widest">{m.label}</div>
              <div className="text-2xl font-black text-ink">{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pending broadsheets */}
        <div className="lg:col-span-8 nacos-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h2 className="font-bold text-sm text-ink">Pending HOD Approval</h2>
              <p className="text-xs text-ink-light">Submitted broadsheets awaiting sign-off</p>
            </div>
            <Link href="/admin/results/approvals" className="text-xs font-bold text-nacos-green hover:text-nacos-green-mid flex items-center gap-1">
              Approval Queue <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full nacos-table">
              <thead>
                <tr><th>Course</th><th>Student</th><th>Submitted By</th><th>Score</th><th className="text-right">Action</th></tr>
              </thead>
              <tbody>
                {pendingApprovals.length > 0 ? pendingApprovals.map((res) => (
                  <tr key={res.id}>
                    <td className="font-bold text-nacos-green">{res.courseCode}</td>
                    <td className="font-semibold">{res.studentName}</td>
                    <td className="text-ink-light">{res.submittedBy || 'Dr. K. A. Mustapha'}</td>
                    <td className="font-bold">{res.caScore} + {res.examScore} = <span className="text-nacos-green">{res.totalScore}</span> ({res.grade})</td>
                    <td className="text-right">
                      <Link href="/admin/results/approvals"
                        className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 font-bold rounded-lg text-[10px] hover:bg-amber-100 transition-all">
                        Review
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-ink-light text-xs">
                      No broadsheets pending HOD approval.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff load */}
        <div className="lg:col-span-4 nacos-card p-5 space-y-4">
          <h2 className="font-bold text-sm text-ink">Staff Teaching Load</h2>
          <div className="space-y-2">
            {[
              { name: 'Dr. K. A. Mustapha', units: 10, courses: 'COM 101, COM 201, COM 311' },
              { name: 'Mrs. F. K. Babalola', units: 10, courses: 'COM 103, COM 205, COM 415' },
              { name: 'Dr. A. O. Adebayo (HOD)', units: 11, courses: 'COM 203, COM 313, COM 411' },
            ].map((s) => (
              <div key={s.name} className="p-3 rounded-xl bg-nacos-off-white border border-border hover:border-nacos-green/30 transition-colors">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-xs text-ink">{s.name}</span>
                  <span className="text-xs text-nacos-green font-bold">{s.units} Units</span>
                </div>
                <p className="text-[10px] text-ink-light">{s.courses}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
