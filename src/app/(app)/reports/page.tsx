"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ShieldAlert, Zap, AlertTriangle, FileText, CheckCircle2, ChevronRight, Activity, Sprout, Loader2, X, Download, Star, ImagePlus } from "lucide-react";
import Link from "next/link";
import { downloadAsPDF } from "@/lib/pdfUtils";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

export default function ReportsPage() {
  const { language } = useLanguageStore();
  const [isDownloadingMaster, setIsDownloadingMaster] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isDownloadingHistory, setIsDownloadingHistory] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Review System State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [reviewImagePreview, setReviewImagePreview] = useState<string | null>(null);

  const handleSelectReport = (report: any) => {
    setSelectedReport(report);
    setRating(report.raw?.user_rating || 0);
    setFeedback(report.raw?.user_feedback || "");
    setHoverRating(0);
    setReviewImage(null);
    setReviewImagePreview(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReviewImage(file);
      setReviewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedReport || rating === 0) return;
    setIsSubmittingReview(true);
    try {
      let uploadedImageUrl = null;

      if (reviewImage) {
        const fileExt = reviewImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `reviews/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('crop-scans')
          .upload(filePath, reviewImage);

        if (uploadError) {
          console.error("Image upload failed:", uploadError);
          throw uploadError;
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('crop-scans')
          .getPublicUrl(filePath);
          
        uploadedImageUrl = publicUrlData.publicUrl;
      }

      const updateData: any = { user_rating: rating, user_feedback: feedback };
      if (uploadedImageUrl) {
        updateData.user_feedback_image_url = uploadedImageUrl;
      }

      const { error } = await supabase
        .from('disease_reports')
        .update(updateData)
        .eq('id', selectedReport.id);
      
      if (error) throw error;
      
      // Update local state
      const updatedRaw = { ...selectedReport.raw, ...updateData };
      const updatedReport = { ...selectedReport, raw: updatedRaw };
      
      setReports(reports.map(r => r.id === selectedReport.id ? updatedReport : r));
      setSelectedReport(updatedReport);
      
      alert(language === 'en' ? "Review submitted successfully!" : "समीक्षा सफलतापूर्वक सबमिट की गई!");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(language === 'en' ? "Failed to submit review." : "समीक्षा सबमिट करने में विफल।");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const mockHistoricalReports = [
    {
      id: "REP-0192",
      type: "Disease Scan",
      date: "Sep 12, 2026",
      title: "Wheat Rust Analysis",
      severity: "High",
      icon: ShieldAlert,
      themeColor: "#C53030",
    },
    {
      id: "REP-0191",
      type: "Farm Plan",
      date: "Aug 05, 2026",
      title: "Soybean Yield Strategy",
      severity: "Optimal",
      icon: Sprout,
      themeColor: "#1A6B45",
    },
    {
      id: "REP-0190",
      type: "Soil Test",
      date: "Jul 22, 2026",
      title: "Nitrogen Deficiency",
      severity: "Warning",
      icon: AlertTriangle,
      themeColor: "#B67D14",
    },
    {
      id: "REP-0189",
      type: "Disease Scan",
      date: "Jul 10, 2026",
      title: "Healthy Rice Crop",
      severity: "Optimal",
      icon: CheckCircle2,
      themeColor: "#1A6B45",
    },
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) {
          setReports(mockHistoricalReports);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('disease_reports')
          .select('*')
          .eq('farmer_id', userData.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const dbReports = data.map(dbReq => ({
            id: dbReq.id,
            type: "Disease Scan",
            date: new Date(dbReq.created_at).toLocaleDateString(),
            title: dbReq.disease_name,
            severity: dbReq.severity_level.charAt(0).toUpperCase() + dbReq.severity_level.slice(1),
            icon: ShieldAlert,
            themeColor: dbReq.severity_level === 'high' || dbReq.severity_level === 'critical' ? "#C53030" : "#B67D14",
            raw: dbReq
          }));
          setReports([...dbReports, ...mockHistoricalReports]);
        } else {
          setReports(mockHistoricalReports);
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setReports(mockHistoricalReports);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDownloadMaster = async () => {
    setIsDownloadingMaster(true);
    try {
      await downloadAsPDF("master-synthesis-report", "KisanAI_Master_Synthesis");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloadingMaster(false);
    }
  };

  const handleDownloadHistory = async () => {
    if (!selectedReport) return;
    setIsDownloadingHistory(true);
    try {
      await downloadAsPDF("historical-report-content", `KisanAI_${selectedReport.title.replace(/\s+/g, '_')}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloadingHistory(false);
    }
  };



  return (
    <div className="pb-16 space-y-6 max-w-4xl mx-auto">
      
      {/* ─── HEADER ─── */}
      <motion.div {...fade(0)} className="mb-4">
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-primary/60 block mb-3">
          {language === 'en' ? "Data Synthesis" : "डेटा संश्लेषण"}
        </span>
        <h1 className="font-display font-semibold text-primary text-4xl md:text-5xl leading-[1.1] mb-2">
          {language === 'en' ? "Farm Reports." : "फार्म रिपोर्ट।"}
        </h1>
        <p className="text-muted/80 text-lg">
          {language === 'en' ? "Your complete agronomic history and final synthesis." : "आपका संपूर्ण कृषि इतिहास और अंतिम संश्लेषण।"}
        </p>
      </motion.div>

      {/* ─── MASTER FARM SYNTHESIS (FULL FINAL REPORT) ─── */}
      <motion.div {...fade(0.1)} id="master-synthesis-report" className="relative overflow-hidden rounded-[2rem] p-6 md:p-10 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #1A4731 0%, #0f2a1d 60%, #1a3a20 100%)",
        }}>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #C8800F 0%, transparent 70%)" }} />
        <div className="absolute -bottom-16 left-0 w-64 h-64 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #78BE6E 0%, transparent 70%)" }} />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="font-mono text-[11px] tracking-widest uppercase text-white/50">
                  {language === 'en' ? "Master Synthesis" : "मास्टर संश्लेषण"}
                </h2>
                <p className="font-body font-semibold text-white/90 text-sm">
                  {language === 'en' ? "Final Report • Q3 2026" : "अंतिम रिपोर्ट • Q3 2026"}
                </p>
              </div>
            </div>

            <h3 className="font-display text-white text-3xl md:text-4xl leading-snug mb-6">
              {language === 'en' 
                ? "Your farm's resilience has improved by 18%, but immediate action is required on Wheat Rust." 
                : "आपके खेत के स्वास्थ्य में 18% सुधार हुआ है, लेकिन गेहूं रस्ट पर तत्काल कार्रवाई की आवश्यकता है।"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="font-mono text-[10px] uppercase text-white/50 mb-1">Overall Health</p>
                <p className="font-display text-3xl text-white">86<span className="text-lg text-white/40">/100</span></p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="font-mono text-[10px] uppercase text-white/50 mb-1">Projected Yield</p>
                <p className="font-display text-3xl text-white">4.2<span className="text-lg text-white/60">T/ha</span></p>
              </div>
            </div>
          </div>

          {/* Action List */}
          <div className="w-full md:w-72 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shrink-0">
            <h4 className="font-mono text-[10px] tracking-widest uppercase text-white/50 mb-4">
              {language === 'en' ? "Critical Actions" : "महत्वपूर्ण कार्रवाई"}
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <ShieldAlert className="w-4 h-4 text-error mt-0.5 shrink-0" />
                <p className="text-sm text-white/90 leading-relaxed font-light">
                  <strong className="font-medium text-white block">Spray Fungicide</strong>
                  Apply Propiconazole within 48 hours for Wheat Rust containment.
                </p>
              </li>
              <li className="flex gap-3 items-start">
                <AlertTriangle className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                <p className="text-sm text-white/90 leading-relaxed font-light">
                  <strong className="font-medium text-white block">Delay Irrigation</strong>
                  Halt watering due to 40mm expected rainfall on Thursday.
                </p>
              </li>
              <li className="flex gap-3 items-start">
                <Zap className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <p className="text-sm text-white/90 leading-relaxed font-light">
                  <strong className="font-medium text-white block">Harvest Soy</strong>
                  Optimal window opens in exactly 12 days.
                </p>
              </li>
            </ul>
            <button 
              onClick={handleDownloadMaster}
              disabled={isDownloadingMaster}
              className="w-full mt-6 py-3 bg-white text-primary rounded-xl font-medium text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDownloadingMaster ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {language === 'en' ? "Generating PDF..." : "पीडीएफ बन रहा है..."}</>
              ) : (
                <><Download className="w-4 h-4" /> {language === 'en' ? "Download Full PDF" : "पूर्ण पीडीएफ डाउनलोड करें"}</>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ─── HISTORICAL REPORTS GRID ─── */}
      <motion.div {...fade(0.2)}>
        <div className="flex items-center justify-between mb-6 mt-8">
          <h2 className="font-display text-2xl font-semibold text-primary">
            {language === 'en' ? "Historical Records" : "ऐतिहासिक रिकॉर्ड"}
          </h2>
          <span className="font-mono text-xs text-muted">
            {reports.length} {language === 'en' ? "entries" : "प्रविष्टियां"}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report, idx) => {
            const Icon = report.icon;
            return (
              <motion.div 
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (idx * 0.05) }}
                onClick={() => handleSelectReport(report)}
                className="group glass p-5 rounded-[1.5rem] border border-primary/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${report.themeColor}15` }}>
                      <Icon className="w-5 h-5" style={{ color: report.themeColor }} />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-0.5">{report.type}</p>
                      <p className="font-mono text-[11px] text-primary/70">{report.date}</p>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-md border text-[10px] font-mono uppercase tracking-wide"
                    style={{ borderColor: `${report.themeColor}30`, color: report.themeColor, backgroundColor: `${report.themeColor}05` }}>
                    {report.severity}
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <h3 className="font-display text-xl font-medium text-text group-hover:text-primary transition-colors">
                    {report.title}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            );
          })}
          </div>
        )}
      </motion.div>

      {/* ─── HISTORICAL REPORT MODAL ─── */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedReport(null)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-background rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header Actions */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button 
                onClick={handleDownloadHistory}
                disabled={isDownloadingHistory}
                className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-primary hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isDownloadingHistory ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setSelectedReport(null)}
                className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-muted hover:text-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - This is what gets captured in the PDF */}
            <div id="historical-report-content" className="p-8 overflow-y-auto bg-white">
              <div className="flex items-center gap-4 mb-6 mt-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${selectedReport.themeColor}15` }}>
                  <selectedReport.icon className="w-7 h-7" style={{ color: selectedReport.themeColor }} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-2xl text-text leading-tight">{selectedReport.title}</h3>
                  <p className="text-muted text-sm">{selectedReport.date} • {selectedReport.type}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: `${selectedReport.themeColor}05`, borderColor: `${selectedReport.themeColor}20` }}>
                <span className="font-mono text-[10px] uppercase tracking-widest block mb-1" style={{ color: selectedReport.themeColor }}>Status</span>
                <p className="font-medium text-lg" style={{ color: selectedReport.themeColor }}>{selectedReport.severity}</p>
              </div>

              <div className="space-y-4 text-sm text-text/80">
                {selectedReport.raw ? (
                  <>
                    <p><strong>{language === 'en' ? "Confidence:" : "आत्मविश्वास:"}</strong> {selectedReport.raw.confidence_score}%</p>
                    <p><strong>{language === 'en' ? "Symptoms Detected:" : "लक्षण पाए गए:"}</strong> {selectedReport.raw.symptoms_detected?.join(', ')}</p>
                    {selectedReport.raw.treatment_recs?.immediate && (
                      <p><strong>{language === 'en' ? "Immediate Treatment:" : "तत्काल उपचार:"}</strong> {selectedReport.raw.treatment_recs.immediate.join(', ')}</p>
                    )}
                    {selectedReport.raw.treatment_recs?.chemical && (
                      <p><strong>{language === 'en' ? "Chemical Treatment:" : "रासायनिक उपचार:"}</strong> {selectedReport.raw.treatment_recs.chemical.join(', ')}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p><strong>{language === 'en' ? "Summary:" : "सारांश:"}</strong> This historical record captures the state of the crop on {selectedReport.date}. Key interventions were recommended based on the data available at the time.</p>
                    <p><strong>{language === 'en' ? "Recommended Actions:" : "अनुशंसित कार्रवाई:"}</strong> Follow-up monitoring was advised to ensure crop stability. Yield projections were adjusted according to the {selectedReport.severity.toLowerCase()} severity level.</p>
                  </>
                )}
                <div className="h-40 w-full rounded-xl bg-gray-50 border border-black/5 flex items-center justify-center text-muted mt-6">
                  [Historical Data Chart Placeholder]
                </div>
              </div>

              {/* Review Section (Only for Real Reports) */}
              {selectedReport.raw && (
                <div className="mt-8 pt-6 border-t border-black/5">
                  <h4 className="font-display font-medium text-lg mb-4">
                    {language === 'en' ? "Was this diagnosis helpful?" : "क्या यह निदान उपयोगी था?"}
                  </h4>
                  
                  {selectedReport.raw?.user_rating ? (
                    <div className="bg-primary/5 rounded-xl p-4">
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-5 h-5 ${star <= selectedReport.raw.user_rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                        ))}
                      </div>
                      {selectedReport.raw.user_feedback && (
                        <p className="text-sm text-text/80 italic mb-3">"{selectedReport.raw.user_feedback}"</p>
                      )}
                      {selectedReport.raw.user_feedback_image_url && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-black/10">
                          <img src={selectedReport.raw.user_feedback_image_url} alt="Review attachment" className="w-full max-h-48 object-cover" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-5 border border-black/5">
                      <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star className={`w-6 h-6 ${(hoverRating || rating) >= star ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                          </button>
                        ))}
                      </div>
                      
                      {rating > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                          <textarea
                            placeholder={language === 'en' ? "Any additional feedback?" : "कोई अतिरिक्त प्रतिक्रिया?"}
                            className="w-full text-sm p-3 rounded-lg border border-black/10 focus:outline-none focus:border-primary mb-3 bg-white"
                            rows={2}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                          
                          <div className="flex items-center gap-3 mb-4">
                            <input 
                              type="file" 
                              accept="image/*" 
                              id="review-image-upload" 
                              className="hidden" 
                              onChange={handleImageSelect}
                            />
                            <label 
                              htmlFor="review-image-upload"
                              className="flex items-center gap-2 text-sm text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                            >
                              <ImagePlus className="w-4 h-4" />
                              {language === 'en' ? "Attach Photo" : "फोटो संलग्न करें"}
                            </label>
                            {reviewImagePreview && (
                              <div className="relative w-12 h-12 rounded-md overflow-hidden border border-black/10">
                                <img src={reviewImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                  onClick={(e) => { e.preventDefault(); setReviewImage(null); setReviewImagePreview(null); }}
                                  className="absolute -top-1 -right-1 bg-white rounded-full text-red-500 shadow-sm hover:scale-110 transition-transform"
                                >
                                  <X className="w-4 h-4 p-0.5 bg-white rounded-full border border-black/10" />
                                </button>
                              </div>
                            )}
                          </div>

                          <button 
                            onClick={handleSubmitReview}
                            disabled={isSubmittingReview}
                            className="bg-primary text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#153a27] transition-colors flex items-center gap-2"
                          >
                            {isSubmittingReview && <Loader2 className="w-4 h-4 animate-spin" />}
                            {language === 'en' ? "Submit Review" : "समीक्षा सबमिट करें"}
                          </button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
