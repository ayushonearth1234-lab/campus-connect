'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillCard from '@/components/SkillCard';
import ServiceCard from '@/components/ServiceCard';
import RequestModal from '@/components/RequestModal';
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Users,
  Repeat,
  BookOpen,
  Award,
  Shield,
  Layers,
  GraduationCap,
  Briefcase,
  ChevronRight,
  Code
} from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalStudents: 5,
    totalOfferedSkills: 4,
    totalWantedSkills: 4,
    totalServices: 4,
  });
  const [recentSkills, setRecentSkills] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState('skill');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user status
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => data?.user && setUser(data.user))
      .catch(() => {});

    // Fetch dynamic stats from database
    fetch('/api/stats')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.global) {
          setStats(data.global);
        }
      })
      .catch(() => {});

    // Fetch sample featured skills from MySQL
    fetch('/api/skills?type=offered')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.skills) {
          setRecentSkills(data.skills.slice(0, 3));
        }
      })
      .catch(() => {});

    // Fetch sample featured services from MySQL
    fetch('/api/services')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.services) {
          setRecentServices(data.services.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const handleRequestSkill = (skill) => {
    setSelectedItem(skill);
    setModalType('skill');
    setIsModalOpen(true);
  };

  const handleRequestService = (service) => {
    setSelectedItem(service);
    setModalType('service');
    setIsModalOpen(true);
  };

  const categories = [
    { name: 'Programming', count: 'Python, C++, Java', color: 'bg-blue-50 text-blue-700' },
    { name: 'Web Dev', count: 'React, Next.js, HTML', color: 'bg-indigo-50 text-indigo-700' },
    { name: 'Designing', count: 'Figma, UI/UX, Canva', color: 'bg-purple-50 text-purple-700' },
    { name: 'Academics', count: 'Maths, Physics, Notes', color: 'bg-amber-50 text-amber-700' },
    { name: 'Photography', count: 'DSLR, Lightroom, Video', color: 'bg-emerald-50 text-emerald-700' },
    { name: 'Campus Services', count: 'Tutoring, Hardware help', color: 'bg-rose-50 text-rose-700' },
  ];

  const teamMembers = [
    { name: 'Shubham Yadav', role: 'Full Stack & Database Lead', dept: 'CSE • 2nd Year' },
    { name: 'Tanmay', role: 'Frontend & UI/UX Developer', dept: 'CSE • 2nd Year' },
    { name: 'Bhargav Sai', role: 'Backend API & System Architect', dept: 'CSE • 2nd Year' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* ================================================================= */}
        {/* HERO SECTION */}
        {/* ================================================================= */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headlines & CTA */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>College Peer-to-Peer Exchange Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Your Campus.{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
                    Your Skills.
                  </span>{' '}
                  Your Community.
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                  Discover talented students, share your knowledge, learn new skills and build meaningful connections within your college campus.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    href="/explore"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore Skills</span>
                  </Link>
                  <Link
                    href={user ? "/dashboard" : "/register"}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <span>{user ? 'Go to Dashboard' : 'Get Started Free'}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>

                {/* Quick Trust Badges */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Verified Students Only</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Zero Cost Mutual Learning</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Safe Campus Community</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Interactive Preview Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-4">
                  {/* Mock Exchange Card */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      Live Matching
                    </span>
                  </div>

                  {/* Student A offering */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        A
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Aarav (2nd Year CSE)</p>
                        <p className="text-[11px] text-slate-500">Offers: Python &bull; Wants: Java</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                      Python
                    </span>
                  </div>

                  {/* Match Connector */}
                  <div className="flex items-center justify-center -my-1">
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold shadow-sm flex items-center gap-1.5">
                      <Repeat className="w-3 h-3" />
                      <span>Smart Mutual Match Found!</span>
                    </div>
                  </div>

                  {/* Student B offering */}
                  <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                        R
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Rohan (2nd Year ECE)</p>
                        <p className="text-[11px] text-slate-500">Offers: Java &bull; Wants: Python</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-lg">
                      Java
                    </span>
                  </div>

                  {/* Stat Counters in Hero */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <div className="text-lg font-extrabold text-indigo-600">{stats.totalStudents}+</div>
                      <div className="text-[10px] font-medium text-slate-500">Students</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <div className="text-lg font-extrabold text-purple-600">{stats.totalOfferedSkills}+</div>
                      <div className="text-[10px] font-medium text-slate-500">Skills Listed</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <div className="text-lg font-extrabold text-emerald-600">{stats.totalServices}+</div>
                      <div className="text-[10px] font-medium text-slate-500">Services</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 1. HOW IT WORKS */}
        {/* ================================================================= */}
        <section className="py-16 md:py-24 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Simple &amp; Direct
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                How CampusConnect Works
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Three effortless steps to teach what you know and learn what you need from fellow college mates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/70 hover:shadow-md transition-all relative">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg mb-4 shadow-md shadow-indigo-200">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Create Your Profile</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Register with your college details. List the skills you can offer (like Python or Figma) and the skills you want to learn.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/70 hover:shadow-md transition-all relative">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-bold flex items-center justify-center text-lg mb-4 shadow-md shadow-purple-200">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Discover or Match</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Browse campus skills or let our smart matching algorithm recommend students who teach what you want to learn.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/70 hover:shadow-md transition-all relative">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg mb-4 shadow-md shadow-emerald-200">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Connect &amp; Exchange</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Send a one-click exchange request. When accepted, coordinate via college email or campus meetups to exchange knowledge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. POPULAR CATEGORIES */}
        {/* ================================================================= */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  Skill Categories
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  Explore by Category
                </h2>
              </div>
              <Link
                href="/explore"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Browse all skills</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/explore?category=${encodeURIComponent(cat.name)}`}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group text-left"
                >
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold mb-2 ${cat.color}`}>
                    {cat.name}
                  </span>
                  <p className="text-xs text-slate-500 truncate">{cat.count}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. RECENTLY ADDED SKILLS */}
        {/* ================================================================= */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  Active Listings
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  Featured Skills Offered by Peers
                </h2>
              </div>
              <Link
                href="/explore"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View all listings</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {recentSkills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentSkills.map((skill) => (
                  <SkillCard
                    key={skill.skill_id}
                    skill={skill}
                    onRequestExchange={handleRequestSkill}
                    onViewProfile={(s) => alert(`Student: ${s.student_name}\nDepartment: ${s.department}\nCollege: ${s.college || 'Tech University'}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-medium">No skills listed yet. Be the first to offer one!</p>
              </div>
            )}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. AVAILABLE CAMPUS SERVICES */}
        {/* ================================================================= */}
        <section className="py-16 md:py-20 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  Campus Support
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  Useful Student Services
                </h2>
              </div>
              <Link
                href="/services"
                className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Browse all services</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {recentServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentServices.map((service) => (
                  <ServiceCard
                    key={service.service_id}
                    service={service}
                    onRequestService={handleRequestService}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-medium">No services listed yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 5. WHY CHOOSE CAMPUSCONNECT */}
        {/* ================================================================= */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Key Advantages
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                Why Students Love CampusConnect
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Designed specifically for collegiate ecosystems, overcoming traditional tutoring paywalls.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Peer-to-Peer Learning</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students understand student problems best. Learn directly from seniors and batchmates in a friendly environment.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Repeat className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Skill Barter System</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No money required. Exchange your knowledge in programming or design in return for academic tutoring or notes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Verified College Identity</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Restricted to college students with authentic department and year verification, keeping exchanges safe.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Resume Worthy</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Demonstrate leadership, teaching, and real-world collaboration skills for placement interviews and resumes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 6. ABOUT OUR PROJECT & 7. TEAM MEMBERS */}
        {/* ================================================================= */}
        <section id="about" className="py-16 md:py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                  <GraduationCap className="w-4 h-4" />
                  <span>Advanced Java Programming &bull; Semester Project</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  About Project CampusConnect
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Campus Skill and Service Exchange System was built to tackle knowledge silos on college campuses. 
                  Developed by Team <strong>CodeMates</strong>, it implements relational database architecture with MySQL, 
                  cryptographic password security with bcrypt, serverless Next.js API Routes, and dynamic SQL JOIN-driven skill matching.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs text-indigo-300 border border-slate-700">Next.js 14</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs text-emerald-300 border border-slate-700">MySQL Database</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs text-purple-300 border border-slate-700">mysql2 Pool</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs text-sky-300 border border-slate-700">Tailwind CSS</span>
                </div>
              </div>

              {/* Team Members Grid */}
              <div className="lg:col-span-7">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span>Team CodeMates Members</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.name}
                      className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow-sm shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">{member.name}</h4>
                        <p className="text-xs text-indigo-400 font-medium">{member.role}</p>
                        <p className="text-[11px] text-slate-400">{member.dept}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Reusable Request Exchange Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetItem={selectedItem}
        type={modalType}
        onSuccess={() => alert('Exchange request submitted successfully! The student has been notified.')}
      />
    </div>
  );
}

