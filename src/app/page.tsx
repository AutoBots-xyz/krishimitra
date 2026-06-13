import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Leaf, Camera, Map as MapIcon, MessageSquare, Sprout, CloudRain, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="glass max-w-2xl w-full p-10 md:p-14 rounded-2xl shadow-xl flex flex-col items-center">
        
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Leaf className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="font-display text-5xl font-bold text-primary text-center mb-10">
          Grow with <span className="italic">intention.</span>
        </h1>

        <div className="w-full">
          <p className="eyebrow text-center mb-8">FOR INDIAN FARMERS</p>
          
          <div className="space-y-4 mb-10">
            <FeatureRow 
              icon={<Camera className="w-5 h-5 text-primary" />}
              title="Instant Crop Analysis"
              desc="Snap a photo of a sick crop. Get an instant AI diagnosis and affordable treatment plan."
            />
            <FeatureRow 
              icon={<MapIcon className="w-5 h-5 text-primary" />}
              title="Local Disease Tracking"
              desc="See outbreaks in your area before they reach your field."
            />
            <FeatureRow 
              icon={<MessageSquare className="w-5 h-5 text-primary" />}
              title="24/7 Expert Chat"
              desc="Ask our AI agronomist anything in Hindi or English."
            />
            <FeatureRow 
              icon={<Sprout className="w-5 h-5 text-primary" />}
              title="Smart Farm Planning"
              desc="Get personalized crop suggestions based on your land and soil."
            />
            <FeatureRow 
              icon={<CloudRain className="w-5 h-5 text-primary" />}
              title="Hyperlocal Weather"
              desc="Know exactly when to water, spray, or harvest."
            />
          </div>

          <div className="glass border border-success/20 p-5 rounded-xl flex gap-4 items-start mb-10">
            <ShieldCheck className="w-6 h-6 text-success shrink-0 mt-0.5" />
            <p className="text-sm text-muted italic font-body font-light">
              Your information stays private. When you help warn other farmers about a disease, you do it anonymously.
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/login" className="w-full md:w-auto">
              <Button size="lg" className="w-full md:w-auto md:px-12">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

function FeatureRow({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass flex gap-4 items-start p-4 rounded-xl hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div className="shrink-0 bg-primary/10 p-3 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div className="mt-1">
        <h3 className="font-body font-medium text-primary text-base">{title}</h3>
        <p className="font-body font-light text-muted text-sm mt-1">{desc}</p>
      </div>
    </div>
  );
}
