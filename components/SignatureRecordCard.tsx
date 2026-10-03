'use client';

import React, { useState, useEffect } from 'react';
import { ResultStatus } from '@/lib/types';
import { ShieldCheck, Clock, RefreshCw } from 'lucide-react';

interface LifecycleStep {
  status: ResultStatus;
  actor: string;
  timestamp: string;
  badgeClass: string;
  badgeBorder: string;
  chipText: string;
  description: string;
}

const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    status: 'Draft',
    actor: 'Dr. K. A. Mustapha (Course Lecturer)',
    timestamp: '2026-07-18 14:22:05 UTC',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-300',
    badgeBorder: 'border-gray-300',
    chipText: 'DRAFT IN PROGRESS',
    description: 'Score entry underway. Scores visible ONLY to the course lecturer.',
  },
  {
    status: 'Submitted',
    actor: 'Dr. K. A. Mustapha (Submitted to HOD)',
    timestamp: '2026-07-20 10:00:00 UTC',
    badgeClass: 'bg-pending-bg text-pending border-pending-border',
    badgeBorder: 'border-pending-border',
    chipText: 'SUBMITTED TO HOD',
    description: 'Gradebook locked & submitted for departmental broadsheet audit.',
  },
  {
    status: 'Approved',
    actor: 'Dr. A. O. Adebayo (HOD Approval)',
    timestamp: '2026-07-22 15:30:00 UTC',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
    badgeBorder: 'border-amber-300',
    chipText: 'APPROVED BY HOD',
    description: 'Broadsheet verified by HOD & Academic Standing Board.',
  },
  {
    status: 'Published',
    actor: 'System Auto-Publish & CGPA Engine',
    timestamp: '2026-07-25 08:00:00 UTC',
    badgeClass: 'bg-verified-bg text-verified border-verified-border',
    badgeBorder: 'border-verified-border',
    chipText: 'PUBLISHED TO STUDENT',
    description: 'Official result released. Student GPA & CGPA recalculated instantly.',
  },
];

export const SignatureRecordCard: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % LIFECYCLE_STEPS.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStep = LIFECYCLE_STEPS[activeStepIndex];

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl border border-slate-border shadow-academic-lg overflow-hidden transition-all duration-300">
      
      {/* Header Bar */}
      <div className="bg-ink px-6 py-4 border-b border-gold/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-gold animate-pulse" />
          <span className="font-mono text-xs text-gold uppercase tracking-widest font-semibold">
            LIVE ACADEMIC RECORD
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate-light">
            SESSION: 2025/2026-1
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="ml-2 text-gold/90 hover:text-gold text-xs flex items-center gap-1 font-mono bg-ink-light px-2 py-0.5 rounded border border-gold/20"
            title="Toggle playback animation"
          >
            <RefreshCw className={`w-3 h-3 ${isPlaying ? 'animate-spin' : ''}`} />
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
        </div>
      </div>

      {/* Record Content Surface */}
      <div className="p-6 space-y-5 bg-white">
        
        {/* Student & Course Details */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-border">
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate font-medium">
              MATRICULATION NO.
            </span>
            <span className="font-mono text-base font-bold text-ink tracking-tight">
              MAPOLY/ND/CS/2024/0142
            </span>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate font-medium">
              STUDENT NAME
            </span>
            <span className="font-sans text-sm font-semibold text-ink">
              Olamide Adeleke (ND2)
            </span>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate font-medium">
              COURSE CODE
            </span>
            <span className="font-mono text-sm font-bold text-gold-dark">
              COM 201 · 3.0 UNITS
            </span>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate font-medium">
              COURSE TITLE
            </span>
            <span className="font-sans text-xs font-medium text-ink leading-tight line-clamp-1">
              Data Structures & Algorithms
            </span>
          </div>
        </div>

        {/* Scores & Computed Grade Grid */}
        <div className="bg-parchment-light p-4 rounded-lg border border-slate-border grid grid-cols-4 gap-2 text-center">
          <div>
            <span className="block text-[10px] uppercase font-mono text-slate">CA (30)</span>
            <span className="font-mono text-lg font-bold text-ink">26</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono text-slate">EXAM (70)</span>
            <span className="font-mono text-lg font-bold text-ink">58</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono text-slate">TOTAL (100)</span>
            <span className="font-mono text-lg font-bold text-ink">84</span>
          </div>
          <div className="bg-gold/10 rounded border border-gold/30 flex flex-col justify-center">
            <span className="block text-[10px] uppercase font-mono text-gold-dark font-semibold">GRADE</span>
            <span className="font-mono text-xl font-extrabold text-gold-dark">A (4.0)</span>
          </div>
        </div>

        {/* Dynamic Result Lifecycle Chip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono font-semibold text-slate tracking-wider">
              LIFECYCLE STATUS:
            </span>
            <span className={`font-mono text-xs font-bold px-3 py-1 rounded-md border shadow-sm ${currentStep.badgeClass} transition-all duration-500`}>
              {currentStep.chipText}
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {LIFECYCLE_STEPS.map((step, idx) => (
              <button
                key={step.status}
                onClick={() => {
                  setActiveStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`h-2 rounded-full transition-all duration-500 ${
                  idx <= activeStepIndex
                    ? idx === 3
                      ? 'bg-verified'
                      : idx === 0
                      ? 'bg-slate-500'
                      : 'bg-pending'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Live Timestamp & Audit Metadata */}
        <div className="bg-parchment-light p-3.5 rounded-lg border border-slate-border text-xs font-mono space-y-1.5">
          <div className="flex items-center justify-between text-ink">
            <span className="flex items-center gap-1.5 font-semibold text-[11px]">
              <Clock className="w-3.5 h-3.5 text-gold-dark" />
              LAST AUDIT TIMESTAMP:
            </span>
            <span className="text-[11px] font-bold text-ink">{currentStep.timestamp}</span>
          </div>
          <div className="text-[11px] text-slate font-sans">
            <span className="font-semibold text-ink">ACTOR:</span> {currentStep.actor}
          </div>
          <div className="text-[11px] text-slate-600 font-sans italic border-t border-slate-200 pt-1.5 mt-1.5">
            "{currentStep.description}"
          </div>
        </div>

      </div>

      {/* Footer Assurance */}
      <div className="bg-ink px-6 py-2.5 text-center text-[11px] text-parchment font-mono flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-gold" />
        <span>AUTHENTICATED BY POSTGRES RLS ENGINE · AUDIT TRAIL #84920</span>
      </div>

    </div>
  );
};
