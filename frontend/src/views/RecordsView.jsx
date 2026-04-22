import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { 
  Database, 
  Microscope, 
  Calendar, 
  ArrowLeft, 
  X, 
  Zap,
  Activity,
  Shield,
  Target
} from 'lucide-react';
import manifest from '../data/clinical_manifest.json';

export function RecordsView({ scans, setScans, setActiveView, authToken }) {
  const [selectedScan, setSelectedScan] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const assessmentHistory = [...scans].reverse();

  const formatDate = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const handleDelete = async (e, scanId) => {
    e.stopPropagation();
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

  const getManifestData = (prediction) => {
    if (!prediction) return manifest.seborrheic;
    const lower = prediction.toLowerCase();
    if (lower.includes('melanoma')) return manifest.melanoma;
    if (lower.includes('actinic') || lower.includes('basal') || lower.includes('bcc') || lower.includes('ak')) return manifest.bcc;
    if (lower.includes('psoriasis')) return manifest.psoriasis;
    if (lower.includes('seborrheic')) return manifest.seborrheic;
    if (lower.includes('eczema')) return manifest.eczema;
    if (lower.includes('vascular')) return manifest.vascular;
    if (lower.includes('urticaria') || lower.includes('hives')) return manifest.urticaria;
    return manifest.seborrheic; // Fallback
  };

  const isMalignant = (prediction) => {
    if (!prediction) return false;
    const lower = prediction.toLowerCase();
    return lower.includes('melanoma') || lower.includes('actinic') || lower.includes('basal') || lower.includes('bcc') || lower.includes('ak');
  };

  const reportData = selectedScan ? getManifestData(selectedScan.prediction) : null;
  const isScanMalignant = selectedScan ? isMalignant(selectedScan.prediction) : false;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="view-container reveal-entry">
      {!selectedScan ? (
        /* ── REGISTRY ARCHIVE LIST VIEW ── */
        <div className="reveal-entry px-1">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 pt-0 border-b border-slate-100 pb-1 mb-4">
            <div>
              <button 
                onClick={() => setActiveView('dashboard')} 
                className="flex items-center gap-2 text-slate-600 hover:text-slate-700 font-bold mb-1 transition-all text-[11px] uppercase tracking-widest group"
              >
                <ArrowLeft className="w-3" /> 
                Back to Hub
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter uppercase leading-none">
                Clinical <span className="text-slate-600">Records</span>
              </h1>
              <p className="mt-0.5 text-sm text-slate-500 font-medium">Permanent diagnostic registry and EMR synchronization hub.</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50/50 border border-slate-100 shadow-sm transition-all">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Registry Active</span>
            </div>
          </header>

          <Card className="p-4 md:p-6 premium-card border-slate-100 bg-white shadow-premium min-h-[600px] flex flex-col rounded-[2rem]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-600 text-white flex items-center justify-center shadow-lg shadow-slate-200">
                  <Database className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-950 tracking-tight uppercase">Registry Archive</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Complete Clinical History</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-5 py-3 bg-slate-950 text-white rounded-2xl shadow-xl">
                <Zap className="w-5 h-5 text-slate-400" />
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Load Status</p>
                  <p className="text-sm font-black leading-none">{scans.length} Entries</p>
                </div>
              </div>
            </div>

            {assessmentHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {assessmentHistory.map((scan, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.04 }}
                    key={scan.id} 
                    onClick={() => setSelectedScan(scan)}
                    className="group bg-white hover:bg-slate-50/10 border-2 border-slate-50 hover:border-slate-200 p-5 rounded-[2rem] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl"
                  >
                    <div className="aspect-square rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 mb-5 relative group-hover:shadow-lg transition-all duration-500">
                      {scan.image_url ? (
                        <img src={scan.image_url} alt="entry" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                           <Microscope className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2">
                           REF-{(scan?.id || '').toString().slice(-6)}
                        </p>
                        <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight leading-[1.1] mb-3 group-hover:text-slate-600 transition-colors">
                           {scan?.prediction}
                        </h3>
                        <div className="space-y-1.5 opacity-60">
                           <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                              <Target className="w-3 h-3" />
                              {scan?.location}
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <Calendar className="w-3 h-3" />
                              {formatDate(scan?.created_at).split(',')[1]}
                           </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                           <p className="text-sm font-black text-slate-950 leading-none mb-1">{scan?.risk_score}% Risk</p>
                           <Badge className={isMalignant(scan?.prediction) ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'}>
                              {isMalignant(scan?.prediction) ? 'High Priority' : 'Routine'}
                           </Badge>
                        </div>
                        <button 
                          onClick={(e) => handleDelete(e, scan?.id)}
                          disabled={isDeleting}
                          className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all border border-slate-100 z-10 relative"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-40 border-4 border-dashed border-slate-50 rounded-[3rem]">
                <Database className="w-24 h-24 text-slate-100 mb-8" />
                <h4 className="text-slate-400 font-black text-xl uppercase tracking-widest">Registry Depleted</h4>
              </div>
            )}
          </Card>
        </div>

      ) : (
        /* ── FLAT PROFESSIONAL DOSSIER DETAIL PAGE ── */
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="reveal-entry px-1 w-full flex flex-col pb-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-slate-200 gap-4">
             <div>
               <button onClick={() => setSelectedScan(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-3 transition-all text-[10px] uppercase tracking-widest group">
                 <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Registry Archive
               </button>
               <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter uppercase leading-none">Clinical Assessment</h1>
             </div>
             <div className="flex items-center gap-3">
               <div className="px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  REF-{(selectedScan.id || '').toString().slice(-8)}
               </div>
             </div>
          </div>

          {/* Flat Content */}
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 relative">
                  {/* ASSESSMENT HEADER */}
                  <div className="pb-4 border-b border-slate-100">
                    <p className="text-[14px] font-black text-slate-900 uppercase tracking-tighter mb-1">Dermisyn AI System Result</p>
                    <div className="flex items-center gap-6">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ref ID: <span className="text-slate-900">DS-{(selectedScan.id || '').toString().slice(-8)}</span></p>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Date: <span className="text-slate-900">{new Date(selectedScan.created_at).toLocaleDateString('en-US')}</span></p>
                    </div>
                  </div>

                  {/* DIAGNOSTIC SUMMARY */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 text-slate-200">
                      <Activity className="w-16 h-16" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Diagnostic Summary</h4>
                    <div className="space-y-2">
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">Primary Mapping: <span className="text-[14px] text-slate-950 tracking-tight">{selectedScan.prediction}</span></p>
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">Malignancy Risk Score: <span className="text-[14px] text-rose-600 tracking-tight">{(selectedScan.risk_score || selectedScan.confidence || 0).toString()}%</span></p>
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">Clinical Priority: <span className={`text-[12px] tracking-tight ${isScanMalignant ? 'text-rose-600' : 'text-slate-600'}`}>{isScanMalignant ? 'Urgent Review Required' : 'Non-Malignant Manifestation'}</span></p>
                    </div>
                  </div>

                  {/* CLINICAL OVERVIEW */}
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Clinical Overview</h4>
                    <p className="text-[13px] text-slate-700 leading-relaxed font-medium px-1">
                      {reportData.clinical_overview}
                    </p>
                  </div>

                  {/* DUO GRID: FEATURES & RISK */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                     <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                           <Microscope className="w-4 h-4 text-slate-500" />
                           Dermoscopic Features
                        </h4>
                        <ul className="space-y-2">
                           {reportData.dermoscopic_features.map((feature, idx) => (
                              <li key={idx} className="text-[11px] font-bold text-slate-600 leading-tight flex items-start gap-2">
                                 <div className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                                 {feature}
                              </li>
                           ))}
                        </ul>
                     </div>
                     <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                           <Activity className="w-4 h-4 text-rose-500" />
                           Risk Factors
                        </h4>
                        <ul className="space-y-2">
                           {reportData.risk_factors.map((factor, idx) => (
                              <li key={idx} className="text-[11px] font-bold text-slate-600 leading-tight flex items-start gap-2">
                                 <div className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                                 {factor}
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>

                  {/* MANAGEMENT PROTOCOL */}
                  <div className="p-5 bg-slate-50/50 border border-slate-200 rounded-2xl">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2 flex items-center gap-2">
                       <Shield className="w-4 h-4 text-slate-500" />
                       Management Protocol
                    </h4>
                    <p className="text-[12px] text-slate-700 leading-relaxed font-bold">
                       {reportData.management_protocol}
                    </p>
                  </div>

                  {/* DIFFERENTIAL DX */}
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Differential Diagnosis</h4>
                    <p className="text-[13px] text-slate-600 italic leading-snug px-1">{reportData.differential_diagnosis}</p>
                  </div>

                  {/* DISCLAIMER */}
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 text-center opacity-40">Classification Disclaimer</p>
                    <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                       <p className="text-[10px] text-slate-500 leading-tight text-center italic">
                          This is an AI-generated assessment intended for clinical triage and screening purposes only. It does not constitute a definitive medical diagnosis. For professional medical advice, consult a physician or certified dermatologist.
                       </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col md:flex-row justify-end gap-3 mt-4">
                     <Button 
                       variant="outline" 
                       onClick={(e) => handleDelete(e, selectedScan.id)}
                       disabled={isDeleting}
                       className="h-11 px-6 rounded-xl border-rose-100 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all shadow-sm flex items-center gap-2"
                     >
                       <X className="w-3.5 h-3.5" /> Delete Record
                     </Button>
                     <Button 
                       onClick={() => setSelectedScan(null)}
                       className="h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-none transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 flex items-center gap-2"
                     >
                       <ArrowLeft className="w-3.5 h-3.5" /> Return to Archives
                     </Button>
                  </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
