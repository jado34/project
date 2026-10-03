'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { BookOpenCheck, CheckCircle2, Plus, Check } from 'lucide-react';

export default function StudentCourseRegistration() {
  const { currentUser, courses, registrations, registerCourse, courseForms, uploadCourseForm } = useApp();
  const myLevelCourses = courses.filter((c) => c.level === (currentUser.level || 'ND2'));
  const myRegistrations = registrations.filter((r) => r.studentId === currentUser.id);
  const registeredCourseIds = new Set(myRegistrations.map((r) => r.courseId));
  const currentUnits = myRegistrations.reduce((sum, r) => sum + r.unitLoad, 0);
  const minUnits = 15;
  const maxUnits = 24;
  const isValid = currentUnits >= minUnits && currentUnits <= maxUnits;

  // Student's uploaded course form
  const myCourseForm = courseForms.find((f) => f.studentId === currentUser.id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDocPreview, setShowDocPreview] = useState(false);

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setTimeout(() => {
      uploadCourseForm({
        name: selectedFile.name,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        url: '#',
      });
      setSelectedFile(null);
      setUploading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-nacos-green font-bold text-[10px] uppercase tracking-widest mb-1">
            <BookOpenCheck className="w-4 h-4" /> Course Registration Portal
          </div>
          <h1 className="font-black text-2xl md:text-3xl text-ink">
            {currentUser.level || 'ND2'} Semester Course Selection
          </h1>
        </div>
        <div className="nacos-card p-4 flex items-center gap-5">
          <div>
            <span className="block text-[9px] font-bold uppercase text-ink-light tracking-widest">Total Units</span>
            <div className="flex items-baseline gap-1">
              <span className="font-black text-2xl text-ink">{currentUnits}</span>
              <span className="text-xs text-ink-light">/ {maxUnits} MAX</span>
            </div>
          </div>
          <span className={`chip text-xs px-3 py-1.5 ${isValid ? 'chip-approved' : currentUnits < minUnits ? 'chip-info' : 'chip-error'}`}>
            {currentUnits < minUnits ? `UNDERLOAD` : isValid ? 'VALID ✓' : 'OVERLOAD'}
          </span>
        </div>
      </div>

      {/* Official MAPOLY School Portal Course Form Upload Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-lg">
              📄
            </div>
            <div>
              <span className="text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-widest block">
                OFFICIAL MAPOLY SCHOOL PORTAL INTEGRATION
              </span>
              <h2 className="font-display font-bold text-lg text-white">Upload Generated School Portal Course Form</h2>
            </div>
          </div>

          {myCourseForm ? (
            <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 uppercase">
              Form Verified &amp; Courses Auto-Approved ✓
            </span>
          ) : (
            <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-mono rounded-full border border-slate-700">
              Upload PDF for Instant Clearance
            </span>
          )}
        </div>

        <p className="text-xs text-slate-300">
          Upload your official <strong>MAPOLY School Portal Course Registration Form (PDF/Image)</strong>. Upon upload, your selected courses are <strong>automatically approved</strong> for CA gradebook &amp; attendance entry.
        </p>

        {myCourseForm ? (
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">{myCourseForm.fileName}</span>
              <span className="text-slate-400 font-mono text-[11px]">
                Uploaded on {new Date(myCourseForm.uploadedAt).toLocaleDateString()} ({myCourseForm.fileSize}) — <span className="text-emerald-400 font-bold">Auto-Verified ✓</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDocPreview(true)}
                className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg font-mono font-bold text-xs transition-colors"
              >
                Preview Document ↗
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFileUpload} className="flex flex-col sm:flex-row gap-3">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-400 cursor-pointer bg-slate-800 rounded-xl border border-slate-700 p-1"
            />
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-colors shrink-0"
            >
              {uploading ? 'Verifying...' : 'Upload & Auto-Approve'}
            </button>
          </form>
        )}
      </div>

      {/* Document Preview Modal */}
      {showDocPreview && myCourseForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>MAPOLY Official Portal Form Preview</span>
              </h3>
              <button onClick={() => setShowDocPreview(false)} className="text-slate-400 hover:text-white font-mono font-bold">
                ✕ Close
              </button>
            </div>

            <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3 font-mono">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">
                PDF
              </div>
              <h4 className="font-bold text-white text-sm">{myCourseForm.fileName}</h4>
              <p className="text-xs text-slate-400">
                Student: <strong>{myCourseForm.studentName}</strong> ({myCourseForm.matricNo})
              </p>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-700 text-xs">
                  Verification Status: VERIFIED &amp; COURSES AUTO-APPROVED ✓
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDocPreview(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Adviser Clearance Status Banner */}
      <div className="p-4 rounded-xl bg-nacos-green-light border border-nacos-green/25 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-nacos-green/20 text-nacos-green-dark flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm text-ink block font-sans">Course Registration Clearance Status</span>
            <span className="text-xs text-ink-light">Adviser: {currentUser.adviserName || 'Mrs. F. K. Babalola'}</span>
          </div>
        </div>
        <span className="font-bold text-xs text-nacos-green-dark font-mono uppercase">
          {myCourseForm ? 'AUTO-VERIFIED VIA PORTAL FORM ✓' : 'PENDING PORTAL FORM UPLOAD'}
        </span>
      </div>

      {/* Course catalog */}
      <div className="nacos-card p-6 space-y-4">
        <h2 className="font-bold text-base text-ink">Approved Course Catalog — {currentUser.level || 'ND2'}</h2>
        <div className="overflow-x-auto">
          <table className="w-full nacos-table">
            <thead>
              <tr>
                {['Code','Title','Units','Type','Prerequisites','Action'].map(h=>(
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myLevelCourses.map((course) => {
                const isReg = registeredCourseIds.has(course.id);
                return (
                  <tr key={course.id}>
                    <td className="font-bold text-nacos-green">{course.code}</td>
                    <td className="font-medium">{course.title}</td>
                    <td className="font-mono">{course.unitLoad} CU</td>
                    <td>
                      <span className={`chip ${course.type === 'core' ? 'chip-approved' : 'chip-info'}`}>
                        {course.type}
                      </span>
                    </td>
                    <td className="text-ink-light text-xs">
                      {course.prerequisites.length > 0 ? course.prerequisites.join(', ') : 'None'}
                    </td>
                    <td className="text-right">
                      {isReg ? (
                        <span className="inline-flex items-center gap-1 chip chip-approved px-3 py-1.5 rounded-lg">
                          <Check className="w-3 h-3" /> Registered
                        </span>
                      ) : (
                        <button onClick={() => registerCourse(course.id)}
                          className="inline-flex items-center gap-1 btn-primary !py-1.5 !px-3 !text-xs !rounded-lg">
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
