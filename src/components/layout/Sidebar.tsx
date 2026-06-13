"use client";

import { Home, Scan, Map, MessageSquare, ListTodo, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Scan Crop", href: "/scan", icon: Scan },
    { name: "CropWatch Map", href: "/cropwatch", icon: Map },
    { name: "Ask Expert", href: "/chat", icon: MessageSquare },
    { name: "My Farm Plan", href: "/plan", icon: ListTodo },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-mid transition-transform duration-300 md:static md:translate-x-0 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 shrink-0 items-center px-6">
          <span className="font-display text-2xl font-bold text-soil">KrishiMitra</span>
        </div>
        
        <nav className="flex-1 space-y-1 px-4 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-sky text-indigo" 
                    : "text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <Link href="/profile" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100">
            <User className="h-5 w-5" />
            Profile
          </Link>
        </div>
      </div>
    </>
  );
}
