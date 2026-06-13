"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLanguageStore } from "@/store/languageStore";

const mockRiskPoints = [
  { id: 1, lat: 23.5251, lng: 77.8081, riskScore: 0.56, riskLevel: "HIGH", temp: "36.8°C", rain: "295mm", predictedCases: 48, radius: 25000, color: "#6366f1", 
    en: { name: "Vidisha", state: "Madhya Pradesh", disease: "Wheat Rust", cropType: "Wheat" },
    hi: { name: "विदिशा", state: "मध्य प्रदेश", disease: "गेहूं रस्ट", cropType: "गेहूं" } },
  { id: 2, lat: 23.2599, lng: 77.4126, riskScore: 0.47, riskLevel: "MEDIUM", temp: "34.2°C", rain: "310mm", predictedCases: 21, radius: 20000, color: "#818cf8",
    en: { name: "Bhopal", state: "Madhya Pradesh", disease: "Rice Blast", cropType: "Rice" },
    hi: { name: "भोपाल", state: "मध्य प्रदेश", disease: "चावल ब्लास्ट", cropType: "चावल" } },
  { id: 3, lat: 23.8388, lng: 78.7378, riskScore: 0.55, riskLevel: "HIGH", temp: "35.1°C", rain: "280mm", predictedCases: 42, radius: 22000, color: "#6366f1",
    en: { name: "Sagar", state: "Madhya Pradesh", disease: "Late Blight", cropType: "Potato" },
    hi: { name: "सागर", state: "मध्य प्रदेश", disease: "लेट ब्लाइट", cropType: "आलू" } },
  { id: 4, lat: 23.1815, lng: 79.9864, riskScore: 0.48, riskLevel: "MEDIUM", temp: "33.5°C", rain: "340mm", predictedCases: 19, radius: 21000, color: "#818cf8",
    en: { name: "Jabalpur", state: "Madhya Pradesh", disease: "Powdery Mildew", cropType: "Peas" },
    hi: { name: "जबलपुर", state: "मध्य प्रदेश", disease: "पाउडरी मिल्ड्यू", cropType: "मटर" } },
  { id: 5, lat: 22.9676, lng: 76.0534, riskScore: 0.45, riskLevel: "MEDIUM", temp: "36.0°C", rain: "250mm", predictedCases: 14, radius: 18000, color: "#c7d2fe",
    en: { name: "Dewas", state: "Madhya Pradesh", disease: "Leaf Spot", cropType: "Groundnut" },
    hi: { name: "देवास", state: "मध्य प्रदेश", disease: "लीफ स्पॉट", cropType: "मूंगफली" } },
  { id: 6, lat: 22.7196, lng: 75.8577, riskScore: 0.51, riskLevel: "HIGH", temp: "35.8°C", rain: "270mm", predictedCases: 38, radius: 24000, color: "#6366f1",
    en: { name: "Indore", state: "Madhya Pradesh", disease: "Cotton Bollworm", cropType: "Cotton" },
    hi: { name: "इंदौर", state: "मध्य प्रदेश", disease: "कॉटन बॉलवर्म", cropType: "कपास" } },
  { id: 7, lat: 24.5769, lng: 80.8280, riskScore: 0.60, riskLevel: "HIGH", temp: "37.1°C", rain: "210mm", predictedCases: 55, radius: 28000, color: "#4f46e5",
    en: { name: "Satna", state: "Madhya Pradesh", disease: "Stem Rot", cropType: "Soybean" },
    hi: { name: "सतना", state: "मध्य प्रदेश", disease: "स्टेम रोट", cropType: "सोयाबीन" } },
  { id: 8, lat: 24.5373, lng: 81.2981, riskScore: 0.57, riskLevel: "HIGH", temp: "36.5°C", rain: "230mm", predictedCases: 49, radius: 26000, color: "#6366f1",
    en: { name: "Rewa", state: "Madhya Pradesh", disease: "Wheat Rust", cropType: "Wheat" },
    hi: { name: "रीवा", state: "मध्य प्रदेश", disease: "गेहूं रस्ट", cropType: "गेहूं" } },
  { id: 9, lat: 26.2183, lng: 78.1828, riskScore: 0.32, riskLevel: "LOW", temp: "39.2°C", rain: "120mm", predictedCases: 4, radius: 15000, color: "#c7d2fe",
    en: { name: "Gwalior", state: "Madhya Pradesh", disease: "Mustard Aphid", cropType: "Mustard" },
    hi: { name: "ग्वालियर", state: "मध्य प्रदेश", disease: "मस्टर्ड एफिड", cropType: "सरसों" } },
  { id: 10, lat: 23.1793, lng: 75.7849, riskScore: 0.53, riskLevel: "HIGH", temp: "36.1°C", rain: "260mm", predictedCases: 41, radius: 23000, color: "#6366f1",
    en: { name: "Ujjain", state: "Madhya Pradesh", disease: "Soybean Rust", cropType: "Soybean" },
    hi: { name: "उज्जैन", state: "मध्य प्रदेश", disease: "सोयाबीन रस्ट", cropType: "सोयाबीन" } },
  { id: 11, lat: 21.8257, lng: 76.3526, riskScore: 0.41, riskLevel: "MEDIUM", temp: "38.5°C", rain: "180mm", predictedCases: 12, radius: 18000, color: "#818cf8",
    en: { name: "Khandwa", state: "Madhya Pradesh", disease: "Cotton Bollworm", cropType: "Cotton" },
    hi: { name: "खंडवा", state: "मध्य प्रदेश", disease: "कॉटन बॉलवर्म", cropType: "कपास" } },
  { id: 12, lat: 22.0574, lng: 78.9382, riskScore: 0.49, riskLevel: "MEDIUM", temp: "32.4°C", rain: "380mm", predictedCases: 24, radius: 21000, color: "#818cf8",
    en: { name: "Chhindwara", state: "Madhya Pradesh", disease: "Rice Blast", cropType: "Rice" },
    hi: { name: "छिंदवाड़ा", state: "मध्य प्रदेश", disease: "चावल ब्लास्ट", cropType: "चावल" } },
  { id: 13, lat: 23.2032, lng: 77.0844, riskScore: 0.58, riskLevel: "HIGH", temp: "34.5°C", rain: "305mm", predictedCases: 51, radius: 27000, color: "#4f46e5",
    en: { name: "Sehore", state: "Madhya Pradesh", disease: "Late Blight", cropType: "Tomato" },
    hi: { name: "सीहोर", state: "मध्य प्रदेश", disease: "लेट ब्लाइट", cropType: "टमाटर" } },
  { id: 14, lat: 22.7541, lng: 77.7289, riskScore: 0.62, riskLevel: "HIGH", temp: "33.8°C", rain: "410mm", predictedCases: 62, radius: 30000, color: "#4f46e5",
    en: { name: "Hoshangabad", state: "Madhya Pradesh", disease: "Wheat Rust", cropType: "Wheat" },
    hi: { name: "होशंगाबाद", state: "मध्य प्रदेश", disease: "गेहूं रस्ट", cropType: "गेहूं" } },
  { id: 15, lat: 23.3315, lng: 75.0367, riskScore: 0.38, riskLevel: "LOW", temp: "37.5°C", rain: "190mm", predictedCases: 8, radius: 16000, color: "#c7d2fe",
    en: { name: "Ratlam", state: "Madhya Pradesh", disease: "Leaf Spot", cropType: "Banana" },
    hi: { name: "रतलाम", state: "मध्य प्रदेश", disease: "लीफ स्पॉट", cropType: "केला" } },
  { id: 16, lat: 24.2713, lng: 80.1706, riskScore: 0.46, riskLevel: "MEDIUM", temp: "35.2°C", rain: "270mm", predictedCases: 17, radius: 19000, color: "#818cf8",
    en: { name: "Panna", state: "Madhya Pradesh", disease: "Powdery Mildew", cropType: "Grapes" },
    hi: { name: "पन्ना", state: "मध्य प्रदेश", disease: "पाउडरी मिल्ड्यू", cropType: "अंगूर" } },
  { id: 17, lat: 24.7438, lng: 78.8354, riskScore: 0.35, riskLevel: "LOW", temp: "38.1°C", rain: "150mm", predictedCases: 5, radius: 15000, color: "#c7d2fe",
    en: { name: "Tikamgarh", state: "Madhya Pradesh", disease: "Mustard Aphid", cropType: "Mustard" },
    hi: { name: "टीकमगढ़", state: "मध्य प्रदेश", disease: "मस्टर्ड एफिड", cropType: "सरसों" } },
  { id: 18, lat: 21.8129, lng: 80.1838, riskScore: 0.59, riskLevel: "HIGH", temp: "31.5°C", rain: "450mm", predictedCases: 53, radius: 26000, color: "#4f46e5",
    en: { name: "Balaghat", state: "Madhya Pradesh", disease: "Rice Blast", cropType: "Rice" },
    hi: { name: "बालाघाट", state: "मध्य प्रदेश", disease: "चावल ब्लास्ट", cropType: "चावल" } },
  { id: 19, lat: 24.6468, lng: 77.3168, riskScore: 0.44, riskLevel: "MEDIUM", temp: "36.8°C", rain: "240mm", predictedCases: 15, radius: 18000, color: "#818cf8",
    en: { name: "Guna", state: "Madhya Pradesh", disease: "Soybean Rust", cropType: "Soybean" },
    hi: { name: "गुना", state: "मध्य प्रदेश", disease: "सोयाबीन रस्ट", cropType: "सोयाबीन" } },
  { id: 20, lat: 21.9011, lng: 77.9022, riskScore: 0.50, riskLevel: "HIGH", temp: "33.1°C", rain: "350mm", predictedCases: 33, radius: 22000, color: "#6366f1",
    en: { name: "Betul", state: "Madhya Pradesh", disease: "Stem Rot", cropType: "Mustard" },
    hi: { name: "बैतूल", state: "मध्य प्रदेश", disease: "स्टेम रोट", cropType: "सरसों" } },
];

