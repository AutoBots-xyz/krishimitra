"use client";

import { useState } from "react";
import { Leaf, UploadCloud, ArrowRight, Zap, ScanLine, Camera, Image as ImageIcon, MapPin, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import DiseaseReportCard from "@/features/disease-detection/components/DiseaseReportCard";
import ConsentPopup from "@/features/cropwatch/components/ConsentPopup";
import { useFarmerStore } from "@/store/farmerStore";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const MiniMap = dynamic(() => import("@/components/map/MiniMap"), { ssr: false });

export default function ScanPage() {
  const router = useRouter();
  const { setLocation, addRiskPoint } = useFarmerStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geotagLocation, setGeotagLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGeotagging, setIsGeotagging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setReport(null);
      
      // Auto-geotag on selection
      setIsGeotagging(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setGeotagLocation(loc);
            setLocation(loc); // Update global store
            setIsGeotagging(false);
          },
          () => {
            setIsGeotagging(false); // Ignore errors silently for now to not block UX
          }
        );
      } else {
        setIsGeotagging(false);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);

    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/disease/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Analysis failed (${res.status})`);

      const data = await res.json();
      setReport(data);
      setShowConsent(true);

      if (typeof window !== "undefined" && "geolocation" in navigator && !geotagLocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {}
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveReport = () => {
    // If we have a report, we map it back to the map as a Risk Point
    if (report) {
      const isHighRisk = report.diseaseName.includes("Rust") || report.diseaseName.includes("Blast") || report.diseaseName.includes("Blight") || report.confidence > 0.8;
      const color = isHighRisk ? "#C53030" : "#C8800F";
      
      // Default to Bhopal coordinates if they skipped geotagging
      const finalLoc = geotagLocation || { lat: 23.26, lng: 77.42 };

      const newPoint = {
        id: Date.now(),
        lat: finalLoc.lat,
        lng: finalLoc.lng,
        riskScore: report.confidence || 0.8,
        riskLevel: isHighRisk ? "HIGH" : "MEDIUM",
        temp: "34.0°C", 
        rain: "310mm",
        predictedCases: 1,
        radius: 300,
        color: color,
        en: { 
          name: "My Scanned Field", 
          state: "Madhya Pradesh", 
          disease: report.diseaseName || "Detected Issue", 
          cropType: "Unknown" 
        },
        hi: { 
          name: "मेरा स्कैन किया गया खेत", 
          state: "मध्य प्रदेश", 
          disease: report.diseaseName || "बीमारी", 
          cropType: "अज्ञात" 
        }
      };
      
      addRiskPoint(newPoint);
      
      // Navigate to Map to see it
      router.push("/cropwatch");
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-16">
      
      {/* Header */}
      <div className="mb-8">
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-primary/60 block mb-3">
          Crop Analysis
        </span>
        <h1 className="font-display font-semibold text-primary text-4xl md:text-5xl leading-[1.1] mb-3">
          Scan your field.
        </h1>
        <p className="text-muted/80 text-lg">
          Upload a clear photo of the affected leaf or crop for an instant AI-powered diagnosis.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!report ? (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Upload Zone */}
            <div className="relative overflow-hidden rounded-[2rem] p-1"
              style={{
                background: "linear-gradient(135deg, #e8f5ee 0%, #d4eddd 100%)",
                boxShadow: "0 20px 40px rgba(26,71,49,0.08)",
              }}>
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1A4731 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              
              <div className={`relative rounded-[1.75rem] border-2 border-dashed border-primary/20 bg-white/40 backdrop-blur-md transition-all duration-300 ${preview ? 'p-4' : 'p-12 md:p-20 flex flex-col items-center justify-center min-h-[360px]'}`}>
                
                {preview ? (
                  <div className="flex flex-col items-center w-full">
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg mb-4">
                      <Image src={preview} alt="Crop preview" fill className="object-cover" />
                      {analyzing && (
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                          <ScanLine className="w-12 h-12 mb-4 animate-pulse" />
                          <span className="font-mono text-sm tracking-widest uppercase animate-pulse">Running Analysis...</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Geotagging Status & MiniMap */}
                    <div className="w-full mb-6">
                      {isGeotagging ? (
                        <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/5 p-3 rounded-xl">
                          <Loader2 className="w-4 h-4 animate-spin" /> Fetching GPS location...
                        </div>
                      ) : geotagLocation ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-primary font-medium">
                            <MapPin className="w-4 h-4" /> Geotagged Successfully
                          </div>
                          <MiniMap lat={geotagLocation.lat} lng={geotagLocation.lng} />
                        </div>
                      ) : null}
                    </div>

                    {!analyzing && (
                      <label className="w-full block text-center py-3 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors cursor-pointer">
                        Choose a different photo
                        <input 
                          type="file" accept="image/*" 
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 text-primary">
                      <ScanLine className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <p className="font-display text-2xl text-primary font-medium mb-2 text-center">
                      Diagnose your crop
                    </p>
                    <p className="text-sm text-primary/60 text-center mb-8 max-w-[240px]">
                      Take a live picture of the crop or upload from your gallery to geotag and analyze.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                      <label className="flex-1 flex flex-col items-center justify-center gap-2 py-4 px-2 bg-[#1A4731] text-white rounded-xl font-medium shadow-md hover:bg-[#153a27] transition-all cursor-pointer">
                        <Camera className="w-5 h-5 text-white" />
                        <span>Scan Crop</span>
                        <input 
                          type="file" accept="image/*" capture="environment" 
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      <label className="flex-1 flex flex-col items-center justify-center gap-2 py-4 px-2 bg-white text-primary border-2 border-primary/20 rounded-xl font-medium hover:bg-primary/5 transition-all cursor-pointer">
                        <ImageIcon className="w-5 h-5" />
                        <span>Upload Image</span>
                        <input 
                          type="file" accept="image/*" 
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Analyze CTA */}
            {preview && !analyzing && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onClick={handleAnalyze}
                className="w-full flex items-center justify-between rounded-2xl px-6 py-5 group transition-all duration-300 hover:scale-[1.01]"
                style={{ background: "linear-gradient(90deg, #1A4731 0%, #163d29 100%)", boxShadow: "0 12px 32px rgba(26,71,49,0.3)" }}
              >
                <div className="text-left">
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/50 mb-1">Step 2</p>
                  <p className="font-display font-semibold text-white text-xl">Analyze with AI Expert</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </motion.button>
            )}

            {error && (
              <div className="p-4 bg-error/5 border border-error/20 rounded-xl text-sm text-error font-medium text-center">
                {error}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <DiseaseReportCard report={report} />
            
            <div className="flex gap-3">
              <button 
                onClick={() => { setReport(null); setPreview(null); setFile(null); setGeotagLocation(null); }}
                className="flex-1 py-4 text-primary bg-primary/5 hover:bg-primary/10 rounded-2xl font-medium transition-colors"
              >
                Scan Another
              </button>
              <button 
                onClick={handleSaveReport}
                className="flex-1 py-4 text-white bg-primary hover:bg-[#153a27] rounded-2xl font-medium transition-colors shadow-md"
              >
                Save to Map
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showConsent && (
        <ConsentPopup onClose={() => setShowConsent(false)} />
      )}
    </div>
  );
}
