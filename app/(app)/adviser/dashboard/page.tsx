'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { Users, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';

export default function AdviserDashboard() {
  const { currentUser, registrations, updateRegistrationStatus, getAtRiskStudents, showToast } = useApp();
  const pendingRegs = registrations.filter((r) => r.status === 'pending');
  const atRiskList = getAtRiskStudents(currentUser.adviserForLevel || 'ND2');
  const highRiskCount = atRiskList.filter((s) => s.riskLevel === 'high').length;

  const handleSendAdvisory = (studentName: string) => {
    showToast(`Counseling notice & Academic Recovery plan sent to ${studentName} ✓`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-nacos-green-dark rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-nacos-green/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-nacos-green/20 border border-nacos-green/40 text-nacos-green text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-1">
            Course Adviser Portal · MAPOLY CS
          </div>
          <h1 className="font-black text-2xl md:text-3xl text-white">
            Advisee Standing &amp; <span className="text-nacos-green">Clearance Portal</span>
          </h1>
          <p className="text-white/60 text-xs font-mono">
            ADVISER: <span className="text-nacos-green font-bold">{currentUser.name}</span>
            {' · '}COHORT: <span className="text-nacos-green font-bold">{currentUser.adviserForLevel || 'ND2'}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Advisees', value: '142', icon: <Users className="w-5 h-5" />, bg: 'bg-blue-50 text-blue-700' },
          { label: 'Pending Clearances', value: String(pendingRegs.length), icon: <CheckCircle2 className="w-5 h-5" />, bg: 'bg-amber-50 text-amber-700' },
          { label: 'At-Risk Students', value: String(highRiskCount), icon: <AlertTriangle className="w-5 h-5" />, bg: 'bg-red-50 text-red-700' },
        ].map((m) => (
          <div key={m.label} className="stat-card flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${m.bg}`}>{m.icon}</div>
            <div>
              <div className="text-[10px] font-bold uppercase text-ink-light tracking-widest">{m.label}</div>
              <div className="text-2xl font-black text-ink">{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Smart AI Academic Early Warning Telemetry Panel */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-widest block">
              AI PREDICTIVE ACADEMIC TELEMETRY
            </span>
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <span>Smart Cohort At-Risk Student Predictor</span>
              <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 font-mono text-[10px]">
                {highRiskCount} Action Required
              </span>
            </h2>
          </div>
          <span className="text-slate-400 text-xs font-mono hidden sm:inline">Exam Eligibility Threshold: 75% Attendance</span>
        </div>

        <div className="divide-y divide-slate-800 bg-slate-950 rounded-xl overflow-hidden text-xs font-mono">
          {atRiskList.map((stu) => (
            <div key={stu.studentId} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-900/60 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-sans text-sm">{stu.studentName}</span>
                  <span className="text-slate-400 font-mono">({stu.matricNo})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    stu.riskLevel === 'high' 
                      ? 'bg-red-950 text-red-400 border border-red-800' 
                      : stu.riskLevel === 'moderate'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {stu.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Attendance: <strong className={stu.attendancePercentage < 75 ? 'text-red-400' : 'text-emerald-400'}>{stu.attendancePercentage}%</strong>
                  {' · '}CA Score: <strong className="text-slate-200">{stu.caScore} / 30</strong>
                </div>
                <div className="text-slate-300 text-[11px] font-sans italic">
                  Primary Cause: {stu.reasons.join(' · ')}
                </div>
              </div>

              <button
                onClick={() => handleSendAdvisory(stu.studentName)}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold font-mono text-[11px] rounded-lg shadow-sm transition-all shrink-0"
              >
                Send Counseling Advisory →
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="nacos-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="font-bold text-sm text-ink">Pending Registration Clearances</h2>
          <Link href="/adviser/registrations" className="text-xs font-bold text-nacos-green hover:text-nacos-green-mid flex items-center gap-1">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full nacos-table">
            <thead>
              <tr><th>Student</th><th>Matric</th><th>Course</th><th>Title</th><th className="text-right">Action</th></tr>
            </thead>
            <tbody>
              {pendingRegs.length > 0 ? pendingRegs.map((reg) => (
                <tr key={reg.id}>
                  <td className="font-semibold">{reg.studentName}</td>
                  <td className="font-mono text-ink-light">{reg.matricNo}</td>
                  <td className="font-bold text-nacos-green">{reg.courseCode}</td>
                  <td>{reg.courseTitle}</td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => updateRegistrationStatus(reg.id, 'approved')}
                        className="px-3 py-1.5 bg-nacos-green-light text-nacos-green-dark border border-nacos-green/30 font-bold rounded-lg text-[10px] hover:bg-nacos-green hover:text-white transition-all">
                        Approve
                      </button>
                      <button onClick={() => updateRegistrationStatus(reg.id, 'rejected')}
                        className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 font-bold rounded-lg text-[10px] hover:bg-red-100 transition-all">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-ink-light text-xs">
                    All registrations for {currentUser.adviserForLevel || 'ND2'} are cleared!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
