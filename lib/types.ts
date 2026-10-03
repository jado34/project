export type UserRole = 'student' | 'lecturer' | 'adviser' | 'hod' | 'admin';

export type ResultStatus = 'Draft' | 'Submitted' | 'Approved' | 'Published';

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export type AcademicLevel = 'ND1' | 'ND2' | 'HND1' | 'HND2';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  // Student specific
  matricNo?: string;
  level?: AcademicLevel;
  programme?: string;
  cgpa?: number;
  academicStatus?: 'active' | 'probation' | 'withdrawn' | 'graduated';
  adviserId?: string;
  adviserName?: string;
  // Staff specific
  staffId?: string;
  title?: string;
  isHod?: boolean;
  adviserForLevel?: AcademicLevel;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  unitLoad: number;
  level: AcademicLevel;
  semesterId: string;
  semesterName: string;
  type: 'core' | 'elective';
  prerequisites: string[]; // array of course codes
  lecturerId?: string;
  lecturerName?: string;
  capacity?: number;
  registeredCount?: number;
}

export interface Registration {
  id: string;
  studentId: string;
  studentName: string;
  matricNo: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  unitLoad: number;
  semesterId: string;
  status: RegistrationStatus;
  adviserApprovedAt?: string;
  createdAt: string;
}

export interface Result {
  id: string;
  registrationId: string;
  studentId: string;
  studentName: string;
  matricNo: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  unitLoad: number;
  caScore: number; // Max 30 or 40
  examScore: number; // Max 70 or 60
  totalScore: number; // 0..100
  grade: 'A' | 'AB' | 'B' | 'BC' | 'C' | 'CD' | 'D' | 'E' | 'F';
  gradePoint: number; // 4.0, 3.5, 3.0, etc.
  status: ResultStatus;
  submittedBy?: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;
  lastUpdated: string;
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  courseCode: string;
  date: string;
  topic: string;
  totalStudents: number;
  presentCount: number;
  sessionCode?: string;
  isActive?: boolean;
  expiresAt?: string;
  allowSelfCheckIn?: boolean;
  // Anti-Proxy Security Attributes
  requireGeo?: boolean;
  lecturerLat?: number;
  lecturerLng?: number;
  allowedRadiusMeters?: number; // e.g. 50 meters
  requireDeviceLock?: boolean; // 1 check-in per device rule
}

export interface AttendanceRecord {
  id: string;
  attendanceSessionId: string;
  studentId: string;
  studentName: string;
  matricNo: string;
  present: boolean;
  checkInMethod?: 'pin_self' | 'lecturer_manual' | 'walk_in';
  checkInTime?: string;
  // Anti-Proxy Verification Details
  deviceFingerprint?: string;
  distanceFromLecturerMeters?: number;
  proxyFlagged?: boolean;
  proxyReason?: string;
  isOfflineSynced?: boolean;
}

export interface CourseFormDoc {
  id: string;
  studentId: string;
  studentName: string;
  matricNo: string;
  level: AcademicLevel;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface StudentAttendanceSummary {
  studentId?: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  isEligible: boolean; // >= 75%
}

export interface TimetableSlot {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  venue: string;
  lecturerName: string;
  level: AcademicLevel;
}

export interface Announcement {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  scope: 'department' | 'level' | 'course';
  targetLevel?: AcademicLevel;
  targetCourseId?: string;
  targetCourseCode?: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
}

export interface Material {
  id: string;
  courseId: string;
  courseCode: string;
  uploadedBy: string;
  uploadedByName: string;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  topic: string;
  category?: 'lecture_note' | 'past_question' | 'lab_manual' | 'syllabus';
  examYear?: string; // e.g. '2024', '2023', '2022'
  semester?: 'First Semester' | 'Second Semester';
  level?: AcademicLevel;
  downloadCount?: number;
  isOfflineCached?: boolean;
  createdAt: string;
}

export interface AtRiskStudent {
  studentId: string;
  studentName: string;
  matricNo: string;
  level: AcademicLevel;
  attendancePercentage: number;
  caScore?: number;
  riskLevel: 'high' | 'moderate' | 'low'; // High = < 75% exam barred risk
  reasons: string[];
}
