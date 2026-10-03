'use client';

import React, { useState, use, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import {
  Award,
  Lock,
  Send,
  ShieldCheck,
  Download,
  Upload,
  AlertTriangle,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export default function LecturerGrading({ params }: { params: any }) {
  const resolvedParams = params && typeof params.then === 'function' ? use(params) : params;
  const courseId = (resolvedParams as any)?.id || 'crs_201';

  const { results, courses, currentUser, updateResultScores, updateResultStatus, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const course = courses.find((c) => c.id === courseId);
  const courseResults = results.filter((r) => r.courseId === courseId);

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [scores, setScores] = useState<Record<string, { ca: number; exam: number }>>(() => {
    const init: Record<string, { ca: number; exam: number }> = {};
    courseResults.forEach((r) => {
      init[r.id] = { ca: r.caScore, exam: r.examScore };
    });
    return init;
  });

  const handleScoreChange = (resId: string, type: 'ca' | 'exam', rawVal: string) => {
    const parsed = parseInt(rawVal, 10);
    const max = type === 'ca' ? 30 : 70;
    const safeVal = isNaN(parsed) ? 0 : Math.max(0, Math.min(max, parsed));

    const currentRes = courseResults.find((r) => r.id === resId);
    const currentCa = scores[resId]?.ca ?? currentRes?.caScore ?? 0;
    const currentExam = scores[resId]?.exam ?? currentRes?.examScore ?? 0;

    const newCa = type === 'ca' ? safeVal : currentCa;
    const newExam = type === 'exam' ? safeVal : currentExam;

    setScores((prev) => ({
      ...prev,
      [resId]: { ca: newCa, exam: newExam },
    }));

    updateResultScores(resId, newCa, newExam);
  };

  const handleDownloadCSV = () => {
    let csv = 'Matriculation No.,Student Name,CA Score (30),Exam Score (70)\n';
    courseResults.forEach((res) => {
      const ca = scores[res.id]?.ca ?? res.caScore;
      const exam = scores[res.id]?.exam ?? res.examScore;
      csv += `"${res.matricNo}","${res.studentName}",${ca},${exam}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course?.code || 'course'}_gradebook_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded CSV Gradebook template for ${course?.code}`, 'success');
  };

  const handleUploadCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        showToast('Invalid CSV file format. Missing header or empty content.', 'error');
        return;
      }

      let updatedCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.replace(/"/g, '').trim());
        if (parts.length >= 4) {
          const matric = parts[0];
          const ca = Math.max(0, Math.min(30, parseInt(parts[2], 10) || 0));
          const exam = Math.max(0, Math.min(70, parseInt(parts[3], 10) || 0));

          const matchingRes = courseResults.find(
            (r) => r.matricNo.toLowerCase() === matric.toLowerCase()
          );

          if (matchingRes) {
            setScores((prev) => ({
              ...prev,
              [matchingRes.id]: { ca, exam },
            }));
            updateResultScores(matchingRes.id, ca, exam);
            updatedCount++;
          }
        }
      }

      showToast(`Successfully imported scores for ${updatedCount} student(s) from CSV`, 'success');
    };
    reader.readAsText(file);
  };

  const handleConfirmSubmitToHOD = () => {
    courseResults.forEach((r) => {
      updateResultStatus(r.id, 'Submitted', currentUser.name);
    });
    setShowSubmitModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-border">
        <div>
          <div className="flex items-center gap-2 text-gold-dark font-mono text-xs font-semibold uppercase">
            <Award className="w-4 h-4" />
            <span>LECTURER GRADEBOOK & SCORE ENTRY</span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-ink">
            {course?.code ?? 'Course'} · {course?.title ?? 'Gradebook'}
          </h1>
          {/* Submodule Tabs */}
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-slate-900 text-emerald-400">
              Gradebook
            </span>
            <Link
              href={`/lecturer/courses/${courseId}/attendance`}
              className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              Attendance
            </Link>
            <Link
              href={`/lecturer/courses/${courseId}/materials`}
              className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              Materials
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleUploadCSV}
            className="hidden"
          />

          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-mono text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV Template</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold shadow-sm transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Submit to HOD</span>
          </button>
        </div>
      </div>

      {/* Audit Banner */}
      <div className="p-4 rounded-xl bg-ink text-parchment border border-gold/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
          <span>AUDIT ENGINE ACTIVE: Auto-computing Letter Grade (A to F) & Broadsheet Points</span>
        </div>
        <span className="text-gold font-bold">CA WEIGHT: 30% | EXAM WEIGHT: 70%</span>
      </div>

      {/* Spreadsheet Gradebook Table */}
      <div className="bg-white rounded-xl border border-slate-border p-6 shadow-academic space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-border text-slate font-mono uppercase bg-parchment-light">
                <th className="py-3 px-3">S/N</th>
                <th className="py-3 px-3">Matriculation No.</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3 text-center">CA Score (30)</th>
                <th className="py-3 px-3 text-center">Exam Score (70)</th>
                <th className="py-3 px-3 text-center">Total (100)</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3 text-center">Grade Point</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-border font-mono">
              {courseResults.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate font-mono text-xs">
                    No student registrations found for this course yet.
                  </td>
                </tr>
              ) : (
                courseResults.map((res, idx) => {
                  const caVal = scores[res.id]?.ca ?? res.caScore;
                  const examVal = scores[res.id]?.exam ?? res.examScore;
                  const total = caVal + examVal;

                  return (
                    <tr key={res.id} className="hover:bg-parchment-light/50">
                      <td className="py-3 px-3 text-slate font-bold">{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-ink">{res.matricNo}</td>
                      <td className="py-3 px-3 font-sans font-semibold text-ink">{res.studentName}</td>

                      {/* CA Input */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={30}
                          value={caVal}
                          onChange={(e) => handleScoreChange(res.id, 'ca', e.target.value)}
                          className="w-16 text-center font-bold px-2 py-1 border border-slate-border rounded bg-parchment-light text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                      </td>

                      {/* Exam Input */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={70}
                          value={examVal}
                          onChange={(e) => handleScoreChange(res.id, 'exam', e.target.value)}
                          className="w-16 text-center font-bold px-2 py-1 border border-slate-border rounded bg-parchment-light text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                      </td>

                      {/* Computed Total */}
                      <td className="py-3 px-3 text-center font-extrabold text-sm text-ink">
                        {total}
                      </td>

                      {/* Live Grade */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded border border-gold/30">
                          {res.grade}
                        </span>
                      </td>

                      {/* Grade Point */}
                      <td className="py-3 px-3 text-center font-bold">
                        {res.gradePoint.toFixed(1)}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                            res.status === 'Published'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : res.status === 'Submitted'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}
                        >
                          {res.status.toUpperCase()}
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

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-xl border border-slate-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-border pb-3">
              <div className="flex items-center gap-2 text-amber-600 font-mono text-xs font-bold uppercase">
                <AlertTriangle className="w-5 h-5" />
                <span>Broadsheet Submission Lock</span>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate hover:text-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-ink leading-relaxed">
              Are you sure you want to submit the score entries for <strong className="font-mono">{course?.code}</strong> to the Head of Department (HOD)?
              This will lock score edits and trigger departmental broadsheet compilation.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-ink font-mono text-xs font-semibold rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmitToHOD}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs font-bold uppercase rounded shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Confirm & Lock Submission</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
