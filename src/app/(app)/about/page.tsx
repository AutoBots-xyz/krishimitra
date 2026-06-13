"use client";

import { Info, Users, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <div className="glass rounded-2xl p-8 shadow-sm text-center border border-primary/10 mb-8">
        <p className="eyebrow mb-2">ABOUT US</p>
        <h1 className="font-display text-[36px] text-primary font-bold mb-3">KrishiMitra</h1>
        <p className="font-body font-light text-muted text-lg">Learn more about the project and the team behind it.</p>
      </div>

      <div className="space-y-4">
        <div className="glass rounded-xl p-6 border border-primary/10 flex items-start gap-5 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Info className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-[20px] text-primary font-bold mb-1">Our Mission</h3>
            <p className="font-body font-light text-text leading-relaxed">
              KrishiMitra is built to empower Indian farmers with cutting-edge AI and satellite technology. We strive to provide real-time, hyperlocal agricultural insights that maximize yield and protect against crop diseases.
            </p>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-primary/10 flex items-start gap-5 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-[20px] text-primary font-bold mb-1">The AUTOBOTS Team</h3>
            <p className="font-body font-light text-text leading-relaxed">
              We are a team of passionate developers dedicated to building the future of farming. The "AUTOBOTS" team is headquartered in Bhopal, working closely with local farming communities.
            </p>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-primary/10 flex items-start gap-5 hover:-translate-y-1 transition-transform border-l-4 border-l-success">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-success" />
          </div>
          <div>
            <h3 className="font-display text-[20px] text-primary font-bold mb-1">Privacy & Trust</h3>
            <p className="font-body font-light text-text leading-relaxed">
              Your farm data, coordinates, and crop images are processed securely and never sold to third parties. Our AI models act purely as an objective advisory tool.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
