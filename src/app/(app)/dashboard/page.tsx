"use client";

import { Scan, Map as MapIcon, MessageSquare, ListTodo, CloudRain, Wind, AlertTriangle, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLanguageStore } from "@/store/languageStore";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Dashboard is now a Client Component to support live translation
// Data shown here will be replaced by real Supabase queries once authentication + farmer profile are wired up.
// The placeholders below use safe fallback values.

const FARMER_NAME = "Farmer";        // TODO: fetch from farmers table
// Location is now managed in state

export default function DashboardPage() {
  const { language } = useLanguageStore();
  const [location, setLocation] = useState("Bhopal, Madhya Pradesh");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState("");
  
  const [weatherText, setWeatherText] = useState("32° | Rain 20%");
  const [windText, setWindText] = useState("12 km/h");
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  useEffect(() => {
    async function updateWeather() {
      if (!location) return;
      setIsWeatherLoading(true);
      try {
        // Geocode
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) {
          setIsWeatherLoading(false);
          return;
        }
        
        const { latitude, longitude } = geoData.results[0];
        
        // Fetch Weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,precipitation&hourly=precipitation_probability`);
        const weatherData = await weatherRes.json();
        
        if (weatherData.current) {
          const temp = Math.round(weatherData.current.temperature_2m);
          // Get precip prob for the current hour
          const currentHour = new Date().getHours();
          const precipProb = weatherData.hourly?.precipitation_probability?.[currentHour] || 0;
          const wind = Math.round(weatherData.current.wind_speed_10m);
          
          setWeatherText(`${temp}° | ${language === 'en' ? 'Rain' : 'बारिश'} ${precipProb}%`);
          setWindText(`${wind} km/h`);
        }
      } catch (err) {
        console.error("Failed to update weather:", err);
      } finally {
        setIsWeatherLoading(false);
      }
    }
    
    updateWeather();
  }, [location, language]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="space-y-6 max-w-5xl mx-auto pb-20 md:pb-0"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      
      {/* Hero Card */}
      <motion.div variants={itemVariants} className="rounded-xl p-6 shadow-mid border border-neutral-100 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.png')" }}>
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-0"></div>
        <div className="relative z-10">
          <h1 className="font-display text-display-lg text-soil mb-1">
            {language === 'en' ? `Hello ${FARMER_NAME}` : `नमस्ते ${FARMER_NAME} जी`}
          </h1>
          <div className="text-neutral-800 flex items-center gap-2 mb-4 h-8">
            <span>📍</span>
            {isEditingLocation ? (
              <input 
                autoFocus
                className="bg-white/90 border border-indigo/30 rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo w-56 text-neutral-800 shadow-sm"
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                onBlur={() => {
                  if (tempLocation.trim()) setLocation(tempLocation);
                  setIsEditingLocation(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (tempLocation.trim()) setLocation(tempLocation);
                    setIsEditingLocation(false);
                  } else if (e.key === 'Escape') {
                    setIsEditingLocation(false);
                  }
                }}
              />
            ) : (
              <span 
                className="cursor-pointer hover:bg-white/50 px-2 py-1 -ml-2 rounded-md transition-colors border border-transparent hover:border-neutral-200"
                onClick={() => {
                  setTempLocation(location);
                  setIsEditingLocation(true);
                }}
                title={language === 'en' ? "Click to change location" : "स्थान बदलने के लिए क्लिक करें"}
              >
                {location}
              </span>
            )}
          </div>
          
          <div className="flex gap-4 items-center mt-2 bg-white/80 p-3 rounded-lg w-max backdrop-blur-sm shadow-low">
            <div className="flex items-center gap-1 text-soil font-medium">
              {isWeatherLoading ? <Loader2 className="w-5 h-5 text-indigo animate-spin" /> : <CloudRain className="w-5 h-5 text-indigo" />} 
              {isWeatherLoading ? "..." : weatherText}
            </div>
            <div className="w-px h-4 bg-neutral-400"></div>
            <div className="flex items-center gap-1 text-neutral-800 text-sm">
              <Wind className="w-4 h-4" /> 
              {isWeatherLoading ? "..." : windText}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-3 md:gap-6">
        <QuickAction href="/scan" icon={Scan} label={language === 'en' ? "Scan Crop" : "फसल स्कैन"} color="bg-leaf" text="text-white" />
        <QuickAction href="/cropwatch" icon={MapIcon} label={language === 'en' ? "Watch Map" : "नक्शा देखें"} color="bg-alert-amber" text="text-white" />
        <QuickAction href="/chat" icon={MessageSquare} label={language === 'en' ? "Ask Expert" : "विशेषज्ञ से पूछें"} color="bg-sky" text="text-indigo" />
        <QuickAction href="/plan" icon={ListTodo} label={language === 'en' ? "Plan Farm" : "फार्म योजना"} color="bg-harvest" text="text-soil" />
      </motion.div>

      {/* Active Alerts */}
      <motion.section variants={itemVariants}>
        <h2 className="font-display text-heading-2 text-soil mb-3">⚠ {language === 'en' ? 'Active Alerts' : 'सक्रिय अलर्ट'}</h2>
        <div className="flex overflow-x-auto gap-3 pb-2 snap-x">
          <div className="snap-start shrink-0 w-72 bg-alert-red/10 border border-alert-red/20 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-alert-red shrink-0" />
            <div>
              <h3 className="font-semibold text-alert-red text-sm">{language === 'en' ? 'Wheat Rust Outbreak' : 'गेहूं रस्ट प्रकोप'}</h3>
              <p className="text-xs text-neutral-800 mt-1">{language === 'en' ? '14 cases detected within 5km in the last 2 days.' : 'पिछले 2 दिनों में 5 किमी के भीतर 14 मामले सामने आए।'}</p>
            </div>
          </div>
          <div className="snap-start shrink-0 w-72 bg-alert-amber/10 border border-alert-amber/20 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-alert-amber shrink-0" />
            <div>
              <h3 className="font-semibold text-alert-amber text-sm">{language === 'en' ? 'Heavy Rain Expected' : 'भारी बारिश की संभावना'}</h3>
              <p className="text-xs text-neutral-800 mt-1">Avoid spraying fertilizers for the next 48 hours.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Recent Scans */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-heading-2 text-soil">{language === 'en' ? 'Recent Scans' : 'हाल के स्कैन'}</h2>
          <Link href="/scan/history" className="text-sm text-indigo font-medium flex items-center hover:underline">
            {language === 'en' ? 'View all' : 'सभी देखें'} <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-xl shadow-low border border-neutral-100 flex items-center gap-4">
            <img src="/rice-blast.png" alt="Rice Blast" className="w-16 h-16 object-cover rounded-lg shrink-0 border border-neutral-200" />
            <div className="flex-1">
              <h3 className="font-medium text-soil">Rice Blast</h3>
              <p className="text-xs text-neutral-400 mt-1">2 days ago</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-alert-red shrink-0"></div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-low border border-neutral-100 flex items-center gap-4">
            <img src="/healthy-crop.png" alt="Healthy Crop" className="w-16 h-16 object-cover rounded-lg shrink-0 border border-neutral-200" />
            <div className="flex-1">
              <h3 className="font-medium text-soil">Healthy Crop</h3>
              <p className="text-xs text-neutral-400 mt-1">1 week ago</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-leaf shrink-0"></div>
          </div>
        </div>
      </motion.section>

      {/* Today's Advisory */}
      <motion.section variants={itemVariants} className="bg-sky border-l-4 border-harvest rounded-r-xl p-5 shadow-low">
        <h3 className="font-display text-heading-3 text-soil mb-2">{language === 'en' ? "Today's Advisory" : "आज की सलाह"}</h3>
        <p className="text-neutral-800 italic leading-relaxed">
          {language === 'en' ? `"Delay irrigation for the next 2 days — 40mm rain is forecast starting Thursday evening."` : `"अगले 2 दिनों के लिए सिंचाई में देरी करें — गुरुवार शाम से 40 मिमी बारिश का अनुमान है।"`}
        </p>
        <div className="mt-3 text-right">
          <Link href="/advisory" className="text-sm font-semibold text-indigo">{language === 'en' ? 'Read full advisory →' : 'पूरी सलाह पढ़ें →'}</Link>
        </div>
      </motion.section>
      
    </motion.div>
  );
}

function QuickAction({ href, icon: Icon, label, color, text }: { href: string, icon: any, label: string, color: string, text: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2">
      <div className={`w-14 h-14 md:w-16 md:h-16 ${color} ${text} rounded-2xl flex items-center justify-center shadow-mid hover:scale-105 transition-transform`}>
        <Icon className="w-7 h-7 md:w-8 md:h-8" />
      </div>
      <span className="text-xs md:text-sm font-medium text-neutral-800 text-center leading-tight">
        {label}
      </span>
    </Link>
  );
}
