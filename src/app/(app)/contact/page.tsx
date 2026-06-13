"use client";

import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="font-display text-heading-1 text-soil mb-2">Contact AUTOBOTS</h1>
        <p className="text-neutral-800">We are here to assist you with any questions regarding KrishiMitra.</p>
      </div>

      <div className="bg-white rounded-xl shadow-high border border-neutral-100 p-8 space-y-8">
        <div className="flex items-center gap-4 text-soil">
          <div className="w-12 h-12 rounded-full bg-mist flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6 text-indigo" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Call Us</h3>
            <p className="text-neutral-800">+91 1800-123-4567</p>
            <p className="text-sm text-neutral-400 mt-1">Available Mon-Sat, 9am - 6pm</p>
          </div>
        </div>

        <div className="w-full h-px bg-neutral-100"></div>

        <div className="flex items-center gap-4 text-soil">
          <div className="w-12 h-12 rounded-full bg-mist flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6 text-indigo" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Email Support</h3>
            <p className="text-neutral-800">support@autobots-krishimitra.com</p>
          </div>
        </div>

        <div className="w-full h-px bg-neutral-100"></div>

        <div className="flex items-center gap-4 text-soil">
          <div className="w-12 h-12 rounded-full bg-mist flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-indigo" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">AUTOBOTS HQ</h3>
            <p className="text-neutral-800">123 Innovation Tech Park,<br/>Sector 4, Bhopal, MP 462001</p>
          </div>
        </div>
      </div>
    </div>
  );
}
