'use client';

import { useState } from 'react';
import { X, Send, Sparkles, Briefcase } from 'lucide-react';

export default function RequestModal({
  isOpen,
  onClose,
  targetItem,
  type = 'skill', // 'skill' or 'service'
  onSuccess
}) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !targetItem) return null;

  const isSkill = type === 'skill';
  const title = isSkill ? targetItem.skill_name : targetItem.service_name;
  const receiverId = targetItem.student_id;
  const receiverName = targetItem.student_name || targetItem.provider_name || 'Student';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        receiver_id: receiverId,
        request_type: type,
        skill_id: isSkill ? targetItem.skill_id : null,
        service_id: !isSkill ? targetItem.service_id : null,
        description: description.trim() || `Requesting ${type} exchange for ${title}`
      };

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setDescription('');
      if (onSuccess) onSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl text-white ${isSkill ? 'bg-indigo-600' : 'bg-purple-600'}`}>
              {isSkill ? <Sparkles className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                {isSkill ? 'Request Skill Exchange' : 'Request Campus Service'}
              </h3>
              <p className="text-xs text-slate-500">Connecting with {receiverName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              {isSkill ? 'Target Skill' : 'Target Service'}
            </span>
            <p className="font-bold text-slate-800 text-sm">{title}</p>
            <p className="text-xs text-slate-500 mt-0.5">Offered by {receiverName} ({targetItem.department || 'Campus'})</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Message or Note to {receiverName}
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Hi ${receiverName}, I would love to connect for ${title}. I am free on...`}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 ${
                isSkill
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                  : 'bg-purple-600 hover:bg-purple-700 shadow-purple-100'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

