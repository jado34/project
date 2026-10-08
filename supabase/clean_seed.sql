-- ====================================================================
-- CSDSIMS MAPOLY - Clean Slate Database Reset & Seeding Script
-- Department of Computer Science, Moshood Abiola Polytechnic
-- Official Staff Roster from nacosmapoly.com/lecturers
-- ====================================================================

-- 1. CLEANUP (TRUNCATE ALL EXISTING TEST DATA WITH CASCADE)
TRUNCATE TABLE 
  public.results, 
  public.registrations, 
  public.attendance_records, 
  public.attendance_sessions, 
  public.materials, 
  public.announcements, 
  public.timetable_slots, 
  public.course_allocations, 
  public.student_profiles, 
  public.staff_profiles, 
  public.users, 
  public.courses, 
  public.semesters, 
  public.sessions 
RESTART IDENTITY CASCADE;

-- 2. ACADEMIC SESSIONS & SEMESTERS
INSERT INTO public.sessions (id, name, is_current) VALUES
  ('a0000000-0000-0000-0000-000000000001', '2025/2026', true);

INSERT INTO public.semesters (id, session_id, name) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'First Semester'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Second Semester');

-- 3. OFFICIAL DEPARTMENTAL STAFF / LECTURERS / TECHNOLOGISTS
-- HOD (Mr. Adebayo A.A)
-- HOD (Dr. A. A. Orunsolu)
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'hod.cs@mapoly.edu.ng', 'Dr. A. A. Orunsolu', 'hod', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'MAP/CS/ST/001', 'Head of Department / Principal Lecturer (PL)', true);

-- Mr. Adebayo A.A
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000002', 'adebayo.a@mapoly.edu.ng', 'Mr. Adebayo A.A', 'lecturer', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000002', 'MAP/CS/ST/002', 'Principal Lecturer (PL)', false);

-- Mr. Elegbede Oluwaseyi
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000003', 'elegbede.o@mapoly.edu.ng', 'Mr. Elegbede Oluwaseyi', 'lecturer', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000003', 'MAP/CS/ST/003', 'Technologist', false);

-- Mr. Odekunle Abiodun
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000004', 'odekunle.a@mapoly.edu.ng', 'Mr. Odekunle Abiodun', 'lecturer', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000004', 'MAP/CS/ST/004', 'Lecturer', false);

-- Mr. Adetona Basit
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000005', 'adetona.b@mapoly.edu.ng', 'Mr. Adetona Basit', 'lecturer', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000005', 'MAP/CS/ST/005', 'Technologist', false);

-- Dr. Mrs. Lawal
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000006', 'lawal.m@mapoly.edu.ng', 'Dr. Mrs. Lawal', 'lecturer', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000006', 'MAP/CS/ST/006', 'Senior Lecturer (SL)', false);

-- Mr. Triumph Olatunji
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000007', 'triumph.o@mapoly.edu.ng', 'Mr. Triumph Olatunji', 'lecturer', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000007', 'MAP/CS/ST/007', 'Technologist', false);

-- Mr. Adebesin A.A
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000008', 'adebesin.a@mapoly.edu.ng', 'Mr. Adebesin A.A', 'lecturer', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000008', 'MAP/CS/ST/008', 'Principal Technologist (PT)', false);

-- Mr. Oladimeji G.B
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000009', 'oladimeji.g@mapoly.edu.ng', 'Mr. Oladimeji G.B', 'lecturer', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000009', 'MAP/CS/ST/009', 'Asst Chief Technologist (ACT)', false);

-- Mr. Akinlade O.S
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000010', 'akinlade.o@mapoly.edu.ng', 'Mr. Akinlade O.S', 'lecturer', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000010', 'MAP/CS/ST/010', 'Lecturer', false);

-- Dr. Mrs. Alaran (ND2 Level Adviser)
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000011', 'alaran.o@mapoly.edu.ng', 'Dr. Mrs. Alaran', 'adviser', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod, adviser_for_level) VALUES
  ('c0000000-0000-0000-0000-000000000011', 'MAP/CS/ST/011', 'Principal Lecturer (PL)', false, 'ND2');

