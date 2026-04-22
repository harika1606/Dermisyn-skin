import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Plus,
  Shield,
  Terminal,
  BrainCircuit,
  ShieldCheck,
  Search,
  ChevronRight,
  Layers,
  Camera,
  FileText,
  Database,
  Lock,
  CheckCircle2,
  ScanFace
} from 'lucide-react';
import { DiseaseClasses } from '../components/ui/DiseaseClasses';
import { motion } from 'framer-motion';

/**
 * DashboardView: Refocused Home Page that serves as a clinical Knowledge Base.
 */
export function DashboardView({ setActiveView, setSelectedClass }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="view-container reveal-entry relative"
    >
      <div className="mesh-gradient-hub" />

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] whitespace-nowrap">Classification Registry</h2>
          <div className="h-px w-full bg-gradient-to-r from-slate-200 to-transparent" />
        </div>
        <Button 
           onClick={() => setActiveView('upload')}
           className="h-9 px-5 bg-slate-900 hover:bg-black text-white !rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 group transition-all shrink-0"
        >
          Initialize Intake <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform" />
        </Button>
      </div>

      {/* Main Grid Interface */}
      <div className="mt-0 mb-16">
         <DiseaseClasses setSelectedClass={setSelectedClass} setActiveView={setActiveView} />
      </div>

      {/* NEW: How it works flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
        <Card className="p-6 bg-white/60 backdrop-blur-xl border-slate-200/60 shadow-lg shadow-slate-200/20 hover:-translate-y-1 transition-all flex flex-col items-center text-center">
           <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-sm border border-blue-100">
              <Camera className="w-6 h-6" />
           </div>
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">1. Capture Image</h3>
           <p className="text-xs text-slate-500 font-medium leading-relaxed">Upload a high-resolution, focused photograph of the skin lesion or area of concern.</p>
        </Card>

        <Card className="p-6 bg-white/60 backdrop-blur-xl border-slate-200/60 shadow-lg shadow-slate-200/20 hover:-translate-y-1 transition-all flex flex-col items-center text-center relative">
           <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 border border-slate-200 hidden md:flex items-center justify-center text-slate-400 z-10 shadow-sm">
              <ChevronRight className="w-3 h-3" />
           </div>
           <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 border border-slate-200 hidden md:flex items-center justify-center text-slate-400 z-10 shadow-sm">
              <ChevronRight className="w-3 h-3" />
           </div>
           
           <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
              <BrainCircuit className="w-6 h-6" />
           </div>
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">2. Neural Analysis</h3>
           <p className="text-xs text-slate-500 font-medium leading-relaxed">Our advanced model extracts deep visual features and patterns in milliseconds.</p>
        </Card>

        <Card className="p-6 bg-white/60 backdrop-blur-xl border-slate-200/60 shadow-lg shadow-slate-200/20 hover:-translate-y-1 transition-all flex flex-col items-center text-center">
           <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 shadow-sm border border-purple-100">
              <FileText className="w-6 h-6" />
           </div>
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">3. Clinical Report</h3>
           <p className="text-xs text-slate-500 font-medium leading-relaxed">Receive a detailed risk assessment and diagnostic dossier instantly.</p>
        </Card>
      </div>

      {/* Redesigned Clinical Action Center (Bottom) */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 md:p-12 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10 group transition-all hover:shadow-md">
        
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-slate-100 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="flex-1 text-left relative z-10">
           <div className="flex flex-wrap gap-2 mb-6">
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[9px] uppercase tracking-widest font-black text-slate-500">
               <Database className="w-3 h-3 text-slate-400" /> Massive Dataset
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-[9px] uppercase tracking-widest font-black text-emerald-600">
               <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 7 Disease Classes
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-100 text-[9px] uppercase tracking-widest font-black text-rose-600">
               <Lock className="w-3 h-3 text-rose-500" /> AES-256 Secured
             </div>
           </div>
           
           <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
             Ready for Clinical <br />
             <span className="text-slate-400">Diagnostic Analysis?</span>
           </h2>
           
           <p className="text-sm text-slate-500 max-w-md leading-relaxed font-medium">
             Initialize a new diagnostic intake. Our proprietary neural network evaluates the patient&apos;s skin concern against international dermatological markers in milliseconds.
           </p>
        </div>

        <div className="flex-shrink-0 relative z-10 w-full md:w-auto">
          <Button 
            onClick={() => setActiveView('upload')}
            className="w-full md:w-auto h-16 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-4 group"
          >
            <ScanFace className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" /> 
            Initialize Intake
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
