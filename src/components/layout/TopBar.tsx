"use client";

import { useState, useRef, useEffect } from "react";
import { Home, Scan, Map, MessageSquare, ListTodo, User, Bell, Info, Globe, ClipboardList, ShieldAlert, CloudRain, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguageStore } from "@/store/languageStore";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar() {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguageStore();

  const menuItems = [
    { name: language === 'en' ? "Dashboard" : "डैशबोर्ड", href: "/dashboard", icon: Home },
    { name: language === 'en' ? "Scan Crop" : "फसल स्कैन", href: "/scan", icon: Scan },
    { name: language === 'en' ? "Map" : "नक्शा", href: "/cropwatch", icon: Map },
    { name: language === 'en' ? "Expert" : "विशेषज्ञ", href: "/chat", icon: MessageSquare },
    { name: language === 'en' ? "Plan" : "योजना", href: "/plan", icon: ListTodo },
    { name: language === 'en' ? "Reports" : "रिपोर्ट", href: "/reports", icon: ClipboardList },
  ];

  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, type: 'alert', title: language === 'en' ? 'Disease Alert' : 'रोग चेतावनी', desc: language === 'en' ? 'High risk of Wheat Rust detected within 5km.' : '5 किमी के भीतर गेहूं रस्ट का उच्च जोखिम।', time: '10 min ago', icon: ShieldAlert, color: 'text-error' },
    { id: 2, type: 'weather', title: language === 'en' ? 'Weather Warning' : 'मौसम की चेतावनी', desc: language === 'en' ? 'Heavy rain expected tomorrow. Delay spraying.' : 'कल भारी बारिश की संभावना। छिड़काव में देरी करें।', time: '2 hrs ago', icon: CloudRain, color: 'text-secondary' },
    { id: 3, type: 'system', title: language === 'en' ? 'Report Ready' : 'रिपोर्ट तैयार', desc: language === 'en' ? 'Your Q3 Master Synthesis is ready to download.' : 'आपकी Q3 मास्टर सिंथेसिस डाउनलोड के लिए तैयार है।', time: '1 day ago', icon: FileText, color: 'text-primary' },
  ];

  const NotificationDropdown = () => (
    <AnimatePresence>
      {showNotifications && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden z-[100]"
        >
          <div className="px-4 py-3 border-b border-black/5 bg-gray-50 flex justify-between items-center">
            <span className="font-semibold text-primary">{language === 'en' ? 'Notifications' : 'सूचनाएं'}</span>
            <button className="text-xs text-primary font-medium hover:underline">{language === 'en' ? 'Mark all read' : 'सभी को पढ़ा हुआ मानें'}</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 border-b border-black/5 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 items-start">
                <div className={`mt-0.5 ${n.color}`}>
                  <n.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text">{n.title}</h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{n.desc}</p>
                  <span className="text-[10px] text-muted/60 mt-2 block">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-gray-50 text-center">
            <button className="text-xs font-semibold text-primary">{language === 'en' ? 'View all' : 'सभी देखें'}</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Desktop Navigation - Floating Pill */}
      <div className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-[1200px] h-16 items-center justify-between px-6 glass shadow-xl rounded-xl">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-display text-2xl font-bold text-primary italic">
            KrishiMitra
          </Link>
          
          <nav className="flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-md px-3 py-1.5 font-mono text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            <Globe className="h-4 w-4" />
            {language === 'en' ? 'EN' : 'HI'}
          </button>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center justify-center h-9 w-9 rounded-full text-muted hover:bg-primary/5 hover:text-primary transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error border border-white"></span>
            </button>
            <div className="hidden md:block">
              <NotificationDropdown />
            </div>
          </div>
          <Link href="/profile" className="flex items-center justify-center h-9 w-9 rounded-full text-muted hover:bg-primary/5 hover:text-primary transition-colors">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Mobile Navigation - Standard Header */}
      <div className="md:hidden flex h-14 items-center justify-between glass px-4 z-50 shrink-0 sticky top-0 border-b border-primary/10">
        <Link href="/dashboard" className="font-display text-2xl font-bold text-primary italic">
          KrishiMitra
        </Link>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleLanguage}
            className="flex items-center justify-center h-9 w-9 rounded-full text-primary hover:bg-primary/5 transition-colors"
          >
            <Globe className="h-5 w-5" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center justify-center h-9 w-9 rounded-full text-muted hover:bg-primary/5 hover:text-primary transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error border border-white"></span>
            </button>
            <div className="md:hidden">
              <NotificationDropdown />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
