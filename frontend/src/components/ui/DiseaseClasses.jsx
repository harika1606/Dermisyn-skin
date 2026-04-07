import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { 
  AlertTriangle, 
  Search, 
  Activity, 
  CheckCircle, 
  Info, 
  Shield, 
  Zap, 
  BrainCircuit, 
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { CLASSES } from '../../data/classes';

// Removed local CLASSES definition in favor of shared data.

export function DiseaseClasses({ setSelectedClass, setActiveView }) {
  return (
    <div className="reveal-entry pt-4">
      {/* Search/Filter Bar - High Density UI */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2 border-b border-slate-50 pb-2">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">Diagnostic Hub</h3>
            <p className="text-[11px] font-black text-violet-600 uppercase tracking-widest mt-0.5">Verified Clinical Registry</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 shadow-inner">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Pathology Matrix..." 
            className="bg-transparent text-[11px] font-bold text-slate-900 outline-none w-48 placeholder:text-slate-300" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
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
               className="h-full premium-card hover:border-violet-500/30 transition-all duration-500 group overflow-hidden bg-white shadow-sm hover:shadow-lg border-slate-100 p-0 flex flex-col relative z-0 cursor-pointer"
            >
               {/* Compact Specification Header */}
               <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                     <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 duration-500 ${cls.is_malignant ? 'bg-rose-600' : 'bg-violet-600'}`}>
                        <div className="w-5 h-5 flex items-center justify-center">
                           {cls.icon}
                        </div>
                     </div>
                  <div className="flex-1 min-w-0">
                     <Badge className={`mb-1 px-1.5 py-0 text-[8px] font-black uppercase tracking-widest border-none ${cls.is_malignant ? 'bg-rose-50 text-rose-600' : 'bg-violet-50 text-violet-600'}`}>
                       {cls.risk}
                     </Badge>
                     <h3 className="text-sm font-black text-slate-900 tracking-tight group-hover:text-violet-600 transition-colors uppercase leading-tight line-clamp-2">
                       {cls.name}
                     </h3>
                  </div>
               </div>
            </div>
         </Card>
          </motion.div>
        ))}
      </div>

      {/* Standards Bar */}
      <Card className="p-4 bg-white border-slate-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border-dashed transition-all hover:bg-violet-50/10">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm">
               <Info className="w-5 h-5" />
            </div>
            <div>
               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-0.5">Clinical Standards Matrix</h4>
               <p className="text-[10px] text-slate-500 font-medium leading-none">All benchmarks verified against international ISIC dermatological standards.</p>
            </div>
         </div>
         <Button 
           variant="outline" 
           className="h-10 px-6 rounded-xl text-[11px] font-black uppercase tracking-widest border-slate-200 bg-white text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all font-black"
           onClick={() => window.open('https://www.isic-archive.com/', '_blank')}
         >
           Access ISIC Data Repository
         </Button>
      </Card>

    </div>
  );
}
