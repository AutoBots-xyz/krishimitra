"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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

  const handlePhoneLogin = async (e: React.FormEvent) => {
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
      setLoading(false);
      if (!error) {
        router.push("/dashboard");
      } else {
        alert(error.message);
      }
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });
    setLoading(false);
    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mist p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-high">
        <h1 className="font-display text-display-lg text-soil mb-2 text-center font-bold">
          KrishiMitra
        </h1>
        <p className="text-neutral-800 mb-8 text-center">
          Empowering Indian Farmers with AI
        </p>

        {!otpSent ? (
          <form onSubmit={handlePhoneLogin} className="space-y-4">
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-soil">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 99999 99999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending OTP..." : "Login with Phone"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label htmlFor="otp" className="mb-1 block text-sm font-medium text-soil">
                Enter OTP
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              disabled={loading}
              onClick={() => setOtpSent(false)}
            >
              Back
            </Button>
          </form>
        )}

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-neutral-400"></div>
          <span className="mx-4 text-sm text-neutral-400">OR</span>
          <div className="flex-grow border-t border-neutral-400"></div>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleAnonymousLogin}
          disabled={loading}
        >
          Continue Anonymously
        </Button>
      </div>
    </div>
  );
}
