"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function MiniMap({ lat, lng }: { lat: number, lng: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add custom icon styling
    const style = document.createElement("style");
    style.innerHTML = `
      .mini-pin {
        width: 16px;
        height: 16px;
        background-color: #1A4731;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 4px rgba(26, 71, 49, 0.2);
        animation: pulse-ring 2s infinite;
      }
      @keyframes pulse-ring {
        0% { box-shadow: 0 0 0 0 rgba(26, 71, 49, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(26, 71, 49, 0); }
        100% { box-shadow: 0 0 0 0 rgba(26, 71, 49, 0); }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  if (!mounted) return <div className="h-32 w-full bg-black/5 rounded-2xl animate-pulse" />;

  const customIcon = L.divIcon({
    className: "mini-pin",
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  return (
    <div className="h-32 w-full rounded-2xl overflow-hidden shadow-inner border border-black/5 relative z-10">
      <MapContainer 
        center={[lat, lng]} 
        zoom={14} 
        style={{ height: "100%", width: "100%", zIndex: 1 }} 
        zoomControl={false} 
        dragging={false} 
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <Marker position={[lat, lng]} icon={customIcon} />
      </MapContainer>
      
      {/* Coordinates Overlay */}
      <div className="absolute bottom-2 left-2 z-[1000] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-primary font-semibold border border-black/5 shadow-sm pointer-events-none">
        {lat.toFixed(5)}, {lng.toFixed(5)}
      </div>
    </div>
  );
}
