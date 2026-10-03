'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  User,
  UserRole,
  Course,
  Registration,
  Result,
  ResultStatus,
  AttendanceSession,
  AttendanceRecord,
  StudentAttendanceSummary,
  TimetableSlot,
  Announcement,
  Material,
  CourseFormDoc,
  AtRiskStudent,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_REGISTRATIONS,
  INITIAL_RESULTS,
  INITIAL_ATTENDANCE_SUMMARY,
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_TIMETABLE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MATERIALS,
  INITIAL_COURSE_FORMS,
  CURRENT_SESSION,
  CURRENT_SEMESTER,
} from './mock-data';
import { ToastContainer, ToastMessage } from '@/components/Toast';

interface StudentSessionPresence {
  studentId: string;
  studentName: string;
  matricNo: string;
  present: boolean;
}

interface AppContextType {
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  users: User[];
  courses: Course[];
  registrations: Registration[];
  results: Result[];
  attendanceSessions: AttendanceSession[];
  attendanceRecords: AttendanceRecord[];
  attendanceSummaries: StudentAttendanceSummary[];
  courseForms: CourseFormDoc[];
  timetable: TimetableSlot[];
  announcements: Announcement[];
  materials: Material[];
  currentSession: string;
  currentSemester: string;
  toasts: ToastMessage[];
  // Actions
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  recordAttendanceSession: (
    courseId: string,
    topic: string,
    date: string,
    presences: StudentSessionPresence[]
  ) => void;
  startLiveAttendanceSession: (
    courseId: string,
    topic?: string,
    options?: {
      requireGeo?: boolean;
      lecturerLat?: number;
      lecturerLng?: number;
      allowedRadiusMeters?: number;
      requireDeviceLock?: boolean;
    }
  ) => AttendanceSession;
  endLiveAttendanceSession: (sessionId: string) => void;
  checkInStudentWithPin: (
    pin: string,
    userLocation?: { lat: number; lng: number },
    deviceFingerprint?: string
  ) => { success: boolean; message: string; proxyFlagged?: boolean };
  addWalkInStudentToSession: (sessionId: string, studentId: string) => void;
  updateResultStatus: (resultId: string, status: ResultStatus, actorName: string, silent?: boolean) => void;
  updateResultScores: (resultId: string, caScore: number, examScore: number) => void;
  updateRegistrationStatus: (regId: string, status: 'approved' | 'rejected') => void;
  uploadCourseForm: (file: { name: string; size: string; url?: string }) => void;
  verifyCourseForm: (formId: string) => void;
  rejectCourseForm: (formId: string, reason: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  addMaterial: (material: Omit<Material, 'id' | 'createdAt'>) => void;
  registerCourse: (courseId: string) => void;
  addUser: (userData: Omit<User, 'id'>) => void;
  registerNewStudentAccount: (data: { name: string; email: string; matricNo: string; level: 'ND1' | 'ND2' | 'HND1' | 'HND2' }) => void;
  toggleOfflineMaterial: (materialId: string) => void;
  getAtRiskStudents: (level?: string) => AtRiskStudent[];
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default Student
  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);
  const [results, setResults] = useState<Result[]>(INITIAL_RESULTS);
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(INITIAL_ATTENDANCE_SESSIONS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_RECORDS);
  const [attendanceSummaries, setAttendanceSummaries] = useState<StudentAttendanceSummary[]>(INITIAL_ATTENDANCE_SUMMARY);
  const [courseForms, setCourseForms] = useState<CourseFormDoc[]>(INITIAL_COURSE_FORMS);
  const [timetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setCurrentUserRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      showToast(`Switched active portal role to ${role.toUpperCase()}`, 'info');
    }
  };

  const calculateHaversineMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const startLiveAttendanceSession = (
    courseId: string,
    topic?: string,
    options?: {
      requireGeo?: boolean;
      lecturerLat?: number;
      lecturerLng?: number;
      allowedRadiusMeters?: number;
      requireDeviceLock?: boolean;
    }
  ): AttendanceSession => {
    const course = courses.find((c) => c.id === courseId);
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionId = `att_sess_live_${Date.now()}`;

    const newSession: AttendanceSession = {
      id: sessionId,
      courseId,
      courseCode: course?.code || 'COM',
      date: new Date().toISOString().split('T')[0],
      topic: topic || 'Live Lecture Hall Check-In',
      totalStudents: 0,
      presentCount: 0,
      sessionCode: pin,
      isActive: true,
      allowSelfCheckIn: true,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      requireGeo: options?.requireGeo ?? true,
      lecturerLat: options?.lecturerLat ?? 7.1475, // MAPOLY Abeokuta Campus coordinates default
      lecturerLng: options?.lecturerLng ?? 3.3619,
      allowedRadiusMeters: options?.allowedRadiusMeters ?? 50,
      requireDeviceLock: options?.requireDeviceLock ?? true,
    };

    setAttendanceSessions((prev) => [newSession, ...prev]);
    showToast(`Live Class Session Started! PIN Code: ${pin}`, 'success');
    return newSession;
  };

  const endLiveAttendanceSession = (sessionId: string) => {
    setAttendanceSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, isActive: false } : s))
    );
    showToast('Live class session ended & attendance locked.', 'info');
  };

  const checkInStudentWithPin = (
    pin: string,
    userLocation?: { lat: number; lng: number },
    deviceFingerprint?: string
  ): { success: boolean; message: string; proxyFlagged?: boolean } => {
    const cleanPin = pin.trim();
    const activeSession = attendanceSessions.find(
      (s) => s.sessionCode === cleanPin && s.isActive
    );

    if (!activeSession) {
      showToast('Invalid or expired Live Session PIN. Verify with lecturer.', 'error');
      return { success: false, message: 'Invalid or expired Live Session PIN.' };
    }

    const alreadyCheckedIn = attendanceRecords.some(
      (r) => r.attendanceSessionId === activeSession.id && r.studentId === currentUser.id
    );

    if (alreadyCheckedIn) {
      showToast(`You have already checked into ${activeSession.courseCode} for this session.`, 'info');
      return { success: true, message: 'Already checked in.' };
    }

    // --- ANTI-PROXY SECURITY CHECKS ---
    let proxyFlagged = false;
    let proxyReason = '';
    let distanceFromLecturerMeters = 0;

    // 1. Device Lock Check (1 check-in per device per session)
    if (activeSession.requireDeviceLock && deviceFingerprint) {
      const deviceAlreadyUsed = attendanceRecords.some(
        (r) => r.attendanceSessionId === activeSession.id && r.deviceFingerprint === deviceFingerprint
      );
      if (deviceAlreadyUsed) {
        proxyFlagged = true;
        proxyReason = 'Device Fingerprint Collision (Multiple student check-ins detected on 1 phone)';
      }
    }

    // 2. Geolocation Proximity Check (Classroom Geofencing)
    if (activeSession.requireGeo && activeSession.lecturerLat && activeSession.lecturerLng) {
      if (userLocation) {
        distanceFromLecturerMeters = calculateHaversineMeters(
          userLocation.lat,
          userLocation.lng,
          activeSession.lecturerLat,
          activeSession.lecturerLng
        );
        const radius = activeSession.allowedRadiusMeters || 50;
        if (distanceFromLecturerMeters > radius) {
          proxyFlagged = true;
          proxyReason = `Outside Classroom Boundary (${distanceFromLecturerMeters}m away from lecturer; max ${radius}m permitted)`;
        }
      } else {
        proxyFlagged = true;
        proxyReason = 'Geolocation position not supplied / location disabled on student device';
      }
    }

    const newRecord: AttendanceRecord = {
      id: `att_rec_${activeSession.id}_${Date.now()}`,
      attendanceSessionId: activeSession.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      matricNo: currentUser.matricNo || 'MAPOLY/STUDENT',
      present: true,
      checkInMethod: 'pin_self',
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deviceFingerprint,
      distanceFromLecturerMeters,
      proxyFlagged,
      proxyReason,
      isOfflineSynced: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    };

    setAttendanceRecords((prev) => [...prev, newRecord]);

    setAttendanceSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) {
          const newPresent = s.presentCount + 1;
          const newTotal = Math.max(s.totalStudents, newPresent);
          return { ...s, presentCount: newPresent, totalStudents: newTotal };
        }
        return s;
      })
    );

    // Update attendance summaries
    recalculateStudentSummary(activeSession.courseId, currentUser.id);

    if (proxyFlagged) {
      showToast(`Checked in, but flagged for security review: ${proxyReason}`, 'error');
      return { success: true, message: `Checked in (Proxy Flagged: ${proxyReason})`, proxyFlagged: true };
    }

    showToast(`Checked in successfully to ${activeSession.courseCode}!`, 'success');
    return { success: true, message: `Checked in to ${activeSession.courseCode}` };
  };

  const uploadCourseForm = (file: { name: string; size: string; url?: string }) => {
    const newFormDoc: CourseFormDoc = {
      id: `cf_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      matricNo: currentUser.matricNo || 'MAPOLY/STUDENT',
      level: currentUser.level || 'ND2',
      fileName: file.name,
      fileSize: file.size,
      fileUrl: file.url || '#',
      uploadedAt: new Date().toISOString(),
      status: 'verified',
      verifiedBy: 'MAPOLY Official Portal Auto-Verification',
      verifiedAt: new Date().toISOString(),
    };

    setCourseForms((prev) => [newFormDoc, ...prev.filter((f) => f.studentId !== currentUser.id)]);

    // Instantly auto-approve all pending registrations for this student upon portal form upload
    setRegistrations((prev) =>
      prev.map((r) =>
        r.studentId === currentUser.id
          ? {
              ...r,
              status: 'approved',
              adviserApprovedAt: new Date().toISOString(),
            }
          : r
      )
    );

    showToast('Official School Portal Form verified! All course registrations AUTO-APPROVED ✓', 'success');
  };

  const verifyCourseForm = (formId: string) => {
    setCourseForms((prev) =>
      prev.map((f) =>
        f.id === formId
          ? {
              ...f,
              status: 'verified',
              verifiedBy: currentUser.name,
              verifiedAt: new Date().toISOString(),
            }
          : f
      )
    );
    showToast('Student Official Course Form verified ✓', 'success');
  };

  const rejectCourseForm = (formId: string, reason: string) => {
    setCourseForms((prev) =>
      prev.map((f) =>
        f.id === formId
          ? {
              ...f,
              status: 'rejected',
              rejectionReason: reason,
              verifiedBy: currentUser.name,
              verifiedAt: new Date().toISOString(),
            }
          : f
      )
    );
    showToast(`Course form rejected: ${reason}`, 'info');
  };

  const addWalkInStudentToSession = (sessionId: string, studentId: string) => {
    const targetSession = attendanceSessions.find((s) => s.id === sessionId);
    const targetUser = users.find((u) => u.id === studentId);

    if (!targetSession || !targetUser) return;

    const alreadyIn = attendanceRecords.some(
      (r) => r.attendanceSessionId === sessionId && r.studentId === studentId
    );

    if (alreadyIn) {
      showToast(`${targetUser.name} is already marked in this session.`, 'info');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: `att_rec_${sessionId}_${Date.now()}`,
      attendanceSessionId: sessionId,
      studentId: targetUser.id,
      studentName: targetUser.name,
      matricNo: targetUser.matricNo || 'MAPOLY/WALKIN',
      present: true,
      checkInMethod: 'walk_in',
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAttendanceRecords((prev) => [...prev, newRecord]);

    setAttendanceSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const newPresent = s.presentCount + 1;
          const newTotal = Math.max(s.totalStudents, newPresent);
          return { ...s, presentCount: newPresent, totalStudents: newTotal };
        }
        return s;
      })
    );

    recalculateStudentSummary(targetSession.courseId, targetUser.id);
    showToast(`Added walk-in student ${targetUser.name} to class register`, 'success');
  };

  const recalculateStudentSummary = (courseId: string, studentId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const courseSessions = attendanceSessions.filter((s) => s.courseId === courseId);
    const totalClasses = Math.max(courseSessions.length, 1);
    const sessionIds = new Set(courseSessions.map((s) => s.id));

    const attendedCount = attendanceRecords.filter(
      (r) => sessionIds.has(r.attendanceSessionId) && r.studentId === studentId && r.present
    ).length;

    const percentage = (attendedCount / totalClasses) * 100;
    const isEligible = percentage >= 75;

    setAttendanceSummaries((prev) => {
      const idx = prev.findIndex((s) => s.courseId === courseId);
      const summary: StudentAttendanceSummary = {
        courseId,
        courseCode: course.code,
        courseTitle: course.title,
        totalClasses,
        attendedClasses: attendedCount,
        percentage: Number(percentage.toFixed(1)),
        isEligible,
      };

      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = summary;
        return copy;
      }
      return [...prev, summary];
    });
  };

  const recordAttendanceSession = (
    courseId: string,
    topic: string,
    date: string,
    presences: StudentSessionPresence[]
  ) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const sessionId = `att_sess_${Date.now()}`;
    const presentCount = presences.filter((p) => p.present).length;

    const newSession: AttendanceSession = {
      id: sessionId,
      courseId,
      courseCode: course.code,
      date: date || new Date().toISOString().split('T')[0],
      topic: topic || 'Class Lecture & Lab Session',
      totalStudents: presences.length,
      presentCount,
      isActive: false,
    };

    const newRecords: AttendanceRecord[] = presences.map((p, idx) => ({
      id: `att_rec_${sessionId}_${idx}`,
      attendanceSessionId: sessionId,
      studentId: p.studentId,
      studentName: p.studentName,
      matricNo: p.matricNo,
      present: p.present,
      checkInMethod: 'lecturer_manual',
    }));

    const updatedSessions = [newSession, ...attendanceSessions];
    const updatedRecords = [...attendanceRecords, ...newRecords];

    setAttendanceSessions(updatedSessions);
    setAttendanceRecords(updatedRecords);

    // Recalculate summary
    presences.forEach((p) => {
      recalculateStudentSummary(courseId, p.studentId);
    });

    showToast(`Saved attendance register for ${course.code}: ${presentCount}/${presences.length} present.`, 'success');
  };

  const updateResultStatus = (resultId: string, newStatus: ResultStatus, actorName: string, silent?: boolean) => {
    const now = new Date().toISOString();
    setResults((prev) =>
      prev.map((r) => {
        if (r.id === resultId) {
          const updated = { ...r, status: newStatus, lastUpdated: now };
          if (newStatus === 'Submitted') {
            updated.submittedBy = actorName;
            updated.submittedAt = now;
          } else if (newStatus === 'Approved') {
            updated.approvedBy = actorName;
            updated.approvedAt = now;
          } else if (newStatus === 'Published') {
            updated.publishedAt = now;
          }
          return updated;
        }
        return r;
      })
    );
    if (!silent) {
      showToast(`Result status updated to ${newStatus.toUpperCase()}`, 'success');
    }
  };

  const updateResultScores = (resultId: string, caScore: number, examScore: number) => {
    const total = caScore + examScore;
    let grade: Result['grade'] = 'F';
    let point = 0.0;

    if (total >= 75) { grade = 'A'; point = 4.0; }
    else if (total >= 70) { grade = 'AB'; point = 3.5; }
    else if (total >= 65) { grade = 'B'; point = 3.0; }
    else if (total >= 60) { grade = 'BC'; point = 2.5; }
    else if (total >= 55) { grade = 'C'; point = 2.0; }
    else if (total >= 50) { grade = 'CD'; point = 1.5; }
    else if (total >= 45) { grade = 'D'; point = 1.0; }
    else if (total >= 40) { grade = 'E'; point = 0.5; }
    else { grade = 'F'; point = 0.0; }

    setResults((prev) =>
      prev.map((r) => {
        if (r.id === resultId) {
          return {
            ...r,
            caScore,
            examScore,
            totalScore: total,
            grade,
            gradePoint: point,
            lastUpdated: new Date().toISOString(),
          };
        }
        return r;
      })
    );
  };

  const updateRegistrationStatus = (regId: string, status: 'approved' | 'rejected') => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === regId
          ? {
              ...r,
              status,
              adviserApprovedAt: status === 'approved' ? new Date().toISOString() : undefined,
            }
          : r
      )
    );
    showToast(`Registration request ${status.toUpperCase()}`, status === 'approved' ? 'success' : 'error');
  };

  const addAnnouncement = (newAnn: Omit<Announcement, 'id' | 'createdAt'>) => {
    const created: Announcement = {
      ...newAnn,
      id: `ann_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [created, ...prev]);
    showToast('Departmental announcement posted', 'success');
  };

  const addMaterial = (newMat: Omit<Material, 'id' | 'createdAt'>) => {
    const created: Material = {
      ...newMat,
      id: `mat_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMaterials((prev) => [created, ...prev]);
    showToast('Course resource published to student portal', 'success');
  };

  const registerCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course || currentUser.role !== 'student') return;

    const existing = registrations.find(
      (r) => r.courseId === courseId && r.studentId === currentUser.id
    );
    if (existing) {
      showToast('Course already added to your registration sheet', 'info');
      return;
    }

    const newReg: Registration = {
      id: `reg_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      matricNo: currentUser.matricNo || 'MAPOLY/STUDENT',
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      unitLoad: course.unitLoad,
      semesterId: 'sem_1',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setRegistrations((prev) => [...prev, newReg]);
    showToast(`Added ${course.code} to course registration list`, 'success');
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newId = `usr_${userData.role}_${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: newId,
      department: userData.department || 'Computer Science',
      academicStatus: userData.role === 'student' ? (userData.academicStatus || 'active') : undefined,
    };

    setUsers((prev) => [newUser, ...prev]);
    showToast(`Created account for ${newUser.name} as ${newUser.role.toUpperCase()}`, 'success');
  };

  const registerNewStudentAccount = (data: {
    name: string;
    email: string;
    matricNo: string;
    level: 'ND1' | 'ND2' | 'HND1' | 'HND2';
  }) => {
    const freshUser: User = {
      id: `usr_student_fresh_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'student',
      department: 'Computer Science',
      matricNo: data.matricNo.trim().toUpperCase(),
      level: data.level,
      programme: 'Computer Science',
      cgpa: 0.00,
      academicStatus: 'active',
      adviserName: 'Mrs. F. K. Babalola',
    };

    setUsers((prev) => [freshUser, ...prev]);
    setCurrentUser(freshUser);
    showToast(`Account created for ${data.name} (${data.matricNo})! Clean slate initialized.`, 'success');
  };

  const toggleOfflineMaterial = (materialId: string) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === materialId) {
          const nextState = !m.isOfflineCached;
          showToast(
            nextState
              ? `Saved "${m.courseCode}" file for offline study ✓`
              : `Removed "${m.courseCode}" file from offline storage`,
            'info'
          );
          return { ...m, isOfflineCached: nextState };
        }
        return m;
      })
    );
  };

  const getAtRiskStudents = (levelFilter?: string): AtRiskStudent[] => {
    const studentUsers = users.filter(
      (u) => u.role === 'student' && (!levelFilter || u.level === levelFilter)
    );

    return studentUsers.map((student) => {
      const studentSummaries = attendanceSummaries.filter((s) => s.studentId === student.id);
      const studentResults = results.filter((r) => r.studentId === student.id);

      const avgAttendance =
        studentSummaries.length > 0
          ? studentSummaries.reduce((sum, s) => sum + s.percentage, 0) / studentSummaries.length
          : student.id === 'usr_student_1' ? 84.8 : 68.4;

      const reasons: string[] = [];
      let riskLevel: 'high' | 'moderate' | 'low' = 'low';

      if (avgAttendance < 75) {
        riskLevel = 'high';
        reasons.push(`Attendance at ${avgAttendance.toFixed(1)}% (Below 75% exam eligibility threshold)`);
      } else if (avgAttendance < 80) {
        riskLevel = 'moderate';
        reasons.push(`Attendance at ${avgAttendance.toFixed(1)}% (Near 75% warning line)`);
      }

      if (student.cgpa && student.cgpa < 2.5) {
        if (riskLevel !== 'high') riskLevel = 'moderate';
        reasons.push(`CGPA at ${student.cgpa.toFixed(2)} (Academic Standing Warning)`);
      }

      if (reasons.length === 0) {
        reasons.push('Good academic standing & full exam eligibility');
      }

      return {
        studentId: student.id,
        studentName: student.name,
        matricNo: student.matricNo || 'MAPOLY/STUDENT',
        level: student.level || 'ND2',
        attendancePercentage: Number(avgAttendance.toFixed(1)),
        caScore: studentResults.length > 0 ? studentResults[0].caScore : 24,
        riskLevel,
        reasons,
      };
    });
  };

  const resetDemoData = () => {
    setRegistrations(INITIAL_REGISTRATIONS);
    setResults(INITIAL_RESULTS);
    setAttendanceSessions(INITIAL_ATTENDANCE_SESSIONS);
    setAttendanceRecords(INITIAL_ATTENDANCE_RECORDS);
    setAttendanceSummaries(INITIAL_ATTENDANCE_SUMMARY);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setMaterials(INITIAL_MATERIALS);
    showToast('System demo dataset restored', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUserRole,
        users,
        courses,
        registrations,
        results,
        attendanceSessions,
        attendanceRecords,
        attendanceSummaries,
        courseForms,
        timetable,
        announcements,
        materials,
        currentSession: CURRENT_SESSION,
        currentSemester: CURRENT_SEMESTER,
        toasts,
        showToast,
        dismissToast,
        recordAttendanceSession,
        startLiveAttendanceSession,
        endLiveAttendanceSession,
        checkInStudentWithPin,
        addWalkInStudentToSession,
        updateResultStatus,
        updateResultScores,
        updateRegistrationStatus,
        uploadCourseForm,
        verifyCourseForm,
        rejectCourseForm,
        addAnnouncement,
        addMaterial,
        registerCourse,
        addUser,
        registerNewStudentAccount,
        toggleOfflineMaterial,
        getAtRiskStudents,
        resetDemoData,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
