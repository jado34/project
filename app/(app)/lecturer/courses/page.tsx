'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { BookOpen, Users, Award, ChevronRight, CalendarCheck, FolderOpen } from 'lucide-react';

export default function LecturerCourses() {
  const { currentUser, courses, results } = useApp();
  const myCourses = courses.filter(
    (c) => c.lecturerId === currentUser.id || c.lecturerId === 'usr_lecturer_1'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-nacos-green font-bold text-[10px] uppercase tracking-widest mb-1">
          <BookOpen className="w-4 h-4" />
          My Allocated Teaching Courses · Session 2025/2026
        </div>
        <h1 className="font-black text-2xl md:text-3xl text-ink">My Courses</h1>
        <p className="text-sm text-ink-light mt-1">
          Manage gradebooks, attendance registers, and course materials for each of your allocated courses.
        </p>
      </div>

      {/* Course Cards */}
      {myCourses.length === 0 ? (
        <div className="nacos-card p-12 text-center text-ink-light">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No courses allocated yet.</p>
          <p className="text-sm mt-1">Contact the HOD for course allocation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {myCourses.map((course) => {
            const courseResults = results.filter((r) => r.courseId === course.id);
            const submitted = courseResults.filter((r) => r.status === 'Submitted' || r.status === 'Approved' || r.status === 'Published').length;
            const pending = courseResults.length - submitted;

            return (
              <div
                key={course.id}
                className="nacos-card p-6 space-y-5 hover:border-nacos-green/40 hover:shadow-card transition-all"
              >
                {/* Course header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block font-bold text-sm text-nacos-green bg-nacos-green-light px-3 py-1 rounded-full border border-nacos-green/20 mb-2">
                      {course.code}
                    </span>
                    <h2 className="font-bold text-base text-ink leading-tight">{course.title}</h2>
                    <p className="text-xs text-ink-light mt-0.5 font-mono">
                      {course.level} · {course.unitLoad} Credit Units · {course.registeredCount} Students
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] font-bold uppercase text-ink-light tracking-widest">Scores</div>
                    <div className="text-lg font-black text-ink">{submitted}<span className="text-xs text-ink-light font-normal">/{courseResults.length}</span></div>
                    <div className="text-[10px] text-ink-light">submitted</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-nacos-green transition-all"
                    style={{ width: courseResults.length > 0 ? `${(submitted / courseResults.length) * 100}%` : '0%' }}
                  />
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                  <Link
                    href={`/lecturer/courses/${course.id}/grading`}
                    className="flex flex-col items-center gap-1 py-3 text-center text-xs font-bold text-white bg-nacos-green hover:bg-nacos-green-mid rounded-xl transition-all"
                  >
                    <Award className="w-4 h-4" />
                    Gradebook
                  </Link>
                  <Link
                    href={`/lecturer/courses/${course.id}/attendance`}
                    className="flex flex-col items-center gap-1 py-3 text-center text-xs font-semibold text-ink bg-nacos-off-white border border-border hover:border-nacos-green/30 hover:bg-white rounded-xl transition-all"
                  >
                    <CalendarCheck className="w-4 h-4 text-blue-600" />
                    Attendance
                  </Link>
                  <Link
                    href={`/lecturer/courses/${course.id}/materials`}
                    className="flex flex-col items-center gap-1 py-3 text-center text-xs font-semibold text-ink bg-nacos-off-white border border-border hover:border-nacos-green/30 hover:bg-white rounded-xl transition-all"
                  >
                    <FolderOpen className="w-4 h-4 text-amber-600" />
                    Materials
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
