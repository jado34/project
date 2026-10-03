# Product Requirements Document
## Department Information Management System (DIMS)
### For the Computer Science Department

| **Document Owner** | Oluwasemilore |
| **Status** | Draft v1.0 — For Direction Review |
| **Last Updated** | July 26, 2026 |
| **Stack** | Next.js · Supabase (Postgres, Auth, Storage, Edge Functions) · TypeScript |
| **Audience** | Engineering, design, department stakeholders, project supervisor/examiners |


## 1. Executive Summary

Most Nigerian Computer Science departments still run on a patchwork of paper files, WhatsApp groups, Excel sheets, and disconnected portals — one place for results, another for course forms, a noticeboard for announcements, and a lecturer's personal drive for materials. Nothing talks to anything else, records get lost between semesters, and every result-checking period turns into a queue outside the HOD's office.

**DIMS** is a single, role-aware web platform that gives a Computer Science department one source of truth for its academic operations: student records, course registration, result computation and CGPA tracking, lecturer course allocation, attendance, timetabling, and departmental communication.

It's built to work as both a genuinely useful department tool *and* a portfolio-grade case study — clean information architecture, a real data model, and defensible product decisions a reviewer or examiner can interrogate.

---

## 2. Problem Statement

**For students:**
- No central place to register courses, check results, or track CGPA progress
- Result release means physical noticeboards or one overworked WhatsApp group
- No visibility into attendance standing until it's too late (exam eligibility)
- Course materials scattered across lecturer WhatsApp groups, personal cloud links, and email

**For lecturers:**
- Manual, spreadsheet-based grading with no standard format across courses
- No easy way to see which students are registered for their course
- Re-typing the same attendance sheet every week
- No structured way to share materials or announcements to a specific course cohort

**For the HOD / department admin:**
- No dashboard view of departmental performance (pass rates, course load, staff allocation)
- Manual compilation of result broadsheets, often under deadline pressure
- No system of record for staff-course allocation, timetable clashes, or student standing (probation, withdrawal risk)
- Accreditation and audit prep means manually reconstructing years of records

**Root cause:** Academic record-keeping and communication live in disconnected tools with no shared data model, no single login, and no audit trail.


## 3. Goals & Success Metrics

### Product Goals
1. Give every student a live, accurate view of their academic record (courses, results, CGPA, attendance)
2. Give every lecturer a fast, structured way to manage their courses, grade, and communicate
3. Give the HOD/admin a real-time operational view of the department, not a retrospective one
4. Replace paper- and WhatsApp-based workflows with an auditable digital system of record

### Success Metrics (post-launch)

| Metric | Target |
|---|---|
| Result publishing time (exam close → results visible) | From ~2–4 weeks → under 5 days |
| Students actively using the portal per semester | 85%+ of registered students |
| Course registration completed online (vs. paper/manual) | 100% |
| Lecturer grading submitted through the system | 90%+ of active courses |
| Support/complaint tickets re: "lost" records | Reduced by 80%+ vs. prior semester |

---

## 4. Users & Roles

DIMS is role-based from the ground up — everyone logs into the same system, but sees a different surface.

### 4.1 Student
Undergraduate CS student. Primary jobs: register courses each semester, check results and CGPA, view attendance and timetable, access course materials, receive announcements.

### 4.2 Lecturer
Teaches one or more courses. Primary jobs: view course roster, take/manage attendance, upload materials, enter and submit scores, post course announcements.

### 4.3 Course Adviser
A lecturer with an added layer: assigned to a specific student cohort/level to monitor academic standing, approve course registration, and flag at-risk students.

### 4.4 Head of Department (HOD) / Admin
Oversees the whole department. Primary jobs: manage staff and course allocation, approve/publish results, view departmental analytics, manage timetable, broadcast department-wide announcements, handle student status changes (probation, withdrawal, transfer).

### 4.5 Super Admin (System/IT Admin)
Technical owner. Manages user accounts, roles, academic session/semester setup, system configuration, backups. Usually a small, invisible role — exists for system integrity, not daily use.

> **Design implication:** one login system, one `users` table, roles resolved via a `role` + `department` + (for students) `level`/`matric_no` relationship. No separate portals to maintain.

---

## 5. Scope

