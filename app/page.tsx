import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeaderNav } from '@/components/HeaderNav';
import { HeroSection } from '@/components/HeroSection';
import {
  ArrowRight, BookOpen, CalendarCheck, BarChart3, Bell,
  CalendarDays, Users, Award, CheckCircle, ChevronRight,
  GraduationCap, Laptop, Shield
} from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Course Registration',
    desc: 'Students self-register online. Course advisers clear in one click. No paper, no queues.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Result Computation',
    desc: 'Lecturers upload scores. HOD approves. Students see published results instantly.',
  },
  {
    icon: <CalendarCheck className="w-6 h-6" />,
    title: 'Attendance Tracking',
    desc: 'Automatic 75% eligibility monitoring. Alerts for at-risk students before exams.',
  },
  {
    icon: <CalendarDays className="w-6 h-6" />,
    title: 'Class Timetable',
    desc: 'Live departmental timetable. Level-filtered so each student sees only their schedule.',
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Announcements',
    desc: 'HOD and lecturers push bulletins. Students receive real-time department updates.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'CGPA Calculation',
    desc: 'Automatic grade-point computation. Full academic transcript for every student.',
  },
];

const roles = [
  {
    icon: <GraduationCap className="w-7 h-7" />,
    role: 'Student',
    desc: 'Register courses, view results, check attendance, download materials — all from one dashboard.',
    color: 'nacos-green',
  },
  {
    icon: <Laptop className="w-7 h-7" />,
    role: 'Lecturer',
    desc: 'Manage your allocated courses, mark attendance, submit scores for HOD approval.',
    color: 'nacos-green',
  },
  {
    icon: <Users className="w-7 h-7" />,
    role: 'Course Adviser',
    desc: 'Clear student registrations, monitor advisee standing, flag at-risk students.',
    color: 'nacos-green',
  },
  {
    icon: <Shield className="w-7 h-7" />,
    role: 'HOD / Admin',
    desc: 'Approve broadsheets, publish results, manage staff allocation, oversee the department.',
    color: 'nacos-green',
  },
];

