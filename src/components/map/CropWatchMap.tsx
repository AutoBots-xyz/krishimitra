"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLanguageStore } from "@/store/languageStore";
import { useFarmerStore } from "@/store/farmerStore";
import LocationDetailPanel from "./LocationDetailPanel";
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, Zap, Camera, MapPin, X, Loader2 } from "lucide-react";

const createChipIcon = (name: string, score: number, color: string) => {
  return L.divIcon({
    className: 'custom-chip-icon',
    html: `
      <div style="
        display: inline-flex; 
        align-items: center; 
        gap: 6px; 
        background: rgba(255, 255, 255, 0.9); 
        backdrop-filter: blur(12px); 
        border-radius: 999px; 
        padding: 6px 14px 6px 8px; 
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); 
        border: 1px solid rgba(0,0,0,0.05);
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <div style="width: 12px; height: 12px; border-radius: 50%; background: ${color}; box-shadow: 0 0 8px ${color}80;"></div>
        <span style="font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; color: #1a2332; letter-spacing: 0.2px;">${name}</span>
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: ${color}; margin-left: 4px;">${score.toFixed(2)}</span>
      </div>
    `,
    iconSize: [120, 32],
    iconAnchor: [60, 16]
  });
};

// Component to handle map view updates dynamically
function MapUpdater({ activeLocation, filteredPoints, searchQuery, activeFilter }: { activeLocation: any, filteredPoints: any[], searchQuery: string, activeFilter: string }) {
  const map = useMap();

  useEffect(() => {
    if (activeLocation) {
      // Fly to clicked location. Offset longitude slightly to account for the right-side sliding panel.
      map.flyTo([activeLocation.lat, activeLocation.lng - 0.015], 14, { animate: true, duration: 1.5 });
    }
  }, [activeLocation, map]);

  useEffect(() => {
    // Only auto-zoom if we are actively searching or filtering, and not if a panel is open
    if (!activeLocation && (searchQuery || activeFilter !== "ALL")) {
      if (filteredPoints.length > 0) {
        const bounds = L.latLngBounds(filteredPoints.map((p: any) => [p.lat, p.lng]));
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true, duration: 1.5 });
      }
    } else if (!activeLocation && !searchQuery && activeFilter === "ALL") {
      // Reset view to default
      map.flyTo([23.2599, 77.4126], 12, { animate: true, duration: 1.5 });
    }
  }, [filteredPoints, searchQuery, activeFilter, activeLocation, map]);

  return null;
}

