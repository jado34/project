'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import { CalendarDays, MapPin, Clock, User } from 'lucide-react';

export default function StudentTimetable() {
  const { timetable, currentUser } = useApp();
  const myLevelSchedule = timetable.filter((t) => t.level === (currentUser.level || 'ND2'));
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-nacos-green font-bold text-[10px] uppercase tracking-widest mb-1">
          <CalendarDays className="w-4 h-4" /> Departmental Timetable
        </div>
        <h1 className="font-black text-2xl md:text-3xl text-ink">
          {currentUser.level || 'ND2'} Weekly Lecture Timetable
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {days.map((day) => {
          const slots = myLevelSchedule.filter((s) => s.day === day);
          return (
            <div key={day} className="nacos-card p-4 space-y-3">
              <div className="font-bold text-[10px] uppercase bg-nacos-green text-white py-1.5 rounded-lg text-center tracking-widest">
                {day}
              </div>
              {slots.length > 0 ? slots.map((slot) => (
                <div key={slot.id} className="p-3 rounded-xl bg-nacos-off-white border border-border space-y-2 hover:border-nacos-green/30 transition-colors">
                  <span className="font-bold text-[10px] text-nacos-green bg-nacos-green-light px-2 py-0.5 rounded-full border border-nacos-green/20 inline-block">
                    {slot.courseCode}
                  </span>
                  <h4 className="font-bold text-xs text-ink leading-snug">{slot.courseTitle}</h4>
                  <div className="text-[10px] text-ink-light space-y-1 pt-1.5 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-nacos-green" />
                      <span>{slot.startTime} – {slot.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-nacos-green" />
                      <span className="truncate">{slot.venue}</span>
                    </div>
                    <div className="flex items-center gap-1 text-ink-faint">
                      <User className="w-3 h-3" />
                      <span className="truncate">{slot.lecturerName}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center text-[10px] text-ink-faint italic">No lectures</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
