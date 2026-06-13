"use client";

import dynamic from "next/dynamic";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Dynamically import the map to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/map/CropWatchMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-mist animate-pulse rounded-xl flex items-center justify-center text-neutral-400">
      Loading Map...
    </div>
  ),
});

export default function CropWatchPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-130px)] md:h-[calc(100vh-100px)] -m-4 md:-m-8">
      {/* Header bar */}
      <div className="bg-white px-4 py-3 shadow-sm z-10 flex justify-between items-center shrink-0">
        <div>
          <h1 className="font-display text-heading-2 text-soil">CropWatch</h1>
          <p className="text-xs text-neutral-400">Early Warning System</p>
        </div>
        <Button variant="outline" size="sm" className="flex gap-2">
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-0">
        <Map />
      </div>
    </div>
  );
}
