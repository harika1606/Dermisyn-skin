import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';

/**
 * ClinicalProtocolWidget: A user manual / SOP guide for the platform.
 * Replaces the AI Engine widget in the 8th slot.
 */
export function ClinicalProtocolWidget() {
  return (
    <Card 
      className="h-full premium-card hover:border-slate-500/30 transition-all duration-500 group overflow-hidden bg-white shadow-sm hover:shadow-2xl border-slate-100 p-0 flex flex-col relative z-0 cursor-pointer"
      onClick={() => alert("Operating Manual v2.0 Loading...")}
    >
      <div className="p-3.5 flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex-shrink-0 flex items-center justify-center shadow-premium transition-all group-hover:scale-105 group-hover:rotate-2 duration-500 relative">
            <div className="absolute inset-0 rounded-xl bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <BookOpen className="w-5 h-5 relative z-10" />
          </div>
          <div className="flex-1 min-w-0">
            <Badge className="mb-1 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider border-none bg-slate-50 text-slate-800">
              USER MANUAL
            </Badge>
            <h3 className="text-[12px] font-black text-slate-900 tracking-tighter group-hover:text-slate-800 transition-colors uppercase leading-[1.1]">
              Clinical Protocol
            </h3>
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-800 group-hover:text-white transition-all transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shadow-sm">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Card>
  );
}
