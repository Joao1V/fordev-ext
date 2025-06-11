import { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

export function createExtensionStoragePersister() {
   const key = 'REACT_QUERY_OFFLINE_CACHE';
   const storage = browser.storage.local;

   return {
      async persistClient(client: PersistedClient): Promise<void> {
         const jsonString = JSON.stringify(client || {});

         await storage.set({ [key]: jsonString });
      },
      async restoreClient(): Promise<PersistedClient | undefined> {
         const storedState = await storage.get(key);

         if (storedState && storedState[key]) {
            return JSON.parse(storedState[key]);
         }
         return undefined;
      },
      removeClient(): Promise<void> {
         return storage.remove(key);
      },
   } as Persister;
}
