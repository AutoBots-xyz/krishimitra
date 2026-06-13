"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <div className="mb-6">
        <p className="eyebrow mb-2">GET IN TOUCH</p>
        <h1 className="font-display text-[36px] text-primary font-bold leading-tight">Contact AUTOBOTS</h1>
        <p className="font-body font-light text-muted">We are here to assist you with any questions regarding KrishiMitra.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="glass p-5 rounded-xl border border-primary/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-body font-medium text-primary text-[14px]">Call Us</h3>
              <p className="font-mono text-sm text-text">+91 1800-123-4567</p>
              <p className="font-mono text-[10px] text-muted uppercase mt-0.5">Mon-Sat, 9am - 6pm</p>
            </div>
          </div>

          <div className="glass p-5 rounded-xl border border-primary/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-body font-medium text-primary text-[14px]">Email Support</h3>
              <p className="font-body font-light text-[14px] text-text break-all">support@autobots-krishimitra.com</p>
            </div>
          </div>

          <div className="glass p-5 rounded-xl border border-primary/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-body font-medium text-primary text-[14px] mb-1">AUTOBOTS HQ</h3>
              <p className="font-body font-light text-[14px] text-text leading-relaxed">
                123 Innovation Tech Park,<br/>Sector 4, Bhopal, MP 462001
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-primary/10 shadow-sm">
          <h3 className="font-display text-[24px] text-primary font-bold mb-4">Send a Message</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="mb-1 block text-[13px] font-body text-muted">Name</label>
              <Input placeholder="Your full name" />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-body text-muted">Phone Number</label>
              <Input type="tel" placeholder="+91" />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-body text-muted">Message</label>
              <textarea 
                className="w-full glass border border-primary/14 rounded-md p-3 text-base font-body focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary min-h-[100px] resize-none placeholder:text-muted"
                placeholder="How can we help?"
              />
            </div>
            <Button className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
