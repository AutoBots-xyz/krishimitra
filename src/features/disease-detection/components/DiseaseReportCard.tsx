"use client";

import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function DiseaseReportCard({ report }: { report: any }) {
  const getSeverityColor = (level: string) => {
    switch(level) {
      case 'low': return 'bg-leaf text-white';
      case 'moderate': return 'bg-alert-amber text-white';
      case 'high': 
      case 'critical': return 'bg-alert-red text-white animate-pulse';
      default: return 'bg-neutral-400 text-white';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-mid border border-neutral-100 overflow-hidden">
      <div className="p-5 border-b border-neutral-100 bg-mist">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-display text-heading-2 text-soil">{report.disease_name}</h2>
          <span className={`px-3 py-1 rounded-pill text-xs font-bold uppercase tracking-wider ${getSeverityColor(report.severity_level)}`}>
            {report.severity_level}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm text-neutral-800">Confidence:</span>
          <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-harvest transition-all duration-1000" 
              style={{ width: `${report.confidence_score}%` }}
            ></div>
          </div>
          <span className="font-mono text-sm font-medium">{report.confidence_score}%</span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-soil mb-2">
            <AlertTriangle className="w-5 h-5 text-alert-amber" /> Symptoms Detected
          </h3>
          <ul className="list-disc list-inside text-neutral-800 space-y-1 text-sm">
            {report.symptoms_detected.map((sym: string, i: number) => (
              <li key={i}>{sym}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-semibold text-soil mb-2">
            <CheckCircle2 className="w-5 h-5 text-indigo" /> Treatment
          </h3>
          <div className="space-y-3">
            {report.treatment_recommendations.immediate && (
              <div className="bg-alert-red/10 border-l-2 border-alert-red p-3 rounded-r text-sm text-neutral-800">
                <strong>Immediate:</strong> {report.treatment_recommendations.immediate.join(", ")}
              </div>
            )}
            {report.treatment_recommendations.chemical && (
              <div className="bg-sky/50 border-l-2 border-indigo p-3 rounded-r text-sm text-neutral-800">
                <strong>Chemical:</strong> {report.treatment_recommendations.chemical.join(", ")}
              </div>
            )}
            {report.treatment_recommendations.organic && (
              <div className="bg-leaf/10 border-l-2 border-leaf p-3 rounded-r text-sm text-neutral-800">
                <strong>Organic:</strong> {report.treatment_recommendations.organic.join(", ")}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-semibold text-soil mb-2">
            <ShieldCheck className="w-5 h-5 text-leaf" /> Prevention
          </h3>
          <ul className="list-disc list-inside text-neutral-800 space-y-1 text-sm">
            {report.prevention_measures.map((prev: string, i: number) => (
              <li key={i}>{prev}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
