import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  PieChart, 
  Activity, 
  Zap, 
  Cpu, 
  ArrowLeft, 
  Layers,
  Thermometer,
  BrainCircuit,
  CheckCircle2,
  FileText,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { CLASSES } from '../data/classes';

/**
 * AnalyticsView: Redesigned as a high-density clinical intelligence report.
 * Fully transitioned to the 'Clinical slate' identity.
 */
export function AnalyticsView({ scans, setActiveView }) {
  const totalAssessments = scans.length;
  
  // Helper to map raw backend prediction strings to standard CLASSES
  const mapPredictionToClass = (prediction) => {
    if (!prediction) return null;
    const lower = prediction.toLowerCase();
    if (lower.includes('melanoma')) return CLASSES.find(c => c.id === 'melanoma');
    if (lower.includes('actinic') || lower.includes('basal') || lower.includes('bcc') || lower.includes('ak')) return CLASSES.find(c => c.id === 'bcc');
    if (lower.includes('psoriasis')) return CLASSES.find(c => c.id === 'psoriasis');
    if (lower.includes('seborrheic')) return CLASSES.find(c => c.id === 'seborrheic');
    if (lower.includes('eczema')) return CLASSES.find(c => c.id === 'eczema');
    if (lower.includes('vascular')) return CLASSES.find(c => c.id === 'vascular');
    if (lower.includes('urticaria') || lower.includes('hives')) return CLASSES.find(c => c.id === 'urticaria');
    return null;
  };

  const criticalRiskScans = scans.filter(s => mapPredictionToClass(s.prediction)?.id === 'melanoma');
  const highRiskScans = scans.filter(s => mapPredictionToClass(s.prediction)?.id === 'bcc');
  
  const criticalRiskCount = criticalRiskScans.length;
  const highRiskCount = highRiskScans.length;

  // Calculate Weighted Severity Index
  // All Malignant Cases (Melanoma & AK/BCC): 1.0x weight | Benign: 0.0x weight
  let severitySum = 0;
  scans.forEach(s => {
    const meta = mapPredictionToClass(s.prediction);
    const conf = s.confidence || 0;
    if (meta?.is_malignant) {
      severitySum += conf * 1.0;
    }
  });

  const severityIndex = totalAssessments > 0
    ? (severitySum / totalAssessments).toFixed(1)
    : "0.0";

  // Frequency aggregation
  const conditionFrequency = scans.reduce((acc, scan) => {
    acc[scan.prediction] = (acc[scan.prediction] || 0) + 1;
    return acc;
  }, {});

  const sortedConditions = Object.entries(conditionFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([rawName, count]) => {
      const meta = mapPredictionToClass(rawName);
      return { 
        name: meta ? meta.name : rawName, 
        count, 
        risk: meta?.risk || 'Undetermined', 
        isMalignant: meta?.is_malignant || false 
      };
    });

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="view-container reveal-entry"
    >
      
      {/* ── Intelligence Header ─────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pt-4 border-b border-slate-50 pb-6">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm">
                 <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">Intelligence Core v4.28</h3>
           </div>
           <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter leading-none mb-2">
             Clinical <span className="text-slate-600">Analytics</span>
           </h1>
           <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
             Comprehensive cross-registry intelligence auditing. Evaluating localized pathology distributions and longitudinal diagnostic patterns.
           </p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
             onClick={() => setActiveView('dashboard')} 
             variant="outline"
             className="px-6 h-12 border-slate-200 text-slate-400 rounded-xl hover:text-slate-600 transition-all font-black uppercase tracking-widest text-[11px] group"
           >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
              Exit Registry
           </Button>
        </div>
      </header>
      {/* ── Risk Summary Panel ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {/* Total Uploads */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Uploads</p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{totalAssessments}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">Images analysed</p>
        </div>

        {/* Critical Risk */}
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5">
          <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Critical Risk</p>
          <p className="text-4xl font-black text-rose-600 tracking-tighter leading-none">
            {criticalRiskCount}
          </p>
          <p className="text-[10px] text-rose-500 mt-1 font-semibold">Melanoma cases</p>
        </div>

        {/* High Risk */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">High Risk</p>
          <p className="text-4xl font-black text-amber-600 tracking-tighter leading-none">
            {highRiskCount}
          </p>
          <p className="text-[10px] text-amber-500 mt-1 font-semibold">AK / BCC cases</p>
        </div>

        {/* Overall Severity Index */}
        <div className={`rounded-2xl p-5 ${parseFloat(severityIndex) > 30 ? 'bg-rose-600' : parseFloat(severityIndex) > 10 ? 'bg-amber-500' : 'bg-slate-800'}`}>
          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-2">Severity Index</p>
          <p className="text-4xl font-black text-white tracking-tighter leading-none">{severityIndex}</p>
          <p className="text-[10px] text-white/60 mt-1 font-semibold">
            {parseFloat(severityIndex) > 30 ? 'High — Review Urgently' : parseFloat(severityIndex) > 10 ? 'Moderate — Monitor' : 'Low — All Clear'}
          </p>
        </div>

      </div>

      {/* ── Intelligence Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-12">


         {/* List: Condition Frequency */}
         <Card className="lg:col-span-12 p-8 md:p-10 bg-white border-slate-100 shadow-sm relative overflow-hidden group rounded-[2.5rem]">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 pb-6 border-b border-slate-50">
               <div>
                  <h3 className="text-3xl font-extrabold text-slate-950 tracking-tighter mb-1 uppercase leading-none">Diagnostic Distributions</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Specialized Pathology Mapping</p>
               </div>
               <div className="hidden md:flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Clinical Severity Index</p>
                    <p className="text-xl font-black text-rose-600 tracking-tight tabular-nums">{severityIndex}</p>
                  </div>
                  <div className="w-px h-10 bg-slate-100" />
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Principal Pathology</p>
                    <p className="text-lg font-black text-slate-600 tracking-tight uppercase truncate max-w-[160px]">{sortedConditions[0]?.name || 'N/A'}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
               {sortedConditions.length > 0 ? sortedConditions.map(({ name, count, risk, isMalignant }, index) => (
                  <div key={name} className="flex flex-col group/item cursor-default">
                     <div className="flex justify-between items-end mb-4">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${isMalignant ? 'bg-rose-50 text-rose-600 border border-rose-100 group-hover/item:bg-rose-600 group-hover/item:text-white group-hover/item:border-rose-600' : 'bg-slate-50 text-slate-400 border border-slate-100 group-hover/item:bg-slate-600 group-hover/item:text-white group-hover/item:border-slate-600'}`}>
                              {(index + 1).toString().padStart(2, '0')}
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <Badge className={`px-2 py-0 text-[8px] font-black uppercase tracking-widest border-none ${isMalignant ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {risk}
                                 </Badge>
                              </div>
                              <p className="text-base font-black text-slate-950 tracking-tight uppercase leading-none">{name}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className={`text-3xl font-black tabular-nums leading-none transition-colors ${isMalignant ? 'text-rose-600' : 'text-slate-900 group-hover/item:text-slate-600'}`}>{count}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{((count / totalAssessments) * 100).toFixed(1)}% Weighting</p>
                        </div>
                     </div>
                     <div className="relative h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${(count / totalAssessments) * 100}%` }}
                           transition={{ duration: 1, ease: 'easeOut' }}
                           className={`absolute inset-y-0 left-0 rounded-full ${isMalignant ? 'bg-rose-600' : 'bg-slate-600'}`}
                        />
                     </div>
                  </div>
               )) : (
                  <div className="col-span-2 py-24 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-100 text-center flex flex-col items-center justify-center">
                     <Layers className="w-10 h-10 text-slate-200 mb-4" />
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest font-black">Waiting for diagnostic history influx.</p>
                  </div>
               )}
            </div>
         </Card>
      </div>

      <footer className="mb-12 pt-6 border-t border-slate-100 flex items-center justify-between opacity-50">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Audit Validated Node DS-482 • Clinical Core 5.2.1</p>
        <div className="flex gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
           <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
           <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        </div>
      </footer>
    </motion.div>
  );
}


