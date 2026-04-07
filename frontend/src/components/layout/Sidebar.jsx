import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Microscope, LogOut, LayoutDashboard, Target, Upload as UploadIcon, BarChart3, Settings } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Global Sidebar Navigation.
 * Replaces old top Navbar for a more professional dashboard layout.
 */
export function Sidebar({ activeView, setActiveView, onLogout, user }) {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-violet-50 h-full flex flex-col justify-between py-6">
      
      <div>
        <div 
          onClick={() => setActiveView('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group px-6 mb-10"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-premium transition-transform group-hover:rotate-6">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">
              DERMISYN
            </h1>
            <p className="text-[11px] font-bold text-violet-600 tracking-[0.2em] uppercase mt-0.5 leading-none">
              Clinical Hub
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-1 px-4">
          <NavLink 
            id="nav-home" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')}
            label="Home"
            icon={LayoutDashboard}
          />
          <NavLink 
            id="nav-records" 
            active={activeView === 'records'} 
            onClick={() => setActiveView('records')}
            label="Records"
            icon={Target}
          />
          <NavLink 
            id="nav-intake" 
            active={activeView === 'upload'} 
            onClick={() => setActiveView('upload')}
            label="Intake"
            icon={UploadIcon}
          />
          <NavLink 
            id="nav-analytics" 
            active={activeView === 'analytics'} 
            onClick={() => setActiveView('analytics')}
            label="Data"
            icon={BarChart3}
          />
        </div>
      </div>

      <div className="px-4">
        <button 
          id="nav-profile" 
          onClick={() => setActiveView('settings')}
          className={`w-full flex items-center gap-3 transition-all p-3 rounded-xl border ${activeView === 'settings' ? 'bg-violet-50 border-violet-100' : 'border-transparent hover:border-violet-100 hover:bg-violet-50'} group`}
        >
          <div className="w-10 h-10 rounded-lg bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-700 font-bold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest leading-none mb-1">Preferences</p>
            <p className="text-sm font-bold text-slate-900 leading-none truncate">{user?.name?.split(' ')[0] || 'Clinician'}</p>
          </div>
          <Settings className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
        </button>
        <Button 
          variant="ghost" 
          onClick={onLogout} 
          className="w-full justify-start text-slate-400 hover:text-rose-500 mt-2 px-3 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span className="font-semibold text-sm">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}

function NavLink({ id, active, onClick, label, icon: Icon }) { // eslint-disable-line no-unused-vars
  return (
    <button
      id={id}
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all relative ${
        active 
        ? 'bg-violet-600 text-white shadow-md' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-violet-700'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
      <span className={`text-sm font-semibold tracking-wide ${active ? 'text-white' : ''}`}>
        {label}
      </span>
    </button>
  );
}
