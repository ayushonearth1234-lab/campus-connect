'use client';

import { Clock, CheckCircle2, XCircle, Ban, ArrowRight, User, Sparkles, Briefcase } from 'lucide-react';

export default function RequestCard({
  request,
  type = 'received', // 'received' or 'sent'
  onStatusChange,
  loading = false
}) {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return {
          icon: CheckCircle2,
          class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Accepted'
        };
      case 'rejected':
        return {
          icon: XCircle,
          class: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'Rejected'
        };
      case 'cancelled':
        return {
          icon: Ban,
          class: 'bg-slate-100 text-slate-600 border-slate-200',
          label: 'Cancelled'
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          class: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          label: 'Completed'
        };
      case 'pending':
      default:
        return {
          icon: Clock,
          class: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Pending'
        };
    }
  };

  const statusConfig = getStatusBadge(request.status);
  const StatusIcon = statusConfig.icon;

  const isReceived = type === 'received';
  const peerName = isReceived ? request.sender_name : request.receiver_name;
  const peerEmail = isReceived ? request.sender_email : request.receiver_email;
  const peerDept = isReceived ? request.sender_department : request.receiver_department;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        {/* Request Type and Title */}
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
            request.request_type === 'skill'
              ? 'bg-indigo-50 text-indigo-700'
              : 'bg-purple-50 text-purple-700'
          }`}>
            {request.request_type === 'skill' ? <Sparkles className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
            {request.request_type === 'skill' ? 'Skill Exchange' : 'Campus Service'}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {new Date(request.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Status Pill */}
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 ${statusConfig.class}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {statusConfig.label}
        </span>
      </div>

      {/* Target Item Title */}
      <h4 className="text-base font-bold text-slate-800 mb-2">
        {request.target_title || 'General Request'}
      </h4>

      {/* Message / Description */}
      {request.description && (
        <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600 mb-4 border border-slate-100">
          <p className="italic">&ldquo;{request.description}&rdquo;</p>
        </div>
      )}

      {/* Peer info & Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
            {peerName ? peerName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-xs">
            <p className="font-semibold text-slate-800">
              {isReceived ? `From: ${peerName}` : `To: ${peerName}`}
            </p>
            <p className="text-slate-500">{peerDept} &bull; {peerEmail}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* If Receiver and Status is Pending: Accept or Reject */}
          {isReceived && request.status === 'pending' && (
            <>
              <button
                disabled={loading}
                onClick={() => onStatusChange(request.request_id, 'accepted')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Accept
              </button>
              <button
                disabled={loading}
                onClick={() => onStatusChange(request.request_id, 'rejected')}
                className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </>
          )}

          {/* If Sender and Status is Pending: Cancel */}
          {!isReceived && request.status === 'pending' && (
            <button
              disabled={loading}
              onClick={() => onStatusChange(request.request_id, 'cancelled')}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel Request
            </button>
          )}

          {/* If Status is Accepted: Mark Completed option */}
          {request.status === 'accepted' && (
            <button
              disabled={loading}
              onClick={() => onStatusChange(request.request_id, 'completed')}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

