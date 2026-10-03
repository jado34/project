'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import { Bell, Pin } from 'lucide-react';

export default function StudentAnnouncements() {
  const { announcements } = useApp();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-nacos-green font-bold text-[10px] uppercase tracking-widest mb-1">
          <Bell className="w-4 h-4" /> Departmental Announcement Feed
        </div>
        <h1 className="font-black text-2xl md:text-3xl text-ink">Official Bulletins & Broadcasts</h1>
      </div>

      <div className="space-y-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`nacos-card p-5 space-y-3 ${ann.pinned ? 'border-amber-300 bg-amber-50/30' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {ann.pinned && (
                  <span className="inline-flex items-center gap-1 chip chip-warning">
                    <Pin className="w-2.5 h-2.5" /> PINNED
                  </span>
                )}
                <span className="chip chip-success">{ann.scope}</span>
              </div>
              <span className="text-[9px] text-ink-faint">{new Date(ann.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className="font-bold text-base text-ink">{ann.title}</h3>
            <p className="text-sm text-ink-light leading-relaxed">{ann.body}</p>
            <div className="text-[10px] text-ink-faint pt-2 border-t border-border">
              Posted by: <strong className="text-ink-light">{ann.authorName}</strong> ({ann.authorRole})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
