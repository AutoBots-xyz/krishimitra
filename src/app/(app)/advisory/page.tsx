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
    return <div className="p-8 text-center text-neutral-400">Loading your personalized advisory...</div>;
  }

  if (error || !advisory) {
    return <div className="p-8 text-center text-alert-red">{error ?? 'Failed to load advisory. Please try again.'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="font-display text-heading-1 text-soil">Climate Advisory</h1>
        <p className="text-neutral-800">Hyperlocal weather & crop advice for {locationLabel}</p>
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
            <div key={dateString} className={`shrink-0 w-20 flex flex-col items-center p-3 rounded-xl border ${i === 0 ? 'bg-indigo text-white border-indigo' : 'bg-white border-neutral-100 text-neutral-800 shadow-low'}`}>
              <span className="text-xs font-semibold mb-2">{dayName}</span>
              {isRain ? <CloudRain className="w-6 h-6 mb-2" /> : <Sun className="w-6 h-6 mb-2 text-harvest" />}
              <span className="font-mono text-sm">{maxTemp}°</span>
            </div>
          );
        })}
      </div>

      <div className="bg-sky border-l-4 border-harvest rounded-r-xl p-6 shadow-low relative overflow-hidden">
        <CloudRain className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo opacity-5" />
        <h2 className="font-semibold text-lg text-soil mb-3 relative z-10">AI Summary</h2>
        <p className="text-neutral-800 text-lg italic leading-relaxed relative z-10">
          "{advisory.summary}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-mid border border-neutral-100">
          <h3 className="flex items-center gap-2 font-semibold text-soil mb-3">
            <Droplets className="w-5 h-5 text-indigo" /> Irrigation
          </h3>
          <p className="text-sm text-neutral-800 leading-relaxed">{advisory.irrigation_advice}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-mid border border-neutral-100">
          <h3 className="flex items-center gap-2 font-semibold text-soil mb-3">
            <AlertTriangle className="w-5 h-5 text-alert-red" /> Disease Risk
          </h3>
          <p className="text-sm text-neutral-800 leading-relaxed">{advisory.disease_risk_alert}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-mid border border-neutral-100">
        <h3 className="font-semibold text-soil mb-3">Field Activities</h3>
        <ul className="space-y-2">
          {advisory.field_activity_recommendations.map((rec: string, i: number) => (
            <li key={i} className="flex gap-3 text-sm text-neutral-800">
              <span className="w-1.5 h-1.5 bg-harvest rounded-full mt-1.5 shrink-0"></span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
