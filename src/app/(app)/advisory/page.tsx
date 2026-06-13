"use client";

import { useEffect, useState } from "react";
import { CloudRain, Sun, Wind, Droplets, AlertTriangle } from "lucide-react";
import { useFarmerStore } from "@/store/farmerStore";

export default function AdvisoryPage() {
  const { profile, location } = useFarmerStore();
  const [advisory, setAdvisory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locationLabel = profile?.district && profile?.state
    ? `${profile.district}, ${profile.state}`
    : "Your Location";

  useEffect(() => {
    async function fetchAdvisory() {
      try {
        const lat = location?.lat ?? 23.2599;
        const lng = location?.lng ?? 77.4126;
        const res = await fetch(`/api/advisory?lat=${lat}&lng=${lng}`);
        if (!res.ok) throw new Error('Failed to load advisory');
        const data = await res.json();
        setAdvisory(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    fetchAdvisory();
  }, [location]);

  if (loading) {
    return <div className="p-8 text-center font-mono text-sm text-primary">Loading your personalized advisory...</div>;
  }

  if (error || !advisory) {
    return <div className="p-8 text-center text-error font-body">{error ?? 'Failed to load advisory. Please try again.'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-6">
        <p className="eyebrow mb-2">WEATHER & ADVISORY</p>
        <h1 className="font-display text-[36px] text-primary font-bold leading-tight">Climate Advisory</h1>
        <p className="font-body font-light text-muted">Hyperlocal weather & crop advice for {locationLabel}</p>
      </div>

      {/* Real 7-day forecast strip from Open-Meteo */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {advisory.weatherData?.daily?.time?.slice(0, 7).map((dateString: string, i: number) => {
          const date = new Date(dateString);
          const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
          const maxTemp = Math.round(advisory.weatherData.daily.temperature_2m_max[i]);
          const code = advisory.weatherData.daily.weather_code[i];
          const isRain = code >= 50; // WMO codes >= 50 indicate rain/drizzle

          return (
            <div key={dateString} className={`shrink-0 w-20 flex flex-col items-center p-3 rounded-xl border ${i === 0 ? 'glass border-primary text-primary shadow-md' : 'glass border-primary/10 text-muted shadow-sm'}`}>
              <span className="font-mono text-[10px] uppercase mb-2">{dayName}</span>
              {isRain ? <CloudRain className="w-6 h-6 mb-2" /> : <Sun className={`w-6 h-6 mb-2 ${i===0 ? 'text-secondary' : 'text-primary/60'}`} />}
              <span className="font-mono text-sm font-semibold">{maxTemp}°</span>
            </div>
          );
        })}
      </div>

      <div className="glass border-l-4 border-secondary rounded-r-xl p-6 shadow-sm relative overflow-hidden">
        <CloudRain className="absolute -right-4 -bottom-4 w-32 h-32 text-primary opacity-[0.03]" />
        <h2 className="font-body font-semibold text-[14px] text-primary mb-3 relative z-10">AI Summary</h2>
        <p className="font-display italic text-[24px] text-primary leading-relaxed relative z-10">
          "{advisory.summary}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-5 rounded-xl shadow-sm border border-primary/10">
          <h3 className="flex items-center gap-2 font-body font-semibold text-[14px] text-primary mb-3">
            <Droplets className="w-5 h-5 text-primary" /> Irrigation
          </h3>
          <p className="font-body font-light text-[14px] text-text leading-relaxed">{advisory.irrigation_advice}</p>
        </div>

        <div className="glass p-5 rounded-xl shadow-sm border border-primary/10 border-l-4 border-error">
          <h3 className="flex items-center gap-2 font-body font-semibold text-[14px] text-error mb-3">
            <AlertTriangle className="w-5 h-5 text-error" /> Disease Risk
          </h3>
          <p className="font-body font-light text-[14px] text-text leading-relaxed">{advisory.disease_risk_alert}</p>
        </div>
      </div>

      <div className="glass p-5 rounded-xl shadow-sm border border-primary/10">
        <h3 className="font-body font-semibold text-[14px] text-primary mb-3">Field Activities</h3>
        <ul className="space-y-2">
          {advisory.field_activity_recommendations.map((rec: string, i: number) => (
            <li key={i} className="flex gap-3 font-body font-light text-[14px] text-text">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 shrink-0"></span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
