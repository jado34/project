'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { UserRole, AcademicLevel } from '@/lib/types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  GraduationCap,
  BookOpen,
  UserCheck,
  X,
  CheckCircle2,
  Mail,
  Hash,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

const roleChip: Record<UserRole, string> = {
  student: 'chip-approved',
  lecturer: 'chip-info',
  adviser: 'chip-warning',
  hod: 'chip-error',
  admin: 'chip-draft',
};

const roleLabel: Record<UserRole, string> = {
  student: 'Student',
  lecturer: 'Lecturer',
  adviser: 'Course Adviser',
  hod: 'Head of Dept (HOD)',
  admin: 'System Admin',
};

export default function AdminUsers() {
  const { currentUser, users, addUser, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [matricNo, setMatricNo] = useState('');
  const [staffId, setStaffId] = useState('');
  const [title, setTitle] = useState('Dr.');
  const [level, setLevel] = useState<AcademicLevel>('ND1');
  const [programme, setProgramme] = useState('Computer Science');
  const [adviserForLevel, setAdviserForLevel] = useState<AcademicLevel>('ND1');

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.matricNo && u.matricNo.toLowerCase().includes(q)) ||
      (u.staffId && u.staffId.toLowerCase().includes(q)) ||
      u.role.toLowerCase().includes(q);

    return matchRole && matchSearch;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      showToast('Please enter full name and email address', 'error');
      return;
    }

    if (role === 'student') {
      const finalMatric = matricNo.trim() || `MAPOLY/ND/CS/2026/${Math.floor(1000 + Math.random() * 9000)}`;
      addUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: 'student',
        department: 'Computer Science',
        matricNo: finalMatric.toUpperCase(),
        level,
        programme: programme || 'Computer Science',
        cgpa: 0.00,
        academicStatus: 'active',
        adviserName: 'Mrs. F. K. Babalola',
      });
    } else {
      const finalStaffId = staffId.trim() || `MAPOLY/ST/CS/${Math.floor(100 + Math.random() * 900)}`;
      addUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        department: 'Computer Science',
        staffId: finalStaffId.toUpperCase(),
        title: title || 'Dr.',
        isHod: role === 'hod',
        adviserForLevel: role === 'adviser' ? adviserForLevel : undefined,
      });
    }

    // Reset form & close
    setName('');
    setEmail('');
    setMatricNo('');
    setStaffId('');
    setShowModal(false);
  };

  const studentCount = users.filter((u) => u.role === 'student').length;
  const staffCount = users.filter((u) => u.role !== 'student').length;
  const hodCount = users.filter((u) => u.role === 'hod' || u.role === 'admin').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-nacos-green font-bold text-[10px] uppercase tracking-widest mb-1">
            <Users className="w-4 h-4" /> Department User Governance & Role Management
          </div>
          <h1 className="font-black text-2xl md:text-3xl text-ink">User Directory & Accounts</h1>
          <p className="text-xs text-ink-light mt-0.5">
            Managed by HOD (<span className="font-semibold text-nacos-green">{currentUser.name}</span>) & Department Administrators
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary inline-flex items-center gap-2 shadow-lg shadow-nacos-green/20"
        >
          <UserPlus className="w-4 h-4" /> Create User Account
        </button>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-ink-light tracking-widest">Total Registered Users</div>
            <div className="text-xl font-black text-ink">{users.length} Active Accounts</div>
          </div>
        </div>

        <div className="stat-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-ink-light tracking-widest">Enrolled Students</div>
            <div className="text-xl font-black text-ink">{studentCount} Students</div>
          </div>
        </div>

        <div className="stat-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-ink-light tracking-widest">Staff & Faculty</div>
            <div className="text-xl font-black text-ink">{staffCount} Lecturers / Staff</div>
          </div>
        </div>
      </div>

      {/* Controls: Search and Filter */}
      <div className="nacos-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or matric/staff ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-nacos-green bg-nacos-off-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-ink-light shrink-0">Role:</span>
          {['all', 'student', 'lecturer', 'adviser', 'hod', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all shrink-0 ${
                roleFilter === r
                  ? 'bg-nacos-green text-white shadow-sm'
                  : 'bg-nacos-off-white text-ink-light hover:bg-slate-200/60'
              }`}
            >
              {r === 'all' ? 'All Roles' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="nacos-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full nacos-table">
            <thead>
              <tr>
                {['User Profile', 'Email', 'Assigned Role', 'Matric / Staff ID', 'Level / Designation', 'Status'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-nacos-green/10 text-nacos-green font-black flex items-center justify-center text-xs shrink-0 border border-nacos-green/20">
                          {u.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-ink">{u.name}</div>
                          <div className="text-[10px] text-ink-light font-mono">{u.department}</div>
                        </div>
                      </div>
                    </td>

                    <td className="text-ink-light text-xs font-mono">{u.email}</td>

                    <td>
                      <span className={`chip ${roleChip[u.role] || 'chip-draft'} font-bold`}>
                        {roleLabel[u.role] || u.role.toUpperCase()}
                      </span>
                    </td>

                    <td className="font-mono font-bold text-xs text-nacos-green-dark">
                      {u.matricNo || u.staffId || '—'}
                    </td>

                    <td className="text-xs text-ink-light font-medium">
                      {u.level ? (
                        <span className="font-bold text-slate-700">{u.level} Student</span>
                      ) : u.title ? (
                        <span>{u.title} {u.isHod ? '(HOD)' : ''}</span>
                      ) : (
                        'System User'
                      )}
                    </td>

                    <td>
                      <span className="chip chip-approved flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ACTIVE
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-ink-light text-xs">
                    No matching user accounts found in registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create User Account */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-nacos-green/15 text-nacos-green flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-ink">Add New User Account</h3>
                  <p className="text-xs text-ink-light">HOD & Administrative Provisioning Tool</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-ink rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-1.5">
                  Select User Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['student', 'lecturer', 'adviser', 'hod', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        role === r
                          ? 'border-nacos-green bg-nacos-green/10 text-nacos-green-dark font-bold shadow-sm'
                          : 'border-slate-200 text-ink-light hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold capitalize">{roleLabel[r]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-ink-light mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'student' ? 'e.g. Babatunde Ogunleye' : 'e.g. Dr. K. O. Mustapha'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-nacos-green"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-ink-light mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@mapoly.edu.ng"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-nacos-green"
                  />
                </div>
              </div>

              {/* Role Specific Fields */}
              {role === 'student' ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="text-xs font-bold text-nacos-green flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" /> Student Profile Attributes
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-ink-light mb-1">
                        Matric Number
                      </label>
                      <input
                        type="text"
                        value={matricNo}
                        onChange={(e) => setMatricNo(e.target.value)}
                        placeholder="MAPOLY/ND/CS/2026/0201"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-nacos-green font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-ink-light mb-1">
                        Academic Level
                      </label>
                      <select
                        value={level}
                        onChange={(e: any) => setLevel(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-nacos-green font-mono"
                      >
                        <option value="ND1">ND1 (First Year)</option>
                        <option value="ND2">ND2 (Second Year)</option>
                        <option value="HND1">HND1 (Post-ND First Year)</option>
                        <option value="HND2">HND2 (Post-ND Second Year)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-3">
                  <div className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" /> Staff Credentials
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-ink-light mb-1">
                        Staff ID / Staff Number
                      </label>
                      <input
                        type="text"
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                        placeholder="MAPOLY/ST/CS/094"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-nacos-green font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-ink-light mb-1">
                        Academic Title
                      </label>
                      <select
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-nacos-green"
                      >
                        <option value="Dr.">Dr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Prof.">Prof.</option>
                        <option value="Engr.">Engr.</option>
                      </select>
                    </div>
                  </div>

                  {role === 'adviser' && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-ink-light mb-1">
                        Assigned Level Adviser Cohort
                      </label>
                      <select
                        value={adviserForLevel}
                        onChange={(e: any) => setAdviserForLevel(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-nacos-green font-mono"
                      >
                        <option value="ND1">ND1 Adviser</option>
                        <option value="ND2">ND2 Adviser</option>
                        <option value="HND1">HND1 Adviser</option>
                        <option value="HND2">HND2 Adviser</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-ink-light hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