### 5.1 In Scope (V1 — MVP)
- Authentication & role-based access (student, lecturer, adviser, HOD, admin)
- Student academic profile (bio-data, matric number, level, programme)
- Course management (course catalogue, unit load, prerequisites, semester assignment)
- Course registration (student self-service, adviser approval flow)
- Result management (score entry by lecturer → HOD approval → publish; auto GPA/CGPA computation)
- Attendance (lecturer marks per session; student views own record)
- Timetable (admin builds; students/lecturers view by course/level)
- Announcements (department-wide, course-specific, level-specific)
- Course materials repository (lecturer uploads, students access per registered course)
- Basic departmental analytics dashboard (HOD view): pass rates, enrollment numbers, staff load

### 5.2 Out of Scope (V1)
- Payment processing (school fees, etc. — typically handled by central university portal)
- Full HR/payroll for staff
- Alumni management
- Multi-department/faculty-wide rollout (architecture should allow it later, but V1 ships single-department)
- Native mobile app (V1 is responsive web; app can be a V3 consideration)
- Video/live class delivery (materials are static uploads/links, not a full LMS)

### 5.3 Future Considerations (V2/V3)
- Multi-department support (make department a first-class scoped entity, not hardcoded)
- Project/thesis supervision tracker (final-year students ↔ supervisors)
- SMS/email notifications
- Faculty-level rollup dashboards
- Integration with a central university SSO/portal if one exists

---

## 6. Core Modules — Functional Requirements

### 6.1 Authentication & Roles
- Email/matric-number + password login; Supabase Auth
- Role assigned at account creation by admin (students can self-register with matric number verification against a pre-loaded student list, to prevent impersonation)
- Password reset flow
- Session persistence, secure route protection by role (middleware-level, not just UI hiding)

### 6.2 Student Records
- Bio-data: name, matric number, level, programme, contact info, passport photo
- Academic history: sessions attended, courses taken per session, results, CGPA trend over time
- Status flag: active, probation, withdrawn, graduated (admin-managed, visible to student and adviser)

### 6.3 Course Management
- Course catalogue: code, title, unit load, level, semester, course type (core/elective), prerequisites
- Lecturer-course assignment (admin sets; a lecturer can teach multiple courses; a course can have a co-lecturer)
- Course capacity (optional cap, useful for electives)

### 6.4 Course Registration
- Student selects courses for the semester within their level's approved course list
- System validates: unit load limits (min/max), prerequisite completion, no time clashes with timetable
- Adviser approval step before registration is finalized (configurable — can be auto-approve or manual)
- Registration window controlled by admin (opens/closes per semester)
- Late registration / add-drop handled as a distinct, time-boxed state

### 6.5 Result Management
This is the highest-trust module — needs the clearest state machine.

**States:** `Draft` (lecturer entering scores) → `Submitted` (lecturer locks and sends to HOD) → `Approved` (HOD reviews, can send back or approve) → `Published` (visible to students)

- Lecturer enters CA + exam scores per registered student, per course
- System auto-computes grade (based on department grading scale) and grade point
- On publish: system recalculates GPA (semester) and CGPA (cumulative) per student automatically
- Full audit trail: who entered, who approved, who published, and when — timestamped
- Students only ever see `Published` results; nothing leaks earlier in the pipeline
- Result correction after publish requires an explicit "correction request" flow with HOD sign-off (not a silent edit) — this preserves academic integrity

### 6.6 Attendance
- Lecturer marks attendance per class session (present/absent) against the registered course roster
- Runs off the same roster as registration — no duplicate data entry
- Student views their own attendance percentage per course
- System flags students below a configurable attendance threshold (e.g., 75%) — visible to adviser/HOD, relevant for exam eligibility

### 6.7 Timetable
- Admin builds timetable: course, day, time slot, venue, lecturer
- Conflict detection: same lecturer or same venue double-booked
- Views: by level (student), by lecturer (their own schedule), department-wide (admin)

### 6.8 Announcements & Communication
- Three scopes: department-wide, level-specific, course-specific
- Posted by: HOD (department-wide), lecturer (their course), adviser (their level)
- Students see a unified feed filtered to what's relevant to them
- Optional pin/priority flag for urgent notices (e.g., exam timetable changes)

