'use client';

import { BookOpen, User, Calendar, Award, Send } from 'lucide-react';

export default function SkillCard({ skill, onRequestExchange, onViewProfile, isOwnSkill = false }) {
  // Experience badge coloring
  const getLevelBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'advanced':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'beginner':
      default:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Top Header: Category & Level */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
            {skill.category || 'Skill'}
          </span>
          {skill.experience_level && (
            <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md border ${getLevelBadge(skill.experience_level)}`}>
              {skill.experience_level}
            </span>
          )}
        </div>

        {/* Skill Title */}
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1">
          {skill.skill_name}
        </h3>

        {/* Skill Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {skill.description || 'No detailed description provided.'}
        </p>

        {/* Availability info */}
        {skill.availability && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{skill.availability}</span>
          </div>
        )}

        {/* Student Provider Information */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            {skill.student_name ? skill.student_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden text-xs">
            <p className="font-semibold text-slate-800 truncate">{skill.student_name || 'Student'}</p>
            <p className="text-slate-500 truncate">
              {skill.department} &bull; Year {skill.year}
            </p>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => onViewProfile && onViewProfile(skill)}
          className="flex-1 py-2 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-center"
        >
          View Profile
        </button>

        {!isOwnSkill ? (
          <button
            onClick={() => onRequestExchange && onRequestExchange(skill)}
            className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Request Exchange
          </button>
        ) : (
          <span className="flex-1 py-2 text-center text-xs text-slate-400 font-medium italic">
            Your Listing
          </span>
        )}
      </div>
    </div>
  );
}

