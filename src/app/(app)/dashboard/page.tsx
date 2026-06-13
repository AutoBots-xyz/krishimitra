"use client";

import {
  Scan, Map as MapIcon, MessageSquare, ListTodo,
  CloudRain, Wind, AlertTriangle, ChevronRight,
  Thermometer, Droplets, ArrowUpRight, Zap, ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useLanguageStore } from "@/store/languageStore";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const FARMER_NAME = "Ramesh";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function DashboardPage() {
  const { language } = useLanguageStore();
  const [temp, setTemp] = useState<number | null>(null);
  const [rain, setRain] = useState<number | null>(null);
  const [wind, setWind] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const location = "Bhopal, MP";

  useEffect(() => {
    async function fetchWeather() {
      try {
        const geo = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=Bhopal&count=1&format=json`
        ).then((r) => r.json());
        if (!geo.results?.length) return;
        const { latitude: lat, longitude: lng } = geo.results[0];
        const w = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&hourly=precipitation_probability`
        ).then((r) => r.json());
        if (w.current) {
          setTemp(Math.round(w.current.temperature_2m));
          setRain(w.hourly?.precipitation_probability?.[new Date().getHours()] ?? 0);
          setWind(Math.round(w.current.wind_speed_10m));
          setHumidity(w.current.relative_humidity_2m ?? null);
        }
      } catch (_) {}
    }
    fetchWeather();
  }, []);

  return (
    <div className="pb-10 space-y-5">

      {/* ─── HERO ─── */}
      <motion.div {...fade(0)} className="relative overflow-hidden rounded-3xl" style={{
        background: "linear-gradient(135deg, #1A4731 0%, #0f2a1d 60%, #1a3a20 100%)",
        boxShadow: "0 20px 60px rgba(26,71,49,0.35)",
      }}>
        {/* Decorative orbs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #C8800F 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/3 w-80 h-32 opacity-10"
          style={{ background: "radial-gradient(ellipse, #78BE6E 0%, transparent 70%)" }} />

        <div className="relative z-10 p-6 md:p-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
              {location} · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-white leading-[1.05] mb-6"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)" }}>
            {language === "en" ? (
              <>Good morning,<br /><span className="italic text-white/75">{FARMER_NAME}.</span></>
            ) : (
              <>शुभ प्रभात,<br /><span className="italic text-white/75">{FARMER_NAME}।</span></>
            )}
          </h1>

          {/* Weather Stats row */}
          <div className="grid grid-cols-4 gap-3 md:gap-4">
            <WeatherStat icon={<Thermometer className="w-4 h-4" />}
              label={language === "en" ? "Temp" : "तापमान"}
              value={temp !== null ? `${temp}°` : "—"} />
            <WeatherStat icon={<CloudRain className="w-4 h-4" />}
              label={language === "en" ? "Rain" : "बारिश"}
              value={rain !== null ? `${rain}%` : "—"} />
            <WeatherStat icon={<Wind className="w-4 h-4" />}
              label={language === "en" ? "Wind" : "हवा"}
              value={wind !== null ? `${wind} km/h` : "—"} />
            <WeatherStat icon={<Droplets className="w-4 h-4" />}
              label={language === "en" ? "Humid" : "नमी"}
              value={humidity !== null ? `${humidity}%` : "—"} />
          </div>
        </div>
      </motion.div>

      {/* ─── QUICK ACTIONS ─── */}
      <motion.div {...fade(0.08)} className="grid grid-cols-4 gap-3">
        <QuickAction href="/scan" icon={Scan} label={language === "en" ? "Scan" : "स्कैन"} color="#1A4731" />
        <QuickAction href="/cropwatch" icon={MapIcon} label={language === "en" ? "Map" : "नक्शा"} color="#C8800F" />
        <QuickAction href="/chat" icon={MessageSquare} label={language === "en" ? "Ask AI" : "पूछें"} color="#1A6B45" />
        <QuickAction href="/plan" icon={ListTodo} label={language === "en" ? "Plan" : "योजना"} color="#B67D14" />
      </motion.div>

      {/* ─── BENTO GRID ─── */}
      <motion.div {...fade(0.14)} className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {/* Advisory — spans 2 cols on md */}
        <div className="col-span-2 md:col-span-2 relative overflow-hidden rounded-2xl p-5 md:p-6"
          style={{ background: "linear-gradient(135deg, #fdf6ec 0%, #fef3e2 100%)", border: "1px solid rgba(200,128,15,0.18)" }}>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
            style={{ background: "radial-gradient(circle at top right, #C8800F 0%, transparent 70%)" }} />
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#B67D14] mb-3 block">
            {language === "en" ? "Today's Advisory" : "आज की सलाह"}
          </span>
          <p className="font-display text-[#0D1910] leading-snug mb-4"
            style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", fontStyle: "italic" }}>
            {language === "en"
              ? '"Delay irrigation 48 hrs — 40mm rain forecast from Thursday.'
              : '"गुरुवार से 40 मिमी बारिश — 48 घंटे सिंचाई न करें।'}
          </p>
          <Link href="/advisory"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#B67D14] hover:gap-2 transition-all">
            {language === "en" ? "Full advisory" : "पूरी सलाह"} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Field Health Score */}
        <div className="relative overflow-hidden rounded-2xl p-5"
          style={{ background: "linear-gradient(160deg, #e8f5ee 0%, #d4eddd 100%)", border: "1px solid rgba(26,107,69,0.15)" }}>
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#1A6B45] mb-2 block">
            {language === "en" ? "Field Health" : "फसल स्वास्थ्य"}
          </span>
          <div className="font-display font-bold text-[#1A4731] mb-1" style={{ fontSize: "3rem", lineHeight: 1 }}>
            86
            <span className="text-lg text-[#1A6B45]/60 font-normal ml-1">/100</span>
          </div>
          <p className="text-xs text-[#1A6B45] font-medium mt-2">
            {language === "en" ? "↑ 4 pts from last week" : "↑ पिछले सप्ताह से 4 अंक"}
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-[#1A6B45]/15">
            <div className="h-full rounded-full bg-[#1A6B45]" style={{ width: "86%" }} />
          </div>
        </div>

        {/* Alert: Disease Risk */}
        <div className="relative overflow-hidden rounded-2xl p-5"
          style={{ background: "linear-gradient(160deg, #fff1f0 0%, #ffe4e1 100%)", border: "1px solid rgba(197,48,48,0.15)" }}>
          <div className="flex items-start justify-between mb-3">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#C53030] block">
              {language === "en" ? "Disease Alert" : "रोग चेतावनी"}
            </span>
            <ShieldAlert className="w-5 h-5 text-[#C53030]" />
          </div>
          <p className="font-display font-semibold text-[#0D1910] text-lg leading-snug mb-1">
            {language === "en" ? "Wheat Rust" : "गेहूं रस्ट"}
          </p>
          <p className="text-xs text-[#C53030] font-medium">
            {language === "en" ? "14 cases · 5km radius" : "14 मामले · 5km दायरे में"}
          </p>
          <Link href="/cropwatch"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#C53030]">
            {language === "en" ? "View on map" : "नक्शे पर देखें"} <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Weather Alert */}
        <div className="relative overflow-hidden rounded-2xl p-5"
          style={{ background: "linear-gradient(160deg, #fffbeb 0%, #fef3c7 100%)", border: "1px solid rgba(182,125,20,0.15)" }}>
          <div className="flex items-start justify-between mb-3">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#B67D14] block">
              {language === "en" ? "Weather" : "मौसम"}
            </span>
            <AlertTriangle className="w-5 h-5 text-[#B67D14]" />
          </div>
          <p className="font-display font-semibold text-[#0D1910] text-lg leading-snug mb-1">
            {language === "en" ? "Heavy Rain" : "भारी बारिश"}
          </p>
          <p className="text-xs text-[#B67D14] font-medium">
            {language === "en" ? "Thu–Fri · Avoid spraying" : "गुरु–शुक्र · स्प्रे न करें"}
          </p>
        </div>

        {/* MSP Ticker */}
        <div className="col-span-2 md:col-span-1 relative overflow-hidden rounded-2xl p-5"
          style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #e8eeff 100%)", border: "1px solid rgba(26,71,49,0.12)" }}>
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#1A4731] mb-2 block">
            {language === "en" ? "MSP Rates" : "MSP दर"}
          </span>
          <div className="space-y-2">
            {[
              { crop: language === "en" ? "Wheat" : "गेहूं", price: "₹2,275", unit: "/qtl", up: true },
              { crop: language === "en" ? "Rice" : "धान", price: "₹2,183", unit: "/qtl", up: false },
              { crop: language === "en" ? "Soybean" : "सोयाबीन", price: "₹4,600", unit: "/qtl", up: true },
            ].map((item) => (
              <div key={item.crop} className="flex items-center justify-between">
                <span className="text-xs text-muted font-medium">{item.crop}</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm font-semibold text-[#0D1910]">{item.price}</span>
                  <span className="font-mono text-[10px] text-muted">{item.unit}</span>
                  <Zap className={`w-3 h-3 ${item.up ? "text-[#1A6B45]" : "text-[#C53030]"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── SCAN CTA STRIP ─── */}
      <motion.div {...fade(0.2)}>
        <Link href="/scan"
          className="flex items-center justify-between rounded-2xl px-6 py-5 group transition-all duration-300 hover:scale-[1.01]"
          style={{
            background: "linear-gradient(90deg, #1A4731 0%, #163d29 100%)",
            boxShadow: "0 8px 32px rgba(26,71,49,0.25)",
          }}>
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/50 mb-1">
              {language === "en" ? "AI Diagnosis" : "AI निदान"}
            </p>
            <p className="font-display font-semibold text-white text-xl">
              {language === "en" ? "Scan a crop now" : "अभी फसल स्कैन करें"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Scan className="w-5 h-5 text-white" />
          </div>
        </Link>
      </motion.div>

    </div>
  );
}

function WeatherStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-white/50">
        {icon}
        <span className="font-mono text-[9px] uppercase tracking-widest">{label}</span>
      </div>
      <span className="font-mono font-semibold text-white text-base">{value}</span>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label, color }: {
  href: string; icon: any; label: string; color: string;
}) {
  return (
    <Link href={href}
      className="flex flex-col items-center justify-center gap-2.5 rounded-2xl py-4 px-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 glass border border-primary/5">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18` }}>
        <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
      </div>
      <span className="font-body font-medium text-[11px] text-center leading-tight text-muted">{label}</span>
    </Link>
  );
}
