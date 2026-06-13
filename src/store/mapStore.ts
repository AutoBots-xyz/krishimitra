import { create } from 'zustand';

interface MapState {
  radius: number;
  diseaseCategory: string | null;
  setRadius: (radius: number) => void;
  setDiseaseCategory: (category: string | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  radius: 15,
  diseaseCategory: null,
  setRadius: (radius) => set({ radius }),
  setDiseaseCategory: (diseaseCategory) => set({ diseaseCategory }),
}));
