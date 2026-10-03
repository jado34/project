-- Computer Science Department Students Information Management System (CSDSIMS)
-- Moshood Abiola Polytechnic (MAPOLY), Abeokuta
-- Supabase Postgres Relational Schema DDL & Row Level Security (RLS) Policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'lecturer', 'adviser', 'hod', 'admin')),
  department TEXT NOT NULL DEFAULT 'Computer Science',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.student_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  matric_no TEXT UNIQUE NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('ND1', 'ND2', 'HND1', 'HND2')),
  programme TEXT NOT NULL DEFAULT 'Computer Science',
  cgpa NUMERIC(3,2) DEFAULT 0.00,
  academic_status TEXT DEFAULT 'active' CHECK (academic_status IN ('active', 'probation', 'withdrawn', 'graduated')),
  adviser_id UUID REFERENCES public.users(id)
);

CREATE TABLE public.staff_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  staff_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  is_hod BOOLEAN DEFAULT FALSE,
  adviser_for_level TEXT CHECK (adviser_for_level IN ('ND1', 'ND2', 'HND1', 'HND2'))
);

-- 2. ACADEMIC SESSIONS & COURSES
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- e.g., "2025/2026"
  is_current BOOLEAN DEFAULT FALSE
);

CREATE TABLE public.semesters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL -- e.g., "First Semester"
);

CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  unit_load INTEGER NOT NULL CHECK (unit_load > 0),
  level TEXT NOT NULL CHECK (level IN ('ND1', 'ND2', 'HND1', 'HND2')),
  semester_id UUID REFERENCES public.semesters(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('core', 'elective')),
  prerequisites TEXT[] DEFAULT '{}'::TEXT[]
);

CREATE TABLE public.course_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lecturer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  semester_id UUID REFERENCES public.semesters(id) ON DELETE CASCADE,
  UNIQUE(course_id, lecturer_id, semester_id)
);

-- 3. REGISTRATION & RESULT LIFECYCLE STATE MACHINE
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  semester_id UUID REFERENCES public.semesters(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  adviser_approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, course_id, semester_id)
);

CREATE TABLE public.results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID UNIQUE REFERENCES public.registrations(id) ON DELETE CASCADE,
  ca_score NUMERIC(5,2) DEFAULT 0 CHECK (ca_score >= 0 AND ca_score <= 40),
  exam_score NUMERIC(5,2) DEFAULT 0 CHECK (exam_score >= 0 AND exam_score <= 70),
  total_score NUMERIC(5,2) GENERATED ALWAYS AS (ca_score + exam_score) STORED,
  grade TEXT,
  grade_point NUMERIC(3,2),
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Published')),
  submitted_by UUID REFERENCES public.users(id),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ATTENDANCE & TIMETABLE
CREATE TABLE public.attendance_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  topic TEXT NOT NULL
);

CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendance_session_id UUID REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  present BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(attendance_session_id, student_id)
);

CREATE TABLE public.timetable_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  day TEXT NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  venue TEXT NOT NULL,
  lecturer_id UUID REFERENCES public.users(id)
);

-- 5. ANNOUNCEMENTS & MATERIALS
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  scope TEXT NOT NULL CHECK (scope IN ('department', 'level', 'course')),
  target_level TEXT,
  target_course_id UUID REFERENCES public.courses(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  topic TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Student Result Policy: Can ONLY see results that are formally 'Published' and belong to them!
CREATE POLICY student_view_published_results ON public.results
  FOR SELECT
  USING (
    status = 'Published' AND registration_id IN (
      SELECT id FROM public.registrations WHERE student_id = auth.uid()
    )
  );

-- HOD / Admin Result Policy: Can view and update all results
CREATE POLICY hod_admin_manage_results ON public.results
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND (role = 'hod' OR role = 'admin')
    )
  );
