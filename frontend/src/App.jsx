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
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

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
      />

      <main className="flex-1 overflow-y-auto px-6 py-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="max-w-screen-2xl mx-auto"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
      />
    </div>
  );
}

export default App;
