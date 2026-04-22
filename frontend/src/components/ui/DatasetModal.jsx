import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { X, Database, BrainCircuit, Activity, PieChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DatasetModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="w-full max-w-4xl relative z-20 max-h-[90vh] flex flex-col"
        >
          <Card className="p-6 sm:p-12 border-slate-200 bg-white shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col flex-1">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-white shadow-lg">
                  <Database className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase leading-none mb-1">Training Registry</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model Dataset Overview</p>
                </div>
              </div>
              <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-8">
               
               {/* Metrics */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                     <BrainCircuit className="w-6 h-6 text-slate-500 mb-3" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Verified Scans</p>
                     <p className="text-2xl font-black text-slate-900 tracking-tighter">70,000+</p>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                     <PieChart className="w-6 h-6 text-slate-500 mb-3" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnostic Classes</p>
                     <p className="text-2xl font-black text-slate-900 tracking-tighter">7 Unified</p>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                     <Activity className="w-6 h-6 text-emerald-500 mb-3" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Validation Accuracy</p>
                     <p className="text-2xl font-black text-emerald-600 tracking-tighter">94.2%</p>
                  </div>
               </div>

               {/* Dataset Breakdown */}
               <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Class Distribution</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {['Melanoma / Nevi', 'AK / BCC', 'Psoriasis / Lichen', 'Seborrheic Keratosis', 'Eczema (Atopic)', 'Vascular Tumors', 'Urticaria (Hives)'].map(cls => (
                        <div key={cls} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl">
                           <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{cls}</span>
                           <span className="text-[11px] font-black text-slate-400">~10,000</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Data Integrity */}
               <div className="p-6 bg-slate-950 rounded-2xl text-white relative overflow-hidden">
                  <Database className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
                  <h4 className="text-xs font-black uppercase tracking-widest mb-3 text-slate-300">Clinical Data Integrity</h4>
                  <p className="text-[12px] font-medium leading-relaxed text-slate-400 relative z-10">
                    The Dermisyn AI model is calibrated using a highly curated, class-balanced dataset aggregated from multiple international dermatoscopic repositories. To prevent biased inference, approximately 10,000 augmented, high-resolution samples are maintained per diagnostic class. All patient identifiable information (PII) was fully purged prior to model ingestion to strictly adhere to global HIPAA and GDPR standards.
                  </p>
               </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end flex-shrink-0">
               <Button onClick={onClose} className="px-8 h-12 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
                  Acknowledge Integrity
               </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
