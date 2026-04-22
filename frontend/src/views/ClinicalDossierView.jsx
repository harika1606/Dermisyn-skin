import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Activity, 
  Search, 
  Stethoscope, 
  AlertTriangle, 
  BrainCircuit, 
  Info,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CLASSES } from '../data/classes';
import clinicalData from '../data/clinical_manifest.json';

/**
 * ClinicalDossierView: High-density, full-screen clinical reference page.
 * Replaces the previous modal interface for an expert-level experience.
 */
export function ClinicalDossierView({ selectedClass, onBackToDashboard }) {
  if (!selectedClass) return null;

  const data = clinicalData[selectedClass.id];
  const alphaCode = `ALPHA-${(CLASSES.findIndex(c => c.id === selectedClass.id) + 1).toString().padStart(2, '0')}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="view-container reveal-entry min-h-screen bg-slate-50/50 p-0"
    >
      {/* --- Unified Dossier Container --- */}
      <div className="max-w-6xl mx-auto bg-white min-h-screen shadow-2xl border-x border-slate-100 flex flex-col">
        
        {/* Medical Header - Professional High-Density Sync */}
        <header className="p-3 md:p-4 border-b border-slate-100 bg-white sticky top-0 z-20">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                 <button 
                   onClick={onBackToDashboard}
                   className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold uppercase tracking-[0.2em] text-[10px] transition-all group"
                 >
                   <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> 
                   Return
                 </button>
                 <div className="h-4 w-px bg-slate-200" />
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-0.5">{alphaCode} CLASSIFICATION NODE</p>
                    <h1 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight uppercase leading-none">{selectedClass.name}</h1>
                 </div>
              </div>

              <div className="flex items-center gap-5">
                 <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0 text-right">System Status</p>
                    <div className="flex items-center gap-2 justify-end">
                       <ShieldCheck className="w-3 h-3 text-slate-500" />
                       <span className="text-[10px] font-black text-slate-900 uppercase">Verified</span>
                    </div>
                 </div>
                 <div className={`px-4 py-1.5 rounded-lg border-none shadow-md text-white flex items-center gap-2.5 ${selectedClass.is_malignant ? 'bg-rose-600' : 'bg-slate-600'}`}>
                    {selectedClass.is_malignant ? <AlertTriangle className="w-3.5 h-3.5"/> : <ShieldCheck className="w-3.5 h-3.5"/>}
                    <span className="font-black uppercase tracking-widest text-[9px]">{selectedClass.risk} Profile</span>
                 </div>
              </div>
           </div>
        </header>

        {/* Master Dossier Body - Optimized Density */}
        <main className="flex-1 p-4 md:p-6 space-y-6">
           
           {!data ? (
             <div className="py-16 text-center">
                <Info className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">Module data is currently offline.</p>
             </div>
           ) : (
             <>
               {/* 01: Pathological Overview - Removed Uppercase for Legibility */}
               <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  <div className="lg:col-span-3">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-black text-slate-200 tracking-tighter">01</span>
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Pathological Overview</h3>
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-wide">
                        Diagnostic baseline and context.
                     </p>
                  </div>
                  <div className="lg:col-span-9 p-4 bg-slate-50/50 rounded-xl border border-slate-100 relative overflow-hidden">
                     <Activity className="absolute bottom-[-15px] right-[-15px] w-32 h-32 text-slate-950 opacity-[0.02] pointer-events-none" />
                     <p className="text-[14px] font-medium text-slate-700 leading-relaxed relative z-10">
                        {data.clinical_overview}
                     </p>
                  </div>
               </section>

               {/* 02: Diagnostic Markers - Tightened Grid */}
               <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  <div className="lg:col-span-3">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-black text-slate-200 tracking-tighter">02</span>
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Diagnostic Markers</h3>
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-wide">
                        Morphological signatures.
                     </p>
                  </div>
                  <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-3">
                     {data.dermoscopic_features.map((feature, i) => (
                       <div key={i} className="group p-3.5 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-md transition-all duration-500 flex items-start gap-3">
                          <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center text-[9px] font-black text-slate-400 group-hover:bg-slate-600 group-hover:text-white group-hover:border-slate-600 transition-all">
                             {(i + 1).toString().padStart(2, '0')}
                          </div>
                          <span className="text-[13px] font-bold text-slate-600 leading-tight flex-1">{feature}</span>
                       </div>
                     ))}
                  </div>
               </section>

               {/* 03: Risk Assessment - Centered Density */}
               <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  <div className="lg:col-span-3">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-black text-slate-200 tracking-tighter">03</span>
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Risk Assessment</h3>
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-wide">
                        Priority indicators and exclusions.
                     </p>
                  </div>
                  <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100">
                        <h3 className="text-[9px] font-black text-rose-600 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-3.5 h-3.5" /> Priority Indicators
                        </h3>
                        <ul className="space-y-2.5">
                            {data.risk_factors.map((factor, i) => (
                            <li key={i} className="flex gap-3 group/item">
                                <div className="w-1 h-1 rounded-full bg-rose-400 mt-1.5" />
                                <span className="text-[12px] font-bold text-rose-900/70 leading-tight">{factor}</span>
                            </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 flex flex-col items-center justify-center">
                        <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                            <BrainCircuit className="w-3.5 h-3.5" /> Differential Exclusions
                        </h3>
                        <div className="italic font-bold text-slate-500 text-[13px] leading-relaxed text-center px-4">
                            &quot;{data.differential_diagnosis}&quot;
                        </div>
                    </div>
                  </div>
               </section>

               {/* 04: Clinical Action Protocol - Elite Dark Panel */}
               <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                   <div className="lg:col-span-3">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-xl font-black text-slate-200 tracking-tighter">04</span>
                         <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Management Protocol</h3>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-wide">
                         Protocol standards.
                      </p>
                   </div>
                   <div className="lg:col-span-9 p-6 md:p-7 rounded-2xl bg-slate-50/50 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                            <Stethoscope className="w-24 h-24 text-slate-900" />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-[13px] font-bold leading-relaxed mb-3 text-slate-700">
                                {data.management_protocol}
                            </h4>
                            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:scale-125 transition-transform" />
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">ISIC-Standard Verified Protocol</p>
                            </div>
                        </div>
                   </div>
               </section>
             </>
           )}
        </main>

        <footer className="p-4 border-t border-slate-100 bg-white flex flex-col md:flex-row items-center justify-between text-slate-400 gap-5">
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-3 h-3 text-slate-500" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secure Registry</span>
             </div>
             <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Node DS-27.5</p>
           </div>
           <Button 
             onClick={onBackToDashboard}
             className="px-6 h-9 bg-slate-950 hover:bg-black text-white font-black uppercase tracking-widest text-[9px] !rounded-lg shadow-lg transition-all"
           >
             Dismiss Dossier
           </Button>
        </footer>
      </div>


    </motion.div>
  );
}
