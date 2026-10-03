'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import { Award, Globe, CheckCircle2, ShieldCheck, CheckCheck } from 'lucide-react';

export default function AdminResultApprovals() {
  const { results, updateResultStatus, currentUser, showToast } = useApp();

  const submittedResults = results.filter((r) => r.status === 'Submitted');
  const approvedResults = results.filter((r) => r.status === 'Approved');
  const publishedResults = results.filter((r) => r.status === 'Published');

  const handleBatchApprove = () => {
    if (submittedResults.length === 0) {
      showToast('No pending submitted broadsheets to approve', 'info');
      return;
    }
    submittedResults.forEach((res) => {
      updateResultStatus(res.id, 'Approved', currentUser.name, true);
    });
    showToast(`Successfully batch approved ${submittedResults.length} broadsheet entry/entries!`, 'success');
  };

  const handleBatchPublish = () => {
    if (approvedResults.length === 0) {
      showToast('No approved broadsheets waiting to publish', 'info');
      return;
    }
    approvedResults.forEach((res) => {
      updateResultStatus(res.id, 'Published', currentUser.name, true);
    });
    showToast(`Successfully published ${approvedResults.length} broadsheet result(s) to student portal!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-[10px] uppercase tracking-widest mb-1">
            <Award className="w-4 h-4" /> Broadsheet Governance & Result Publishing Hub
          </div>
          <h1 className="font-black text-2xl md:text-3xl text-ink">HOD Broadsheet Approval Queue</h1>
          <p className="text-xs text-ink-light mt-1">
            Departmental State Machine: <span className="text-amber-600 font-bold font-mono">Submitted</span> → <span className="text-blue-600 font-bold font-mono">Approved</span> → <span className="text-emerald-600 font-bold font-mono">Published (Live RLS)</span>
          </p>
        </div>

        {/* Batch Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleBatchApprove}
            disabled={submittedResults.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase shadow-sm transition-all"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Approve All ({submittedResults.length})</span>
          </button>

          <button
            onClick={handleBatchPublish}
            disabled={approvedResults.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase shadow-sm transition-all"
          >
            <Globe className="w-4 h-4" />
            <span>Publish All Approved ({approvedResults.length})</span>
          </button>
        </div>
      </div>

      {/* Governance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase text-ink-light tracking-widest">
              Pending HOD Review
            </div>
            <div className="text-2xl font-black text-ink">{submittedResults.length}</div>
            <div className="text-[10px] text-ink-light font-mono">Awaiting sign-off</div>
          </div>
        </div>

        <div className="stat-card flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase text-ink-light tracking-widest">
              Approved Broadsheets
            </div>
            <div className="text-2xl font-black text-ink">{approvedResults.length}</div>
            <div className="text-[10px] text-ink-light font-mono">Ready to publish</div>
          </div>
        </div>

        <div className="stat-card flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase text-ink-light tracking-widest">
              Live Published Results
            </div>
            <div className="text-2xl font-black text-ink">{publishedResults.length}</div>
            <div className="text-[10px] text-ink-light font-mono">Visible on Student Portal</div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="nacos-card p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full nacos-table">
            <thead>
              <tr>
                {['Course', 'Matric', 'Student', 'CA + Exam', 'Total', 'Grade', 'State', 'Action'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs font-mono text-slate-400">
                    No departmental broadsheets recorded in queue.
                  </td>
                </tr>
              ) : (
                results.map((res) => (
                  <tr key={res.id}>
                    <td className="font-bold text-emerald-700 font-mono">{res.courseCode}</td>
                    <td className="font-bold font-mono">{res.matricNo}</td>
                    <td className="font-semibold text-ink">{res.studentName}</td>
                    <td className="font-mono">{res.caScore} + {res.examScore}</td>
                    <td className="font-black font-mono">{res.totalScore}</td>
                    <td>
                      <span className="font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 text-xs">
                        {res.grade}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`chip ${
                          res.status === 'Published'
                            ? 'chip-approved'
                            : res.status === 'Approved'
                            ? 'chip-info'
                            : 'chip-pending'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="text-right">
                      {res.status === 'Submitted' && (
                        <button
                          onClick={() => updateResultStatus(res.id, 'Approved', currentUser.name)}
                          className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-300 font-mono font-bold rounded-lg text-[10px] hover:bg-amber-100 transition-all"
                        >
                          Approve
                        </button>
                      )}
                      {res.status === 'Approved' && (
                        <button
                          onClick={() => updateResultStatus(res.id, 'Published', currentUser.name)}
                          className="inline-flex items-center gap-1 btn-primary !py-1.5 !px-3 !text-[10px] !rounded-lg"
                        >
                          <Globe className="w-3 h-3" /> Publish
                        </button>
                      )}
                      {res.status === 'Published' && (
                        <span className="text-emerald-700 font-bold font-mono text-[10px]">
                          ✓ Published & Logged
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
