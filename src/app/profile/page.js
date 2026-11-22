'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import {
  User,
  Mail,
  Building,
  Calendar,
  GraduationCap,
  FileText,
  BookOpen,
  BookmarkCheck,
  Briefcase,
  Edit3,
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    year: '',
    college: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('offered'); // 'offered', 'wanted', 'services'

  const fetchProfile = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) {
        window.location.href = '/login';
        return;
      }
      const meData = await meRes.json();
      setUser(meData.user);

      // Fetch full profile with skills and services
      const res = await fetch(`/api/students/${meData.user.student_id}`);
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        setFormData({
          name: data.student.name || '',
          department: data.student.department || '',
          year: data.student.year || '2',
          college: data.student.college || '',
          bio: data.student.bio || ''
        });
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/students/${user.student_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setMessage('Profile updated successfully in MySQL database!');
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!confirm('Are you sure you want to remove this skill listing?')) return;
    try {
      const res = await fetch(`/api/skills/${skillId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProfile();
      }
    } catch (err) {
      alert('Failed to delete skill');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this campus service?')) return;
    try {
      const res = await fetch(`/api/services/${serviceId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProfile();
      }
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const student = profileData?.student || user;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar user={user} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8">
          {message && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          {/* Profile Card Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  {student?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">{student?.name}</h1>
                  <p className="text-sm text-slate-500">{student?.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700">
                      {student?.department}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700">
                      Year {student?.year}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700">
                      {student?.college}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </div>

            {/* Bio Display */}
            {!isEditing && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  About Me / Bio
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  {student?.bio || 'No bio provided yet. Click "Edit Profile" to add your introduction!'}
                </p>
              </div>
            )}

            {/* Profile Edit Form */}
            {isEditing && (
              <form onSubmit={handleUpdate} className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Edit Profile Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">College</label>
                    <input
                      type="text"
                      required
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Year of Study</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Short Bio</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell campus peers about your technical interests, projects, and what you love learning..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Tab Navigation for Skills Offered / Wanted / Services */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('offered')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'offered'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Skills Offered ({profileData?.skillsOffered?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('wanted')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'wanted'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Skills Wanted ({profileData?.skillsWanted?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'services'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  My Campus Services ({profileData?.services?.length || 0})
                </button>
              </div>

              {/* Add New Button based on Tab */}
              {activeTab === 'offered' && (
                <Link
                  href="/skills/offer"
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Offer New Skill
                </Link>
              )}
              {activeTab === 'wanted' && (
                <Link
                  href="/skills/wanted"
                  className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Wanted Skill
                </Link>
              )}
              {activeTab === 'services' && (
                <Link
                  href="/services/offer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Offer New Service
                </Link>
              )}
            </div>

            {/* TAB 1: Skills Offered */}
            {activeTab === 'offered' && (
              <div className="space-y-3">
                {profileData?.skillsOffered?.length > 0 ? (
                  profileData.skillsOffered.map((skill) => (
                    <div
                      key={skill.skill_id}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-800 text-sm">{skill.skill_name}</h4>
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-indigo-100 text-indigo-700">
                            {skill.category}
                          </span>
                          {skill.experience_level && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-100 text-purple-700">
                              {skill.experience_level}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">{skill.description || 'No description'}</p>
                        {skill.availability && (
                          <p className="text-[11px] text-slate-400 mt-1">Availability: {skill.availability}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(skill.skill_id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">You haven&apos;t offered any skills yet.</p>
                )}
              </div>
            )}

            {/* TAB 2: Skills Wanted */}
            {activeTab === 'wanted' && (
              <div className="space-y-3">
                {profileData?.skillsWanted?.length > 0 ? (
                  profileData.skillsWanted.map((skill) => (
                    <div
                      key={skill.skill_id}
                      className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-800 text-sm">{skill.skill_name}</h4>
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-100 text-purple-700">
                            {skill.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{skill.description || 'Interested in learning'}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(skill.skill_id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">You haven&apos;t added any wanted skills yet.</p>
                )}
              </div>
            )}

            {/* TAB 3: My Campus Services */}
            {activeTab === 'services' && (
              <div className="space-y-3">
                {profileData?.services?.length > 0 ? (
                  profileData.services.map((srv) => (
                    <div
                      key={srv.service_id}
                      className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-800 text-sm">{srv.service_name}</h4>
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-100 text-emerald-800">
                            {srv.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{srv.description || 'Campus Service'}</p>
                        {srv.availability && (
                          <p className="text-[11px] text-slate-400 mt-1">Availability: {srv.availability}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteService(srv.service_id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">You haven&apos;t offered any campus services yet.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

