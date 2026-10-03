'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { CheckCircle2, FileText, ShieldCheck, Eye, Check, X } from 'lucide-react';
import { CourseFormDoc } from '@/lib/types';

export default function AdviserRegistrations() {
  const { registrations, updateRegistrationStatus, courseForms, verifyCourseForm, rejectCourseForm } = useApp();
  const [inspectingForm, setInspectingForm] = useState<CourseFormDoc | null>(null);

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-border">
        <div className="flex items-center gap-2 text-gold-dark font-mono text-xs font-semibold uppercase">
          <CheckCircle2 className="w-4 h-4" />
          <span>COURSE REGISTRATION CLEARANCE QUEUE</span>
        </div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-ink">
          Student Course Forms &amp; Portal Verification
        </h1>
      </div>

      {/* Uploaded MAPOLY School Portal Documents Overview */}
      <div className="nacos-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-ink flex items-center gap-2">
            <FileText className="w-5 h-5 text-nacos-green" />
            <span>Uploaded Official MAPOLY School Portal Course Forms ({courseForms.length})</span>
          </h2>
          <span className="chip chip-info text-xs">Adviser Verification Required</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courseForms.map((form) => (
            <div key={form.id} className="p-4 rounded-xl bg-nacos-off-white border border-border space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-ink">{form.studentName}</h3>
                  <span className="text-xs text-ink-light font-mono block">{form.matricNo} · {form.level}</span>
                </div>
                <span className={`chip text-[10px] uppercase font-mono ${
                  form.status === 'verified' ? 'chip-approved' : form.status === 'rejected' ? 'chip-error' : 'chip-info'
                }`}>
                  {form.status}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-border text-xs font-mono flex items-center justify-between">
                <span className="truncate max-w-[200px] text-ink-light">{form.fileName}</span>
                <span className="text-ink-light">{form.fileSize}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setInspectingForm(form)}
                  className="px-3 py-1.5 bg-nacos-green-light hover:bg-nacos-green/20 text-nacos-green-dark border border-nacos-green/30 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Inspect Document
                </button>

                {form.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => verifyCourseForm(form.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold font-mono flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Verify
                    </button>
                    <button
                      onClick={() => rejectCourseForm(form.id, 'Discrepancy with selected courses')}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold font-mono flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Form Inspection Modal */}
      {inspectingForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-border rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-xs font-bold font-mono text-nacos-green uppercase tracking-widest block">
                  ADVISER VERIFICATION INSPECTOR
                </span>
                <h3 className="font-bold text-lg text-ink">
                  {inspectingForm.studentName} — Official Portal Course Form
                </h3>
              </div>
              <button onClick={() => setInspectingForm(null)} className="text-ink-light hover:text-ink font-bold">
                ✕ Close
              </button>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 text-white space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Document Name:</span>
                <span className="font-bold text-emerald-400">{inspectingForm.fileName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Matric Number:</span>
                <span>{inspectingForm.matricNo}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Level:</span>
                <span>{inspectingForm.level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Verification Status:</span>
                <span className={`font-bold uppercase ${
                  inspectingForm.status === 'verified' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {inspectingForm.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  verifyCourseForm(inspectingForm.id);
                  setInspectingForm(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Approve &amp; Mark Verified
              </button>
              <button
                onClick={() => setInspectingForm(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-ink font-bold text-xs rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Individual Course Clearances */}
      <div className="bg-white rounded-xl border border-slate-border p-6 shadow-academic space-y-4">
        <h2 className="font-bold text-base text-ink">Individual Course Clearance Queue</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-border text-slate font-mono uppercase bg-parchment-light">
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Matric No.</th>
                <th className="py-3 px-3">Course Code</th>
                <th className="py-3 px-3">Course Title</th>
                <th className="py-3 px-3">Unit Load</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Clearance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-border font-mono">
              {registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-parchment-light/50">
                  <td className="py-3.5 px-3 font-sans font-semibold text-ink">{reg.studentName}</td>
                  <td className="py-3.5 px-3 font-bold text-ink">{reg.matricNo}</td>
                  <td className="py-3.5 px-3 font-bold text-gold-dark">{reg.courseCode}</td>
                  <td className="py-3.5 px-3 font-sans text-ink">{reg.courseTitle}</td>
                  <td className="py-3.5 px-3 font-semibold">{reg.unitLoad} CU</td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      reg.status === 'approved' ? 'bg-verified-bg text-verified border-verified-border' : 'bg-pending-bg text-pending border-pending-border'
                    }`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right space-x-2">
                    {reg.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => updateRegistrationStatus(reg.id, 'approved')}
                          className="px-3 py-1 bg-verified hover:bg-verified-light text-white font-bold rounded shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateRegistrationStatus(reg.id, 'rejected')}
                          className="px-3 py-1 bg-pending hover:bg-pending-light text-white font-bold rounded shadow-sm"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-slate italic">Cleared</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
