'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import {
  Sparkles,
  BookOpen,
  BookmarkCheck,
  Briefcase,
  Clock,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Compass,
  Repeat,
  Layers,
  Inbox
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('campus_token') : null;
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    // 1. Fetch current authenticated user
    fetch('/api/auth/me', { headers })
      .then((res) => {
        if (!res.ok) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => router.push('/login'));

    // 2. Fetch personalized stats
    fetch('/api/stats', { headers })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.userStats) {
          setStats(data.userStats);
        }
      })
      .catch(() => {});

    // 3. Fetch skill matches
    fetch('/api/matches', { headers })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.matches) {
          setMatches(data.matches);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar user={user} />

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Hub &bull; {user?.department || 'Engineering'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'Student'}! 👋
              </h1>
              <p className="text-indigo-100 text-sm max-w-xl leading-relaxed">
                Here is your campus exchange snapshot. Connect with peers, accept requests, and manage your offered skills.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
              <Link
                href="/skills/offer"
                className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Offer a Skill
              </Link>
              <Link
                href="/explore"
                className="px-4 py-2.5 rounded-xl bg-indigo-500/40 hover:bg-indigo-500/60 text-white font-semibold text-xs transition-colors border border-white/20 flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                Find Peers
              </Link>
            </div>
          </div>

          {/* Quick Statistics Cards Grid (From MySQL) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Total Skills Offered */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Skills Offered
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats?.skillsOffered || 0}
              </div>
              <Link
                href="/profile"
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 mt-2 inline-flex items-center gap-1"
              >
                <span>View listings</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Total Skills Wanted */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Skills Wanted
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BookmarkCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats?.skillsWanted || 0}
              </div>
              <Link
                href="/skills/wanted"
                className="text-[11px] font-semibold text-purple-600 hover:text-purple-700 mt-2 inline-flex items-center gap-1"
              >
                <span>Add wanted</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Services Offered */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  My Services
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats?.servicesOffered || 0}
              </div>
              <Link
                href="/services/offer"
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 mt-2 inline-flex items-center gap-1"
              >
                <span>Manage services</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Pending Requests */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pending Action
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                {stats?.pendingRequests || 0}
              </div>
              <Link
                href="/requests"
                className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 mt-2 inline-flex items-center gap-1"
              >
                <span>Review requests</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Accepted Requests */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active Exchanges
                </span>
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-600">
                {stats?.acceptedRequests || 0}
              </div>
              <Link
                href="/requests"
                className="text-[11px] font-semibold text-sky-700 hover:text-sky-800 mt-2 inline-flex items-center gap-1"
              >
                <span>View contacts</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Skill Matching Highlight Section */}
          {matches.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-600 text-white shadow-sm">
                    <Repeat className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      Skill Matches Found For You!
                    </h3>
                    <p className="text-xs text-slate-600">
                      Based on skills you want to learn vs skills offered by your college peers.
                    </p>
                  </div>
                </div>
                <Link
                  href="/explore"
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  <span>See all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.slice(0, 2).map((match) => (
                  <div
                    key={match.match_id}
                    className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full inline-block mb-1">
                        Match Found
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {match.instructor_name} can teach you {match.offered_skill_name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {match.instructor_department} &bull; {match.experience_level || 'Proficient'}
                      </p>
                    </div>
                    <Link
                      href="/explore"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shrink-0 shadow-sm"
                    >
                      Connect
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activities & Quick Navigation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Activities from MySQL requests */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Recent Activities</span>
                </h3>
                <Link href="/requests" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  View all requests
                </Link>
              </div>

              {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivities.map((act) => {
                    const isSender = act.sender_id === user?.student_id;
                    return (
                      <div
                        key={act.request_id}
                        className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            act.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {act.status === 'accepted' ? '✓' : '•'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              {isSender
                                ? `You sent request for "${act.title}" to ${act.receiver_name}`
                                : `${act.sender_name} requested "${act.title}" from you`}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Status: <span className="capitalize font-semibold text-slate-700">{act.status}</span> &bull; {new Date(act.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Link
                          href="/requests"
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 shrink-0"
                        >
                          Details &rarr;
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  <Inbox className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p>No recent activity yet. Explore skills to send your first exchange request!</p>
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-base pb-3 border-b border-slate-100">
                Quick Actions
              </h3>
              <div className="space-y-2.5">
                <Link
                  href="/skills/offer"
                  className="p-3 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-900 border border-indigo-100 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="text-xs font-bold">Offer a New Skill</p>
                      <p className="text-[11px] text-slate-500">Teach what you know to fellow students</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-500" />
                </Link>

                <Link
                  href="/skills/wanted"
                  className="p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 text-purple-900 border border-purple-100 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookmarkCheck className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-xs font-bold">Add Skills Wanted</p>
                      <p className="text-[11px] text-slate-500">Specify what you wish to learn</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-500" />
                </Link>

                <Link
                  href="/services/offer"
                  className="p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 border border-emerald-100 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold">Offer a Campus Service</p>
                      <p className="text-[11px] text-slate-500">Notes sharing, tutoring, poster design</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-500" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

