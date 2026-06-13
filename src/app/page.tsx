import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Leaf, Camera, Map as MapIcon, MessageSquare, Sprout, CloudRain, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-mist bg-topo-pattern p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-3xl shadow-high border border-neutral-100">
        
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-leaf text-white rounded-xl flex items-center justify-center shadow-mid">
            <Leaf className="w-7 h-7" />
          </div>
          <h1 className="font-display text-heading-1 text-soil text-center">
            Welcome to Krishi Mitra
          </h1>
        </div>

        <p className="text-xl text-center text-neutral-800 font-medium mb-8">
          — Your Farm's New Best Friend! 🌾
        </p>

        <p className="text-lg text-neutral-800 mb-6">Namaste! 🙏</p>

        <p className="text-lg text-neutral-800 mb-8 leading-relaxed">
          Imagine having a senior agronomist, a weather expert, and a community of fellow farmers — all available in your pocket, anytime you need them, completely free.
          <br /><br />
          <strong>That's Krishi Mitra.</strong>
        </p>

        <div className="space-y-6 mb-10">
          <FeatureRow 
            icon={<Camera className="w-6 h-6 text-indigo" />}
            title="Worried about a sick crop?"
            desc="Just snap a photo. Within seconds, get a clear report telling you exactly what's wrong, how serious it is, and what to do about it — using treatments that are affordable and easy to find."
          />
          <FeatureRow 
            icon={<MapIcon className="w-6 h-6 text-alert-amber" />}
            title="Want to know what's happening around you?"
            desc="Our CropWatch map shows disease outbreaks in your area before they reach your field — so you can act early and protect your harvest."
          />
          <FeatureRow 
            icon={<MessageSquare className="w-6 h-6 text-sky" />}
            title="Have a question, day or night?"
            desc="Chat with our AI agronomist in Hindi or English — about pests, fertilizers, irrigation, government schemes, or today's mandi prices. No judgment, no waiting."
          />
          <FeatureRow 
            icon={<Sprout className="w-6 h-6 text-leaf" />}
            title="Planning your next season?"
            desc="Tell us about your land, soil, and water — we'll suggest the best crops to grow, when to sow and harvest, and even estimate what you could earn."
          />
          <FeatureRow 
            icon={<CloudRain className="w-6 h-6 text-indigo" />}
            title="Curious about the weather's impact?"
            desc="Get personalized advice based on your exact location's forecast — so you know when to water, spray, or harvest."
          />
        </div>

        <div className="bg-sky/30 border border-sky p-4 rounded-xl flex gap-3 items-start mb-10">
          <ShieldCheck className="w-6 h-6 text-indigo shrink-0 mt-0.5" />
          <p className="text-sm text-neutral-800 italic">
            Your information stays private. When you help warn other farmers about a disease, you do it anonymously — your name is never shared.
          </p>
        </div>

        <div className="text-center">
          <p className="font-display text-heading-2 text-soil mb-8">
            Let's grow smarter, together. 🌾💚
          </p>
          <Link href="/login">
            <Button size="lg" className="w-full md:w-auto md:px-12 text-lg">
              Get Started
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}

function FeatureRow({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="shrink-0 mt-1 bg-neutral-100 p-2 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-soil text-lg">{title}</h3>
        <p className="text-neutral-800 leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}
