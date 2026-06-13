"use client";

import dynamic from "next/dynamic";
import { Search, Filter, ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

// Dynamically import the map to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/map/CropWatchMap"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full bg-[#dde3ea] flex items-center justify-center font-mono text-sm text-primary tracking-widest uppercase">
      Loading Predictive Engine...
    </div>
  ),
});

export default function CropWatchPage() {
  const { language } = useLanguageStore();

  return (
    <div className="fixed inset-0 z-0 bg-[#dde3ea]">
      {/* MAP LAYER (Underneath everything) */}
      <Map />
    </div>
  );
}
