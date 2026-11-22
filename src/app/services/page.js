'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import RequestModal from '@/components/RequestModal';
import { Briefcase, Search, Plus, Filter, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function FindServicesPage() {
  const [services, setServices] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    'All',
    'Notes Sharing',
    'Assignment Guidance',
    'Tutoring',
    'Poster Designing',
    'Photography',
    'Event Assistance',
    'Laptop Troubleshooting',
    'Presentation Preparation',
    'Document Formatting',
    'Other'
  ];

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selectedCategory !== 'All') query.set('category', selectedCategory);
      if (search.trim()) query.set('search', search.trim());

      const res = await fetch(`/api/services?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Fetch services error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchServices();
    }, 250);
    return () => clearTimeout(delay);
  }, [search, selectedCategory]);

  const handleRequestService = (service) => {
    if (!user) {
      alert('Please log in or register to request a campus service!');
      window.location.href = '/login';
      return;
    }
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Campus Services Marketplace</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Campus Services by Fellow Students
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Find notes sharing, assignment guidance, event photography, tech troubleshooting and more.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/services/offer"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-sm shadow-purple-100 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Offer a Service
            </Link>
            <Link
              href="/services/manage"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors shadow-sm"
            >
              Manage My Services
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services (e.g., notes, photography, troubleshooting)..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    Category: {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading campus services from database...</p>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.service_id}
                service={service}
                isOwnService={user?.student_id === service.student_id}
                onRequestService={handleRequestService}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No services found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your keyword search or category filter.</p>
          </div>
        )}
      </main>

      <Footer />

      {/* Request Service Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetItem={selectedService}
        type="service"
        onSuccess={() => alert('Service request sent! Check status under "My Requests".')}
      />
    </div>
  );
}

