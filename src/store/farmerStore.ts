import { create } from 'zustand';

export interface RiskPoint {
  id: number;
  lat: number;
  lng: number;
  riskScore: number;
  riskLevel: string;
  temp: string;
  rain: string;
  predictedCases: number;
  radius: number;
  color: string;
  en: { name: string; state: string; disease: string; cropType: string; };
  hi: { name: string; state: string; disease: string; cropType: string; };
}

const initialRiskPoints: RiskPoint[] = [
  // Bhopal Area Cluster
  { id: 1, lat: 23.2599, lng: 77.4126, riskScore: 0.88, riskLevel: "HIGH", temp: "34.2°C", rain: "310mm", predictedCases: 35, radius: 550, color: "#C53030",
    en: { name: "Bhopal Central Farm", state: "Madhya Pradesh", disease: "Rice Blast", cropType: "Rice" },
    hi: { name: "भोपाल सेंट्रल फार्म", state: "मध्य प्रदेश", disease: "चावल ब्लास्ट", cropType: "चावल" } },
  { id: 2, lat: 23.2750, lng: 77.4250, riskScore: 0.65, riskLevel: "MEDIUM", temp: "34.0°C", rain: "315mm", predictedCases: 21, radius: 450, color: "#C8800F",
    en: { name: "Bhopal Northern Fields", state: "Madhya Pradesh", disease: "Rice Blast", cropType: "Rice" },
    hi: { name: "भोपाल उत्तरी खेत", state: "मध्य प्रदेश", disease: "चावल ब्लास्ट", cropType: "चावल" } },
  { id: 3, lat: 23.2450, lng: 77.4000, riskScore: 0.92, riskLevel: "HIGH", temp: "34.5°C", rain: "305mm", predictedCases: 42, radius: 600, color: "#C53030",
    en: { name: "Bhopal South Plot", state: "Madhya Pradesh", disease: "Rice Blast", cropType: "Rice" },
    hi: { name: "भोपाल दक्षिणी प्लॉट", state: "मध्य प्रदेश", disease: "चावल ब्लास्ट", cropType: "चावल" } },
  { id: 4, lat: 23.2680, lng: 77.3950, riskScore: 0.42, riskLevel: "MEDIUM", temp: "33.8°C", rain: "320mm", predictedCases: 12, radius: 400, color: "#C8800F",
    en: { name: "Bhopal West Co-op", state: "Madhya Pradesh", disease: "Rice Blast (Early Stage)", cropType: "Rice" },
    hi: { name: "भोपाल पश्चिमी को-ऑप", state: "मध्य प्रदेश", disease: "चावल ब्लास्ट (प्रारंभिक)", cropType: "चावल" } },
  { id: 5, lat: 23.2500, lng: 77.4400, riskScore: 0.15, riskLevel: "LOW", temp: "34.1°C", rain: "310mm", predictedCases: 0, radius: 500, color: "#1A6B45",
    en: { name: "Bhopal East Estate", state: "Madhya Pradesh", disease: "None", cropType: "Rice" },
    hi: { name: "भोपाल पूर्वी एस्टेट", state: "मध्य प्रदेश", disease: "कोई नहीं", cropType: "चावल" } },
];

interface FarmerState {
  profile: any | null;
  location: { lat: number; lng: number } | null;
  riskPoints: RiskPoint[];
  setProfile: (profile: any) => void;
  setLocation: (location: { lat: number; lng: number }) => void;
  addRiskPoint: (point: RiskPoint) => void;
}

export const useFarmerStore = create<FarmerState>((set) => ({
  profile: null,
  location: null,
  riskPoints: initialRiskPoints,
  setProfile: (profile) => set({ profile }),
  setLocation: (location) => set({ location }),
  addRiskPoint: (point) => set((state) => ({ riskPoints: [...state.riskPoints, point] })),
}));
