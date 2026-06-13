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
      // Auto-consent
      handleConsent(true);
    }
  }, [countdown]);

  const handleConsent = (agreed: boolean) => {
    // TODO: save consent to disease_reports in database
    // supabase.from('disease_reports').update({ consented_to_share: agreed, consent_method: 'explicit', consent_timestamp: new Date().toISOString() })
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-high overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="h-1 bg-neutral-100 w-full">
          <div 
            className="h-full bg-harvest transition-all duration-1000 ease-linear" 
            style={{ width: `${(countdown / 4) * 100}%` }}
          ></div>
        </div>
        
        <div className="p-6 text-center">
          <div className="text-4xl mb-4">🌾</div>
          <h3 className="font-display text-heading-2 text-soil mb-2">Help your community</h3>
          <p className="text-sm text-neutral-800 mb-6">
            Share this detection anonymously with CropWatch to help nearby farmers. No personal data is shared.
          </p>
          
          <div className="text-xs text-neutral-400 mb-4">
            Auto-sharing in [{countdown}]...
          </div>
          
          <div className="flex flex-col gap-2">
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
