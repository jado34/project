'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import { Users, BookOpen, GraduationCap, ChevronRight, Award, CalendarCheck, Mail } from 'lucide-react';

// Mock advisee data (in production this comes from Supabase)
const ADVISEES = [
  {
    id: 'usr_student_1',
    name: 'Olamide Adeleke',
    matricNo: 'MAPOLY/ND/CS/2024/0142',
    level: 'ND2',
    cgpa: 3.68,
    attendance: 84.8,
    registrationStatus: 'approved',
    email: 'olamide.adeleke@mapoly.edu.ng',
  },
  {
    id: 'usr_student_2',
    name: 'Babajide Ogundipe',
    matricNo: 'MAPOLY/HND/CS/2024/0089',
    level: 'HND2',
    cgpa: 3.12,
    attendance: 91.2,
    registrationStatus: 'approved',
    email: 'babajide.ogundipe@mapoly.edu.ng',
  },
  {
    id: 'usr_student_3',
    name: 'Chidimma Nwosu',
    matricNo: 'MAPOLY/ND/CS/2025/0015',
    level: 'ND1',
    cgpa: 2.87,
    attendance: 68.5,
    registrationStatus: 'pending',
    email: 'chidimma.nwosu@mapoly.edu.ng',
  },
  {
    id: 'usr_student_4',
    name: 'Emeka Okonkwo',
    matricNo: 'MAPOLY/ND/CS/2025/0031',
    level: 'ND1',
    cgpa: 3.44,
    attendance: 77.3,
    registrationStatus: 'approved',
    email: 'emeka.okonkwo@mapoly.edu.ng',
  },
  {
    id: 'usr_student_5',
    name: 'Fatimah Aliyu',
    matricNo: 'MAPOLY/HND/CS/2025/0004',
    level: 'HND1',
    cgpa: 3.91,
    attendance: 95.0,
    registrationStatus: 'approved',
    email: 'fatimah.aliyu@mapoly.edu.ng',
  },
];

function cgpaClass(gpa: number) {
  if (gpa >= 3.5) return { label: 'Upper Credit', color: 'text-nacos-green bg-nacos-green-light border-nacos-green/20' };
  if (gpa >= 3.0) return { label: 'Lower Credit', color: 'text-blue-700 bg-blue-50 border-blue-200' };
  if (gpa >= 2.0) return { label: 'Pass', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { label: 'Below Pass', color: 'text-red-700 bg-red-50 border-red-200' };
}

export default function AdviserStudents() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-nacos-green font-bold text-[10px] uppercase tracking-widest mb-1">
          <Users className="w-4 h-4" />
          Level Adviser · Advisees Directory
        </div>
        <h1 className="font-black text-2xl md:text-3xl text-ink">My Advisees</h1>
        <p className="text-sm text-ink-light mt-1">
          {ADVISEES.length} students under your advisory · Session 2025/2026
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Advisees', value: ADVISEES.length, color: 'text-ink', bg: 'bg-nacos-off-white' },
          { label: 'Reg. Approved', value: ADVISEES.filter((s) => s.registrationStatus === 'approved').length, color: 'text-nacos-green', bg: 'bg-nacos-green-light' },
          { label: 'Pending Approval', value: ADVISEES.filter((s) => s.registrationStatus === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Below 75% Attend.', value: ADVISEES.filter((s) => s.attendance < 75).length, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 border border-border`}>
            <div className="text-[10px] font-bold uppercase text-ink-light tracking-widest mb-1">{stat.label}</div>
            <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Advisees table */}
      <div className="nacos-card p-6 space-y-4">
        <h2 className="font-bold text-base text-ink">Student Directory</h2>
        <div className="overflow-x-auto">
          <table className="w-full nacos-table">
            <thead>
              <tr>
                {['Student Name', 'Matric No.', 'Level', 'CGPA', 'Attendance', 'Reg. Status', 'Action'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ADVISEES.map((student) => {
                const cls = cgpaClass(student.cgpa);
                const lowAttend = student.attendance < 75;
                return (
                  <tr key={student.id}>
                    <td>
                      <div className="font-semibold text-ink">{student.name}</div>
                      <div className="text-[10px] text-ink-light font-mono">{student.email}</div>
                    </td>
                    <td className="font-mono font-bold text-ink">{student.matricNo}</td>
                    <td>
                      <span className="chip chip-info">{student.level}</span>
                    </td>
                    <td>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${cls.color}`}>
                        {student.cgpa.toFixed(2)} — {cls.label}
                      </span>
                    </td>
                    <td>
                      <span className={`font-bold text-sm ${lowAttend ? 'text-red-600' : 'text-nacos-green'}`}>
                        {student.attendance.toFixed(1)}%
                      </span>
                      {lowAttend && (
                        <div className="text-[10px] text-red-500 font-bold">⚠ Below 75%</div>
                      )}
                    </td>
                    <td>
                      <span className={`chip ${student.registrationStatus === 'approved' ? 'chip-approved' : 'chip-pending'}`}>
                        {student.registrationStatus}
                      </span>
                    </td>
                    <td>
                      <a
                        href={`mailto:${student.email}`}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-nacos-green hover:underline"
                      >
                        <Mail className="w-3 h-3" /> Contact
                      </a>
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
