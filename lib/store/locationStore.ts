import { create } from "zustand";

type LocationFilters = {
  search: string;
  region: string;
  locationType: string;
  sort: string;
};

type LocationStore = {
  filters: LocationFilters;
  setSearch: (value: string) => void;
  setRegion: (value: string) => void;
  setLocationType: (value: string) => void;
  setSort: (value: string) => void;
  resetFilters: () => void;
};

const initialFilters: LocationFilters = {
  search: "",
  region: "",
  locationType: "",
  sort: "",
};

export const useLocationStore = create<LocationStore>((set) => ({
  filters: initialFilters,
  setSearch: (value) =>
    set((state) => ({ filters: { ...state.filters, search: value } })),
  setRegion: (value) =>
    set((state) => ({ filters: { ...state.filters, region: value } })),
  setLocationType: (value) =>
    set((state) => ({ filters: { ...state.filters, locationType: value } })),
  setSort: (value) =>
    set((state) => ({ filters: { ...state.filters, sort: value } })),
  resetFilters: () => set({ filters: initialFilters }),
}));
