"use client";

import { AlertTriangle, Droplets, ShieldCheck, Zap, Leaf } from "lucide-react";

export default function DiseaseReportCard({ report }: { report: any }) {
  const isHighRisk = report.severity_level === 'high' || report.severity_level === 'critical';
  const themeColor = isHighRisk ? '#C53030' : '#C8800F';
  const themeBg = isHighRisk ? 'linear-gradient(135deg, #fff1f0 0%, #ffe4e1 100%)' : 'linear-gradient(135deg, #fdf6ec 0%, #fef3e2 100%)';

  return (
    <div className="flex flex-col gap-4">
      
      {/* ─── HEADER BENTO ─── */}
      <div className="relative overflow-hidden rounded-[2rem] p-6 md:p-8"
        style={{ background: themeBg, border: `1px solid ${themeColor}25` }}>
        <div className="absolute top-0 right-0 w-48 h-48 opacity-10"
          style={{ background: `radial-gradient(circle at top right, ${themeColor} 0%, transparent 70%)` }} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase block" style={{ color: themeColor }}>
              Diagnosis Complete
            </span>
            <span className="px-3 py-1 rounded-full font-mono text-[10px] tracking-widest uppercase font-bold text-white shadow-sm"
              style={{ backgroundColor: themeColor }}>
              {report.severity_level} Risk
            </span>
          </div>

          <h2 className="font-display font-bold text-[2.5rem] md:text-[3rem] leading-[1.05] text-[#0D1910] mb-8">
            {report.disease_name}
          </h2>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-[#0D1910]/60 font-medium mb-2 uppercase tracking-wide">AI Confidence</p>
              <div className="flex items-center gap-3">
                <span className="font-display text-4xl font-semibold" style={{ color: themeColor }}>
                  {report.confidence_score}<span className="text-2xl text-[#0D1910]/30">%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── DETAILS GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Symptoms */}
        <div className="glass rounded-[1.5rem] p-6 border border-primary/10 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-primary">Symptoms</h3>
          </div>
          <ul className="space-y-3">
            {report.symptoms_detected.map((sym: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text/80 leading-relaxed">
                <span className="text-primary mt-1 opacity-50">•</span>
                {sym}
              </li>
            ))}
          </ul>
        </div>

        {/* Prevention */}
        <div className="glass rounded-[1.5rem] p-6 border border-primary/10 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-primary">Prevention</h3>
          </div>
          <ul className="space-y-3">
            {report.prevention_measures.map((prev: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text/80 leading-relaxed">
                <span className="text-primary mt-1 opacity-50">•</span>
                {prev}
              </li>
            ))}
          </ul>
        </div>

        {/* Treatment Protocol (Spans full width) */}
        <div className="md:col-span-2 glass rounded-[1.5rem] p-6 border border-primary/10 shadow-sm mt-2">
          <h3 className="font-display text-2xl font-semibold text-primary mb-6">Treatment Protocol</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.treatment_recommendations.immediate && (
              <div className="rounded-xl p-5" style={{ background: 'linear-gradient(180deg, #fff1f0 0%, #fff 100%)', border: '1px solid rgba(197,48,48,0.1)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-[#C53030]" />
                  <span className="font-mono text-[10px] tracking-widest uppercase font-semibold text-[#C53030]">Immediate</span>
                </div>
                <p className="text-sm text-text/90 leading-relaxed">{report.treatment_recommendations.immediate.join(", ")}</p>
              </div>
            )}
            
            {report.treatment_recommendations.chemical && (
              <div className="rounded-xl p-5" style={{ background: 'linear-gradient(180deg, #f0f4ff 0%, #fff 100%)', border: '1px solid rgba(26,71,49,0.1)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Droplets className="w-4 h-4 text-[#1A4731]" />
                  <span className="font-mono text-[10px] tracking-widest uppercase font-semibold text-[#1A4731]">Chemical</span>
                </div>
                <p className="text-sm text-text/90 leading-relaxed">{report.treatment_recommendations.chemical.join(", ")}</p>
              </div>
            )}
            
            {report.treatment_recommendations.organic && (
              <div className="rounded-xl p-5" style={{ background: 'linear-gradient(180deg, #e8f5ee 0%, #fff 100%)', border: '1px solid rgba(26,107,69,0.1)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="w-4 h-4 text-[#1A6B45]" />
                  <span className="font-mono text-[10px] tracking-widest uppercase font-semibold text-[#1A6B45]">Organic</span>
                </div>
                <p className="text-sm text-text/90 leading-relaxed">{report.treatment_recommendations.organic.join(", ")}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
