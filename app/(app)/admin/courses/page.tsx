'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { BookOpen, Users, Plus, Edit2, Trash2, ChevronRight, Check } from 'lucide-react';

export default function AdminCourses() {
  const { courses, users } = useApp();
  const lecturers = users.filter((u) => u.role === 'lecturer');
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.level.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-nacos-green font-bold text-[10px] uppercase tracking-widest mb-1">
            <BookOpen className="w-4 h-4" />
            HOD · Course Administration
          </div>
          <h1 className="font-black text-2xl md:text-3xl text-ink">Course Allocation</h1>
          <p className="text-sm text-ink-light mt-1">
            {courses.length} courses in the department · {lecturers.length} lecturers on staff
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary inline-flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Add Course Form (collapsible) */}
      {showForm && (
        <div className="nacos-card p-6 border-nacos-green/30 space-y-4">
          <h2 className="font-bold text-base text-ink">New Course Entry</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Course Code', placeholder: 'e.g. COM 301' },
              { label: 'Course Title', placeholder: 'e.g. Computer Networks' },
              { label: 'Level', placeholder: 'e.g. ND2 / HND1' },
              { label: 'Credit Units', placeholder: 'e.g. 3' },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-[10px] font-bold uppercase text-ink-light tracking-widest mb-1">{f.label}</label>
                <input
                  type="text"
                  placeholder={f.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-nacos-off-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-nacos-green"
                />
              </div>
            ))}
            <div>
              <label className="block text-[10px] font-bold uppercase text-ink-light tracking-widest mb-1">Assign Lecturer</label>
              <select className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-nacos-off-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-nacos-green">
                <option value="">— Select Lecturer —</option>
                {lecturers.map((l) => (
                  <option key={l.id} value={l.id}>{l.name} ({l.title})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn-primary text-sm">
              <Check className="w-4 h-4" /> Save Course
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-xs">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-nacos-green"
        />
      </div>

      {/* Courses Table */}
      <div className="nacos-card p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full nacos-table">
            <thead>
              <tr>
                {['Code', 'Title', 'Level', 'Units', 'Enrolled', 'Assigned Lecturer', 'Semester', 'Actions'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => {
                const lecturer = users.find((u) => u.id === course.lecturerId);
                return (
                  <tr key={course.id}>
                    <td>
                      <span className="font-bold text-nacos-green bg-nacos-green-light px-2 py-0.5 rounded border border-nacos-green/20 text-xs">
                        {course.code}
                      </span>
                    </td>
                    <td className="font-semibold text-ink">{course.title}</td>
                    <td><span className="chip chip-info">{course.level}</span></td>
                    <td className="font-mono">{course.unitLoad} CU</td>
                    <td className="font-mono font-bold">{course.registeredCount}</td>
                    <td className="text-sm">
                      {lecturer ? (
                        <div>
                          <div className="font-semibold text-ink">{lecturer.name}</div>
                          <div className="text-[10px] text-ink-light">{lecturer.title}</div>
                        </div>
                      ) : (
                        <span className="chip chip-pending">Unassigned</span>
                      )}
                    </td>
                    <td className="text-xs text-ink-light font-mono">First Sem 2025/26</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="text-nacos-green hover:text-nacos-green-mid" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
