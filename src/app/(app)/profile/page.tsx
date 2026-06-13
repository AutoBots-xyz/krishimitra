"use client";

import { useLanguageStore } from "@/store/languageStore";
import { useFarmerStore } from "@/store/farmerStore";
import { User, MapPin, Sprout, Droplets, Phone, Settings, LogOut, ChevronRight, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { language, setLanguage } = useLanguageStore();
  const { profile, setProfile } = useFarmerStore();
  const [isEditing, setIsEditing] = useState(false);

  // Default profile if null
  const defaultProfile = {
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    location: "Bhopal, Madhya Pradesh",
    farmSize: "5 Acres",
    soilType: "Black Cotton Soil",
    primaryCrops: "Wheat, Soybean",
    irrigation: "Tube Well",
  };

  const [formData, setFormData] = useState(profile || defaultProfile);

  useEffect(() => {
    if (!profile) {
      setProfile(defaultProfile);
    } else {
      setFormData(profile);
    }
  }, [profile, setProfile]);

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile || defaultProfile);
    setIsEditing(false);
  };

  const currentData = isEditing ? formData : (profile || defaultProfile);

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-6">
      {/* ─── HEADER CARD ─── */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, #1A4731 0%, #0f2a1d 100%)",
          boxShadow: "0 20px 60px rgba(26,71,49,0.25)",
        }}>
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #78BE6E 0%, transparent 70%)" }} />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center backdrop-blur-md shrink-0">
            <User className="w-10 h-10 text-white opacity-80" />
          </div>
          
          <div className="flex-1 text-center md:text-left text-white w-full">
            {isEditing ? (
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="font-display font-semibold text-3xl mb-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-white w-full max-w-xs outline-none focus:border-white/50"
              />
            ) : (
              <h1 className="font-display font-semibold text-3xl mb-1">{currentData.name}</h1>
            )}
            
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-white/70 text-sm font-medium mt-2">
              <div className="flex items-center gap-1.5 w-full md:w-auto">
                <Phone className="w-4 h-4" /> 
                {isEditing ? (
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-white w-32 outline-none" />
                ) : currentData.phone}
              </div>
              <div className="hidden md:block w-1 h-1 bg-white/30 rounded-full"></div>
              <div className="flex items-center gap-1.5 w-full md:w-auto">
                <MapPin className="w-4 h-4" /> 
                {isEditing ? (
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-white w-48 outline-none" />
                ) : currentData.location}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            {isEditing ? (
              <>
                <Button onClick={handleCancel} variant="secondary" size="sm" className="rounded-xl px-4 flex items-center gap-2 border-white/20 hover:bg-white/20 text-white bg-transparent shadow-none">
                  <X className="w-4 h-4" />
                </Button>
                <Button onClick={handleSave} variant="secondary" size="sm" className="rounded-xl px-4 flex items-center gap-2 border-transparent text-[#1A4731] bg-white hover:bg-white/90 shadow-none">
                  <Save className="w-4 h-4" />
                  {language === "en" ? "Save" : "सहेजें"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="secondary" size="sm" className="rounded-xl px-5 flex items-center gap-2 border-white/20 hover:bg-white/20 text-white bg-white/10 shadow-none">
                <Edit3 className="w-4 h-4" />
                {language === "en" ? "Edit Profile" : "संपादित करें"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ─── FARM DETAILS ─── */}
      <div className="glass rounded-[24px] p-6 md:p-8 border border-primary/10 shadow-sm relative overflow-hidden">
        <h2 className="font-display text-xl font-semibold text-text mb-6">
          {language === "en" ? "Farm Information" : "खेत की जानकारी"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard 
            icon={<MapPin className="w-5 h-5 text-warning" />}
            label={language === "en" ? "Total Land Area" : "कुल भूमि क्षेत्र"}
            value={currentData.farmSize}
            fieldKey="farmSize"
            isEditing={isEditing}
            formData={formData}
            setFormData={setFormData}
            color="#B67D14"
          />
          <DetailCard 
            icon={<Droplets className="w-5 h-5 text-secondary" />}
            label={language === "en" ? "Soil Type" : "मिट्टी का प्रकार"}
            value={currentData.soilType}
            fieldKey="soilType"
            isEditing={isEditing}
            formData={formData}
            setFormData={setFormData}
            color="#C8800F"
          />
          <DetailCard 
            icon={<Sprout className="w-5 h-5 text-success" />}
            label={language === "en" ? "Primary Crops" : "मुख्य फसलें"}
            value={currentData.primaryCrops}
            fieldKey="primaryCrops"
            isEditing={isEditing}
            formData={formData}
            setFormData={setFormData}
            color="#1A6B45"
          />
          <DetailCard 
            icon={<Droplets className="w-5 h-5 text-primary" />}
            label={language === "en" ? "Irrigation Source" : "सिंचाई का स्रोत"}
            value={currentData.irrigation}
            fieldKey="irrigation"
            isEditing={isEditing}
            formData={formData}
            setFormData={setFormData}
            color="#1A4731"
          />
        </div>
      </div>

      {/* ─── APP PREFERENCES ─── */}
      <div className="glass rounded-[24px] p-6 md:p-8 border border-primary/10 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-text mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-muted" />
          {language === "en" ? "App Preferences" : "ऐप प्राथमिकताएँ"}
        </h2>
        
        <div className="space-y-2">
          {/* Language Toggle */}
          <div className="flex items-center justify-between p-4 hover:bg-primary/5 rounded-2xl transition-colors cursor-pointer"
               onClick={() => setLanguage(language === "en" ? "hi" : "en")}>
            <div>
              <p className="font-medium text-text">{language === "en" ? "App Language" : "ऐप की भाषा"}</p>
              <p className="text-sm text-muted">{language === "en" ? "Tap to switch to Hindi" : "अंग्रेजी में बदलने के लिए टैप करें"}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {language === "en" ? "English" : "हिंदी"}
              </span>
              <ChevronRight className="w-5 h-5 text-muted" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── LOGOUT ─── */}
      <Button variant="outline" className="w-full h-14 rounded-2xl border-error/20 text-error hover:bg-error/5 hover:text-error/90 flex items-center gap-2 text-lg font-medium">
        <LogOut className="w-5 h-5" />
        {language === "en" ? "Log Out" : "लॉग आउट"}
      </Button>
    </div>
  );
}

function DetailCard({ icon, label, value, fieldKey, isEditing, formData, setFormData, color }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-white/60">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-mono tracking-widest uppercase text-muted mb-0.5">{label}</p>
        {isEditing ? (
          <input 
            type="text" 
            value={formData[fieldKey]} 
            onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
            className="font-semibold text-text text-base w-full bg-white/50 border border-black/10 rounded px-2 py-1 outline-none focus:border-primary/50"
          />
        ) : (
          <p className="font-semibold text-text text-base">{value}</p>
        )}
      </div>
    </div>
  );
}
