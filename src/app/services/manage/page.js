'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Briefcase, Plus, Edit2, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ManageServicesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [editFormData, setEditFormData] = useState({
    service_name: '',
    category: '',
    description: '',
    availability: ''
  });
  const [message, setMessage] = useState('');

  const fetchMyServices = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) {
        router.push('/login');
        return;
      }
      const meData = await meRes.json();
      setUser(meData.user);

      const res = await fetch(`/api/services?student_id=${meData.user.student_id}`);
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  const handleDelete = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this campus service?')) return;
    try {
      const res = await fetch(`/api/services/${serviceId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Service deleted successfully from MySQL!');
        fetchMyServices();
      }
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  const startEdit = (srv) => {
    setEditingService(srv);
    setEditFormData({
      service_name: srv.service_name,
      category: srv.category,
      description: srv.description || '',
      availability: srv.availability || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/services/${editingService.service_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        setMessage('Service updated successfully!');
        setEditingService(null);
        fetchMyServices();
      }
    } catch (err) {
      alert('Failed to update service');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar user={user} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span>My Listings</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Manage Campus Services
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Edit, update, or remove services you currently offer to students.
              </p>
            </div>

            <Link
              href="/services/offer"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Offer New Service</span>
            </Link>
          </div>

          {message && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          {/* Edit Modal / Box */}
          {editingService && (
            <div className="bg-white rounded-3xl p-6 border border-purple-200 shadow-lg space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">
                Edit Service: {editingService.service_name}
              </h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Service Name</label>
                    <input
                      type="text"
                      required
                      value={editFormData.service_name}
                      onChange={(e) => setEditFormData({ ...editFormData, service_name: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Availability</label>
                    <input
                      type="text"
                      value={editFormData.availability}
                      onChange={(e) => setEditFormData({ ...editFormData, availability: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of services */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            {services.length > 0 ? (
              <div className="space-y-3">
                {services.map((srv) => (
                  <div
                    key={srv.service_id}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-800 text-sm">{srv.service_name}</h4>
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-100 text-purple-800">
                          {srv.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{srv.description || 'No description'}</p>
                      {srv.availability && (
                        <p className="text-[11px] text-slate-400 mt-1">Availability: {srv.availability}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => startEdit(srv)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-purple-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(srv.service_id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">You haven&apos;t offered any campus services yet.</p>
                <Link
                  href="/services/offer"
                  className="mt-3 inline-block px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold"
                >
                  Offer Your First Service
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

