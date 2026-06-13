"use client";

import { Home, Scan, Map, MessageSquare, User, Info, ClipboardList } from "lucide-react";
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
    { name: language === 'en' ? "Reports" : "रिपोर्ट", href: "/reports", icon: ClipboardList },
  ];

  return (
    <div className="md:hidden glass border-t border-primary/10 px-2 py-2 pb-safe z-50 shrink-0 overflow-x-auto no-scrollbar fixed bottom-0 left-0 w-full">
      <div className="flex justify-between gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-[64px] h-[52px] rounded-lg transition-colors ${
                isActive ? "text-primary" : "text-muted"
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full mb-0.5 ${isActive ? 'bg-primary/10' : ''}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-mono text-[10px] font-medium uppercase tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
