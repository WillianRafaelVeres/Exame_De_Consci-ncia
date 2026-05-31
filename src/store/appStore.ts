import { create } from 'zustand';

interface AppState {
  lastConfessionDate: string | null;
  activeSinCount: number;
  todayExamDone: boolean;
  loaded: boolean;
  setLastConfessionDate: (date: string | null) => void;
  setActiveSinCount: (count: number) => void;
  setTodayExamDone: (done: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  incrementActiveSinCount: () => void;
  decrementActiveSinCount: () => void;
  resetAfterConfession: (date: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  lastConfessionDate: null,
  activeSinCount: 0,
  todayExamDone: false,
  loaded: false,
  setLastConfessionDate: (date) => set({ lastConfessionDate: date }),
  setActiveSinCount: (count) => set({ activeSinCount: count }),
  setTodayExamDone: (done) => set({ todayExamDone: done }),
  setLoaded: (loaded) => set({ loaded }),
  incrementActiveSinCount: () =>
    set((state) => ({ activeSinCount: state.activeSinCount + 1 })),
  decrementActiveSinCount: () =>
    set((state) => ({ activeSinCount: Math.max(0, state.activeSinCount - 1) })),
  resetAfterConfession: (date) =>
    set({ lastConfessionDate: date, activeSinCount: 0 }),
}));
