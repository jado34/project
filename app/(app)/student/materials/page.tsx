'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { FolderOpen, Download, Search, FileText, Bookmark, Check, Eye, X, BookOpen, Sparkles, HardDrive } from 'lucide-react';
import { Material } from '@/lib/types';

export default function StudentMaterials() {
  const { materials, toggleOfflineMaterial, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePreviewDoc, setActivePreviewDoc] = useState<Material | null>(null);

  const filteredMaterials = materials.filter((mat) => {
    if (selectedCategory !== 'all' && mat.category !== selectedCategory) return false;
    if (selectedLevel !== 'all' && mat.level !== selectedLevel) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = mat.title.toLowerCase().includes(q);
      const matchCode = mat.courseCode.toLowerCase().includes(q);
      const matchTopic = mat.topic.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchTopic) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-nacos-green-dark rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-nacos-green/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-nacos-green/20 border border-nacos-green/40 text-nacos-green text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            <FolderOpen className="w-3.5 h-3.5" /> MAPOLY CS DIGITAL KNOWLEDGE HUB
          </div>
          <h1 className="font-black text-2xl md:text-3xl text-white">
            Digital Course Library &amp; <span className="text-nacos-green">Past Exam Bank</span>
          </h1>
          <p className="text-white/65 text-xs md:text-sm max-w-2xl leading-relaxed">
            Access official Moshood Abiola Polytechnic Computer Science lecture slides, practical laboratory manuals,
            and past semester examination papers (2018–2025). Save materials for PWA offline study without mobile data.
          </p>
        </div>
      </div>

      {/* Filter Controls & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs font-bold">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'past_question', label: 'Past Exam Papers (2018-2025) 📑' },
            { id: 'lecture_note', label: 'Lecture Slides 📚' },
            { id: 'lab_manual', label: 'Lab Manuals 💻' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-emerald-400 font-bold shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Level Filter & Search Bar */}
        <div className="flex items-center gap-2">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Levels</option>
            <option value="ND1">ND1 Freshers</option>
            <option value="ND2">ND2</option>
            <option value="HND1">HND1</option>
            <option value="HND2">HND2</option>
          </select>

          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search course code or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <FolderOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-sm text-slate-800">No course materials matched your filter</h3>
            <p className="text-xs text-slate-500 font-mono">Try adjusting your search terms or selecting another category.</p>
          </div>
        ) : (
          filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              className={`nacos-card p-5 flex flex-col justify-between gap-4 transition-all hover:border-emerald-500/40 hover:shadow-lg ${
                mat.category === 'past_question' ? 'border-amber-200 bg-amber-50/20' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-nacos-green bg-nacos-green-light px-2.5 py-0.5 rounded-full border border-nacos-green/20">
                      {mat.courseCode}
                    </span>
                    {mat.category === 'past_question' && (
                      <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        EXAM PAPER {mat.examYear}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{mat.fileSize}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">{mat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{mat.description}</p>

                <div className="text-[10px] font-mono text-slate-400 space-y-0.5 pt-2 border-t border-slate-100">
                  <div>TOPIC: <span className="text-slate-700 font-semibold">{mat.topic}</span></div>
                  <div>LEVEL: <span className="text-slate-700 font-semibold">{mat.level || 'ND2'}</span> · <span className="text-emerald-700 font-semibold">{mat.downloadCount || 340} downloads</span></div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActivePreviewDoc(mat)}
                    className="px-3 py-2 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>

                  <button
                    onClick={() => toggleOfflineMaterial(mat.id)}
                    className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                      mat.isOfflineCached
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {mat.isOfflineCached ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Saved Offline
                      </>
                    ) : (
                      <>
                        <HardDrive className="w-3.5 h-3.5 text-slate-400" /> Save Offline
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => showToast(`Downloading ${mat.title}`, 'success')}
                  className="btn-primary w-full justify-center text-xs py-2.5 rounded-xl font-bold font-mono"
                >
                  <Download className="w-4 h-4" /> Download Official File
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Interactive Document Preview Modal */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white truncate max-w-md">{activePreviewDoc.title}</h3>
                  <p className="text-[10px] font-mono text-emerald-400">MAPOLY Computer Science · {activePreviewDoc.courseCode}</p>
                </div>
              </div>

              <button
                onClick={() => setActivePreviewDoc(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Viewer Body */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4 font-mono text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-100 text-slate-500">
                  <span>FACULTY OF SCIENCE &amp; TECHNOLOGY</span>
                  <span>DEPARTMENT OF COMPUTER SCIENCE</span>
                </div>

                <div className="text-center py-4 space-y-1">
                  <h2 className="font-extrabold text-sm text-slate-900 uppercase">{activePreviewDoc.title}</h2>
                  <p className="text-xs text-emerald-700 font-bold">{activePreviewDoc.topic}</p>
                  <p className="text-[11px] text-slate-500">Author: {activePreviewDoc.uploadedByName} · File Size: {activePreviewDoc.fileSize}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs space-y-3 leading-relaxed">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">DOCUMENT EXCERPT &amp; EXAMINATION STRUCTURE:</div>
                  <p>
                    <strong>SECTION A (COMPULSORY - 30 MARKS):</strong><br />
                    1. (a) Define a Binary Search Tree (BST) and demonstrate how node insertion maintains the BST invariant. [6 Marks]<br />
                    (b) Write a pseudocode or C function implementing Dijkstra’s Single Source Shortest Path Algorithm. [9 Marks]<br />
                    (c) Differentiate between Boyce-Codd Normal Form (BCNF) and 3rd Normal Form (3NF) with a database schema example. [15 Marks]
                  </p>
                  <p>
                    <strong>SECTION B (ANSWER ANY TWO QUESTIONS - 40 MARKS):</strong><br />
                    2. Explain time complexity analysis for QuickSort in average vs worst case scenarios. [20 Marks]
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">PWA Offline Cache Ready ✓</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    toggleOfflineMaterial(activePreviewDoc.id);
                  }}
                  className="px-4 py-2 bg-emerald-50 text-emerald-800 font-mono text-xs font-bold rounded-xl border border-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  {activePreviewDoc.isOfflineCached ? 'Cached Offline ✓' : 'Save for Offline Study'}
                </button>
                <button
                  onClick={() => setActivePreviewDoc(null)}
                  className="px-4 py-2 bg-slate-900 text-white font-mono text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
