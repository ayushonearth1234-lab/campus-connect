'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import RequestCard from '@/components/RequestCard';
import { Inbox, Send, ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

export default function MyRequestsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [requestsData, setRequestsData] = useState({ all: [], sent: [], received: [] });
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchRequests = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) {
        router.push('/login');
        return;
      }
      const meData = await meRes.json();
      setUser(meData.user);

      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        setRequestsData(data);
      }
    } catch (err) {
      console.error('Fetch requests error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [router]);

  const handleStatusChange = async (requestId, newStatus) => {
    setActionLoading(true);
    setFeedback('');
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update request');
      }

      setFeedback(`Request status updated to "${newStatus}"!`);
      fetchRequests();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentList = activeTab === 'received' ? requestsData.received : requestsData.sent;
  const pendingReceivedCount = requestsData.received.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar user={user} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <Inbox className="w-3.5 h-3.5" />
              <span>Exchange Coordination</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Exchange Requests
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Review incoming skill &amp; service requests or monitor requests you have sent to fellow students.
            </p>
          </div>

          {feedback && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('received')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'received'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Received Requests</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'received' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {requestsData.received.length}
              </span>
              {pendingReceivedCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('sent')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'sent'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-100'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Sent Requests</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'sent' ? 'bg-purple-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {requestsData.sent.length}
              </span>
            </button>
          </div>

          {/* List of Requests */}
          <div className="space-y-4">
            {currentList.length > 0 ? (
              currentList.map((req) => (
                <RequestCard
                  key={req.request_id}
                  request={req}
                  type={activeTab}
                  loading={actionLoading}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  No {activeTab} requests found
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {activeTab === 'received'
                    ? 'When other students want to exchange skills or request your services, they will appear here.'
                    : 'Explore skills or services and send an exchange request to connect with peers!'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

