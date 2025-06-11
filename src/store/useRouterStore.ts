import ChromeLocalStorage from '@/scripts/zustand-chrome-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface RouterState {
   route: string;
   setRoute: (route: string) => void;
}

export const useRouterStore = create<RouterState>()(
   persist(
      (set) => ({
         route: '/form',
         setRoute: (route: string) => set({ route: route }),
      }),
      {
         name: 'router-store',
         storage: createJSONStorage(() => ChromeLocalStorage),
         partialize: (state) => ({ route: state.route }),
      },
   ),
);