### 6.9 Course Materials Repository
- Lecturer uploads files (PDF, slides) or links per course
- Students access materials only for courses they're registered for
- Simple folder/topic structure per course (e.g., by week or topic), not a full LMS

### 6.10 Departmental Analytics (HOD Dashboard)
- Enrollment numbers per course/level, per session
- Pass/fail rate per course, trend over sessions
- Staff teaching load (courses/units per lecturer)
- At-risk students (low CGPA, low attendance) — aggregated, actionable list
- Exportable summary reports (for accreditation/audit prep)

---

## 7. Information Architecture (Core Data Model)

High-level entities and relationships — this is the backbone the Supabase schema should mirror:

```
users (id, name, email, role, department_id, avatar_url)
  └─ student_profiles (user_id, matric_no, level, programme, status, adviser_id)
  └─ staff_profiles (user_id, staff_id, title, is_hod)

sessions (id, name, start_date, end_date)      e.g. "2025/2026"
semesters (id, session_id, name)                e.g. "First Semester"

courses (id, code, title, unit_load, level, semester_id, type)
course_prerequisites (course_id, prerequisite_course_id)
course_allocations (id, course_id, lecturer_id, semester_id)

registrations (id, student_id, course_id, semester_id, status, adviser_approved_at)

results (id, registration_id, ca_score, exam_score, grade, grade_point, status, submitted_by, approved_by, published_at)

attendance_sessions (id, course_id, date)
attendance_records (id, attendance_session_id, student_id, present boolean)

timetable_slots (id, course_id, day, start_time, end_time, venue, lecturer_id)

announcements (id, author_id, scope, level, course_id, title, body, pinned, created_at)

materials (id, course_id, uploaded_by, title, file_url, topic, created_at)
```

This is intentionally normalized around `sessions` and `semesters` as time anchors — every academic record (registration, result, attendance) hangs off a specific semester. That's what makes multi-session history and CGPA trend views possible without extra modeling later.

---

## 8. Roles & Permissions Matrix

| Action | Student | Lecturer | Adviser | HOD | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| View own results/CGPA | ✅ | — | — | — | — |
| Register courses | ✅ | — | — | — | — |
| Approve registration | — | — | ✅ | ✅ | ✅ |
| Enter/submit scores | — | ✅ (own course) | — | — | — |
| Approve/publish results | — | — | — | ✅ | ✅ |
| Mark attendance | — | ✅ (own course) | — | — | — |
| Build timetable | — | — | — | ✅ | ✅ |
| Post department-wide announcement | — | — | — | ✅ | ✅ |
| Post course announcement | — | ✅ (own course) | — | — | — |
| Upload course materials | — | ✅ (own course) | — | — | — |
| Manage staff/course allocation | — | — | — | ✅ | ✅ |
| View departmental analytics | — | — | partial (own advisees) | ✅ | ✅ |
| Manage user accounts/roles | — | — | — | — | ✅ |

---

## 9. UX/UI Design Direction

- **Design system:** Material Design 3 principles, adapted — consistent with your recent design system work (tokens, elevation, type scale), not a generic admin-template look
- **Information hierarchy over decoration:** this is a records system — clarity, scannability, and status visibility (draft/submitted/published states, attendance percentages, CGPA trend) matter more than visual flourish
- **Role-first navigation:** each role sees a dashboard tailored to their top 3–4 jobs, not a shared generic menu with hidden/disabled items
- **Status is always visible:** results, registration, and attendance all have clear state indicators (e.g., a colored badge for Draft/Submitted/Approved/Published) so nothing feels like a black box
- **Mobile-responsive first for students:** most students will check results and timetables on a phone; lecturer/admin views can assume a wider viewport (grading, dashboards) but must still degrade gracefully
- **Empty and loading states matter:** a new semester with no results yet, a course with no materials yet — these should feel intentional, not broken

Suggested palette/type direction: open to your usual system (navy/indigo MD3 palette you've used for SkillsBridge, or a fresh direction specific to this department's identity) — happy to design token this out once you confirm.

---

## 10. Technical Architecture