const stats = [
  { number: '1,420+', label: 'Enrolled Students' },
  { number: '13+', label: 'Skilled Lecturers' },
  { number: '30+', label: 'Active Courses' },
  { number: '3', label: 'Awards Won' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-nacos-off-white">
      <HeaderNav />

      <HeroSection />

      {/* ═══ STATS BAND ═══ */}
      <section className="bg-nacos-green">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center text-white">
              <div className="text-4xl font-black mb-1">{s.number}</div>
              <div className="text-sm font-semibold text-white/80 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Real Campus Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] relative">
              <Image
                src="/images/images.jpg"
                alt="MAPOLY CS Department Building"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="font-bold text-lg text-white">MAPOLY CS Department Complex</p>
                <p className="text-emerald-400 text-xs font-mono font-semibold">Ojere Campus · Abeokuta, Ogun State</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-5">
            <div>
              <span className="section-label">Departmental Operations</span>
              <h2 className="section-heading">
                Welcome to the <span className="highlight">CS Department</span>, MAPOLY Abeokuta
              </h2>
            </div>
            <p className="text-ink-muted leading-relaxed text-sm md:text-base">
              CSDSIMS replaces paper files, manual sign-offs, and administrative queues with an official,
              role-aware platform for the Computer Science Department at Moshood Abiola
              Polytechnic. From instant portal course form auto-approval to result computation — everything operates transparently and in real time.
            </p>
            <p className="text-ink-muted leading-relaxed text-sm md:text-base">
              Empowering students, lecturers, course advisers, and administrators with cutting-edge digital infrastructure.
            </p>
            <div className="space-y-2.5 pt-2">
              {['Instant School Portal Form Verification & Course Auto-Approval', 'Classroom GPS Geofencing & 1-Device Check-In Lock', 'Real-Time CA, Examination & Transcript Broadsheet Engine'].map(pt => (
                <div key={pt} className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-slate-800">
                  <CheckCircle className="w-4 h-4 text-nacos-green shrink-0" />
                  {pt}
                </div>
              ))}
            </div>
            <Link href="/login" className="btn-primary inline-flex mt-4 font-mono font-bold text-xs py-3 px-6 rounded-xl">
              Access Student Portal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="bg-nacos-off-white py-20 bg-topo">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="section-label">Our Features</span>
            <h2 className="section-heading">
              Everything the Department <span className="highlight">Needs</span>
            </h2>
            <p className="text-ink-light mt-3 max-w-xl mx-auto">
              Built specifically for MAPOLY CS — every feature maps to a real departmental workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="nacos-card p-6 space-y-4">
                <div className="icon-box-green">{f.icon}</div>
                <h3 className="font-bold text-base text-ink">{f.title}</h3>
                <p className="text-sm text-ink-light leading-relaxed">{f.desc}</p>
                <Link href="/login" className="flex items-center gap-1 text-nacos-green font-semibold text-sm hover:gap-2 transition-all">
                  Learn more <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ROLES ═══ */}
      <section id="roles" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="section-label">Who It's For</span>
            <h2 className="section-heading">
              Role-Aware Access for <span className="highlight">Everyone</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {roles.map((r, i) => (
              <div key={r.role} className="nacos-card p-6 text-center space-y-4 group">
                <div className="w-14 h-14 rounded-2xl bg-nacos-green-light text-nacos-green-dark flex items-center justify-center mx-auto group-hover:bg-nacos-green group-hover:text-white transition-all">
                  {r.icon}
                </div>
                <h3 className="font-bold text-base text-ink">{r.role}</h3>
                <p className="text-sm text-ink-light leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS / CTA BAND ═══ */}
      <section className="relative bg-nacos-green-dark py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/pattern-wave.svg')] bg-repeat" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-6">
          <span className="inline-block bg-white/10 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/20">
            Get Started
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            The Department is <span className="text-nacos-green">Digital Now.</span><br />
            Are you in?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Log in with your matric number or staff credentials. Your dashboard is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <Link href="/login" className="btn-primary text-base py-3.5 px-8 shadow-xl hover:shadow-nacos-green/40 hover:-translate-y-0.5 transition-all">
              Access Portal <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://nacosmapoly.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 text-base font-extrabold py-3.5 px-8 rounded-full bg-white text-nacos-green-dark hover:bg-emerald-50 shadow-2xl border-2 border-white transition-all hover:-translate-y-0.5 shrink-0"
            >
              <span>NACOS MAPOLY Website</span>
              <span className="text-sm font-bold">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-nacos-green-dark text-white/80">
        {/* Main footer */}
        <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/logos/nacos-logo.png"
                alt="NACOSMAPOLY Logo"
                width={180}
                height={48}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed">
              CSDSIMS is the official student information portal for the Computer Science Department
              at Moshood Abiola Polytechnic, Abeokuta.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-4 border-b border-nacos-green pb-2">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['About Us', 'Features', 'Announcements', 'Contact Us', 'FAQ'].map(l => (
                <li key={l}>
                  <a href="#" className="flex items-center gap-1.5 hover:text-nacos-green transition-colors">
                    <ChevronRight className="w-3 h-3 text-nacos-green" /> {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-4 border-b border-nacos-green pb-2">Official Links</h4>
            <ul className="space-y-2 text-sm">
              {['Student Portal', 'Course Registration', 'Result Portal', 'Timetable', 'NACOS MAPOLY'].map(l => (
                <li key={l}>
                  <a href="#" className="flex items-center gap-1.5 hover:text-nacos-green transition-colors">
                    <ChevronRight className="w-3 h-3 text-nacos-green" /> {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-4 border-b border-nacos-green pb-2">Quick Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <div className="icon-box-green shrink-0 !w-8 !h-8 !rounded-lg">
                  <Bell className="w-4 h-4" />
                </div>
                <span>+234 909 346 3811</span>
              </li>
              <li className="flex gap-3">
                <div className="icon-box-green shrink-0 !w-8 !h-8 !rounded-lg">
                  <Shield className="w-4 h-4" />
                </div>
                <span>Ojere, Moshood Abiola Polytechnic, Abeokuta, Ogun State</span>
              </li>
            </ul>

            <div className="mt-5 pt-4 border-t border-white/10 text-xs text-white/60 space-y-1 font-mono">
              <div className="font-bold text-white uppercase text-[10px] tracking-wider mb-1">Office Hours</div>
              <div>Mon – Fri: 8:00 AM – 4:00 PM</div>
              <div>Department ICT Resource Centre</div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/50">
            <span>© CSDSIMS 2026 · Computer Science Dept., Moshood Abiola Polytechnic</span>
            <span>Built by NACOS MAPOLY · Session 2025/2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
