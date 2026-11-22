'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Briefcase,
  Layers,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [skills, setSkills] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('students'); // 'students', 'skills', 'services'
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const checkAdminAndFetch = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) {
        router.push('/login');
        return;
      }
      const meData = await meRes.json();
      if (!meData?.user || meData.user.role !== 'admin') {
        alert('Access Denied: Only users with the "admin" role can access the Admin Dashboard.');
        router.push('/dashboard');
        return;
      }
      setUser(meData.user);

      // Fetch admin data in parallel
      const [stuRes, sklRes, srvRes] = await Promise.all([
        fetch('/api/admin/students'),
        fetch('/api/admin/skills'),
        fetch('/api/admin/services')
      ]);

      if (stuRes.ok) {
        const sData = await stuRes.json();
        setStudents(sData.students || []);
      }
      if (sklRes.ok) {
        const kData = await sklRes.json();
        setSkills(kData.skills || []);
      }
      if (srvRes.ok) {
        const vData = await srvRes.json();
        setServices(vData.services || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminAndFetch();
  }, [router]);

  const handleDeleteSkill = async (skillId) => {
    if (!confirm(`Are you sure you want to moderate and delete skill #${skillId}?`)) return;
    try {
      const res = await fetch(`/api/admin/skills/${skillId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage(`Skill #${skillId} successfully deleted by Administrator.`);
        checkAdminAndFetch();
      }
    } catch (err) {
      alert('Failed to delete skill');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm(`Are you sure you want to moderate and delete service #${serviceId}?`)) return;
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage(`Service #${serviceId} successfully deleted by Administrator.`);
        checkAdminAndFetch();
      }
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar user={user} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-8">
          {/* Admin Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Administrator Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                System Administration &bull; CampusConnect
              </h1>
              <p className="text-slate-300 text-sm max-w-xl">
                Moderate content, view all registered college students, inspect skill offerings, and monitor campus services.
              </p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs space-y-1 text-slate-300">
              <p className="font-bold text-white">Security Policy:</p>
              <p>&bull; Passwords hashed via bcrypt</p>
              <p>&bull; Foreign keys CASCADE delete</p>
            </div>
          </div>

          {message && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{students.length}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">All Skills Listed</p>
                <p className="text-3xl font-extrabold text-purple-600 mt-1">{skills.length}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Services</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">{services.length}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'students'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Registered Students ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'skills'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Manage Skills ({skills.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'services'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Manage Services ({services.length})
            </button>
          </div>

          {/* TAB 1: Registered Students Table */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Students Directory</h3>
                <p className="text-xs text-slate-500">Live records from the MySQL `students` table.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="p-4">ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Department &bull; Year</th>
                      <th className="p-4">College</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Stats</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {students.map((s) => (
                      <tr key={s.student_id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 font-mono font-bold text-indigo-600">#{s.student_id}</td>
                        <td className="p-4 font-semibold text-slate-900">{s.name}</td>
                        <td className="p-4 font-mono text-slate-500">{s.email}</td>
                        <td className="p-4">{s.department} (Yr {s.year})</td>
                        <td className="p-4">{s.college}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                            s.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {s.role}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">
                          {s.skills_offered_count} offered &bull; {s.services_count} services
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Skills Table with Admin Delete */}
          {activeTab === 'skills' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Skills Moderation</h3>
                <p className="text-xs text-slate-500">Administrators can delete inappropriate or spam listings.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="p-4">Skill</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Offered By</th>
                      <th className="p-4">Experience &bull; Timings</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {skills.map((k) => (
                      <tr key={k.skill_id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{k.skill_name}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            k.type === 'offered' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {k.type}
                          </span>
                        </td>
                        <td className="p-4">{k.category}</td>
                        <td className="p-4">{k.student_name} ({k.department})</td>
                        <td className="p-4 text-slate-500">{k.experience_level || 'N/A'} &bull; {k.availability || 'Flexible'}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteSkill(k.skill_id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Admin Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Services Table with Admin Delete */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Campus Services Moderation</h3>
                <p className="text-xs text-slate-500">Administrators can remove non-compliant service listings.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="p-4">Service Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Provider</th>
                      <th className="p-4">Availability</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {services.map((srv) => (
                      <tr key={srv.service_id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{srv.service_name}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {srv.category}
                          </span>
                        </td>
                        <td className="p-4">{srv.provider_name} ({srv.department})</td>
                        <td className="p-4 text-slate-500">{srv.availability || 'On request'}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteService(srv.service_id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Admin Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

