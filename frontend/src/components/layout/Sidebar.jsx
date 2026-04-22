import React from 'react';
import { motion } from 'framer-motion';
import { Microscope, LogOut, LayoutDashboard, Target, Upload as UploadIcon, BarChart3, Settings, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Global Sidebar Navigation — push layout, shifts content right when open.
 */
export function Sidebar({ activeView, setActiveView, onLogout, user, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'records', label: 'Records', icon: Target },
    { id: 'upload', label: 'Intake', icon: UploadIcon },
    { id: 'analytics', label: 'Data', icon: BarChart3 },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex-shrink-0 overflow-hidden bg-white border-r border-slate-100 h-screen sticky top-0 z-[160]"
    >
      {/* Inner fixed-width content so it doesn't squish during animation */}
      <div className="w-64 h-full flex flex-col justify-between py-6">
        <div>
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-6 mb-8">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Navigation</p>
              <p className="text-[11px] font-bold text-slate-700 tracking-tight mt-0.5">Clinical Workstation</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400">
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Nav items */}
          <div className="flex flex-col space-y-1 px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                active={activeView === item.id}
                onClick={() => setActiveView(item.id)}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </div>
        </div>

        {/* Bottom: preferences + sign out */}
        <div className="px-4">
          <button
            onClick={() => setActiveView('settings')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl ${activeView === 'settings' ? 'bg-slate-50' : ''}`}
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Preferences</p>
              <p className="text-sm font-bold text-slate-900 leading-none truncate">{user?.name?.split(' ')[0] || 'Clinician'}</p>
            </div>
            <Settings className="w-4 h-4 text-slate-400" />
          </button>
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full justify-start text-slate-400 mt-2 px-3 uppercase tracking-[0.2em]"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="font-black text-[10px]">SIGN OUT</span>
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}

function NavLink({ active, onClick, label, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl ${
        active ? 'bg-slate-800 text-white' : 'text-slate-500'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
      <span className={`text-sm font-semibold tracking-wide ${active ? 'text-white' : ''}`}>
        {label}
      </span>
    </button>
  );
}