const createCustomIcon = (name: string, score: number, color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #334155; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); white-space: nowrap;">
      <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; display: inline-block;"></span>
      ${name} ${score.toFixed(2)}
    </div>`,
    iconSize: [100, 24],
    iconAnchor: [50, 12]
  });
};

export default function CropWatchMap() {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguageStore();

  useEffect(() => {
    setMounted(true);
    // Fix default marker icon issue in leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full bg-mist animate-pulse flex items-center justify-center text-neutral-400 rounded-xl">
        Loading Map...
      </div>
    );
  }

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-map border border-neutral-100">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-popup .leaflet-popup-content-wrapper {
          background: #334155 !important;
          border-radius: 16px;
          padding: 0;
          overflow: hidden;
          border: 1px solid #1e293b;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1);
        }
        .custom-popup .leaflet-popup-tip {
          background: #334155 !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0 !important;
          width: 240px !important;
        }
        .custom-popup .leaflet-popup-close-button {
          color: #94a3b8 !important;
          padding: 4px;
        }
      `}} />

      <MapContainer 
        center={[23.6, 78.5]} 
        zoom={7} 
        style={{ height: "100%", width: "100%", background: "#f8fafc" }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {mockRiskPoints.map((point) => {
          const t = point[language];
          const riskLevelTranslated = language === 'en' 
            ? point.riskLevel 
            : (point.riskLevel === 'HIGH' ? 'उच्च' : point.riskLevel === 'MEDIUM' ? 'मध्यम' : 'निम्न');
            
          return (
            <div key={point.id}>
              <Circle
                center={[point.lat, point.lng]}
                radius={point.radius}
                pathOptions={{
                  fillColor: point.color,
                  fillOpacity: 0.25,
                  color: point.color,
                  weight: 1,
                  opacity: 0.1
                }}
              />
              <Marker 
                position={[point.lat, point.lng]}
                icon={createCustomIcon(t.name, point.riskScore, point.color)}
              >
                <Popup className="custom-popup">
                  <div className="bg-[#334155] text-white p-6">
                    <h3 className="font-bold text-xl mb-0">{t.name}</h3>
                    <p className="text-[10px] text-slate-400 mb-5 uppercase tracking-wider">{t.state} - {language === 'en' ? 'semi-arid' : 'अर्ध-शुष्क'}</p>
                    
                    <div className="mb-6 border-b border-slate-600 pb-5">
                      <span className={`text-5xl font-black tracking-tight ${point.riskLevel === 'HIGH' ? 'text-rose-400' : 'text-indigo-400'}`}>
                        {point.riskScore}
                      </span>
                      <span className={`block text-[11px] uppercase font-bold tracking-widest mt-2 ${point.riskLevel === 'HIGH' ? 'text-rose-400' : 'text-indigo-400'}`}>
                        {riskLevelTranslated} {language === 'en' ? 'RISK' : 'जोखिम'}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm text-slate-300">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{language === 'en' ? 'Crop Threat' : 'फसल का खतरा'}</span> 
                        <span className="font-medium text-white">{t.disease}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-slate-400">{language === 'en' ? 'Affected Crop' : 'प्रभावित फसल'}</span> 
                        <span className="font-medium text-white">{t.cropType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{language === 'en' ? 'Temp' : 'तापमान'}</span> 
                        <span className="font-medium text-white">{point.temp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{language === 'en' ? 'Rain' : 'बारिश'}</span> 
                        <span className="font-medium text-white">{point.rain}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-600">
                        <span className="text-slate-400">{language === 'en' ? 'Confirmed detected cases' : 'पुष्ट मामलों का पता चला'}</span> 
                        <span className="font-medium text-amber-400">{point.predictedCases} {language === 'en' ? 'farms' : 'खेत'}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-6 left-6 z-[400] bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl text-xs border border-white min-w-[200px]">
        <h4 className="font-bold text-[11px] tracking-widest text-slate-400 uppercase mb-4">
          {language === 'en' ? 'Risk Intensity' : 'जोखिम तीव्रता'}
        </h4>
        <div className="space-y-4 font-semibold text-slate-600">
          <div className="flex items-center gap-3">
            <span className="w-10 h-2.5 rounded-full bg-[#6366f1]"></span>
            {language === 'en' ? 'HIGH - Critical' : 'उच्च - गंभीर'}
          </div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-2.5 rounded-full bg-[#818cf8]"></span>
            {language === 'en' ? 'MEDIUM - Watch' : 'मध्यम - निगरानी'}
          </div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-2.5 rounded-full bg-[#c7d2fe]"></span>
            {language === 'en' ? 'LOW - Routine' : 'निम्न - सामान्य'}
          </div>
        </div>
      </div>
    </div>
  );
}
