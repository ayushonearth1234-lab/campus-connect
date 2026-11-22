'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Compass,
  PlusCircle,
  Briefcase,
  Layers,
  Inbox,
  LogOut,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', href: '/profile', icon: User },
    { label: 'Explore Skills', href: '/explore', icon: Compass },
    { label: 'Offer a Skill', href: '/skills/offer', icon: PlusCircle },
    { label: 'Find Services', href: '/services', icon: Briefcase },
    { label: 'Offer a Service', href: '/services/offer', icon: Layers },
    { label: 'My Requests', href: '/requests', icon: Inbox },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Student Brief Profile Card */}
      {user && (
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <div className="w-11 h-11 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-semibold text-sm text-slate-800 truncate">{user.name}</h3>
            <p className="text-xs text-slate-500 truncate">{user.department}</p>
            <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-100 text-indigo-700">
              Year {user.year} &bull; {user.role}
            </span>
          </div>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 font-semibold'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Admin Link if role is admin */}
        {user?.role === 'admin' && (
          <div className="pt-2 mt-2 border-t border-slate-100">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === '/admin'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Logout button */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

