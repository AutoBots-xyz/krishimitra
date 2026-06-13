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
        <h1 className="font-display text-heading-1 text-soil">{t.advancedPlan}</h1>
        
        {crops.map((crop: any, index: number) => (
          <div key={index} className="bg-white rounded-xl shadow-mid border border-neutral-100 overflow-hidden mb-6">
            <div className="bg-harvest text-soil p-4 flex justify-between items-center">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Leaf /> {t.topRecommendation} #{index + 1}: {crop.crop_name}
              </h2>
              <span className="bg-white/40 px-3 py-1 rounded-full text-sm font-semibold">{t.score}: {crop.suitability_score}/100</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-soil border-b pb-2">{t.cropDetails}</h3>
                <div className="flex justify-between"><span className="text-neutral-500">{t.variety}</span><span className="font-medium">{crop.variety}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">{t.sowingWindow}</span><span className="font-medium">{crop.sowing_window}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">{t.harvestWindow}</span><span className="font-medium">{crop.harvest_window}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">{t.expectedYield}</span><span className="font-medium">{crop.expected_yield}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">{t.totalWaterNeed}</span><span className="font-medium">{crop.total_water_requirement}</span></div>
              </div>

              {/* Financials */}
              <div className="space-y-4 bg-mist p-4 rounded-xl">
                <h3 className="font-semibold text-soil border-b border-neutral-300 pb-2">{t.financialEstimate}</h3>
                <div className="flex justify-between"><span className="text-neutral-500">{t.estIncome}</span><span className="font-medium text-leaf">{crop.estimated_income}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">{t.inputCost}</span><span className="font-medium text-alert-amber">{crop.input_cost_breakdown?.total_estimated_cost}</span></div>
                <div className="flex justify-between text-lg"><span className="font-bold text-soil">{t.netProfit}</span><span className="font-bold text-indigo">{crop.estimated_net_profit}</span></div>
                <div className="text-xs text-neutral-500 mt-2 text-right">{t.margin}: {crop.profit_margin_percent}% | {t.breakEven}: {crop.break_even_point}</div>
              </div>
            </div>

            {/* Risk & Sustainability */}
            <div className="p-6 border-t border-neutral-100 bg-neutral-50 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <h3 className="font-semibold text-soil mb-3">{t.riskAssessment}</h3>
                 <div className="flex gap-2 mb-2">
                   <span className={`text-xs px-2 py-1 rounded-full ${crop.risk_assessment?.weather_risk === 'high' ? 'bg-alert-red/20 text-alert-red' : 'bg-neutral-200'}`}>{t.weather}: {crop.risk_assessment?.weather_risk}</span>
                   <span className={`text-xs px-2 py-1 rounded-full ${crop.risk_assessment?.market_risk === 'high' ? 'bg-alert-red/20 text-alert-red' : 'bg-neutral-200'}`}>{t.market}: {crop.risk_assessment?.market_risk}</span>
                   <span className={`text-xs px-2 py-1 rounded-full ${crop.risk_assessment?.pest_risk === 'high' ? 'bg-alert-red/20 text-alert-red' : 'bg-neutral-200'}`}>{t.pest}: {crop.risk_assessment?.pest_risk}</span>
                 </div>
                 <p className="text-sm text-neutral-600">{crop.risk_assessment?.notes}</p>
               </div>
               <div>
                 <h3 className="font-semibold text-soil mb-3">{t.sustainabilityBadges}</h3>
                 <div className="flex flex-wrap gap-2">
                    {crop.sustainability_badges?.map((badge: string, i: number) => (
                      <span key={i} className="text-xs px-2 py-1 bg-leaf/20 text-leaf font-medium rounded-md">{badge}</span>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        ))}

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.alternative_crop_option && (
            <div className="bg-white p-5 rounded-xl shadow-low border border-neutral-100">
              <h3 className="font-semibold text-soil mb-2">{t.backupOption}: {result.alternative_crop_option.crop_name}</h3>
              <p className="text-sm text-neutral-600">{result.alternative_crop_option.reason}</p>
            </div>
          )}
          {result.soil_health_impact_note && (
            <div className="bg-white p-5 rounded-xl shadow-low border border-neutral-100">
              <h3 className="font-semibold text-soil mb-2">{t.soilHealthImpact}</h3>
              <p className="text-sm text-neutral-600">{result.soil_health_impact_note}</p>
            </div>
          )}
        </div>

        <Button onClick={() => setResult(null)} variant="outline" className="w-full mt-8">{t.generateAnother}</Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="font-display text-heading-1 text-soil">{t.newFarmPlan}</h1>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-harvest' : 'bg-neutral-100'}`} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-low p-6">
        {step === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right-4">
            <h2 className="font-semibold text-lg text-soil">{t.whatIsLandSize}</h2>
            <input 
              type="number" 
              placeholder="e.g. 5"
              className="w-full h-14 border border-neutral-400 rounded-md px-4 text-lg"
              value={formData.landSize}
              onChange={(e) => setFormData({...formData, landSize: e.target.value})}
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">{t.acres}</Button>
              <Button variant="ghost" className="flex-1">{t.hectares}</Button>
            </div>
            <Button className="w-full mt-4" onClick={() => setStep(2)}>{t.next} <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-right-4">
            <h2 className="font-semibold text-lg text-soil">{t.selectSoilType}</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Black Cotton', 'Alluvial', 'Red Soil', 'Laterite'].map(soil => (
                <div 
                  key={soil} 
                  onClick={() => setFormData({...formData, soilType: soil})}
                  className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center gap-2 ${formData.soilType === soil ? 'border-harvest bg-harvest/10 text-soil font-semibold' : 'border-neutral-400 text-neutral-800'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-soil opacity-20"></div>
                  {soil}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>{t.back}</Button>
              <Button className="flex-1" onClick={() => setStep(3)}>{t.next}</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in slide-in-from-right-4">
            <h2 className="font-semibold text-lg text-soil">{t.waterAvailability}</h2>
            <div className="space-y-3">
              {['Rainfed (Monsoon only)', 'Canal Irrigation', 'Borewell / Tube well'].map(water => (
                <div 
                  key={water} 
                  onClick={() => setFormData({...formData, waterSource: water})}
                  className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center ${formData.waterSource === water ? 'border-indigo bg-sky text-indigo font-semibold' : 'border-neutral-400 text-neutral-800'}`}
                >
                  {water}
                  {formData.waterSource === water && <CheckCircle2 className="w-5 h-5" />}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>{t.back}</Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
                {loading ? t.generatingPlan : t.generateAIPlan}
              </Button>
            </div>

            {/* Advanced Details Toggle */}
            <div className="pt-6 mt-6 border-t border-neutral-200">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-indigo font-medium text-sm flex items-center gap-1 hover:underline"
              >
                {showAdvanced ? t.hideAdvanced : t.advancedDetailsToggle}
              </button>
              
              {showAdvanced && (
                <div className="mt-4 space-y-4 bg-mist p-4 rounded-xl border border-neutral-200 animate-in slide-in-from-top-2">
                  
                  <div>
                    <label className="text-sm font-medium text-soil block mb-1">{t.budget}</label>
                    <select className="w-full h-10 border rounded-md px-3" value={formData.budgetLevel} onChange={e => setFormData({...formData, budgetLevel: e.target.value})}>
                      <option value="">{t.select}</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-soil block mb-1">{t.labor}</label>
                    <select className="w-full h-10 border rounded-md px-3" value={formData.laborAvailability} onChange={e => setFormData({...formData, laborAvailability: e.target.value})}>
                      <option value="">{t.select}</option>
                      <option value="Family labor only">Family labor only</option>
                      <option value="Hired labor available">Hired labor available</option>
                      <option value="Mechanized">Mechanized</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-soil block mb-1">{t.riskAppetite}</label>
                    <select className="w-full h-10 border rounded-md px-3" value={formData.riskAppetite} onChange={e => setFormData({...formData, riskAppetite: e.target.value})}>
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