**Stack**
- **Frontend:** Next.js (App Router), TypeScript, Tailwind
- **Backend/DB:** Supabase — Postgres (relational fit for this data model is strong), Supabase Auth (role-based via custom claims/RLS), Supabase Storage (materials, profile photos)
- **Authorization:** Postgres Row-Level Security policies per role — enforced at the database layer, not just in the frontend, since this handles sensitive academic records
- **Hosting:** Vercel

**Key architecture decisions**
- **RLS-first security:** a student querying `results` should only ever be able to see rows where `status = 'published'` and `registration.student_id = auth.uid()`. This is enforced in Postgres policy, not app logic — so there's no path to leak unpublished results even with a frontend bug.
- **State machine for results:** implemented as an enum with a Postgres trigger/function to control valid transitions (Draft → Submitted → Approved → Published, plus a Correction-Requested path). Prevents invalid states like publishing without approval.
- **Computed fields via function, not client math:** GPA/CGPA computed server-side (Postgres function or edge function) triggered on result publish — keeps the calculation logic in one trusted place.
- **Audit logging:** a lightweight `audit_log` table capturing who changed what, when — critical for a records system, and useful evidence for your case study/defense.

---

## 11. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Dashboard/list views load under 2s for typical department size (200–500 students) |
| Availability | Should tolerate result-day traffic spikes (all students checking at once) |
| Data integrity | No result visible to a student until formally published; no silent edits post-publish |
| Auditability | Every result/registration state change is logged with actor and timestamp |
| Accessibility | Readable contrast, keyboard-navigable forms, works on low-end Android devices common among students |
| Data privacy | Student records visible only to the student, their adviser, and admin — not to other lecturers by default |

---

## 12. Phased Roadmap

**Phase 1 — MVP (core records loop)**
Auth & roles → student/staff profiles → course catalogue → registration → result entry/approval/publish → CGPA computation

**Phase 2 — Daily operations**
Attendance → timetable → announcements → materials repository

**Phase 3 — Intelligence layer**
HOD analytics dashboard → at-risk student flagging → exportable reports

**Phase 4 — Stretch**
Correction-request workflow polish, multi-department architecture generalization, notification system (email/SMS)

This phasing also doubles as a natural chapter structure if this is being written up as a project report — each phase maps to a demonstrable milestone.

---

## 13. Risks & Assumptions

| Risk | Mitigation |
|---|---|
| Department has no clean existing student data to seed | Build an admin bulk-import (CSV) for initial student/course load |
| Lecturers resist digital grading (habit/trust) | Keep score entry as simple as a spreadsheet; allow CSV upload of scores as an alternative to manual entry |
| Result publishing errors are high-stakes | State machine + audit log + correction-request flow (never silent edits) |
| Low and inconsistent internet access | Optimize for low-bandwidth; avoid heavy client-side bundles; consider basic offline-tolerant patterns for attendance marking |
| Scope creep toward "full LMS" | V1 scope explicitly excludes video/live delivery — materials repository only |

---

## 14. Open Questions (for you to resolve before build)

1. Does the department already have a fixed grading scale (e.g., A=5.0, B=4.0...) or does this need to be configurable per department?
2. Is course registration adviser-approved by default, or should some programmes allow auto-approval?
3. Should this be built assuming one specific department's data (hardcoded), or should "department" be a scoped entity from day one to make future multi-department reuse trivial? (Recommend the latter — costs little extra now, saves a rebuild later.)
4. Do you have (or need to design) a real grading/unit-load policy to encode, or should V1 ship with sensible defaults (e.g., 5.0 scale, min 15/max 24 units) that are easy to reconfigure?

---

## 15. Appendix — Suggested Page/Route Map

```
/login
/dashboard                     → role-aware redirect

/student
  /dashboard
  /courses/register
  /results
  /attendance
  /timetable
  /materials
  /announcements

/lecturer
  /dashboard
  /courses/:id/roster
  /courses/:id/attendance
  /courses/:id/grading
  /courses/:id/materials
  /announcements/new

/adviser
  /advisees
  /registrations/pending

/admin (HOD + Super Admin, gated by sub-permission)
  /dashboard
  /students
  /staff
  /courses
  /allocations
  /timetable/builder
  /results/approvals
  /analytics
  /announcements/new
  /settings
```

---

**Next step:** confirm the open questions in Section 14, and I can move straight into the Supabase schema (tables + RLS policies) and the route/component build plan.
