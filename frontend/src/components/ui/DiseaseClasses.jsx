import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Activity, 
  CheckCircle, 
  Info, 
  Shield, 
  Zap, 
  BrainCircuit, 
  ArrowRight,
  Stethoscope,
  ChevronRight,
  ArrowLeft,
  Database,
  PieChart
} from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { CLASSES } from '../../data/classes';

import { ClinicalProtocolWidget } from './ClinicalProtocolWidget';

const CLASS_SAMPLES = [
  { name: 'Melanoma / Nevi',       samples: '~10,000', malignant: true  },
  { name: 'AK / BCC',              samples: '~10,000', malignant: true  },
  { name: 'Psoriasis / Lichen',    samples: '~10,000', malignant: false },
  { name: 'Seborrheic Keratosis',  samples: '~10,000', malignant: false },
  { name: 'Eczema (Atopic)',       samples: '~10,000', malignant: false },
  { name: 'Vascular Tumors',       samples: '~10,000', malignant: false },
  { name: 'Urticaria (Hives)',     samples: '~10,000', malignant: false },
];

export function DiseaseClasses({ setSelectedClass, setActiveView }) {
  const [showDataset, setShowDataset] = useState(false);

  if (showDataset) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="reveal-entry px-1 w-full flex flex-col pb-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-slate-200 gap-4">
          <div>
            <button onClick={() => setShowDataset(false)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-3 transition-all text-[10px] uppercase tracking-widest group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Registry
            </button>
            <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter uppercase leading-none">AI Training Registry</h1>
            <p className="mt-1 text-sm text-slate-500 font-medium">Massive, class-balanced clinical skin disease dataset.</p>
          </div>
          <div className="px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            Dataset v3.2
          </div>
        </div>

        {/* Flat Content */}
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">

          {/* Overview Header */}
          <div className="pb-4 border-b border-slate-100">
            <p className="text-[14px] font-black text-slate-900 uppercase tracking-tighter mb-1">Model Training Overview</p>
            <div className="flex items-center gap-6">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Source: <span className="text-slate-900">HAM10000 + Augmented Clinical Data</span></p>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Version: <span className="text-slate-900">ResNet-50 Backbone</span></p>
            </div>
          </div>

          {/* Key Metrics */}
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Key Metrics</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <BrainCircuit className="w-5 h-5 text-slate-500 mb-3" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Verified Scans</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">70,000+</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <PieChart className="w-5 h-5 text-slate-500 mb-3" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnostic Classes</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">7 Unified</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <Activity className="w-5 h-5 text-emerald-500 mb-3" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Validation Accuracy</p>
                <p className="text-2xl font-black text-emerald-600 tracking-tighter">92.3%</p>
              </div>
            </div>
          </div>

          {/* Class Distribution */}
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Class Distribution</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CLASS_SAMPLES.map((cls) => (
                <div key={cls.name} className="flex items-center justify-between py-3 px-4 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cls.malignant ? 'bg-rose-400' : 'bg-slate-400'}`} />
                    <span className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">{cls.name}</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-400">{cls.samples}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preprocessing Pipeline */}
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Preprocessing Pipeline</h4>
            <ul className="space-y-2">
              {[
                'All images standardized to 224 × 224 resolution',
                'Random horizontal and vertical flipping for augmentation',
                'Colour jitter and brightness normalisation applied per batch',
                'Train / Validation / Test split: 80% / 10% / 10%',
                'Class-weighted sampling to counteract natural imbalance',
              ].map((step, idx) => (
                <li key={idx} className="text-[12px] font-bold text-slate-600 leading-tight flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Integrity Note */}
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Clinical Data Integrity</h4>
            <p className="text-[13px] text-slate-700 leading-relaxed font-medium px-1">
              The Dermisyn AI model is calibrated using a curated, class-balanced dataset aggregated from multiple international dermatoscopic repositories. All patient identifiable information (PII) was fully purged prior to model ingestion to comply with global HIPAA and GDPR standards.
            </p>
          </div>

          {/* Disclaimer */}
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 text-center opacity-40">Dataset Disclaimer</p>
            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-[10px] text-slate-500 leading-tight text-center italic">
                Accuracy figures represent top-1 validation accuracy on a held-out test split. Real-world performance may vary depending on image quality and clinical context.
              </p>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowDataset(false)} className="h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-none transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Registry
            </Button>
          </div>

        </div>
      </motion.div>
    );
  }

  return (
    <div className="reveal-entry pt-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {CLASSES.map((cls, idx) => (
          <motion.div 
            key={cls.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card 
               onClick={() => {
                  setSelectedClass(cls);
                  setActiveView('clinical-dossier');
               }}
               className={`h-full premium-card hover:border-slate-500/30 transition-all duration-500 group overflow-hidden bg-white shadow-sm hover:shadow-2xl border-slate-100 p-0 flex flex-col relative z-0 cursor-pointer`}
            >
               {/* Premium Glow Backdrop */}
               <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${cls.is_malignant ? 'bg-rose-500' : 'bg-slate-500'}`} />

               <div className="p-5 flex items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                     <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-white transition-all group-hover:scale-105 group-hover:rotate-2 duration-500 relative ${cls.is_malignant ? 'bg-rose-600' : 'bg-slate-800'}`}>
                        <div className="w-6 h-6 flex items-center justify-center relative z-10">
                           {cls.icon}
                        </div>
                     </div>
                  <div className="flex-1 min-w-0">
                     <Badge className={`mb-1.5 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border-none ${cls.is_malignant ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-800'}`}>
                       {cls.risk}
                     </Badge>
                     <h3 className="text-[14px] font-black text-slate-900 tracking-tighter uppercase leading-tight">
                       {cls.name}
                     </h3>
                  </div>
               </div>
               <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-800 group-hover:text-white transition-all transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                  <ChevronRight className="w-4 h-4" />
               </div>
            </div>
         </Card>
          </motion.div>
        ))}
        
        {/* Slot 8: Clinical Protocol (User Manual) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 8 * 0.05 }}
        >
          <ClinicalProtocolWidget />
        </motion.div>
      </div>

      {/* Standards Bar */}
      <Card className="p-3 bg-white border-slate-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border-dashed transition-all hover:bg-slate-50/10">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
               <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-0.5">AI Training Registry</h4>
               <p className="text-[10px] text-slate-500 font-medium leading-none">Model trained and calibrated using a massive, class-balanced skin disease dataset.</p>
            </div>
         </div>
         <Button 
           variant="outline" 
           className="h-10 px-6 rounded-xl text-[11px] font-black uppercase tracking-widest border-slate-200 bg-white text-slate-400 hover:text-slate-800 transition-all"
           onClick={() => setShowDataset(true)}
         >
           Dataset Overview
         </Button>
      </Card>

    </div>
  );
}
