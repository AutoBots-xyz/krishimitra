"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function ConsentPopup({ onClose }: { onClose: () => void }) {
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleConsent(true);
    }
  }, [countdown]);

  const handleConsent = (agreed: boolean) => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="glass max-w-sm w-full rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="h-[4px] bg-primary/10 w-full">
          <div 
            className="h-full bg-secondary rounded-full transition-all duration-300 ease-linear" 
            style={{ width: `${(countdown / 4) * 100}%` }}
          ></div>
        </div>
        
        <div className="p-6 md:p-8 text-center flex flex-col items-center">
          <div className="text-[48px] mb-4 leading-none">🌾</div>
          <h3 className="font-display text-[24px] text-primary font-bold mb-3 leading-tight">Help your community</h3>
          <p className="font-body font-light text-[14px] text-muted mb-6 leading-relaxed">
            Share this detection anonymously with CropWatch to help nearby farmers. No personal data is shared.
          </p>
          
          <div className="font-mono text-[12px] text-muted mb-6 uppercase tracking-widest">
            Auto-sharing in [{countdown}]
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            <Button onClick={() => handleConsent(true)} className="w-full">
              Share Anonymously
            </Button>
            <Button variant="ghost" onClick={() => handleConsent(false)} className="w-full">
              Don't share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
