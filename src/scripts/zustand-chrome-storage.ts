import { StateStorage } from 'zustand/middleware';

const ChromeLocalStorage: StateStorage = {
   getItem: async (name: string): Promise<string | null> => {
      try {
         const result = await browser.storage.local.get(name);
         return result[name] ?? null;
      } catch (error) {
         console.error('Error getting item from storage:', error);
         return null;
      }
   },
   setItem: async (name: string, value: string): Promise<void> => {
      try {
         await browser.storage.local.set({ [name]: value });
      } catch (error) {
         console.error('Error setting item in storage:', error);
      }
   },
   removeItem: async (name: string): Promise<void> => {
      try {
         await browser.storage.local.remove(name);
      } catch (error) {
         console.error('Error removing item from storage:', error);
      }
   },
};

export default ChromeLocalStorage;
