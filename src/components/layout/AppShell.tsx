"use client";

import React, { useEffect } from "react";
import BottomNav from "./BottomNav";
import TopBar from "./TopBar";
import { useFarmerStore } from "@/store/farmerStore";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { location, setLocation } = useFarmerStore();

  return (
    <div className="flex flex-col h-screen bg-mist overflow-hidden">
      <TopBar />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="mx-auto max-w-7xl w-full">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