-- Mrs. Adesina Aminat (ND1 Level Adviser)
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000012', 'adesina.a@mapoly.edu.ng', 'Mrs. Adesina Aminat', 'adviser', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod, adviser_for_level) VALUES
  ('c0000000-0000-0000-0000-000000000012', 'MAP/CS/ST/012', 'Lecturer & Level Adviser', false, 'ND1');

-- Mrs. Oyelowo Omotola
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000013', 'oyelowo.o@mapoly.edu.ng', 'Mrs. Oyelowo Omotola', 'lecturer', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000013', 'MAP/CS/ST/013', 'Lecturer', false);

-- Mrs. Adebayo Bukola
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000014', 'adebayo.b@mapoly.edu.ng', 'Mrs. Adebayo Bukola', 'lecturer', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000014', 'MAP/CS/ST/014', 'Technologist', false);

-- Mr. Salawu Saheed
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000015', 'salawu.s@mapoly.edu.ng', 'Mr. Salawu Saheed', 'lecturer', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000015', 'MAP/CS/ST/015', 'Lecturer', false);

-- Mr. Kareem Sakiru
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000016', 'kareem.s@mapoly.edu.ng', 'Mr. Kareem Sakiru', 'lecturer', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000016', 'MAP/CS/ST/016', 'Technologist', false);

-- System Admin
INSERT INTO public.users (id, email, name, role, department) VALUES
  ('c0000000-0000-0000-0000-000000000099', 'admin.cs@mapoly.edu.ng', 'Engr. S. A. Folorunsho', 'admin', 'Computer Science');
INSERT INTO public.staff_profiles (user_id, staff_id, title, is_hod) VALUES
  ('c0000000-0000-0000-0000-000000000099', 'MAP/CS/ADM/002', 'Department System Administrator', false);

-- 4. OFFICIAL COMPUTER SCIENCE CURRICULUM (COURSES)
INSERT INTO public.courses (id, code, title, unit_load, level, semester_id, type) VALUES
  ('d0000000-0000-0000-0000-000000000101', 'COM 101', 'Introduction to Computer Systems & Operating Systems', 3, 'ND1', 'b0000000-0000-0000-0000-000000000001', 'core'),
  ('d0000000-0000-0000-0000-000000000103', 'COM 103', 'Introduction to Programming Principles (C & Python)', 4, 'ND1', 'b0000000-0000-0000-0000-000000000001', 'core'),
  ('d0000000-0000-0000-0000-000000000201', 'COM 201', 'Data Structures & Algorithms', 3, 'ND2', 'b0000000-0000-0000-0000-000000000001', 'core'),
  ('d0000000-0000-0000-0000-000000000203', 'COM 203', 'Database Design & SQL System Management', 4, 'ND2', 'b0000000-0000-0000-0000-000000000001', 'core'),
  ('d0000000-0000-0000-0000-000000000205', 'COM 205', 'Web Application Development (HTML/CSS/JS)', 3, 'ND2', 'b0000000-0000-0000-0000-000000000001', 'core'),
  ('d0000000-0000-0000-0000-000000000301', 'COM 311', 'Advanced Object-Oriented Systems (Java/TypeScript)', 4, 'HND1', 'b0000000-0000-0000-0000-000000000001', 'core'),
  ('d0000000-0000-0000-0000-000000000303', 'COM 313', 'Software Engineering & System Architecture', 3, 'HND1', 'b0000000-0000-0000-0000-000000000001', 'core'),
  ('d0000000-0000-0000-0000-000000000401', 'COM 411', 'Distributed Systems & Cloud Computing Architecture', 4, 'HND2', 'b0000000-0000-0000-0000-000000000001', 'core'),
  ('d0000000-0000-0000-0000-000000000403', 'COM 413', 'Computer Security & Applied Cryptography', 3, 'HND2', 'b0000000-0000-0000-0000-000000000001', 'core'),
  ('d0000000-0000-0000-0000-000000000405', 'COM 415', 'Artificial Intelligence & Machine Learning Fundamentals', 3, 'HND2', 'b0000000-0000-0000-0000-000000000001', 'elective');
