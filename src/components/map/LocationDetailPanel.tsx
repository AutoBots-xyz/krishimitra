"use client";

import { X, Wind, Droplets, Thermometer, ShieldAlert, Zap, AlertTriangle, CloudRain, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LocationData {
  id: number;
  lat: number;
  lng: number;
  riskScore: number;
  riskLevel: string;
  temp: string;
  rain: string;
  predictedCases: number;
  en: { name: string; state: string; disease: string; cropType: string; };
  hi: { name: string; state: string; disease: string; cropType: string; };
}

interface LocationDetailPanelProps {
  location: LocationData | null;
  language: 'en' | 'hi';
  onClose: () => void;
}

export default function LocationDetailPanel({ location, language, onClose }: LocationDetailPanelProps) {
  if (!location) return null;

  const t = location[language];
  const isHighRisk = location.riskLevel === 'HIGH';
  const isMedRisk = location.riskLevel === 'MEDIUM';

  const themeColor = isHighRisk ? '#C53030' : isMedRisk ? '#C8800F' : '#1A6B45';
  const bgGradient = isHighRisk 
    ? 'linear-gradient(135deg, rgba(197,48,48,0.05) 0%, transparent 100%)' 
    : isMedRisk 
    ? 'linear-gradient(135deg, rgba(200,128,15,0.05) 0%, transparent 100%)' 
    : 'linear-gradient(135deg, rgba(26,107,69,0.05) 0%, transparent 100%)';

  const rbClass = isHighRisk 
    ? 'bg-error/10 text-error border-error/20' 
    : isMedRisk 
    ? 'bg-secondary/10 text-secondary border-secondary/20' 
    : 'bg-success/10 text-success border-success/20';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] z-[9999] bg-white/80 backdrop-blur-3xl border-l border-primary/10 shadow-2xl flex flex-col pt-16 md:pt-0"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-20 md:top-28 right-6 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-5 h-5 text-text" />
        </button>

        <div className="flex-1 overflow-y-auto p-8 pt-20 md:pt-28 no-scrollbar pb-24" style={{ background: bgGradient }}>
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display text-4xl font-bold text-primary leading-tight mb-2">{t.name}</h2>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">{t.state} • {t.cropType}</p>
          </div>

          {/* Risk Score */}
          <div className="flex items-end gap-4 mb-10">
            <div>
              <span className={`inline-flex px-3 py-1 rounded-lg font-mono text-[10px] font-bold tracking-widest uppercase border ${rbClass} mb-3`}>
                {location.riskLevel} {language === 'en' ? 'Risk' : 'जोखिम'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-[4rem] font-bold leading-none tracking-tighter" style={{ color: themeColor }}>
                  {location.riskScore.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Bento */}
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-4 border-b border-primary/10 pb-3">
            {language === 'en' ? 'Environmental Data' : 'पर्यावरण डेटा'}
          </h4>
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-white/50 border border-primary/5 rounded-2xl p-4">
              <Thermometer className="w-5 h-5 text-secondary mb-2" />
              <p className="font-display text-2xl font-semibold text-text">{location.temp}</p>
              <p className="font-mono text-[10px] text-muted uppercase tracking-wider">{language === 'en' ? 'Temperature' : 'तापमान'}</p>
            </div>
            <div className="bg-white/50 border border-primary/5 rounded-2xl p-4">
              <CloudRain className="w-5 h-5 text-blue-500 mb-2" />
              <p className="font-display text-2xl font-semibold text-text">{location.rain}</p>
              <p className="font-mono text-[10px] text-muted uppercase tracking-wider">{language === 'en' ? 'Rainfall' : 'बारिश'}</p>
            </div>
            <div className="col-span-2 bg-white/50 border border-primary/5 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">{language === 'en' ? 'Predicted Cases' : 'अनुमानित मामले'}</p>
                <p className="font-body text-sm font-medium text-text">{t.disease} {language === 'en' ? 'detections' : 'का पता चला'}</p>
              </div>
              <span className="font-display text-3xl font-bold" style={{ color: themeColor }}>{location.predictedCases}</span>
            </div>
          </div>

          {/* Transmission Vectors */}
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-4 border-b border-primary/10 pb-3">
            {language === 'en' ? 'Transmission Vectors' : 'प्रसार के कारण'}
          </h4>
          <div className="space-y-4 mb-8">
            <div>
              <div className="flex justify-between font-mono text-[10px] text-muted mb-1.5 uppercase">
                <span>{language === 'en' ? 'Wind Spread' : 'हवा का फैलाव'}</span>
                <span>85%</span>
              </div>
              <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1, delay: 0.2 }} className="h-full rounded-full" style={{ background: themeColor }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-mono text-[10px] text-muted mb-1.5 uppercase">
                <span>{language === 'en' ? 'Humidity Conduciveness' : 'नमी अनुकूलता'}</span>
                <span>{isHighRisk ? '92%' : '45%'}</span>
              </div>
              <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: isHighRisk ? "92%" : "45%" }} transition={{ duration: 1, delay: 0.4 }} className="h-full rounded-full" style={{ background: themeColor }} />
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-4">
            <h4 className="flex items-center gap-2 font-display text-lg font-semibold text-primary mb-2">
              <Zap className="w-4 h-4" /> {language === 'en' ? 'AI Insight' : 'एआई इनसाइट'}
            </h4>
            <p className="text-sm text-text/80 leading-relaxed font-light">
              {language === 'en' 
                ? `High humidity combined with ${location.temp} temperature is creating an optimal breeding ground for ${t.disease}. Spread velocity is increasing.`
                : `उच्च नमी और ${location.temp} तापमान ${t.disease} के लिए अनुकूल वातावरण बना रहे हैं। फैलाव की गति बढ़ रही है।`}
            </p>
          </div>

          {/* Action Required */}
          {isHighRisk && (
            <div className="bg-error/5 border border-error/20 rounded-2xl p-5">
              <h4 className="flex items-center gap-2 font-display text-lg font-semibold text-error mb-2">
                <ShieldAlert className="w-4 h-4" /> {language === 'en' ? 'Action Required' : 'कार्रवाई आवश्यक'}
              </h4>
              <p className="text-sm text-error/90 leading-relaxed font-light">
                {language === 'en'
                  ? `Immediate preventative spraying recommended for all ${t.cropType} fields within a 5km radius.`
                  : `5 किमी के दायरे में सभी ${t.cropType} खेतों के लिए तत्काल निवारक स्प्रे की सिफारिश की जाती है।`}
              </p>
            </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
