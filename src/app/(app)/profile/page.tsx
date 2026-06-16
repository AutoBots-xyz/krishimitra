"use client";

import { useLanguageStore } from "@/store/languageStore";
import { useFarmerStore } from "@/store/farmerStore";
import { User, MapPin, Sprout, Droplets, Phone, Settings, LogOut, ChevronRight, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const FIELD_OPTIONS = {
  soilType: [
    { value: "Black Cotton Soil", en: "Black Cotton Soil", hi: "काली कपास मिट्टी" },
    { value: "red soil", en: "Red Soil", hi: "लाल मिट्टी" }, // Match the user's DB entry
    { value: "Alluvial Soil", en: "Alluvial Soil", hi: "जलोढ़ मिट्टी" },
    { value: "Laterite Soil", en: "Laterite Soil", hi: "लेटराइट मिट्टी" },
    { value: "Sandy Soil", en: "Sandy Soil", hi: "बलुई मिट्टी" },
  ],
  primaryCrops: [
    { value: "Wheat, Soybean", en: "Wheat, Soybean", hi: "गेहूं, सोयाबीन" },
    { value: "Rice", en: "Rice", hi: "चावल" },
    { value: "Cotton", en: "Cotton", hi: "कपास" },
    { value: "Sugarcane", en: "Sugarcane", hi: "गन्ना" },
    { value: "Maize", en: "Maize", hi: "मक्का" },
  ],
  irrigation: [
    { value: "Tube Well", en: "Tube Well", hi: "ट्यूबवेल" },
    { value: "Canal", en: "Canal", hi: "नहर" },
    { value: "Rainfed", en: "Rainfed", hi: "वर्षा आधारित" },
    { value: "Drip Irrigation", en: "Drip Irrigation", hi: "ड्रिप सिंचाई" },
  ],
  budgetLevel: [
    { value: "Low", en: "Low", hi: "निम्न" },
    { value: "Medium", en: "Medium", hi: "मध्यम" },
    { value: "High", en: "High", hi: "उच्च" },
  ],
  laborAvailability: [
    { value: "Family Only", en: "Family Only", hi: "केवल परिवार" },
    { value: "Family + Seasonal Hires", en: "Family + Seasonal Hires", hi: "परिवार + मौसमी कर्मचारी" },
    { value: "Full-time Hires", en: "Full-time Hires", hi: "पूर्णकालिक कर्मचारी" },
  ],
  farmingApproach: [
    { value: "Conventional", en: "Conventional", hi: "पारंपरिक" },
    { value: "Organic", en: "Organic", hi: "जैविक" },
    { value: "Mixed", en: "Mixed", hi: "मिश्रित" },
  ],
  targetMarket: [
    { value: "Local Mandi", en: "Local Mandi", hi: "स्थानीय मंडी" },
    { value: "Export", en: "Export", hi: "निर्यात" },
    { value: "Direct to Consumer", en: "Direct to Consumer", hi: "सीधे उपभोक्ता को" },
    { value: "Contract Farming", en: "Contract Farming", hi: "अनुबंध खेती" },
  ],
  riskAppetite: [
    { value: "Low", en: "Low", hi: "निम्न" },
    { value: "Medium", en: "Medium", hi: "मध्यम" },
    { value: "High", en: "High", hi: "उच्च" },
  ]
};

export default function ProfilePage() {
  const { language, setLanguage } = useLanguageStore();
  const { profile, setProfile } = useFarmerStore();
  const [isEditing, setIsEditing] = useState(false);

  const defaultProfile = {
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    location: "Bhopal, Madhya Pradesh",
    farmSize: "5 Acres",
    soilType: "Black Cotton Soil",
    primaryCrops: "Wheat, Soybean",
    irrigation: "Tube Well",
    budgetLevel: "Medium",
    laborAvailability: "Family + Seasonal Hires",
    farmingApproach: "Conventional",
    targetMarket: "Local Mandi",
    riskAppetite: "Medium",
  };

  const [formData, setFormData] = useState(profile || defaultProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoadingProfile(false);
        if (!profile) setProfile(defaultProfile);
        return;
      }
      
      const { data: dbProfile, error } = await supabase
        .from('farmers')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (dbProfile && !error) {
        const loadedProfile = {
          id: dbProfile.id,
          name: dbProfile.full_name || defaultProfile.name,
          phone: dbProfile.phone || defaultProfile.phone,
          location: [dbProfile.village, dbProfile.district, dbProfile.state].filter(Boolean).join(', ') || defaultProfile.location,
          farmSize: dbProfile.land_size_acres ? `${dbProfile.land_size_acres} Acres` : defaultProfile.farmSize,
          soilType: dbProfile.soil_type || defaultProfile.soilType,
          primaryCrops: dbProfile.primary_crop || defaultProfile.primaryCrops,
          irrigation: dbProfile.irrigation_source || defaultProfile.irrigation,
          budgetLevel: dbProfile.budget_level || defaultProfile.budgetLevel,
          laborAvailability: dbProfile.labor_availability || defaultProfile.laborAvailability,
          farmingApproach: dbProfile.farming_approach || defaultProfile.farmingApproach,
          targetMarket: dbProfile.target_market || defaultProfile.targetMarket,
          riskAppetite: dbProfile.risk_appetite || defaultProfile.riskAppetite,
        };
        setProfile(loadedProfile);
        setFormData(loadedProfile);
      } else if (!profile) {
        setProfile(defaultProfile);
      }
      setLoadingProfile(false);
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setProfile(formData);
    setIsEditing(false);
    
    // Save to Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Parse location and farm size back if possible
      const locParts = formData.location.split(',').map((s: string) => s.trim());
      const state = locParts.length > 1 ? locParts[locParts.length - 1] : null;
      const district = locParts.length > 0 ? locParts[0] : null;
      const acresMatch = formData.farmSize.match(/([0-9.]+)/);
      const acres = acresMatch ? parseFloat(acresMatch[1]) : null;

      await supabase.from('farmers').upsert({
        id: user.id,
        full_name: formData.name,
        phone: formData.phone !== defaultProfile.phone ? formData.phone : null,
        state,
        district,
        land_size_acres: acres,
        soil_type: formData.soilType,
        primary_crop: formData.primaryCrops,
        irrigation_source: formData.irrigation,
        budget_level: formData.budgetLevel,
        labor_availability: formData.laborAvailability,
        farming_approach: formData.farmingApproach,
        target_market: formData.targetMarket,
        risk_appetite: formData.riskAppetite,
      }, { onConflict: 'id' });
    }
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
            language={language}
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
            options={FIELD_OPTIONS.soilType}
            language={language}
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
            options={FIELD_OPTIONS.primaryCrops}
            language={language}
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
            options={FIELD_OPTIONS.irrigation}
            language={language}
          />
          <DetailCard 
            icon={<Settings className="w-5 h-5 text-secondary" />}
            label={language === "en" ? "Budget Level" : "बजट स्तर"}
            value={currentData.budgetLevel}
            fieldKey="budgetLevel"
            isEditing={isEditing}
            formData={formData}
            setFormData={setFormData}
            color="#C8800F"
            options={FIELD_OPTIONS.budgetLevel}
            language={language}
          />
          <DetailCard 
            icon={<User className="w-5 h-5 text-warning" />}
            label={language === "en" ? "Labor Availability" : "श्रम की उपलब्धता"}
            value={currentData.laborAvailability}
            fieldKey="laborAvailability"
            isEditing={isEditing}
            formData={formData}
            setFormData={setFormData}
            color="#B67D14"
            options={FIELD_OPTIONS.laborAvailability}
            language={language}
          />
          <DetailCard 
            icon={<Sprout className="w-5 h-5 text-success" />}
            label={language === "en" ? "Farming Approach" : "खेती का दृष्टिकोण"}
            value={currentData.farmingApproach}
            fieldKey="farmingApproach"
            isEditing={isEditing}
            formData={formData}
            setFormData={setFormData}
            color="#1A6B45"
            options={FIELD_OPTIONS.farmingApproach}
            language={language}
          />
          <DetailCard 
            icon={<MapPin className="w-5 h-5 text-primary" />}
            label={language === "en" ? "Target Market" : "लक्षित बाज़ार"}
            value={currentData.targetMarket}
            fieldKey="targetMarket"
            isEditing={isEditing}
            formData={formData}
            setFormData={setFormData}
            color="#1A4731"
            options={FIELD_OPTIONS.targetMarket}
            language={language}
          />
          <DetailCard 
            icon={<Settings className="w-5 h-5 text-error" />}
            label={language === "en" ? "Risk Appetite" : "जोखिम क्षमता"}
            value={currentData.riskAppetite}
            fieldKey="riskAppetite"
            isEditing={isEditing}
            formData={formData}
            setFormData={setFormData}
            color="#C53030"
            options={FIELD_OPTIONS.riskAppetite}
            language={language}
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

function DetailCard({ icon, label, value, fieldKey, isEditing, formData, setFormData, color, options, language }: any) {
  const getDisplayValue = () => {
    if (options && Array.isArray(options)) {
      const match = options.find((opt: any) => opt.value.toLowerCase() === (value || "").toLowerCase());
      if (match) return language === 'hi' ? match.hi : match.en;
    }
    if (fieldKey === 'farmSize' && typeof value === 'string') {
      return value.replace(/Acres?/i, language === 'hi' ? 'एकड़' : 'Acres');
    }
    return value;
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-white/60">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-mono tracking-widest uppercase text-muted mb-0.5">{label}</p>
        {isEditing ? (
          options ? (
            <select 
              value={formData[fieldKey]}
              onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
              className="font-semibold text-text text-base w-full bg-white/50 border border-black/10 rounded px-2 py-1 outline-none focus:border-primary/50"
            >
              <option value="" disabled>{language === 'hi' ? 'चुनें...' : 'Select...'}</option>
              {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {language === 'hi' ? opt.hi : opt.en}
                </option>
              ))}
            </select>
          ) : (
            <input 
              type="text" 
              value={formData[fieldKey]} 
              onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
              className="font-semibold text-text text-base w-full bg-white/50 border border-black/10 rounded px-2 py-1 outline-none focus:border-primary/50"
            />
          )
        ) : (
          <p className="font-semibold text-text text-base">{getDisplayValue()}</p>
        )}
      </div>
    </div>
  );
}
