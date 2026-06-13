"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ChevronRight, Leaf } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

export default function PlanPage() {
  const { language } = useLanguageStore();

  const translations = {
    en: {
      advancedPlan: "Your Advanced Farm Plan",
      topRecommendation: "Recommendation",
      score: "Score",
      cropDetails: "Crop Details",
      variety: "Variety",
      sowingWindow: "Sowing Window",
      harvestWindow: "Harvest Window",
      expectedYield: "Expected Yield",
      totalWaterNeed: "Total Water Need",
      financialEstimate: "Financial Estimate (per acre)",
      estIncome: "Est. Income",
      inputCost: "Input Cost",
      netProfit: "Net Profit",
      margin: "Margin",
      breakEven: "Break-even",
      riskAssessment: "Risk Assessment",
      weather: "Weather",
      market: "Market",
      pest: "Pest",
      sustainabilityBadges: "Sustainability Badges",
      backupOption: "Backup Option",
      soilHealthImpact: "Soil Health Impact",
      generateAnother: "Generate Another Plan",
      newFarmPlan: "New Farm Plan",
      whatIsLandSize: "What is your land size?",
      acres: "Acres",
      hectares: "Hectares",
      next: "Next",
      back: "Back",
      selectSoilType: "Select your soil type",
      waterAvailability: "Water Availability",
      generateAIPlan: "Generate AI Plan",
      generatingPlan: "Generating Plan...",
      advancedDetailsToggle: "Want a more precise plan? Add details (optional)",
      hideAdvanced: "Hide Advanced Details",
      budget: "Budget / Investment Capacity",
      labor: "Labor Availability",
      riskAppetite: "Risk Appetite",
      select: "Select...",
    },
    hi: {
      advancedPlan: "आपकी उन्नत कृषि योजना",
      topRecommendation: "अनुशंसा",
      score: "स्कोर",
      cropDetails: "फसल विवरण",
      variety: "किस्म",
      sowingWindow: "बुवाई का समय",
      harvestWindow: "कटाई का समय",
      expectedYield: "अनुमानित उपज",
      totalWaterNeed: "कुल पानी की आवश्यकता",
      financialEstimate: "वित्तीय अनुमान (प्रति एकड़)",
      estIncome: "अनुमानित आय",
      inputCost: "लागत",
      netProfit: "शुद्ध लाभ",
      margin: "मार्जिन",
      breakEven: "ब्रेक-ईवन",
      riskAssessment: "जोखिम मूल्यांकन",
      weather: "मौसम",
      market: "बाज़ार",
      pest: "कीट",
      sustainabilityBadges: "स्थिरता बैज",
      backupOption: "वैकल्पिक विकल्प",
      soilHealthImpact: "मिट्टी के स्वास्थ्य पर प्रभाव",
      generateAnother: "एक और योजना बनाएं",
      newFarmPlan: "नई कृषि योजना",
      whatIsLandSize: "आपकी भूमि का आकार क्या है?",
      acres: "एकड़",
      hectares: "हेक्टेयर",
      next: "अगला",
      back: "पीछे",
      selectSoilType: "मिट्टी का प्रकार चुनें",
      waterAvailability: "पानी की उपलब्धता",
      generateAIPlan: "AI योजना बनाएं",
      generatingPlan: "योजना बन रही है...",
      advancedDetailsToggle: "अधिक सटीक योजना चाहते हैं? विवरण जोड़ें (वैकल्पिक)",
      hideAdvanced: "उन्नत विवरण छिपाएं",
      budget: "बजट / निवेश क्षमता",
      labor: "श्रम उपलब्धता",
      riskAppetite: "जोखिम क्षमता",
      select: "चुनें...",
    }
  };
  const t = translations[language as 'en' | 'hi'] || translations.en;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    landSize: "",
    soilType: "",
    waterSource: "",
    budgetLevel: "",
    laborAvailability: "",
    farmingApproach: "",
    targetMarket: "",
    riskAppetite: "",
    planningHorizon: ""
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/plan/recommend", {
        method: "POST",
        body: JSON.stringify({ ...formData, language })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const crops = result.recommended_crops || [];

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in pb-20">
        <div className="mb-6">
          <p className="eyebrow mb-2">FARM PLAN</p>
          <h1 className="font-display text-[36px] text-primary font-bold">{t.advancedPlan}</h1>
        </div>
        
        {crops.map((crop: any, index: number) => (
          <div key={index} className="glass rounded-xl shadow-sm border border-primary/10 overflow-hidden mb-6">
            <div className="bg-secondary/20 text-primary p-4 flex justify-between items-center border-b border-primary/10">
              <h2 className="font-display font-bold text-xl flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" /> {t.topRecommendation} #{index + 1}: {crop.crop_name}
              </h2>
              <span className="glass px-3 py-1 rounded-full font-mono text-[13px] border border-primary/20">{t.score}: {crop.suitability_score}/100</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-body font-semibold text-[14px] text-primary border-b border-primary/10 pb-2">{t.cropDetails}</h3>
                <div className="flex justify-between"><span className="text-muted font-body text-sm">{t.variety}</span><span className="font-mono text-sm text-text">{crop.variety}</span></div>
                <div className="flex justify-between"><span className="text-muted font-body text-sm">{t.sowingWindow}</span><span className="font-mono text-sm text-text">{crop.sowing_window}</span></div>
                <div className="flex justify-between"><span className="text-muted font-body text-sm">{t.harvestWindow}</span><span className="font-mono text-sm text-text">{crop.harvest_window}</span></div>
                <div className="flex justify-between"><span className="text-muted font-body text-sm">{t.expectedYield}</span><span className="font-mono text-sm text-text">{crop.expected_yield}</span></div>
                <div className="flex justify-between"><span className="text-muted font-body text-sm">{t.totalWaterNeed}</span><span className="font-mono text-sm text-text">{crop.total_water_requirement}</span></div>
              </div>

              {/* Financials */}
              <div className="space-y-4 glass p-4 rounded-xl border border-primary/10 border-l-4 border-l-primary">
                <h3 className="font-body font-semibold text-[14px] text-primary border-b border-primary/10 pb-2">{t.financialEstimate}</h3>
                <div className="flex justify-between"><span className="text-muted font-body text-sm">{t.estIncome}</span><span className="font-mono text-sm text-success font-medium">{crop.estimated_income}</span></div>
                <div className="flex justify-between"><span className="text-muted font-body text-sm">{t.inputCost}</span><span className="font-mono text-sm text-warning font-medium">{crop.input_cost_breakdown?.total_estimated_cost}</span></div>
                <div className="flex justify-between mt-2 pt-2 border-t border-primary/10"><span className="font-body font-bold text-primary">{t.netProfit}</span><span className="font-mono text-base font-bold text-primary">{crop.estimated_net_profit}</span></div>
                <div className="font-mono text-[11px] text-muted text-right uppercase tracking-wider">{t.margin}: {crop.profit_margin_percent}% | {t.breakEven}: {crop.break_even_point}</div>
              </div>
            </div>

            {/* Risk & Sustainability */}
            <div className="p-6 border-t border-primary/10 glass grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <h3 className="font-body font-semibold text-[14px] text-primary mb-3">{t.riskAssessment}</h3>
                 <div className="flex gap-2 mb-3">
                   <span className={`font-mono text-[10px] uppercase px-2.5 py-1 rounded-full ${crop.risk_assessment?.weather_risk === 'high' ? 'bg-error/10 text-error border border-error/20' : 'glass border border-primary/10 text-muted'}`}>{t.weather}: {crop.risk_assessment?.weather_risk}</span>
                   <span className={`font-mono text-[10px] uppercase px-2.5 py-1 rounded-full ${crop.risk_assessment?.market_risk === 'high' ? 'bg-error/10 text-error border border-error/20' : 'glass border border-primary/10 text-muted'}`}>{t.market}: {crop.risk_assessment?.market_risk}</span>
                   <span className={`font-mono text-[10px] uppercase px-2.5 py-1 rounded-full ${crop.risk_assessment?.pest_risk === 'high' ? 'bg-error/10 text-error border border-error/20' : 'glass border border-primary/10 text-muted'}`}>{t.pest}: {crop.risk_assessment?.pest_risk}</span>
                 </div>
                 <p className="font-body font-light text-[13px] text-text leading-relaxed">{crop.risk_assessment?.notes}</p>
               </div>
               <div>
                 <h3 className="font-body font-semibold text-[14px] text-primary mb-3">{t.sustainabilityBadges}</h3>
                 <div className="flex flex-wrap gap-2">
                    {crop.sustainability_badges?.map((badge: string, i: number) => (
                      <span key={i} className="font-mono text-[10px] uppercase px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md">{badge}</span>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        ))}

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.alternative_crop_option && (
            <div className="glass p-5 rounded-xl shadow-sm border border-primary/10 hover:-translate-y-1 transition-transform">
              <h3 className="font-body font-semibold text-[14px] text-primary mb-2">{t.backupOption}: <span className="font-display font-bold text-[18px]">{result.alternative_crop_option.crop_name}</span></h3>
              <p className="font-body font-light text-[14px] text-text leading-relaxed">{result.alternative_crop_option.reason}</p>
            </div>
          )}
          {result.soil_health_impact_note && (
            <div className="glass p-5 rounded-xl shadow-sm border border-primary/10 hover:-translate-y-1 transition-transform border-l-4 border-l-success">
              <h3 className="font-body font-semibold text-[14px] text-primary mb-2">{t.soilHealthImpact}</h3>
              <p className="font-body font-light text-[14px] text-text leading-relaxed">{result.soil_health_impact_note}</p>
            </div>
          )}
        </div>

        <Button onClick={() => setResult(null)} variant="outline" className="w-full mt-8">{t.generateAnother}</Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20">
      <div className="mb-8">
        <p className="eyebrow mb-2">FARM PLAN</p>
        <h1 className="font-display text-[36px] text-primary font-bold">{t.newFarmPlan}</h1>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-secondary' : 'bg-primary/10'}`} />
          ))}
        </div>
      </div>

      <div className="glass rounded-xl shadow-sm border border-primary/10 p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="font-display text-[24px] text-primary font-bold">{t.whatIsLandSize}</h2>
            <input 
              type="number" 
              placeholder="e.g. 5"
              className="w-full h-14 glass border border-primary/20 rounded-md px-4 text-lg font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
              value={formData.landSize}
              onChange={(e) => setFormData({...formData, landSize: e.target.value})}
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 text-[13px]">{t.acres}</Button>
              <Button variant="ghost" className="flex-1 text-[13px]">{t.hectares}</Button>
            </div>
            <div className="pt-2">
              <Button className="w-full" onClick={() => setStep(2)}>{t.next} <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="font-display text-[24px] text-primary font-bold">{t.selectSoilType}</h2>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {['Black Cotton', 'Alluvial', 'Red Soil', 'Laterite'].map(soil => (
                <div 
                  key={soil} 
                  onClick={() => setFormData({...formData, soilType: soil})}
                  className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center gap-3 transition-colors ${formData.soilType === soil ? 'border-secondary bg-secondary/10 text-primary font-medium shadow-sm' : 'border-primary/20 text-muted hover:border-primary/40 glass'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.soilType === soil ? 'bg-secondary/20' : 'bg-primary/5'}`}>
                    <Leaf className={`w-5 h-5 ${formData.soilType === soil ? 'text-secondary' : 'text-primary/40'}`} />
                  </div>
                  <span className="font-body text-[14px] text-center">{soil}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6 pt-2 border-t border-primary/10">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>{t.back}</Button>
              <Button className="flex-1" onClick={() => setStep(3)}>{t.next}</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="font-display text-[24px] text-primary font-bold">{t.waterAvailability}</h2>
            <div className="space-y-3">
              {['Rainfed (Monsoon only)', 'Canal Irrigation', 'Borewell / Tube well'].map(water => (
                <div 
                  key={water} 
                  onClick={() => setFormData({...formData, waterSource: water})}
                  className={`p-4 border rounded-xl cursor-pointer flex justify-between items-center transition-colors ${formData.waterSource === water ? 'border-primary bg-primary/5 text-primary font-medium shadow-sm' : 'border-primary/20 text-muted hover:border-primary/40 glass'}`}
                >
                  <span className="font-body text-[14px]">{water}</span>
                  {formData.waterSource === water && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6 pt-2 border-t border-primary/10">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>{t.back}</Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
                {loading ? t.generatingPlan : t.generateAIPlan}
              </Button>
            </div>

            {/* Advanced Details Toggle */}
            <div className="pt-6 mt-6 border-t border-primary/10">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-primary font-body font-medium text-[13px] flex items-center gap-1 hover:underline"
              >
                {showAdvanced ? t.hideAdvanced : t.advancedDetailsToggle}
              </button>
              
              {showAdvanced && (
                <div className="mt-4 space-y-4 glass p-5 rounded-xl border border-primary/10 animate-in slide-in-from-top-2">
                  
                  <div>
                    <label className="text-[13px] font-body text-muted block mb-1.5">{t.budget}</label>
                    <select className="w-full h-12 glass border border-primary/20 rounded-md px-3 font-body text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary" value={formData.budgetLevel} onChange={e => setFormData({...formData, budgetLevel: e.target.value})}>
                      <option value="">{t.select}</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[13px] font-body text-muted block mb-1.5">{t.labor}</label>
                    <select className="w-full h-12 glass border border-primary/20 rounded-md px-3 font-body text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary" value={formData.laborAvailability} onChange={e => setFormData({...formData, laborAvailability: e.target.value})}>
                      <option value="">{t.select}</option>
                      <option value="Family labor only">Family labor only</option>
                      <option value="Hired labor available">Hired labor available</option>
                      <option value="Mechanized">Mechanized</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[13px] font-body text-muted block mb-1.5">{t.riskAppetite}</label>
                    <select className="w-full h-12 glass border border-primary/20 rounded-md px-3 font-body text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary" value={formData.riskAppetite} onChange={e => setFormData({...formData, riskAppetite: e.target.value})}>
                      <option value="">{t.select}</option>
                      <option value="Low (Stable staples)">Low (Stable staples)</option>
                      <option value="Medium">Medium</option>
                      <option value="High (Cash crops)">High (Cash crops)</option>
                    </select>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
