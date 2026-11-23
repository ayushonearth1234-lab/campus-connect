import Link from 'next/link';
import { Sparkles, Heart, Code, Database, Globe, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white">CampusConnect</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A peer-to-peer campus platform where college students exchange knowledge, share skills, and offer useful services.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Project &bull; Team CodeMates</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  Explore Skills
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Campus Services
                </Link>
              </li>
              <li>
                <Link href="/skills/offer" className="hover:text-white transition-colors">
                  Offer a Skill
                </Link>
              </li>
              <li>
                <Link href="/services/offer" className="hover:text-white transition-colors">
                  Provide a Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack Info */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Technology Stack</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next.js &amp; React (Frontend &amp; API Routes)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>MySQL Relational Database (`mysql2`)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>Tailwind CSS &amp; Vercel Serverless Ready</span>
              </li>
            </ul>
          </div>

          {/* CodeMates Team */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Developed By</h4>
            <p className="text-xs text-slate-300 mb-2 font-semibold">
              Team CodeMates &bull; 2nd Year BTech CSE
            </p>
            <div className="text-xs text-indigo-300 font-medium space-y-1 mb-3 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold mb-1">Team Members:</p>
              <p>&bull; Shubham Yadav</p>
              <p>&bull; Tanmay</p>
              <p>&bull; Bhargav Sai</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Developed as part of the Advanced Java Programming / Web Technologies curriculum.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} CampusConnect (CodeMates). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for college student collaboration.
          </p>
        </div>
      </div>
    </footer>
  );
}

