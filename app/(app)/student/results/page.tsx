'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { Award, Printer, ShieldCheck, Calculator, Sparkles, QrCode, CheckCircle2 } from 'lucide-react';

const GRADE_POINTS: Record<string, number> = {
  A: 4.0,
  AB: 3.5,
  B: 3.0,
  BC: 2.5,
  C: 2.0,
  CD: 1.5,
  D: 1.0,
  E: 0.5,
  F: 0.0,
};

export default function StudentResults() {
  const { currentUser, results, registrations } = useApp();
  const [activeTab, setActiveTab] = useState<'broadsheet' | 'simulator'>('broadsheet');

  const myResults = results.filter((r) => r.studentId === currentUser.id);
  const publishedResults = myResults.filter((r) => r.status === 'Published');
  
  const totalUnits = publishedResults.reduce((sum, r) => sum + r.unitLoad, 0);
  const totalPoints = publishedResults.reduce((sum, r) => sum + (r.gradePoint * r.unitLoad), 0);
  const calculatedGPA = totalUnits > 0 ? totalPoints / totalUnits : 0;

  // Simulator state: courseId -> projected grade ('A', 'B', etc)
  const myApprovedRegs = registrations.filter(
    (r) => r.studentId === currentUser.id && r.status === 'approved'
  );

  const [projectedGrades, setProjectedGrades] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    myApprovedRegs.forEach((r) => {
      init[r.courseId] = 'A';
    });
    return init;
  });

  // Calculate simulated GPA
  const simulatedUnits = myApprovedRegs.reduce((sum, r) => sum + r.unitLoad, 0);
  const simulatedPoints = myApprovedRegs.reduce(
    (sum, r) => sum + (GRADE_POINTS[projectedGrades[r.courseId] || 'A'] || 4.0) * r.unitLoad,
    0
  );
  const simulatedGPA = simulatedUnits > 0 ? simulatedPoints / simulatedUnits : 4.0;

  // Projected overall CGPA
  const combinedUnits = totalUnits + simulatedUnits;
  const combinedPoints = totalPoints + simulatedPoints;
  const projectedCGPA = combinedUnits > 0 ? combinedPoints / combinedUnits : (currentUser.cgpa || 3.68);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-nacos-green font-bold text-[10px] uppercase tracking-widest mb-1">
            <Award className="w-4 h-4" /> Official Semester Transcript & Results
          </div>
          <h1 className="font-black text-2xl md:text-3xl text-ink">Academic Performance History</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('broadsheet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'broadsheet'
                  ? 'bg-slate-900 text-emerald-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Official Broadsheet
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>CGPA Target Simulator</span>
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="btn-outline inline-flex items-center gap-2 !py-2 !px-4 !text-xs"
          >
            <Printer className="w-4 h-4" /> Print Slip
          </button>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="nacos-card p-6 grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { label: 'Student Name', value: currentUser.name },
          { label: 'Matriculation No.', value: currentUser.matricNo || 'MAPOLY/ND/CS/2024/0142', mono: true },
          { label: 'Programme & Level', value: `${currentUser.programme || 'Computer Science'} (${currentUser.level || 'ND2'})` },
        ].map((f) => (
          <div key={f.label}>
            <span className="block text-[9px] font-bold uppercase text-ink-light tracking-widest mb-1">{f.label}</span>
            <span className={`text-sm font-bold text-ink ${f.mono ? 'font-mono' : ''}`}>{f.value}</span>
          </div>
        ))}

        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-center">
          <span className="block text-[9px] font-mono font-bold uppercase text-emerald-800 tracking-widest">
            Cumulative CGPA
          </span>
          <span className="font-black text-3xl text-emerald-700 block mt-1">
            {calculatedGPA > 0 ? calculatedGPA.toFixed(2) : (currentUser.cgpa || 3.68).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tab 1: Official Broadsheet */}
      {activeTab === 'broadsheet' && (
        <div className="nacos-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-base text-ink">First Semester 2025/2026 Broadsheet</h2>
              <span className="text-xs text-ink-light font-mono">Verified Departmental Record</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 text-emerald-400 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono">
              <QrCode className="w-4 h-4 text-gold" />
              <span>QR SECURITY STAMP: CSD-849201-VERIFIED</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full nacos-table">
              <thead>
                <tr>
                  {['Course Code','Course Title','Units','CA (30)','Exam (70)','Total','Grade','Points','Status'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myResults.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-xs font-mono text-slate-400">
                      No result broadsheet entries recorded for your account yet.
                    </td>
                  </tr>
                ) : (
                  myResults.map((res) => {
                    const isPub = res.status === 'Published';
                    return (
                      <tr key={res.id}>
                        <td className="font-bold text-emerald-700 font-mono">{res.courseCode}</td>
                        <td className="font-medium">{res.courseTitle}</td>
                        <td className="font-mono">{res.unitLoad} CU</td>
                        <td className="text-center font-mono font-bold">{isPub ? res.caScore : '••'}</td>
                        <td className="text-center font-mono font-bold">{isPub ? res.examScore : '••'}</td>
                        <td className="text-center font-mono font-black">{isPub ? res.totalScore : '••'}</td>
                        <td className="text-center">
                          <span className="font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 text-xs">
                            {isPub ? res.grade : '—'}
                          </span>
                        </td>
                        <td className="text-center font-mono font-bold">{isPub ? res.gradePoint.toFixed(1) : '—'}</td>
                        <td>
                          <span className={`chip ${isPub ? 'chip-approved' : res.status === 'Approved' ? 'chip-info' : 'chip-pending'}`}>
                            {res.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: CGPA Target Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          {/* Simulator Summary Banner */}
          <div className="p-6 rounded-2xl bg-slate-900 text-parchment border-2 border-emerald-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-widest block">
                    GOAL ENGINE
                  </span>
                  <h2 className="font-display font-bold text-lg text-white">Target CGPA Goal Simulator</h2>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-xl border border-white/10 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[9px]">Simulated GPA</span>
                  <strong className="text-emerald-400 text-lg">{simulatedGPA.toFixed(2)}</strong>
                </div>
                <div className="h-6 w-px bg-slate-700" />
                <div>
                  <span className="text-slate-400 block text-[9px]">Projected CGPA</span>
                  <strong className="text-gold text-lg">{projectedCGPA.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Adjust your expected target grades for currently enrolled courses to simulate your end-of-semester GPA and overall cumulative standing.
            </p>
          </div>

          {/* Enrolled Courses Grade Selectors */}
          <div className="nacos-card p-6 space-y-4">
            <h3 className="font-bold text-base text-ink">Simulate Enrolled Course Target Grades</h3>
            <div className="space-y-3">
              {myApprovedRegs.map((reg) => (
                <div
                  key={reg.id}
                  className="p-4 rounded-xl bg-parchment-light border border-slate-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-emerald-700 block">{reg.courseCode} ({reg.unitLoad} CU)</span>
                    <span className="font-medium text-ink block">{reg.courseTitle}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate font-mono text-[11px]">Projected Grade:</span>
                    <select
                      value={projectedGrades[reg.courseId] || 'A'}
                      onChange={(e) =>
                        setProjectedGrades({ ...projectedGrades, [reg.courseId]: e.target.value })
                      }
                      className="w-28 font-mono font-bold bg-white text-ink border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="A">A (4.0 - 75%+)</option>
                      <option value="AB">AB (3.5 - 70%+)</option>
                      <option value="B">B (3.0 - 65%+)</option>
                      <option value="BC">BC (2.5 - 60%+)</option>
                      <option value="C">C (2.0 - 55%+)</option>
                      <option value="CD">CD (1.5 - 50%+)</option>
                      <option value="D">D (1.0 - 45%+)</option>
                      <option value="E">E (0.5 - 40%+)</option>
                      <option value="F">F (0.0 - Fail)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
