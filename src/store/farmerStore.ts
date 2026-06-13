import { create } from 'zustand';

interface FarmerState {
  profile: any | null;
  location: { lat: number; lng: number } | null;
  setProfile: (profile: any) => void;
  setLocation: (location: { lat: number; lng: number }) => void;
}

export const useFarmerStore = create<FarmerState>((set) => ({
  profile: null,
  location: null,
  setProfile: (profile) => set({ profile }),
  setLocation: (location) => set({ location }),
}));
