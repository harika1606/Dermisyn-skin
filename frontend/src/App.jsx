import React, { useState, useEffect, useCallback } from 'react';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { UploadView } from './views/UploadView';
import { ProfileView } from './views/ProfileView';
import { EducationView } from './views/EducationView';
import { AnalyticsView } from './views/AnalyticsView';
import { RecordsView } from './views/RecordsView';
import { SettingsView } from './views/SettingsView';
import { ClinicalDossierView } from './views/ClinicalDossierView';
import { Sidebar } from './components/layout/Sidebar';
import { LegalModal } from './components/ui/LegalModal';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Microscope, ShieldCheck } from 'lucide-react';

/**
 * Main Application Controller (Dermisyn Clinical Hub)
 * Handles authentication state, global data fetching, and high-density view routing.
 */
function App() {
  // --- Authentication State ---
  const [authToken, setAuthToken] = useState(localStorage.getItem('nebula_token'));
  const [user, setUser] = useState(null);

  // --- Core Data State ---
  const [scans, setScans] = useState([]);
  const [isLoadingScans, setIsLoadingScans] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedClass, setSelectedClass] = useState(null);

  // --- UI Toggle State ---
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync token to local storage
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('nebula_token', authToken);
    } else {
      localStorage.removeItem('nebula_token');
    }
  }, [authToken]);

  /**
   * Fetch user profile data once authenticated
   */
  const fetchUserProfile = useCallback(async () => {
    if (!authToken) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else if (response.status === 401) {
        setAuthToken(null); // Session expired
      }
    } catch (error) {
      console.error('Clinical Sync Error:', error);
    }
  }, [authToken]);

  /**
   * Fetch all scan history for the current user
   */
  const fetchScanHistory = useCallback(async () => {
    if (!authToken) return;
    setIsLoadingScans(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/scans`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setScans(data || []);
      }
    } catch (error) {
      console.error('Data Registry Load Error:', error);
    } finally {
      setIsLoadingScans(false);
    }
  }, [authToken]);

  // Initial Data Sync
  useEffect(() => {
    if (authToken) {
      fetchUserProfile();
      fetchScanHistory();
    }
  }, [authToken, fetchUserProfile, fetchScanHistory]);

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    setScans([]);
    setActiveView('dashboard');
  };

  const handleUpdateProfile = useCallback(async (updatedData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        const { user: updatedUser } = await response.json();
        setUser(updatedUser);
      } else {
        const err = await response.json();
        throw new Error(err.error || "Update Failure");
      }
    } catch (e) {
      console.error("Clinical Profile Sync Failure:", e);
      throw e;
    }
  }, [authToken]);

  // --- Professional View Router ---
  const renderActiveView = () => {
    const viewProps = {
      user,
      scans,
      setScans,
      loading: isLoadingScans,
      setActiveView,
      authToken,
      onScanComplete: fetchScanHistory,
      onLogout: handleLogout,
      onUpdateUser: handleUpdateProfile,
      setShowLegal: setIsLegalOpen,
      setSelectedClass: setSelectedClass
    };

    switch (activeView) {
      case 'dashboard': return <DashboardView {...viewProps} />;
      case 'upload': return <UploadView {...viewProps} />;
      case 'profile': return <ProfileView {...viewProps} />;
      case 'records': return <RecordsView {...viewProps} />;
      case 'education': return <EducationView {...viewProps} />;
      case 'analytics': return <AnalyticsView {...viewProps} />;
      case 'settings': return <SettingsView {...viewProps} />;
      case 'clinical-dossier': return <ClinicalDossierView {...viewProps} selectedClass={selectedClass} onBackToDashboard={() => setActiveView('dashboard')} />;
      default: return <DashboardView {...viewProps} />;
    }
  };

  if (!authToken) {
    return <AuthView setAuthToken={setAuthToken} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
        user={user}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 overflow-y-auto flex flex-col w-full">
        {/* Full-Width Sticky Top Navbar — moves with content when sidebar pushes */}
        <header className="sticky top-0 z-40 w-full bg-slate-50/95 backdrop-blur-md border-b border-slate-200/60 px-8 py-4 flex items-center justify-between gap-4 flex-shrink-0">

          {/* Left: Hamburger + DERMISYN Brand */}
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-slate-500"
                title="Toggle Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <Microscope className="w-6 h-6" />
              </div>
              <div className="flex flex-row items-baseline gap-2 leading-none">
                <span className="text-4xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">DERMISYN</span>
                <span className="text-lg font-bold text-slate-400 tracking-tight hidden sm:inline">Diagnostic Hub</span>
              </div>
            </div>
          </div>

          {/* Right: Profile */}
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => setActiveView('settings')}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Verified</p>
                <p className="text-[12px] font-black text-slate-900 leading-none">{user?.name?.split(' ')[0] || 'Clinician'}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 pt-6 pb-12 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
        </div>
      </main>

      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
      />
    </div>
  );
}

export default App;
