import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { 
  Database, 
  Microscope, 
  Calendar, 
  Target, 
  Search, 
  ArrowLeft, 
  Filter, 
  X, 
  Stethoscope, 
  Info,
  ShieldAlert,
  HeartPulse,
  Zap,
  Check,
  FileText
} from 'lucide-react';

export function RecordsView({ scans, setScans, setActiveView, authToken }) {
  const [selectedScan, setSelectedScan] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const assessmentHistory = [...scans].reverse();

  const formatDate = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const handleDelete = async (e, scanId) => {
    e.stopPropagation(); // Prevent opening modal when clicking delete on card
    if (!window.confirm("Are you sure you want to permanently purge this clinical record? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/scans/${scanId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        setScans(scans.filter(s => s.id !== scanId));
        if (selectedScan?.id === scanId) setSelectedScan(null);
      } else {
        const err = await response.json();
        // Flask-JWT-Extended returns 'msg', our app returns 'error'
        const errorMsg = err.error || err.msg || "Clinical record could not be purged.";
        alert(`Error: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Network error: Could not reach the medical diagnostic server.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="view-container reveal-entry">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 mb-2 pt-1 border-b border-slate-50 pb-2">
        <div>
          <button 
            onClick={() => setActiveView('dashboard')} 
            className="flex items-center gap-2 text-violet-600 hover:text-violet-700 font-bold mb-2 transition-all text-[11px] uppercase tracking-widest group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
            Back to Hub
          </button>
          <h1 className="text-display">
            Clinical <span className="text-violet-600">Records</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">Permanent diagnostic registry and EMR synchronization hub.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-violet-50/50 border border-violet-100">
          <div className="w-1 h-1 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-[11px] font-black text-violet-700 uppercase tracking-widest">Encrypted Registry Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-12">
          <Card className="p-4 md:p-6 premium-card border-violet-100 bg-white shadow-sm min-h-[500px] flex flex-col">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Assessment Archive</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Complete Clinical Record</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-violet-50 border border-violet-100 rounded-xl">
                <Zap className="w-4 h-4 text-violet-600" />
                <div className="text-left">
                  <p className="text-[11px] font-black text-violet-600 uppercase tracking-widest leading-none mb-0.5">Registry Load</p>
                  <p className="text-xs font-black text-slate-900 leading-none">{scans.length} Verified Entries</p>
                </div>
              </div>
            </div>

            {assessmentHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {assessmentHistory.map((scan, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    key={scan.id} 
                    onClick={() => setSelectedScan(scan)}
                    className="group premium-card bg-white hover:bg-violet-50/10 border-slate-100 hover:border-violet-300 p-3 transition-all duration-300 cursor-pointer shadow-sm"
                  >
                    <div className="aspect-square rounded-lg bg-slate-50 overflow-hidden border border-slate-100 mb-3 group-hover:scale-[1.02] transition-transform duration-500 relative">
                      {scan.image_url ? (
                        <img src={scan.image_url} alt="registry entry" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Microscope className="w-6 h-6 text-slate-200" /></div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest leading-none mb-1.5 flex items-center gap-2">
                           <Database className="w-2.5 h-2.5" /> 
                           REF-{(scan?.id || '').toString().slice(-6)}
                        </p>
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{scan?.prediction}</h3>
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">
                              <Target className="w-2.5 h-2.5 text-violet-400" />
                              {scan?.location}
                           </div>
                           <div className="flex items-start gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                              <Calendar className="w-2.5 h-2.5 text-violet-300" />
                              <span className="flex-1">{formatDate(scan?.created_at)}</span>
                           </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 mt-2 border-t border-slate-50 flex items-end justify-between gap-1">
                        <div className="flex flex-col gap-1">
                           <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${scan?.is_malignant ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                              {scan?.is_malignant ? 'High Priority' : 'Routine'}
                           </div>
                           <p className="text-sm font-black text-slate-900 leading-none">{scan?.risk_score}% Malignancy Risk</p>
                        </div>
                        
                        <button 
                          onClick={(e) => handleDelete(e, scan?.id)}
                          disabled={isDeleting}
                          className="p-2 rounded-lg bg-slate-50/50 hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-all border border-slate-100 hover:border-rose-200"
                          title="Purge Clinical Record"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-100 rounded-[40px]">
                <Database className="w-20 h-20 text-slate-100 mb-6" />
                <h4 className="text-slate-400 font-bold text-lg uppercase tracking-widest">Registry Empty</h4>
              </div>
            )}
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {selectedScan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md pointer-events-auto"
              onClick={() => setSelectedScan(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl relative overflow-hidden pointer-events-auto border border-white"
            >
              <div className="max-h-[90vh] overflow-y-auto scrollbar-hide">
                <button 
                   onClick={() => setSelectedScan(null)}
                   className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-0 overflow-hidden flex flex-col md:flex-row h-full min-h-[500px]">
                  {/* Left Column: Clinical Imaging */}
                  <div className="w-full md:w-1/2 bg-slate-900 flex items-center justify-center relative overflow-hidden group/img">
                    {selectedScan.image_url ? (
                      <img 
                        src={selectedScan.image_url} 
                        alt="Clinical specimen" 
                        className="w-full h-full object-cover opacity-90 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-700" 
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-slate-700">
                        <Microscope className="w-16 h-16 animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-widest">Imaging Data Offline</span>
                      </div>
                    )}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                       <div className="px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                          Specimen Resolution: High
                       </div>
                    </div>
                  </div>

                  {/* Right Column: Diagnostic Intelligence */}
                  <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedScan.is_malignant ? 'bg-rose-100 text-rose-600' : 'bg-violet-100 text-violet-600'}`}>
                          {selectedScan.is_malignant ? <ShieldAlert className="w-5 h-5"/> : <Check className="w-5 h-5"/>}
                        </div>
                        <div>
                          <Badge className={`mb-1 text-[10px] font-black uppercase tracking-widest ${selectedScan.is_malignant ? 'bg-rose-50 text-rose-600' : 'bg-violet-50 text-violet-600'}`}>
                            {selectedScan.is_malignant ? 'Malignancy Confirmed' : 'Diagnostic Resolution Verified'}
                          </Badge>
                          <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight leading-none">{selectedScan.prediction}</h2>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Malignancy Risk</p>
                        <div className="text-2xl font-black text-slate-900 tracking-tighter">{selectedScan.risk_score}<span className="text-sm text-violet-600">%</span></div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide">
                          <span className="text-slate-500">Registry Ref</span>
                          <span className="text-violet-600">REF-{selectedScan.id.toString().slice(-8)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide">
                          <span className="text-slate-500">Clinical Site</span>
                          <span className="text-violet-600">{selectedScan.location}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide">
                          <span className="text-slate-500">Timestamp</span>
                          <span className="text-violet-600">{formatDate(selectedScan.created_at)}</span>
                        </div>
                    </div>

                    <div className={`flex-1 rounded-2xl p-6 relative overflow-hidden ${selectedScan.is_malignant ? 'bg-rose-50/40 border border-rose-100' : 'bg-violet-50/40 border border-violet-100'}`}>
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                           <Stethoscope className="w-32 h-32 text-slate-900" />
                        </div>
                        
                        <div className="relative z-10">
                           <div className="flex items-center gap-2 mb-3">
                              {selectedScan.is_malignant ? <ShieldAlert className="w-4 h-4 text-rose-600" /> : <HeartPulse className="w-4 h-4 text-violet-600" />}
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] underline underline-offset-4 ${selectedScan.is_malignant ? 'text-rose-700 decoration-rose-200' : 'text-violet-700 decoration-violet-200'}`}>
                                  Registry Notes
                              </h4>
                           </div>
                           <p className="text-slate-700 text-[13px] leading-relaxed font-medium">
                              Historical entry for <span className="text-slate-950 font-bold uppercase">{selectedScan.location}</span> specimen. 
                              Classification: <span className={`${selectedScan.is_malignant ? 'text-rose-700' : 'text-violet-700'} font-extrabold uppercase`}>{selectedScan.prediction}</span> (Risk: <span className={`${selectedScan.is_malignant ? 'text-rose-700' : 'text-violet-700'} font-black`}>{selectedScan.risk_score}%</span>).
                              
                              <span className="block mt-2">
                                  {selectedScan.is_malignant ? (
                                      "Specimen was flagged with malignancy presentation. Clinical priority was assigned to verify diagnostic markers."
                                  ) : (
                                      "Findings indicate a non-malignant condition. AI cross-referenced this presentation with standard benign distributions."
                                  )}
                              </span>
                           </p>
                        </div>
                    </div>

                        <div className="mt-8 flex justify-end gap-2 pt-6 border-t border-slate-50">
                           <Button 
                             variant="outline" 
                             onClick={(e) => handleDelete(e, selectedScan.id)}
                             disabled={isDeleting}
                             className="h-10 px-6 rounded-lg border-rose-100 text-[11px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                           >
                             Delete Entry
                           </Button>
                           <Button variant="outline" className="h-10 px-6 rounded-lg border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-violet-600 hover:border-violet-100 transition-all">
                             Sync
                           </Button>
                       <Button className={`h-10 px-6 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-xl transition-all ${selectedScan.is_malignant ? 'bg-slate-900 text-white' : 'bg-violet-600 text-white hover:bg-violet-700 shadow-violet-50'}`}>
                         PDF Report
                       </Button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
