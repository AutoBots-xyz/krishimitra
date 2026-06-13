"use client";

import React, { useEffect } from "react";
import BottomNav from "./BottomNav";
import TopBar from "./TopBar";
import { useFarmerStore } from "@/store/farmerStore";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { location, setLocation } = useFarmerStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      
      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-24 md:pt-32 md:pb-8 md:px-8 relative">
        <div className="mx-auto max-w-5xl w-full">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
