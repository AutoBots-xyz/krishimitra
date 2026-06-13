import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Leaf, Camera, Map as MapIcon, MessageSquare, ThermometerSun, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Navigation / Header */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50 max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-md border border-primary/10">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-semibold text-2xl text-primary tracking-tight">KrishiMitra</span>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/login" className="text-sm font-body font-medium text-muted hover:text-primary transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/login">
            <Button size="sm" className="rounded-xl shadow-md">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-4 md:pt-52 md:pb-32 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span className="text-xs font-mono font-medium text-primary uppercase tracking-wider">KrishiMitra AI is Live</span>
          </div>
          
          <h1 className="font-display text-6xl md:text-8xl font-bold text-text leading-[1.05] mb-8 max-w-4xl tracking-tight">
            Grow with <br/> <span className="italic font-display text-primary">intention.</span>
          </h1>
          
          <p className="font-body text-lg md:text-xl text-muted max-w-2xl mb-12 font-light leading-relaxed">
            The AI-powered agrarian platform for Indian farmers. Get instant crop diagnosis, hyperlocal weather, and 24/7 expert advisory in your language.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login">
              <Button size="lg" className="px-8 h-14 text-base rounded-xl group shadow-lg shadow-primary/20">
                Start Farming Smarter
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-8 h-14 text-base rounded-xl bg-surface/50 backdrop-blur-md border-primary/20 text-primary hover:bg-primary/5">
                Explore Features
              </Button>
            </Link>
          </div>
        </section>

        {/* Bento Box Grid */}
        <section id="features" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-16">
            <p className="eyebrow mb-4">Platform Capabilities</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-text text-center tracking-tight">Everything your farm needs.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
            {/* Bento 1: CropWatch Map (Spans 2 columns) */}
            <div className="glass md:col-span-2 rounded-[24px] p-8 md:p-10 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden border border-white/80">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 transition-transform group-hover:scale-110 duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-primary/5">
                  <MapIcon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-3xl font-semibold mb-3 tracking-tight">Local Disease Tracking</h3>
                <p className="font-body text-muted max-w-md line-clamp-3 text-lg font-light leading-relaxed">
                  See outbreaks in your area before they reach your field. Our crowdsourced CropWatch map alerts you to nearby risks instantly.
                </p>
              </div>
              
              <div className="absolute -bottom-10 -right-10 w-[65%] h-56 bg-white/40 backdrop-blur-xl rounded-tl-[32px] border border-white/60 p-5 shadow-2xl group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-500">
                <div className="w-full h-full rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-error/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-error rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm border border-white/50"></div>
                  <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-warning rounded-full shadow-sm border border-white/50"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-success rounded-full shadow-sm border border-white/50"></div>
                </div>
              </div>
            </div>

            {/* Bento 2: AI Chat */}
            <div className="glass rounded-[24px] p-8 md:p-10 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden border border-white/80">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-secondary/5">
                  <MessageSquare className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-3 tracking-tight">24/7 Expert Chat</h3>
                <p className="font-body text-muted line-clamp-3 text-base font-light">
                  Ask our AI agronomist anything. Available in Hindi and English.
                </p>
              </div>
              <div className="w-full h-28 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/80 mt-6 p-4 flex flex-col gap-3 shadow-sm group-hover:scale-[1.02] transition-transform duration-500 origin-bottom">
                 <div className="w-4/5 h-8 bg-secondary/15 rounded-xl rounded-tr-sm self-end"></div>
                 <div className="w-full h-10 bg-white/80 rounded-xl rounded-tl-sm border border-black/5 shadow-sm"></div>
              </div>
            </div>

            {/* Bento 3: Instant Diagnosis */}
            <div className="glass md:col-span-1 rounded-[24px] p-8 md:p-10 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden border border-white/80">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-success/5">
                  <Camera className="w-7 h-7 text-success" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-3 tracking-tight">Instant Diagnosis</h3>
                <p className="font-body text-muted line-clamp-3 text-base font-light">
                  Snap a photo of a sick crop to get an instant AI diagnosis and affordable treatment plan.
                </p>
              </div>
              <div className="flex justify-between items-end mt-4 group-hover:scale-[1.02] transition-transform duration-500 origin-bottom">
                 <div className="w-20 h-20 bg-gradient-to-br from-success/20 to-success/5 rounded-2xl border border-success/20 flex items-center justify-center shadow-inner">
                    <Leaf className="w-10 h-10 text-success opacity-70 drop-shadow-sm" />
                 </div>
                 <div className="flex flex-col gap-1.5 items-end">
                    <span className="font-mono text-[10px] text-success font-semibold tracking-widest uppercase bg-success/10 px-2 py-1 rounded-md">98% Match</span>
                    <span className="text-sm font-body font-medium text-text bg-white/50 px-2 py-1 rounded-md border border-white/80">Bacterial Blight</span>
                 </div>
              </div>
            </div>

            {/* Bento 4: Weather & Planning (Spans 2 columns) */}
            <div className="glass md:col-span-2 rounded-[24px] p-8 md:p-10 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden border border-white/80">
               <div className="flex flex-col md:flex-row gap-8 items-center h-full relative z-10">
                  <div className="flex-1">
                    <div className="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-warning/5">
                      <ThermometerSun className="w-7 h-7 text-warning" />
                    </div>
                    <h3 className="font-display text-3xl font-semibold mb-3 tracking-tight">Hyperlocal Planning</h3>
                    <p className="font-body text-muted text-lg font-light leading-relaxed">
                      Know exactly when to water, spray, or harvest with precise weather forecasting and soil-specific crop planning algorithms.
                    </p>
                  </div>
                  <div className="flex-1 w-full flex justify-center items-end group-hover:scale-[1.02] transition-transform duration-500">
                      <div className="w-full max-w-[240px] h-40 rounded-3xl border border-white/80 bg-white/40 backdrop-blur-md flex items-end p-5 shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-warning/10 to-transparent"></div>
                          <div className="w-full flex justify-between items-end gap-3 relative z-10">
                             <div className="w-full bg-warning/30 h-1/3 rounded-t-md"></div>
                             <div className="w-full bg-warning/50 h-2/3 rounded-t-md"></div>
                             <div className="w-full bg-warning h-full rounded-t-md relative shadow-sm">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-xs font-bold text-warning bg-white px-2 py-1 rounded-md shadow-sm">+24%</div>
                             </div>
                             <div className="w-full bg-warning/40 h-1/2 rounded-t-md"></div>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Deep Dive Section */}
        <section className="py-24 px-4 relative z-10 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="flex-1 order-2 md:order-1 relative w-full max-w-lg mx-auto">
               <div className="aspect-[4/5] md:aspect-[4/3] w-full rounded-[40px] glass p-3 shadow-2xl">
                  <div className="w-full h-full bg-white/50 backdrop-blur-sm rounded-[32px] border border-white/80 overflow-hidden relative shadow-inner">
                     {/* Mock App UI */}
                     <div className="absolute top-0 w-full h-16 bg-white/80 border-b border-black/5 flex items-center px-8 backdrop-blur-md z-10">
                        <div className="w-24 h-3 bg-black/10 rounded-full"></div>
                     </div>
                     <div className="p-6 pt-24 flex flex-col gap-5 h-full bg-gradient-to-b from-transparent to-primary/5">
                        <div className="w-full p-5 rounded-2xl border border-white bg-white/60 shadow-sm flex items-center gap-5">
                           <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                              <Leaf className="w-5 h-5 text-primary opacity-50" />
                           </div>
                           <div className="flex flex-col gap-2.5 flex-1">
                              <div className="w-1/3 h-2.5 bg-primary/40 rounded-full"></div>
                              <div className="w-1/2 h-2 bg-primary/20 rounded-full"></div>
                           </div>
                        </div>
                        <div className="w-full p-5 rounded-2xl border border-white bg-white/60 shadow-sm flex items-center gap-5 opacity-70">
                           <div className="w-12 h-12 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                              <MessageSquare className="w-5 h-5 text-secondary opacity-50" />
                           </div>
                           <div className="flex flex-col gap-2.5 flex-1">
                              <div className="w-2/3 h-2.5 bg-secondary/40 rounded-full"></div>
                              <div className="w-1/2 h-2 bg-secondary/20 rounded-full"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="absolute -bottom-8 -right-8 md:-right-12 glass p-5 rounded-2xl shadow-xl border border-white/80 hover:-translate-y-1 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center border border-success/20">
                        <ShieldCheck className="w-6 h-6 text-success" />
                     </div>
                     <div>
                        <p className="font-mono text-[10px] font-bold text-success uppercase tracking-widest mb-0.5">Protected</p>
                        <p className="font-body text-sm font-semibold text-text">Data Encrypted</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="flex-1 order-1 md:order-2">
              <p className="eyebrow mb-5">Enterprise Grade</p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 tracking-tight text-text leading-[1.1]">Your farm, in your pocket.</h2>
              <p className="font-body text-lg text-muted mb-10 font-light leading-relaxed">
                We've brought the power of advanced agricultural science to a mobile-first platform. Whether you are managing 2 acres or 200, KrishiMitra scales with your ambition.
              </p>
              <ul className="space-y-6 font-body text-text">
                 <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                       <Check className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <strong className="block font-semibold mb-1">Works offline in remote areas</strong>
                      <span className="text-muted text-sm font-light">Critical disease databases sync to your device.</span>
                    </div>
                 </li>
                 <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                       <Check className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <strong className="block font-semibold mb-1">Low bandwidth optimized</strong>
                      <span className="text-muted text-sm font-light">Engineered to run seamlessly on 2G and 3G networks.</span>
                    </div>
                 </li>
                 <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                       <Check className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <strong className="block font-semibold mb-1">Exportable PDF Reports</strong>
                      <span className="text-muted text-sm font-light">Generate official agronomy reports for banks and mandis.</span>
                    </div>
                 </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Trust Banner */}
        <section className="py-16 px-4 max-w-5xl mx-auto relative z-10">
          <div className="glass border border-success/30 p-8 md:p-10 rounded-[32px] flex flex-col md:flex-row gap-8 items-center text-center md:text-left shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-20 h-20 bg-gradient-to-br from-success/20 to-success/5 rounded-full flex items-center justify-center shrink-0 shadow-inner border border-success/20">
               <ShieldCheck className="w-10 h-10 text-success" />
            </div>
            <div>
               <h4 className="font-display text-3xl font-semibold text-text mb-3 tracking-tight">Privacy First. Always.</h4>
               <p className="text-lg text-muted font-body font-light max-w-2xl leading-relaxed">
                 Your information stays strictly private. When you scan a disease to help warn other farmers in your district, the data is anonymized. We never sell your yield data to third parties.
               </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4 text-center relative z-10">
           <div>
             <h2 className="font-display text-5xl md:text-7xl font-bold mb-10 tracking-tight text-text">Ready to harvest more?</h2>
             <Link href="/login">
               <Button size="lg" className="px-12 h-16 text-lg rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                 Join KrishiMitra Today
               </Button>
             </Link>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-surface/80 backdrop-blur-xl py-12 px-4 mt-auto relative z-20">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 opacity-90">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="font-display font-semibold text-2xl text-primary tracking-tight">KrishiMitra</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 font-body text-sm text-muted font-medium">
               <Link href="#" className="hover:text-primary transition-colors">Platform</Link>
               <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
               <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
               <Link href="#" className="hover:text-primary transition-colors">Contact Support</Link>
            </div>
            <div className="font-mono text-xs text-muted/60 tracking-wider uppercase">
               © {new Date().getFullYear()} AutoBots. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
