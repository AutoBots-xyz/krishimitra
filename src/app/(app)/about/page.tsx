"use client";

import { Info, Users, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="font-display text-heading-1 text-soil mb-2">About Us</h1>
        <p className="text-neutral-800">Learn more about KrishiMitra and the team behind it.</p>
      </div>

      <div className="bg-white rounded-xl shadow-high border border-neutral-100 p-8 space-y-8">
        <div className="flex items-start gap-4 text-soil">
          <div className="w-12 h-12 rounded-full bg-mist flex items-center justify-center shrink-0">
            <Info className="w-6 h-6 text-indigo" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Our Mission</h3>
            <p className="text-neutral-800 mt-1 leading-relaxed">
              KrishiMitra is built to empower Indian farmers with cutting-edge AI and satellite technology. We strive to provide real-time, hyperlocal agricultural insights that maximize yield and protect against crop diseases.
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-neutral-100"></div>

        <div className="flex items-start gap-4 text-soil">
          <div className="w-12 h-12 rounded-full bg-mist flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-indigo" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">The AUTOBOTS Team</h3>
            <p className="text-neutral-800 mt-1 leading-relaxed">
              We are a team of passionate developers dedicated to building the future of farming. The "AUTOBOTS" team is headquartered in Bhopal, working closely with local farming communities.
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-neutral-100"></div>

        <div className="flex items-start gap-4 text-soil">
          <div className="w-12 h-12 rounded-full bg-mist flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-indigo" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Privacy & Trust</h3>
            <p className="text-neutral-800 mt-1 leading-relaxed">
              Your farm data, coordinates, and crop images are processed securely and never sold to third parties. Our AI models act purely as an objective advisory tool.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
