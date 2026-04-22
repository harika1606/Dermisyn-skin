import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, Lock, Bell, User as UserIcon, Settings as SettingsIcon, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * SettingsView: Standalone user configuration interface for personal profile and security.
 * Transitioned from modal to matched view layout.
 */
export function SettingsView({ user, onUpdateUser }) {
  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    email: user?.email || '' 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncError, setSyncError] = useState(null);

  const [protocols, setProtocols] = useState({
    privacy: true,
    notifications: true,
    security: false
  });

  const toggleProtocol = (key) => {
    setProtocols(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (user) {
        setFormData({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSyncError(null);
    try {
        await onUpdateUser(formData);
        setIsEditing(false);
    } catch (e) {
        setSyncError(e.message || "Failed to update profile");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="view-container reveal-entry">
      <div className="max-w-4xl mx-auto w-full">
        <header className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shadow-sm">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-display">
                System <span className="text-slate-600">Settings</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500 font-medium tracking-wide text-transform: uppercase">Preferences and Security Options</p>
            </div>
        </header>

        <div className="space-y-6">
           {/* Profile Identity */}
         <Card className={`p-6 bg-slate-50 border border-slate-100 rounded-3xl transition-all ${isEditing ? 'ring-2 ring-slate-500/20 shadow-inner bg-white' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 w-full">
                 <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm flex-shrink-0">
                    <UserIcon className="w-7 h-7" />
                 </div>
                 {!isEditing ? (
                   <div className="overflow-hidden">
                      <p className="text-base font-semibold text-slate-900 leading-none mb-1 truncate">{user?.name || 'Clinical User'}</p>
                      <p className="text-sm font-medium text-slate-500 leading-none truncate">{user?.email || 'user@dermisyn.com'}</p>
                   </div>
                 ) : (
                   <div className="space-y-2 w-full animate-in fade-in slide-in-from-left-1 transition-all">
                      <input 
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-900 w-full focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all" 
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Full Name"
                      />
                      <input 
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-900 w-full focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all" 
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email Address"
                      />
                      {syncError && <p className="text-xs font-semibold text-rose-500 px-2">{syncError}</p>}
                   </div>
                 )}
              </div>
              <div className="ml-4">
                {isEditing ? (
                  <Button onClick={handleSave} disabled={isSaving} className="!rounded-xl px-6 h-11 bg-slate-600 text-white hover:bg-slate-700 flex items-center shadow-md">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="!rounded-xl h-11 px-6 border-slate-200 text-sm font-semibold text-slate-600 hover:text-slate-700 hover:bg-slate-50 transition-all">Edit Profile</Button>
                )}
              </div>
            </div>
         </Card>

         {/* Clinical Protocols */}
         <Card className="p-6 bg-white border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Core Protocols</h3>
            <SettingsItem 
              icon={Shield} 
              label="HIPAA Compliant Storage" 
              desc="Store patient data securely on this device." 
              active={protocols.privacy}
              onClick={() => toggleProtocol('privacy')}
            />
            <SettingsItem 
              icon={Bell} 
              label="Email Notifications" 
              desc="Receive alerts for new diagnostic reports." 
              active={protocols.notifications}
              onClick={() => toggleProtocol('notifications')}
            />
            <SettingsItem 
              icon={Lock} 
              label="Two-Factor Authentication" 
              desc="Require an extra layer of security for login." 
              active={protocols.security}
              onClick={() => toggleProtocol('security')}
            />
         </Card>
      </div>

      </div>

    </motion.div>
  );
}

function SettingsItem({ icon: IconComponent, label, desc, active, onClick }) {
  return (
    <div 
        onClick={onClick}
        className={`flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer group border ${active ? 'bg-slate-50/50 border-slate-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}
    >
       <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-white text-slate-600 shadow-sm border border-slate-100' : 'bg-slate-50 text-slate-400 border border-slate-100 group-hover:text-slate-500'}`}>
             {IconComponent && <IconComponent className="w-5 h-5" />}
          </div>
          <div>
            <p className={`text-sm font-semibold mb-1 ${active ? 'text-slate-800' : 'text-slate-900'}`}>{label}</p>
            <p className="text-xs font-medium text-slate-500">{desc}</p>
          </div>
       </div>
       <div className={`w-11 h-6 rounded-full transition-all relative p-1 ${active ? 'bg-slate-600' : 'bg-slate-200'}`}>
          <motion.div 
            animate={{ x: active ? 20 : 0 }}
            className="w-4 h-4 bg-white rounded-full shadow-sm"
          />
       </div>
    </div>
  );
}
