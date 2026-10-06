'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Plus,
  History,
  Clock,
  Radio,
  UserPlus,
  Search,
  KeyRound,
  ShieldCheck,
  StopCircle,
} from 'lucide-react';

export default function LecturerAttendanceClient({ params }: { params: any }) {
  const resolvedParams = params && typeof params.then === 'function' ? use(params) : params;
  const courseId = (resolvedParams as any)?.id || 'crs_201';

  const {
    courses,
    registrations,
    users,
    recordAttendanceSession,
    startLiveAttendanceSession,
    endLiveAttendanceSession,
    addWalkInStudentToSession,
    attendanceSessions,
    attendanceRecords,
  } = useApp();

  const course = courses.find((c) => c.id === courseId);

  // Active live session for this course (if any)
  const activeLiveSession = attendanceSessions.find(
    (s) => s.courseId === courseId && s.isActive
  );

  // Derive enrolled students for this course
  const approvedRegs = registrations.filter((r) => r.courseId === courseId && r.status === 'approved');
  const enrolledStudentIds = new Set(approvedRegs.map((r) => r.studentId));

  const enrolledStudents = users.filter(
    (u) => u.role === 'student' && (enrolledStudentIds.has(u.id) || approvedRegs.length === 0)
  );

  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [walkInSearch, setWalkInSearch] = useState('');

  // Attendance presence state: studentId -> boolean
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    enrolledStudents.forEach((st) => {
      init[st.id] = true;
    });
    return init;
  });

  const courseHistorySessions = attendanceSessions.filter((s) => s.courseId === courseId);

  // Filter students for walk-in addition
  const allStudents = users.filter((u) => u.role === 'student');
  const matchingWalkInStudents = walkInSearch.trim()
    ? allStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(walkInSearch.toLowerCase()) ||
          (s.matricNo && s.matricNo.toLowerCase().includes(walkInSearch.toLowerCase()))
      )
    : [];

  const toggleStatus = (studentId: string) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const setAllStatus = (present: boolean) => {
    const updated: Record<string, boolean> = {};
    enrolledStudents.forEach((st) => {
      updated[st.id] = present;
    });
    setAttendanceMap(updated);
  };

  const handleStartLive = () => {
    startLiveAttendanceSession(courseId, sessionTopic || 'Live Lecture Hall Check-In');
  };

  const handleSaveRegister = () => {
    const presences = enrolledStudents.map((st) => ({
      studentId: st.id,
      studentName: st.name,
      matricNo: st.matricNo || 'MAPOLY/STUDENT',
      present: attendanceMap[st.id] ?? true,
    }));

    recordAttendanceSession(courseId, sessionTopic, sessionDate, presences);
    setSessionTopic('');
  };

  // Get records for active live session
  const activeSessionRecords = activeLiveSession
    ? attendanceRecords.filter((r) => r.attendanceSessionId === activeLiveSession.id)
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-border">
        <div>
          <div className="flex items-center gap-2 text-gold-dark font-mono text-xs font-semibold uppercase">
            <CalendarCheck className="w-4 h-4" />
            <span>CLASS SESSION ATTENDANCE REGISTER</span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-ink">
            {course?.code ?? 'Course'} · {course?.title ?? 'Attendance'}
          </h1>
          {/* Quick Submodule Tabs */}
          <div className="flex items-center gap-2 mt-2">
            <Link
              href={`/lecturer/courses/${courseId}/grading`}
              className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              Gradebook
            </Link>
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-slate-900 text-emerald-400">
              Attendance
            </span>
            <Link
              href={`/lecturer/courses/${courseId}/materials`}
              className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              Materials
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!activeLiveSession ? (
            <button
              onClick={handleStartLive}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase rounded shadow-sm transition-colors flex items-center gap-2"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Start Live Hall Check-In</span>
            </button>
          ) : (
            <button
              onClick={() => endLiveAttendanceSession(activeLiveSession.id)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase rounded shadow-sm transition-colors flex items-center gap-2"
            >
              <StopCircle className="w-4 h-4" />
              <span>End Live Session</span>
            </button>
          )}

          <button
            onClick={() => setAllStatus(true)}
            className="px-3.5 py-2 bg-white border border-slate-border text-ink hover:bg-parchment-light font-mono text-xs font-semibold rounded shadow-sm transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={handleSaveRegister}
            className="px-4 py-2 bg-gold hover:bg-gold-hover text-ink font-mono text-xs font-bold uppercase rounded shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Save Register</span>
          </button>
        </div>
      </div>

      {/* Live Active Session Banner */}
      {activeLiveSession && (
        <div className="p-6 rounded-2xl bg-slate-900 text-parchment border-2 border-emerald-500/50 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-3.5 w-3.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <div>
                <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest block">
                  LIVE CLASSROOM BROADCAST ACTIVE
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  {activeLiveSession.topic}
                </h3>
              </div>
            </div>

            {/* Huge PIN Code Banner for Hall Projection */}
            <div className="bg-slate-800 border border-emerald-500/30 rounded-xl px-6 py-3 text-center">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-widest block">
                HALL CHECK-IN PIN
              </span>
              <span className="font-mono text-3xl md:text-4xl font-extrabold text-gold tracking-widest">
                {activeLiveSession.sessionCode}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <span className="text-slate-300">
              Direct students to open DIMS on mobile and enter PIN <strong className="text-gold">{activeLiveSession.sessionCode}</strong> to check in.
            </span>
            <span className="text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800">
              Live Participants Checked In: {activeLiveSession.presentCount}
            </span>
          </div>

          {/* Quick Live Check-In Feed */}
          {activeSessionRecords.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
                Real-Time Live Check-Ins
              </span>
              <div className="flex flex-wrap gap-2">
                {activeSessionRecords.map((r) => (
                  <span
                    key={r.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-emerald-300 border border-emerald-500/20 text-xs font-mono"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <strong>{r.studentName}</strong> ({r.matricNo}) · {r.checkInTime}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Walk-In Student Search & Add */}
      <div className="bg-white rounded-xl border border-slate-border p-6 shadow-academic space-y-4">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-gold-dark" />
          <h2 className="font-display font-bold text-lg text-ink">
            Live Hall Walk-In Student Lookup & Instant Entry
          </h2>
        </div>
        <p className="text-xs text-slate">
          If a student arrives in class without prior course registration, search their Matric No or Name to append them directly to the active lecture session.
        </p>

        <div className="relative max-w-lg">
          <div className="relative">
            <Search className="w-4 h-4 text-slate absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search student by Matric No. or Name (e.g. MAPOLY/ND/CS...)"
              value={walkInSearch}
              onChange={(e) => setWalkInSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-border bg-parchment-light text-ink text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {matchingWalkInStudents.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-border rounded-xl shadow-2xl z-20 max-h-56 overflow-y-auto divide-y divide-slate-border">
              {matchingWalkInStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-3 hover:bg-parchment-light flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <span className="font-bold text-ink block font-sans">{st.name}</span>
                    <span className="font-mono text-slate text-[11px]">
                      {st.matricNo || 'MAPOLY/STUDENT'} · {st.level || 'ND2'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (activeLiveSession) {
                        addWalkInStudentToSession(activeLiveSession.id, st.id);
                      } else {
                        setAttendanceMap((prev) => ({ ...prev, [st.id]: true }));
                      }
                      setWalkInSearch('');
                    }}
                    className="px-3 py-1 bg-gold hover:bg-gold-hover text-ink font-mono text-[11px] font-bold uppercase rounded shadow-sm"
                  >
                    + Add to Register
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Session Metadata Inputs */}
      <div className="bg-white rounded-xl border border-slate-border p-6 shadow-academic space-y-4">
        <h2 className="font-display font-bold text-lg text-ink">Lecture Session Register Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-mono font-bold uppercase text-slate mb-1">
              Lecture / Practical Topic
            </label>
            <input
              type="text"
              placeholder="e.g., Binary Search Trees & Graph Traversals"
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
              className="w-full px-3.5 py-2 rounded border border-slate-border bg-parchment-light text-ink text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate mb-1">
              Session Date
            </label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded border border-slate-border bg-parchment-light text-ink text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
      </div>

      {/* Roster Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-border p-6 shadow-academic space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-ink">
            Course Roster ({enrolledStudents.length} Students)
          </h2>
          <span className="font-mono text-xs text-slate">
            Present Count: {Object.values(attendanceMap).filter(Boolean).length} / {enrolledStudents.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-border text-slate font-mono uppercase bg-parchment-light">
                <th className="py-2.5 px-3">Matric No.</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3 text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-border">
              {enrolledStudents.map((st) => {
                const isPresent = attendanceMap[st.id] ?? true;
                return (
                  <tr key={st.id} className="hover:bg-parchment-light/50">
                    <td className="py-3 px-3 font-mono font-bold text-ink">{st.matricNo || 'MAPOLY/STUDENT'}</td>
                    <td className="py-3 px-3 font-sans font-semibold text-ink">{st.name}</td>
                    <td className="py-3 px-3 font-mono text-slate">{st.level || 'ND2'}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => toggleStatus(st.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded font-mono text-xs font-bold transition-colors ${
                          isPresent
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100'
                        }`}
                      >
                        {isPresent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{isPresent ? 'PRESENT' : 'ABSENT'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Session Logs */}
      <div className="bg-white rounded-xl border border-slate-border p-6 shadow-academic space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gold-dark" />
          <h2 className="font-display font-bold text-lg text-ink">
            Previous Attendance Registers ({courseHistorySessions.length})
          </h2>
        </div>

        {courseHistorySessions.length === 0 ? (
          <p className="text-xs text-slate font-mono italic">No previous attendance registers logged for this course yet.</p>
        ) : (
          <div className="space-y-3">
            {courseHistorySessions.map((sess) => (
              <div
                key={sess.id}
                className="p-3.5 rounded-lg bg-parchment-light border border-slate-border flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink block">{sess.topic}</span>
                    {sess.sessionCode && (
                      <span className="bg-gold/20 text-gold-dark px-2 py-0.5 rounded text-[10px] font-bold">
                        PIN: {sess.sessionCode}
                      </span>
                    )}
                  </div>
                  <span className="text-slate flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> Date: {sess.date}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gold-dark block">
                    {sess.presentCount} / {sess.totalStudents} Present
                  </span>
                  <span className="text-[10px] text-slate">
                    ({((sess.presentCount / (sess.totalStudents || 1)) * 100).toFixed(0)}% turn-out)
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
