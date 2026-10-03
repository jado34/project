'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import { Users, BookOpen, ShieldCheck } from 'lucide-react';

export default function AdminAllocations() {
  const { courses, users } = useApp();
  const lecturers = users.filter((u) => u.role === 'lecturer' || u.role === 'hod' || u.role === 'adviser');

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-border">
        <div className="flex items-center gap-2 text-gold-dark font-mono text-xs font-semibold uppercase">
          <Users className="w-4 h-4" />
          <span>STAFF TEACHING LOAD & COURSE ALLOCATION</span>
        </div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-ink">
          Academic Staff Course Assignments
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-border p-6 shadow-academic space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-border text-slate font-mono uppercase bg-parchment-light">
                <th className="py-3 px-3">Course Code</th>
                <th className="py-3 px-3">Course Title</th>
                <th className="py-3 px-3">Level</th>
                <th className="py-3 px-3">Unit Load</th>
                <th className="py-3 px-3">Assigned Lecturer</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-border font-mono">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-parchment-light/50">
                  <td className="py-3.5 px-3 font-bold text-gold-dark text-sm">{course.code}</td>
                  <td className="py-3.5 px-3 font-sans font-semibold text-ink text-sm">{course.title}</td>
                  <td className="py-3.5 px-3 font-bold">{course.level}</td>
                  <td className="py-3.5 px-3 font-semibold">{course.unitLoad} CU</td>
                  <td className="py-3.5 px-3 font-sans font-medium text-ink">{course.lecturerName || 'Dr. K. A. Mustapha'}</td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => alert(`Reassigning ${course.code}`)}
                      className="px-3 py-1 bg-ink text-gold hover:bg-ink-light font-bold rounded shadow-sm"
                    >
                      Reassign Lecturer
                    </button>
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
