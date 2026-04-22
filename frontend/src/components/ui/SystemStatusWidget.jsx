import React from 'react';
import { Activity, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import { Card } from './Card';

/**
 * SystemStatusWidget: A high-end clinical monitor for AI performance.
 * Fills the 8th slot in the Diagnostic Hub grid.
 */
export function SystemStatusWidget() {
  return (
    <Card className="h-full premium-card border-slate-100 bg-slate-900/5 backdrop-blur-xl p-0 flex flex-col relative overflow-hidden border-dashed border-2 border-slate-200">
      {/* Animated Background Pulse */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="p-5 flex flex-col h-full relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white shadow-premium animate-pulse">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">AI ENGINE</p>
              <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-tight">Active Monitor</h3>
            </div>
          </div>
          <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg flex items-center gap-1.5 border border-emerald-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[9px] font-black uppercase">LIVE</span>
          </div>
        </div>

        <div className="space-y-3 mt-auto">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 border border-white shadow-sm">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-600 uppercase">Model Core</span>
            </div>
            <span className="text-[10px] font-black text-slate-900">Swin-T v6.0</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 border border-white shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-600 uppercase">Trust Score</span>
            </div>
            <span className="text-[10px] font-black text-slate-900 font-mono tracking-tighter">98.42%</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 border border-white shadow-sm">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-600 uppercase">Latency</span>
            </div>
            <span className="text-[10px] font-black text-slate-900 font-mono tracking-tighter">14ms</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
