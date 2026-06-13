"use client";

import { useState } from "react";
import { UploadCloud, Camera, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import DiseaseReportCard from "@/features/disease-detection/components/DiseaseReportCard";
import ConsentPopup from "@/features/cropwatch/components/ConsentPopup";
import { useFarmerStore } from "@/store/farmerStore";

export default function ScanPage() {
  const { setLocation } = useFarmerStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setReport(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);

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

      // Prompt for location access right after detection for CropWatch mapping
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (err) => console.warn("Location access denied or failed:", err.message)
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-4">
        <h1 className="font-display text-heading-1 text-soil">Scan Crop</h1>
        <p className="text-neutral-800">Upload an image of your crop to detect diseases instantly.</p>
      </div>

      {!report && (
        <div className="bg-white rounded-xl shadow-low border border-neutral-100 p-6">
          <div className="border-2 border-dashed border-neutral-400 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-mist/50">
            {preview ? (
              <img src={preview} alt="Crop preview" className="h-48 object-contain rounded-md mb-4" />
            ) : (
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-harvest">
                <Camera className="w-8 h-8" />
              </div>
            )}
            
            <p className="text-soil font-medium mb-1">
              {preview ? "Image selected" : "Tap to scan or upload crop photo"}
            </p>
            <p className="text-sm text-neutral-400 mb-6">Supports JPG, PNG (Max 5MB)</p>
            
            <div className="relative">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant={preview ? "outline" : "default"}>
                {preview ? "Choose another" : "Select Image"}
              </Button>
            </div>
          </div>

          {preview && (
            <div className="mt-6">
              <Button 
                onClick={handleAnalyze} 
                className="w-full" 
                disabled={analyzing}
              >
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Analyzing with AI Agronomist...
                  </span>
                ) : (
                  "Analyze Crop"
                )}
              </Button>
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-alert-red/10 border border-alert-red/20 rounded-lg text-sm text-alert-red text-center">
              {error}
            </div>
          )}
        </div>
      )}

      {report && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <DiseaseReportCard report={report} />
          
          <div className="mt-6 flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => { setReport(null); setPreview(null); setFile(null); }}>
              Scan Another
            </Button>
            <Button className="flex-1">
              Save to History
            </Button>
          </div>
        </div>
      )}

      {showConsent && (
        <ConsentPopup onClose={() => setShowConsent(false)} />
      )}
    </div>
  );
}
