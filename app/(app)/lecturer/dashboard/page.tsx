'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { BookOpen, Users, Award, Radio, ShieldCheck, MapPin, Smartphone, AlertTriangle, CheckCircle2, KeyRound } from 'lucide-react';

export default function LecturerDashboard() {
  const { currentUser, courses, attendanceSessions, attendanceRecords, startLiveAttendanceSession, endLiveAttendanceSession } = useApp();
  const myCourses = courses.filter((c) => c.lecturerId === currentUser.id || c.lecturerId === 'usr_lecturer_1');

  const [selectedCourseId, setSelectedCourseId] = useState(myCourses[0]?.id || 'crs_201');
  const [sessionTopic, setSessionTopic] = useState('');
  const [requireGeo, setRequireGeo] = useState(true);
  const [requireDeviceLock, setRequireDeviceLock] = useState(true);
  const [radiusMeters, setRadiusMeters] = useState(50);

  const activeSession = attendanceSessions.find((s) => s.isActive && myCourses.some((c) => c.id === s.courseId));
  const activeRecords = activeSession ? attendanceRecords.filter((r) => r.attendanceSessionId === activeSession.id) : [];

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    startLiveAttendanceSession(selectedCourseId, sessionTopic || 'Classroom Lecture & Attendance Check', {
      requireGeo,
      allowedRadiusMeters: radiusMeters,
      requireDeviceLock,
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-nacos-green-dark rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-nacos-green/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-nacos-green/20 border border-nacos-green/40 text-nacos-green text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-1">
            Academic Staff Portal · MAPOLY CS
          </div>
          <h1 className="font-black text-2xl md:text-3xl text-white">
            Welcome, <span className="text-nacos-green">{currentUser.name}</span>
          </h1>
          <p className="text-white/60 text-xs font-mono">
            STAFF ID: <span className="text-nacos-green font-bold">{currentUser.staffId}</span>
            {' · '}TITLE: <span className="text-nacos-green font-bold">{currentUser.title}</span>
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Allocated Courses', value: myCourses.length.toString(), icon: <BookOpen className="w-5 h-5" />, sub: 'This Semester', iconBg: 'bg-nacos-green-light text-nacos-green-dark' },
          { label: 'Students Taught', value: '344', icon: <Users className="w-5 h-5" />, sub: 'Across all courses', iconBg: 'bg-blue-50 text-blue-700' },
          { label: 'Pending Submissions', value: '1 Course', icon: <Award className="w-5 h-5" />, sub: 'Awaiting HOD review', iconBg: 'bg-amber-50 text-amber-700' },
        ].map((m) => (
          <div key={m.label} className="stat-card flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${m.iconBg}`}>{m.icon}</div>
            <div>
              <div className="text-[10px] font-bold uppercase text-ink-light tracking-widest">{m.label}</div>
              <div className="text-2xl font-black text-ink">{m.value}</div>
              <div className="text-[10px] text-ink-light">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Classroom Attendance Control Panel (Anti-Proxy Engine) */}
      <div className="p-6 md:p-7 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-700/80 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-800/80 text-[10px] font-mono font-extrabold text-emerald-300 uppercase tracking-widest mb-1">
                LECTURE HALL ATTENDANCE GOVERNANCE
              </div>
              <h2 className="font-extrabold text-xl text-white font-sans tracking-tight">Live Session &amp; Anti-Proxy Control</h2>
            </div>
          </div>

          {activeSession ? (
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 bg-emerald-950/90 text-emerald-300 text-xs font-mono rounded-xl border border-emerald-700/80 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE SESSION PIN: <strong className="text-white text-sm font-bold tracking-widest font-mono">{activeSession.sessionCode}</strong>
              </span>
              <button
                onClick={() => endLiveAttendanceSession(activeSession.id)}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold font-mono rounded-xl transition-all shadow-md"
              >
                End &amp; Lock Session
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-mono bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              No Active Hall Session
            </span>
          )}
        </div>

        {!activeSession ? (
          <form onSubmit={handleStartSession} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-1.5">
                  Select Course
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700 text-slate-100 text-xs font-mono focus:ring-2 focus:ring-emerald-500 shadow-inner"
                >
                  {myCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-1.5">
                  Lecture Topic / Session Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Trees & Binary Search Tree Implementation"
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700 text-slate-100 text-xs font-sans placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 shadow-inner"
                />
              </div>
            </div>

            {/* Anti-Proxy Controls */}
            <div className="p-4.5 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireGeo}
                  onChange={(e) => setRequireGeo(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-white font-bold block flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Classroom Geofence Lock
                  </span>
                  <span className="text-slate-400 text-[11px]">Enforce GPS distance check within 50 meters of hall.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireDeviceLock}
                  onChange={(e) => setRequireDeviceLock(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-white font-bold block flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Device Signature Lock
                  </span>
                  <span className="text-slate-400 text-[11px]">Block multiple student check-ins from 1 device/phone.</span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 animate-pulse text-emerald-300" />
              <span>Generate Session PIN &amp; Launch Live Attendance</span>
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono bg-slate-800 p-3.5 rounded-xl border border-slate-700">
              <div>
                <span className="text-slate-400">Active Course:</span> <strong className="text-emerald-400">{activeSession.courseCode}</strong>
                {' · '}<span className="text-slate-400">Topic:</span> <span>{activeSession.topic}</span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-400">Checked In:</span> <strong className="text-emerald-400">{activeSession.presentCount} Students</strong>
                </div>
                <div>
                  <span className="text-slate-400">Geofence:</span> <strong className="text-white">50m Radius Lock</strong>
                </div>
              </div>
            </div>

            {/* Live Visual GPS Radar Grid */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Radio className="w-4 h-4 animate-pulse" /> LIVE CLASSROOM ATTENDANCE GPS RADAR GRID
                </span>
                <span className="text-slate-400">Ojere Hall Geofence Radar</span>
              </div>

              {/* Radar Graphic Canvas Container */}
              <div className="relative w-full h-64 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
                {/* Radar Sweep Animation */}
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(16,185,129,0.2)_0deg,transparent_60deg)] animate-[spin_4s_linear_infinite] origin-center pointer-events-none" />

                {/* Radar Rings */}
                <div className="absolute w-56 h-56 rounded-full border border-red-500/20 flex items-center justify-center pointer-events-none">
                  <span className="absolute top-1 text-[9px] font-mono text-red-500/60 uppercase">50m Out of Bounds</span>
                </div>
                <div className="absolute w-40 h-40 rounded-full border border-emerald-500/30 flex items-center justify-center pointer-events-none">
                  <span className="absolute top-1 text-[9px] font-mono text-emerald-400/60 uppercase">25m Radius</span>
                </div>
                <div className="absolute w-24 h-24 rounded-full border border-emerald-400/40 flex items-center justify-center pointer-events-none">
                  <span className="absolute top-1 text-[9px] font-mono text-emerald-400/80 uppercase">10m Core</span>
                </div>

                {/* Center Lecturer Origin Node */}
                <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg shadow-emerald-500/40 animate-pulse">
                  <MapPin className="w-4 h-4" />
                </div>

                {/* Live Student Radar Nodes */}
                {activeRecords.map((rec, idx) => {
                  // Position node dynamically around radar based on index and proxy state
                  const angle = (idx * 60 + 35) * (Math.PI / 180);
                  const distance = rec.proxyFlagged ? 115 : (idx % 2 === 0 ? 45 : 75);
                  const x = Math.cos(angle) * distance;
                  const y = Math.sin(angle) * distance;

                  return (
                    <div
                      key={rec.id}
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                      className="absolute z-20 transition-all duration-500 group"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[10px] shadow-md border cursor-pointer ${
                          rec.proxyFlagged
                            ? 'bg-red-600 text-white border-red-300 animate-ping'
                            : 'bg-emerald-500 text-slate-950 border-white'
                        }`}
                      >
                        {rec.studentName.charAt(0)}
                      </div>

                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-48 p-2 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono text-white z-30 shadow-xl pointer-events-none">
                        <div className="font-bold text-emerald-400">{rec.studentName}</div>
                        <div>{rec.matricNo}</div>
                        <div className="text-slate-400">Distance: {rec.distanceFromLecturerMeters || (rec.proxyFlagged ? 240 : 18)}m</div>
                        {rec.proxyFlagged && <div className="text-red-400 font-bold mt-0.5">⚠️ PROXY FLAGGED</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Radar Legend */}
              <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-900">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Verified In Hall (&lt;50m)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Flagged Out of Hall (&gt;50m)</span>
                </div>
                <span>1-Device Lock Active</span>
              </div>
            </div>

            {/* Live Check-in Audit Feed */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest font-mono">
                Live Security Audit &amp; Check-In Logs ({activeRecords.length})
              </h4>
              {activeRecords.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono italic">Waiting for students to submit PIN check-in...</p>
              ) : (
                <div className="divide-y divide-slate-800 bg-slate-950 rounded-xl overflow-hidden text-xs font-mono">
                  {activeRecords.map((r) => (
                    <div key={r.id} className="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-white font-bold font-sans">{r.studentName}</span>
                        <span className="text-slate-400 ml-2 font-mono">{r.matricNo}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-[11px]">{r.checkInTime}</span>
                        {r.proxyFlagged ? (
                          <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> PROXY FLAGGED (240m away)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED (18m)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Courses */}
      <div className="nacos-card p-6 space-y-4">
        <h2 className="font-bold text-base text-ink">My Allocated Teaching Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myCourses.map((course) => (
            <div key={course.id} className="p-5 rounded-xl bg-nacos-off-white border border-border space-y-4 hover:border-nacos-green/30 hover:shadow-card transition-all">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-nacos-green bg-nacos-green-light px-3 py-1 rounded-full border border-nacos-green/20">
                  {course.code}
                </span>
                <span className="text-xs text-ink-light font-mono">{course.level} · {course.unitLoad} CU</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-ink">{course.title}</h3>
                <p className="text-xs text-ink-light mt-0.5">Enrolled: {course.registeredCount} Students</p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                <Link href={`/lecturer/courses/${course.id}/grading`}
                  className="py-2 text-center text-xs font-bold text-white bg-nacos-green hover:bg-nacos-green-mid rounded-lg transition-all">
                  Gradebook
                </Link>
                <Link href={`/lecturer/courses/${course.id}/attendance`}
                  className="py-2 text-center text-xs font-semibold text-ink bg-white border border-border hover:border-nacos-green/30 rounded-lg transition-all">
                  Attendance
                </Link>
                <Link href={`/lecturer/courses/${course.id}/materials`}
                  className="py-2 text-center text-xs font-semibold text-ink bg-white border border-border hover:border-nacos-green/30 rounded-lg transition-all">
                  Materials
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
