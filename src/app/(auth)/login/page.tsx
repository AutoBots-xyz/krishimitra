"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { Leaf, ArrowRight, CheckCircle2, ShieldCheck, Sprout, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnonymousLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInAnonymously();
    setLoading(false);
    if (!error) {
      router.push("/dashboard");
    } else {
      console.error(error);
      alert(error.message);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // MOCK BYPASS FOR MVP TESTING
    if (phone === "+919999999999" || phone === "9999999999") {
      setTimeout(() => {
        setLoading(false);
        setOtpSent(true);
      }, 1000);
      return;
    }

    // Send OTP via supabase
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });
    setLoading(false);
    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // MOCK BYPASS FOR MVP TESTING
    if ((phone === "+919999999999" || phone === "9999999999") && otp === "123456") {
      const { error } = await supabase.auth.signInAnonymously();
      
      if (!error) {
        if (name) {
          await supabase.auth.updateUser({
            data: { full_name: name }
          });
        }
        setLoading(false);
        router.push("/dashboard");
      } else {
        setLoading(false);
        alert(error.message);
      }
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });
    
    if (error) {
      setLoading(false);
      console.error(error);
      alert(error.message);
    } else {
      if (name) {
        await supabase.auth.updateUser({
          data: { full_name: name }
        });
      }
      setLoading(false);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* ─── LEFT PANE: BRANDING & VISUALS (Hidden on mobile) ─── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative bg-primary overflow-hidden flex-col justify-between p-12 lg:p-16">
        {/* Deep Green Gradient / Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#2a6d4b] via-[#1a4731] to-[#0f2a1d]"></div>
        
        {/* Subtle grid pattern for luxury tech feel */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative z-10 mt-8">
          <div className="flex items-center gap-4 mb-20">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <Leaf className="w-7 h-7 text-success" />
            </div>
            <span className="font-display text-3xl text-white font-bold tracking-wide italic drop-shadow-md">KrishiMitra</span>
          </div>

          <h1 className="font-display text-5xl xl:text-6xl text-white font-bold leading-tight mb-8 drop-shadow-lg">
            Empowering the modern <br/>
            <span className="text-success font-light italic">Indian Farmer.</span>
          </h1>
          <p className="text-white/80 font-body text-xl max-w-md mb-16 leading-relaxed">
            Join thousands of farmers using AI-driven insights to protect crops, optimize yields, and farm smarter.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-5 bg-white/5 p-5 rounded-2xl backdrop-blur-md border border-white/10 w-fit pr-10 shadow-lg hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center shrink-0">
                <Sprout className="w-6 h-6 text-success" />
              </div>
              <p className="text-white font-medium text-base">Instant Crop Disease Diagnosis</p>
            </div>
            <div className="flex items-center gap-5 bg-white/5 p-5 rounded-2xl backdrop-blur-md border border-white/10 w-fit pr-10 shadow-lg hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center shrink-0">
                <Map className="w-6 h-6 text-success" />
              </div>
              <p className="text-white font-medium text-base">Hyperlocal Weather & Tracking</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto pt-16 flex items-center gap-4">
          <ShieldCheck className="w-6 h-6 text-success/80" />
          <p className="text-white/60 text-sm font-light">Secure, anonymous, and built for your privacy.</p>
        </div>
      </div>

      {/* ─── RIGHT PANE: AUTH FORM ─── */}
      <div className="w-full lg:w-[55%] xl:w-[50%] min-h-screen flex items-center justify-center p-6 md:p-12 relative bg-[#F8F9FA]">
        <div className="w-full max-w-md relative z-10">
          
          {/* Mobile Header (Only visible on small screens) */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl text-primary font-bold italic">KrishiMitra</h1>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-black/5 shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!otpSent ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="mb-10">
                    <h2 className="font-display text-4xl font-bold text-primary mb-3">
                      {isSignUp ? "Create Account" : "Welcome Back"}
                    </h2>
                    <p className="text-muted text-base leading-relaxed">
                      {isSignUp 
                        ? "Enter your details to join the KrishiMitra community." 
                        : "Enter your phone number to sign in to your account."}
                    </p>
                  </div>

                  <form onSubmit={handlePhoneSubmit} className="space-y-6">
                    {isSignUp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2 overflow-hidden"
                      >
                        <label htmlFor="name" className="block text-[11px] font-bold text-primary uppercase tracking-widest pl-1">
                          Full Name
                        </label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Ramesh Kumar"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="bg-gray-50/50 border-black/10 focus:border-primary/50 h-14 rounded-2xl text-base px-5 transition-all"
                        />
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-[11px] font-bold text-primary uppercase tracking-widest pl-1">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 99999 99999"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="bg-gray-50/50 border-black/10 focus:border-primary/50 h-14 rounded-2xl font-mono text-base px-5 transition-all"
                      />
                    </div>

                    <Button type="submit" className="w-full h-14 rounded-2xl mt-4 text-base font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all group" disabled={loading}>
                      {loading ? "Sending Code..." : (isSignUp ? "Sign Up" : "Sign In")}
                      {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                  </form>

                  <div className="mt-10 text-center text-sm text-muted">
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    <button 
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-primary font-bold hover:underline transition-all"
                      type="button"
                    >
                      {isSignUp ? "Sign in" : "Create one"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="mb-10">
                    <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-7 h-7 text-success" />
                    </div>
                    <h2 className="font-display text-4xl font-bold text-primary mb-3">
                      Verify Number
                    </h2>
                    <p className="text-muted text-base leading-relaxed">
                      We've sent a 6-digit code to <br/><strong className="font-mono text-text">{phone}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="otp" className="block text-[11px] font-bold text-primary uppercase tracking-widest pl-1">
                        Verification Code
                      </label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="bg-gray-50/50 border-black/10 focus:border-primary/50 h-16 rounded-2xl font-mono text-center text-3xl tracking-[0.3em] transition-all"
                        maxLength={6}
                      />
                    </div>

                    <Button type="submit" className="w-full h-14 rounded-2xl mt-4 text-base font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all group" disabled={loading || otp.length < 6}>
                      {loading ? "Verifying..." : "Verify Code"}
                      {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                    
                    <button 
                      type="button" 
                      className="w-full text-center text-sm text-muted font-medium mt-6 hover:text-primary transition-colors"
                      disabled={loading}
                      onClick={() => setOtpSent(false)}
                    >
                      Wrong number? Go back
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="my-10 flex items-center w-full">
              <div className="flex-grow border-t border-black/5"></div>
              <span className="mx-4 text-[10px] font-bold text-primary/40 uppercase tracking-widest">or continue with</span>
              <div className="flex-grow border-t border-black/5"></div>
            </div>

            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-black/10 text-text hover:bg-gray-50 hover:text-primary font-medium transition-all"
              onClick={handleAnonymousLogin}
              disabled={loading}
            >
              Guest Access (Anonymous)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
