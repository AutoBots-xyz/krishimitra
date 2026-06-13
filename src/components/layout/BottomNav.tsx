"use client";

import { Home, Scan, Map, MessageSquare, User, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguageStore } from "@/store/languageStore";

export default function BottomNav() {
  const pathname = usePathname();
  const { language } = useLanguageStore();

  const navItems = [
    { name: language === 'en' ? "Home" : "होम", href: "/dashboard", icon: Home },
    { name: language === 'en' ? "Scan" : "स्कैन", href: "/scan", icon: Scan },
    { name: language === 'en' ? "Map" : "नक्शा", href: "/cropwatch", icon: Map },
    { name: language === 'en' ? "Chat" : "चैट", href: "/chat", icon: MessageSquare },
    { name: language === 'en' ? "Profile" : "प्रोफ़ाइल", href: "/profile", icon: User },
    { name: language === 'en' ? "About" : "हमारे बारे में", href: "/about", icon: Info },
  ];

  return (
    <div className="md:hidden border-t border-neutral-100 bg-white px-2 py-2 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)] overflow-x-auto no-scrollbar">
      <div className="flex justify-between gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center p-2 min-w-[64px] ${
                isActive ? "text-indigo" : "text-neutral-400"
              }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