export default function CropWatchMap() {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguageStore();
  const { riskPoints, addRiskPoint } = useFarmerStore();
  const [activeLocation, setActiveLocation] = useState<any | null>(null);
  
  // Interactive states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "HIGH" | "MONITORING">("ALL");
  
  // Reporting states
  const [isReporting, setIsReporting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Add hover effect css for custom chip icons
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-chip-icon > div:hover {
        transform: translateY(-4px) scale(1.05);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
      }
      .leaflet-container { background: #dde3ea !important; }
      .leaflet-tile { filter: saturate(0.6) brightness(1.02); }
      .leaflet-control-zoom { display: none; }
      @keyframes pulse-blob {
        0% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(1.02); }
        100% { opacity: 0.2; transform: scale(1); }
      }
      .risk-blob {
        animation: pulse-blob 4s infinite ease-in-out;
        transform-origin: center;
      }
    `;
    document.head.appendChild(style);
  }, []);

  if (!mounted) {
    return null;
  }

  const filteredPoints = riskPoints.filter(p => {
    // Text search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const textMatch = p.en.name.toLowerCase().includes(q) || 
                        p.en.disease.toLowerCase().includes(q) ||
                        p.hi.name.includes(q) || 
                        p.hi.disease.includes(q);
      if (!textMatch) return false;
    }
    // Button filter
    if (activeFilter === "HIGH" && p.riskLevel !== "HIGH") return false;
    if (activeFilter === "MONITORING" && p.riskLevel === "HIGH") return false; // Show Medium/Low
    return true;
  });

  const highRiskCount = riskPoints.filter(p => p.riskLevel === 'HIGH').length;

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Photo selected/taken, now fetch location
      setIsGettingLocation(true);
      
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // Create a new user-reported risk point
            const newReport = {
              id: Date.now(), // Unique ID
              lat: latitude,
              lng: longitude,
              riskScore: 0.5, // Default medium risk for manual reports pending analysis
              riskLevel: "MEDIUM",
              temp: "34.0°C",
              rain: "310mm",
              predictedCases: 1,
              radius: 200,
              color: "#C8800F", // Orange/Medium
              en: { name: "User Reported Issue", state: "Current Location", disease: "Pending Analysis", cropType: "Unknown" },
              hi: { name: "उपयोगकर्ता द्वारा रिपोर्ट की गई समस्या", state: "वर्तमान स्थान", disease: "विश्लेषण लंबित", cropType: "अज्ञात" }
            };

            addRiskPoint(newReport);
            setIsGettingLocation(false);
            setIsReporting(false);
            setActiveLocation(newReport); // Auto open the new report's details
          },
          (error) => {
            console.error("Error getting location:", error);
            alert("Could not fetch your location. Please ensure location permissions are enabled.");
            setIsGettingLocation(false);
          },
          { enableHighAccuracy: true }
        );
      } else {
        alert("Geolocation is not supported by your browser");
        setIsGettingLocation(false);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-[#dde3ea] overflow-hidden">
      
      {/* ─── FLOATING HEADER (EPISHIELD STYLE) ─── */}
      <div className="absolute top-20 md:top-28 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-3 w-full px-4 pointer-events-none">
        
        {/* Main Branding Pill */}
        <div className="flex items-center gap-4 bg-white/70 backdrop-blur-2xl border border-white/60 rounded-full px-4 py-2.5 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1A4731] flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-[15px] text-text leading-none tracking-wide">CropWatch</h1>
              <p className="font-mono text-[8px] text-muted tracking-widest uppercase mt-0.5">Predictive Intelligence</p>
            </div>
          </div>
          
          <div className="w-[1px] h-8 bg-black/10 mx-2" />
          
          <div className="flex items-center gap-2 px-2">
            <span className="font-mono text-[10px] uppercase font-bold text-primary tracking-widest">Live Engine</span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(26,71,49,0.6)]" />
          </div>
        </div>

        {/* Data Ribbon */}
        <div className="flex items-center bg-white/50 backdrop-blur-xl border border-white/40 rounded-2xl px-6 py-2 shadow-md pointer-events-auto">
          <div className="flex items-center gap-2 px-4 border-r border-black/5">
            <span className="font-mono text-sm font-bold text-text">{riskPoints.length}</span>
            <span className="font-mono text-[9px] uppercase text-muted tracking-widest">Active Nodes</span>
          </div>
          <div className="flex items-center gap-2 px-4">
            <span className="font-mono text-sm font-bold text-error">{highRiskCount}</span>
            <span className="font-mono text-[9px] uppercase text-error/80 tracking-widest">Critical Zones</span>
          </div>
        </div>
      </div>

      {/* ─── FLOATING SEARCH ─── */}
      <div className="absolute top-44 left-6 z-[1000] pointer-events-auto hidden md:block">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? "Search farms or diseases..." : "खेत या बीमारी खोजें..."} 
            className="w-72 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl py-3 pl-10 pr-4 text-sm font-body shadow-lg focus:outline-none focus:border-primary/40 transition-colors text-text"
          />
        </div>
      </div>

      {/* ─── MAP LAYER ─── */}
      <MapContainer 
        center={[23.2599, 77.4126]} 
        zoom={12} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <MapUpdater 
          activeLocation={activeLocation} 
          filteredPoints={filteredPoints} 
          searchQuery={searchQuery} 
          activeFilter={activeFilter} 
        />
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution=""
        />

        {filteredPoints.map((point) => (
          <div key={`group-${point.id}`}>
            <Circle 
              center={[point.lat, point.lng]}
              radius={point.radius}
              pathOptions={{ 
                color: point.color, 
                fillColor: point.color, 
                fillOpacity: point.riskLevel === 'HIGH' ? 0.35 : 0.2, 
                weight: point.riskLevel === 'HIGH' ? 2 : 1,
                className: 'risk-blob'
              }} 
            />
            
            {/* Pill Marker */}
            <Marker 
              position={[point.lat, point.lng]}
              icon={createChipIcon(point[language].name, point.riskScore, point.color)}
              eventHandlers={{
                click: () => setActiveLocation(point),
              }}
            />
          </div>
        ))}
      </MapContainer>

      {/* ─── FLOATING LEGEND ─── */}
      <div className="absolute bottom-24 md:bottom-8 left-4 md:left-8 z-[1000] bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/60 min-w-[200px] pointer-events-auto">
        <h4 className="font-mono text-[9px] tracking-[0.2em] text-primary uppercase mb-4 border-b border-black/5 pb-2">
          {language === 'en' ? 'Risk Intensity' : 'जोखिम तीव्रता'}
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-2 rounded-full bg-[#C53030]"></span>
            <span className="font-mono text-[10px] font-bold text-text uppercase tracking-widest">{language === 'en' ? 'Critical' : 'गंभीर'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-2 rounded-full bg-[#C8800F]"></span>
            <span className="font-mono text-[10px] font-bold text-text uppercase tracking-widest">{language === 'en' ? 'Warning' : 'चेतावनी'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-2 rounded-full bg-[#1A6B45]"></span>
            <span className="font-mono text-[10px] font-bold text-text uppercase tracking-widest">{language === 'en' ? 'Safe' : 'सुरक्षित'}</span>
          </div>
        </div>
      </div>

      {/* ─── FLOATING REPORT BUTTON ─── */}
      <div className="absolute top-44 md:top-28 right-4 md:right-8 z-[1000] pointer-events-auto">
        <button 
          onClick={() => setIsReporting(true)}
          className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-2 font-medium transition-transform hover:scale-105"
        >
          <Camera className="w-5 h-5" />
          <span className="hidden md:inline">{language === 'en' ? "Report Issue" : "समस्या दर्ज करें"}</span>
        </button>
      </div>

      {/* ─── FLOATING FILTERS ─── */}
      <div className="absolute bottom-24 md:bottom-8 right-4 md:right-8 z-[1000] flex flex-col gap-2 pointer-events-auto">
        <button 
          onClick={() => setActiveFilter("ALL")}
          className={`px-5 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest backdrop-blur-md shadow-sm transition-colors ${activeFilter === "ALL" ? "bg-primary/10 text-primary border border-primary/20" : "bg-white/70 text-muted border border-white/60 hover:bg-white/90"}`}
        >
          ALL REGIONS
        </button>
        <button 
          onClick={() => setActiveFilter("HIGH")}
          className={`px-5 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest backdrop-blur-md shadow-sm transition-colors ${activeFilter === "HIGH" ? "bg-error/10 text-error border border-error/20" : "bg-white/70 text-muted border border-white/60 hover:bg-white/90"}`}
        >
          HIGH RISK
        </button>
        <button 
          onClick={() => setActiveFilter("MONITORING")}
          className={`px-5 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest backdrop-blur-md shadow-sm transition-colors ${activeFilter === "MONITORING" ? "bg-secondary/10 text-secondary border border-secondary/20" : "bg-white/70 text-muted border border-white/60 hover:bg-white/90"}`}
        >
          MONITORING
        </button>
      </div>

      {/* ─── SLIDING DETAIL PANEL ─── */}
      <LocationDetailPanel 
        location={activeLocation} 
        language={language} 
        onClose={() => setActiveLocation(null)} 
      />

      {/* ─── REPORT ISSUE MODAL ─── */}
      {isReporting && (
        <div className="absolute inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => !isGettingLocation && setIsReporting(false)}
              className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-display font-bold text-text mb-2">
              {language === 'en' ? "Report a Crop Issue" : "फसल की समस्या दर्ज करें"}
            </h3>
            <p className="text-sm text-muted mb-8">
              {language === 'en' 
                ? "Take a picture of the affected crop. We will securely tag your GPS location to help map the spread."
                : "प्रभावित फसल की तस्वीर लें। प्रसार को मैप करने में मदद के लिए हम आपके जीपीएस स्थान को सुरक्षित रूप से टैग करेंगे।"}
            </p>

            <div className="relative">
              <input 
                type="file"
                accept="image/*"
                capture="environment"
                id="camera-input"
                className="hidden"
                onChange={handlePhotoCapture}
                disabled={isGettingLocation}
              />
              <label 
                htmlFor="camera-input"
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-white transition-all cursor-pointer ${isGettingLocation ? 'bg-primary/70' : 'bg-primary hover:bg-primary/90 hover:shadow-lg'}`}
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === 'en' ? "Getting Location..." : "स्थान प्राप्त कर रहा है..."}
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    {language === 'en' ? "Open Camera & Geotag" : "कैमरा खोलें और जियोटैग करें"}
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
