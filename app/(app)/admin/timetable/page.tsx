'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { CalendarDays, Plus, ShieldCheck, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface ClashResult {
  hasClash: boolean;
  type?: 'venue' | 'lecturer' | 'level';
  description?: string;
}

export default function AdminTimetable() {
  const { timetable, showToast } = useApp();
  const [filterLevel, setFilterLevel] = useState<string>('all');

  // Clash Detection Algorithm
  const detectClash = (slot: (typeof timetable)[0]): ClashResult => {
    for (const other of timetable) {
      if (other.id === slot.id) continue;
      if (other.day !== slot.day) continue;

      // Time overlap check
      const sameTime = slot.startTime === other.startTime || slot.endTime === other.endTime;

      if (sameTime) {
        if (other.venue.toLowerCase() === slot.venue.toLowerCase()) {
          return {
            hasClash: true,
            type: 'venue',
            description: `Venue double-booked with ${other.courseCode} in ${other.venue}`,
          };
        }
        if (other.lecturerName.toLowerCase() === slot.lecturerName.toLowerCase()) {
          return {
            hasClash: true,
            type: 'lecturer',
            description: `Lecturer ${other.lecturerName} double-booked with ${other.courseCode}`,
          };
        }
        if (other.level === slot.level) {
          return {
            hasClash: true,
            type: 'level',
            description: `${other.level} cohort double-booked with ${other.courseCode}`,
          };
        }
      }
    }

    return { hasClash: false };
  };

  const filteredTimetable = filterLevel === 'all'
    ? timetable
    : timetable.filter((t) => t.level === filterLevel);

  const totalClashes = timetable.filter((t) => detectClash(t).hasClash).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-border">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-mono text-xs font-semibold uppercase">
            <CalendarDays className="w-4 h-4" />
            <span>DEPARTMENTAL TIMETABLE BUILDER & CLASH DETECTOR ENGINE</span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-ink">
            Master Department Schedule & Collision Audit
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="font-mono text-xs font-bold px-3 py-2 rounded-lg bg-white border border-slate-300 text-ink shadow-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Academic Levels</option>
            <option value="ND1">ND1 Level</option>
            <option value="ND2">ND2 Level</option>
            <option value="HND1">HND1 Level</option>
            <option value="HND2">HND2 Level</option>
          </select>

          <button
            onClick={() => showToast('Timetable Slot Generator modal opened!', 'info')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase rounded shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lecture Slot</span>
          </button>
        </div>
      </div>

      {/* Clash Engine Status Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between font-mono text-xs ${
          totalClashes === 0
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
            : 'bg-rose-50 border-rose-300 text-rose-800'
        }`}
      >
        <div className="flex items-center gap-3">
          {totalClashes === 0 ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <div>
            <strong className="block text-sm">
              {totalClashes === 0
                ? 'CLASH ENGINE ACTIVE: 0 Schedule Collisions Detected'
                : `WARNING: ${totalClashes} Timetable Collision(s) Detected!`}
            </strong>
            <span className="text-[11px] opacity-80">
              Verifying real-time venue availability, lecturer allocation, and level cohort schedules.
            </span>
          </div>
        </div>

        <span className="font-bold text-xs bg-white px-3 py-1 rounded-full border border-slate-300 shadow-xs">
          TOTAL SLOTS: {timetable.length}
        </span>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl border border-slate-border p-6 shadow-academic space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-border text-slate font-mono uppercase bg-parchment-light">
                <th className="py-3 px-3">Day</th>
                <th className="py-3 px-3">Time Slot</th>
                <th className="py-3 px-3">Level</th>
                <th className="py-3 px-3">Course Code</th>
                <th className="py-3 px-3">Course Title</th>
                <th className="py-3 px-3">Venue</th>
                <th className="py-3 px-3">Lecturer</th>
                <th className="py-3 px-3 text-right">Collision Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-border font-mono">
              {filteredTimetable.map((slot) => {
                const clash = detectClash(slot);
                return (
                  <tr key={slot.id} className={clash.hasClash ? 'bg-rose-50/60' : 'hover:bg-parchment-light/50'}>
                    <td className="py-3.5 px-3 font-bold text-ink">{slot.day}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate">
                      {slot.startTime} - {slot.endTime}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-ink">{slot.level}</td>
                    <td className="py-3.5 px-3 font-bold text-emerald-700">{slot.courseCode}</td>
                    <td className="py-3.5 px-3 font-sans font-medium text-ink">{slot.courseTitle}</td>
                    <td className="py-3.5 px-3 font-semibold">{slot.venue}</td>
                    <td className="py-3.5 px-3 font-sans text-slate">{slot.lecturerName}</td>
                    <td className="py-3.5 px-3 text-right">
                      {clash.hasClash ? (
                        <span
                          title={clash.description}
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-300 uppercase animate-pulse"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>Conflict ({clash.type})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 uppercase">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>No Conflict</span>
                        </span>
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
