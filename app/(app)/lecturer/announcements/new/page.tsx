'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { BellPlus, Send } from 'lucide-react';

export default function PostAnnouncement() {
  const { addAnnouncement, currentUser } = useApp();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [scope, setScope] = useState<'department' | 'level' | 'course'>('course');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    addAnnouncement({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.title || 'Course Lecturer',
      scope,
      title,
      body,
      pinned: false,
    });

    setTitle('');
    setBody('');
    alert('Announcement posted to student feed successfully!');
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="pb-4 border-b border-slate-border">
        <div className="flex items-center gap-2 text-gold-dark font-mono text-xs font-semibold uppercase">
          <BellPlus className="w-4 h-4" />
          <span>NEW ANNOUNCEMENT POSTING</span>
        </div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-ink">
          Broadcast Notice to Students
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-border shadow-academic space-y-4">
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate mb-1">Target Audience Scope</label>
          <select
            value={scope}
            onChange={(e: any) => setScope(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded border border-slate-border bg-parchment-light text-ink text-sm focus:outline-none focus:ring-2 focus:ring-gold font-mono"
          >
            <option value="course">Course Cohort (COM 201 Students)</option>
            <option value="level">Level Cohort (ND2 Students)</option>
            <option value="department">Entire Department</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate mb-1">Announcement Headline</label>
          <input
            type="text"
            placeholder="e.g. Test 2 Schedule & Room Assignment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded border border-slate-border bg-parchment-light text-ink text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate mb-1">Notice Content</label>
          <textarea
            rows={5}
            placeholder="Write clear instructions for students..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded border border-slate-border bg-parchment-light text-ink text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-ink hover:bg-ink-light text-parchment font-mono text-xs font-bold uppercase tracking-wider rounded shadow-academic flex items-center justify-center gap-2 transition-colors"
        >
          <Send className="w-4 h-4 text-gold" />
          <span>Publish Broadcast Notice</span>
        </button>
      </form>
    </div>
  );
}
