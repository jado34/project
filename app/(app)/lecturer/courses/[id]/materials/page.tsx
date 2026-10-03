'use client';

import React, { useState, use } from 'react';
import { useApp } from '@/lib/context';
import { FolderPlus, Upload, FileText, CheckCircle2, FileUp, Sparkles, Trash2, Eye } from 'lucide-react';
import { Material } from '@/lib/types';

export default function LecturerMaterials({ params }: { params: any }) {
  const resolvedParams = params && typeof params.then === 'function' ? use(params) : params;
  const courseId = (resolvedParams as any)?.id || 'crs_201';

  const { materials, addMaterial, currentUser, courses, showToast } = useApp();
  const course = courses.find((c) => c.id === courseId);

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'lecture_note' | 'past_question' | 'lab_manual' | 'syllabus'>('lecture_note');
  const [examYear, setExamYear] = useState('2024');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.pdf') && file.type !== 'application/pdf') {
        showToast('Please select an official PDF document (.pdf)', 'error');
        return;
      }
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setSelectedFile({ name: file.name, size: sizeMb });
      if (!title) {
        setTitle(file.name.replace(/\.pdf$/i, ''));
      }
      showToast(`PDF attached: ${file.name} (${sizeMb})`, 'info');
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !topic) {
      showToast('Please specify resource title and course topic', 'error');
      return;
    }

    const fileName = selectedFile ? selectedFile.name : (title.endsWith('.pdf') ? title : `${title}.pdf`);
    const fileSize = selectedFile ? selectedFile.size : '2.4 MB';

    addMaterial({
      courseId,
      courseCode: course?.code ?? 'COM',
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name,
      title: fileName,
      description: description || `Official MAPOLY CS Department resource for ${course?.code ?? 'COM'}.`,
      fileUrl: '#',
      fileSize,
      fileType: 'PDF Document',
      topic,
      category,
      examYear: category === 'past_question' ? examYear : undefined,
      level: course?.level || 'ND2',
      downloadCount: 0,
      isOfflineCached: true,
    });

    showToast(`Successfully published "${fileName}" to student portal ✓`, 'success');
    setTitle('');
    setTopic('');
    setDescription('');
    setSelectedFile(null);
  };

  const courseMaterials = materials.filter((m) => m.courseId === courseId);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-emerald-700 font-mono text-xs font-bold uppercase tracking-widest mb-1">
          <FolderPlus className="w-4 h-4" /> COURSE MATERIALS &amp; EXAM BANK UPLOADER
        </div>
        <h1 className="font-bold text-2xl md:text-3xl text-slate-900">
          Upload {course?.code ?? 'Course'} PDF Resource
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-1">
          Publish official PDF slides, practical manuals, and past exam question papers directly to student dashboards.
        </p>
      </div>

      {/* Interactive Upload Form */}
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-5">
        {/* PDF Dropzone */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate-700 tracking-wider mb-2">
            Select PDF File Document *
          </label>
          <div className="relative border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 rounded-2xl p-6 text-center transition-all">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            {selectedFile ? (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-md">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="font-bold text-sm text-slate-900 font-mono">{selectedFile.name}</div>
                <div className="text-xs text-emerald-700 font-mono font-semibold">{selectedFile.size} · PDF Attached ✓</div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-xs font-mono text-rose-600 hover:underline inline-flex items-center gap-1 mt-1 z-20 relative"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <FileUp className="w-6 h-6" />
                </div>
                <div className="font-bold text-sm text-slate-900">Click or drag &amp; drop PDF file here</div>
                <div className="text-xs text-slate-500 font-mono">Supports official MAPOLY course slides, lab manuals &amp; past question PDFs</div>
              </div>
            )}
          </div>
        </div>

        {/* Resource Meta Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-700 tracking-wider mb-1.5">
              Resource Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500"
            >
              <option value="lecture_note">Lecture Slides / Reference Notes 📚</option>
              <option value="past_question">Past Examination Question Paper 📑</option>
              <option value="lab_manual">Practical Laboratory Manual 💻</option>
              <option value="syllabus">Course Syllabus &amp; Scheme of Work 📋</option>
            </select>
          </div>

          {category === 'past_question' ? (
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                Examination Session Year *
              </label>
              <select
                value={examYear}
                onChange={(e) => setExamYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="2025">2024/2025 Session</option>
                <option value="2024">2023/2024 Session</option>
                <option value="2023">2022/2023 Session</option>
                <option value="2022">2021/2022 Session</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                Resource Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Lecture 05: Dynamic Programming & Recursion"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate-700 tracking-wider mb-1.5">
            Course Topic / Module *
          </label>
          <input
            type="text"
            placeholder="e.g. Week 5 - Binary Search Trees & Graph Algorithms"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate-700 tracking-wider mb-1.5">
            Resource Description &amp; Instructions
          </label>
          <textarea
            rows={3}
            placeholder="Brief explanation of slides or lab exercises..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Publish PDF to Student Portal &amp; PWA Offline Store</span>
        </button>
      </form>

      {/* Previously Uploaded Materials */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-base text-slate-900 flex items-center justify-between">
          <span>Uploaded Course PDF Resources ({courseMaterials.length})</span>
          <span className="text-xs font-mono text-emerald-700 font-semibold">{course?.code}</span>
        </h2>
        {courseMaterials.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono italic">No PDF lecture resources uploaded for this course yet.</p>
        ) : (
          <div className="space-y-3">
            {courseMaterials.map((m) => (
              <div key={m.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-slate-900 block">{m.title}</span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {m.topic} · {m.fileSize} · Category: <strong className="text-emerald-700">{m.category || 'lecture_note'}</strong>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="font-mono text-slate-400 text-[11px]">{new Date(m.createdAt).toLocaleDateString()}</span>
                  <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold text-[10px]">
                    PUBLISHED ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
