'use client';

import { Briefcase, Calendar, User, Send, CheckCircle2 } from 'lucide-react';

export default function ServiceCard({ service, onRequestService, isOwnService = false, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Category Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1.5">
            <Briefcase className="w-3 h-3" />
            {service.category || 'Campus Service'}
          </span>
          <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Available
          </span>
        </div>

        {/* Service Name */}
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-600 transition-colors mb-2 line-clamp-1">
          {service.service_name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {service.description || 'No detailed description provided.'}
        </p>

        {/* Availability info */}
        {service.availability && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span className="truncate">{service.availability}</span>
          </div>
        )}

        {/* Provider info */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            {service.provider_name ? service.provider_name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div className="overflow-hidden text-xs">
            <p className="font-semibold text-slate-800 truncate">{service.provider_name || 'Campus Student'}</p>
            <p className="text-slate-500 truncate">
              {service.department ? `${service.department} • ` : ''}Year {service.year || '2'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-100">
        {!isOwnService ? (
          <button
            onClick={() => onRequestService && onRequestService(service)}
            className="w-full py-2 px-3 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm shadow-purple-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Request Service
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit && onEdit(service)}
              className="flex-1 py-1.5 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete && onDelete(service.service_id)}
              className="flex-1 py-1.5 px-3 text-xs font-medium text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

