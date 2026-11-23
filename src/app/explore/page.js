'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillCard from '@/components/SkillCard';
import RequestModal from '@/components/RequestModal';
import {
  Compass,
  Search,
  Filter,
  Sparkles,
  Repeat,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

export default function ExploreSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    'All',
    'Programming',
    'Web Development',
    'Designing',
    'Communication',
    'Academics',
    'Photography',
    'Video Editing',
    'Business',
    'Sports',
    'Other'
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Check login & load matches
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('campus_token') : null;
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    fetch('/api/auth/me', { headers })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          // Fetch skill matches for this user
          fetch('/api/matches', { headers })
            .then((mRes) => (mRes.ok ? mRes.json() : null))
            .then((mData) => {
              if (mData?.matches) setMatches(mData.matches);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  // Fetch skills from MySQL
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.set('type', 'offered');
      if (selectedCategory !== 'All') query.set('category', selectedCategory);
      if (selectedLevel !== 'All') query.set('experience_level', selectedLevel);
      if (search.trim()) query.set('search', search.trim());

      const res = await fetch(`/api/skills?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSkills(data.skills || []);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSkills();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory, selectedLevel]);

  const handleRequestExchange = (skill) => {
    if (!user) {
      alert('Please log in or register to request a skill exchange!');
      window.location.href = '/login';
      return;
    }
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleViewProfile = (skill) => {
    alert(`🎓 Student Profile\nName: ${skill.student_name}\nDepartment: ${skill.department}\nYear: ${skill.year}\nCollege: ${skill.college}\nEmail: ${skill.student_email}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Campus Skill Directory</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Skills Offered by Students
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Find peers to teach you programming, design, photography, academic subjects, and more.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/skills/offer"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm shadow-indigo-100"
            >
              Offer a Skill
            </Link>
            <Link
              href="/skills/wanted"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors shadow-sm"
            >
              Add Wanted Skill
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SKILL MATCHING SECTION (Academic Requirement 8.D) */}
        {/* ================================================================= */}
        {user && matches.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-sm">
                <Repeat className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Skill Matches For You
                </h2>
                <p className="text-xs text-slate-600">
                  Our matching engine compared your wanted skills with other students&apos; offerings:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match) => (
                <div
                  key={match.match_id}
                  className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-100 text-purple-800 uppercase tracking-wide">
                      Match Found!
                    </span>
                    <h3 className="font-bold text-sm text-slate-800">
                      {match.instructor_name} can teach you {match.offered_skill_name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Because you want to learn: <span className="font-semibold text-indigo-600">{match.wanted_skill_name}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {match.instructor_department} &bull; Level: {match.experience_level || 'Proficient'}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      handleRequestExchange({
                        skill_id: match.offered_skill_id,
                        skill_name: match.offered_skill_name,
                        student_id: match.instructor_id,
                        student_name: match.instructor_name,
                        department: match.instructor_department
                      })
                    }
                    className="mt-3 w-full py-1.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                  >
                    Request Exchange
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by skill name, description or student..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    Category: {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div className="md:col-span-3">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Level: {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Skills Cards Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading skills from database...</p>
          </div>
        ) : skills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <SkillCard
                key={skill.skill_id}
                skill={skill}
                isOwnSkill={user?.student_id === skill.student_id}
                onRequestExchange={handleRequestExchange}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching skills found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search keywords or category filters.</p>
          </div>
        )}
      </main>

      <Footer />

      {/* Exchange Request Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetItem={selectedSkill}
        type="skill"
        onSuccess={() => alert('Exchange request sent successfully! You can track it under "My Requests".')}
      />
    </div>
  );
}

