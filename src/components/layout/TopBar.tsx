"use client";

import { Home, Scan, Map, MessageSquare, ListTodo, User, Bell, Info, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguageStore } from "@/store/languageStore";

export default function TopBar() {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguageStore();

  const menuItems = [
    { name: language === 'en' ? "Dashboard" : "डैशबोर्ड", href: "/dashboard", icon: Home },
    { name: language === 'en' ? "Scan Crop" : "फसल स्कैन", href: "/scan", icon: Scan },
    { name: language === 'en' ? "Map" : "नक्शा", href: "/cropwatch", icon: Map },
    { name: language === 'en' ? "Expert" : "विशेषज्ञ", href: "/chat", icon: MessageSquare },
    { name: language === 'en' ? "Plan" : "योजना", href: "/plan", icon: ListTodo },
    { name: language === 'en' ? "About Us" : "हमारे बारे में", href: "/about", icon: Info },
  ];

  return (
    <div className="flex h-16 items-center justify-between bg-white px-4 md:px-8 shadow-sm shrink-0 border-b border-neutral-100 z-50 relative">
      <div className="flex items-center gap-8">
        <span className="font-display text-xl font-bold text-soil">KrishiMitra</span>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-sky text-indigo" 
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
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
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-indigo bg-mist hover:bg-sky transition-colors mr-1 border border-indigo/20"
        >
          <Globe className="h-4 w-4" />
          {language === 'en' ? 'EN' : 'HI'}
        </button>
        <button className="hidden md:flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
          <User className="h-5 w-5" />
        </button>
        <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-alert-red border-2 border-white"></span>
        </button>
      </div>
    </div>
  );
}
