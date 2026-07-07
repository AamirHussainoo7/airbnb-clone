import { create } from 'zustand';

const useSearchStore = create((set) => ({
  location: '',
  checkIn: null,
  checkOut: null,
  guests: { adults: 1, children: 0, infants: 0, pets: 0 },
  category: 'all',
  priceMin: 0,
  priceMax: 50000,
  isSearchModalOpen: false,
  activeTab: 'location', // 'location' | 'dates' | 'guests'

  setLocation: (location) => set({ location }),
  setCheckIn: (date) => set({ checkIn: date }),
  setCheckOut: (date) => set({ checkOut: date }),
  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuests: (guests) => set({ guests }),
  updateGuests: (type, value) =>
    set((state) => ({
      guests: { ...state.guests, [type]: Math.max(0, value) },
    })),
  setCategory: (category) => set({ category }),
  setPriceRange: (min, max) => set({ priceMin: min, priceMax: max }),
  openSearchModal: (tab = 'location') => set({ isSearchModalOpen: true, activeTab: tab }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  clearSearch: () =>
    set({
      location: '',
      checkIn: null,
      checkOut: null,
      guests: { adults: 1, children: 0, infants: 0, pets: 0 },
    }),
}));

export default useSearchStore;
