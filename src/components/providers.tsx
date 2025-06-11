import { ReactNode, useState } from 'react';
import { HeroUIProvider } from '@heroui/react';
import { createExtensionStoragePersister } from '@/scripts/rq-chrome-storage.ts';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { BrowserRouter } from 'react-router-dom';

const persister = createExtensionStoragePersister();

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         refetchOnWindowFocus: false,
         refetchOnMount: false,
         refetchOnReconnect: false,
         retry: false,
         staleTime: 5 * 1000,
      },
   },
});

export function Providers({ children }: { children: ReactNode }) {
   const [isHydrated, setIsHydrated] = useState(false);

   return (
      <PersistQueryClientProvider
         persistOptions={{
            persister,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            buster: '1.0.0',
            dehydrateOptions: {
               shouldDehydrateMutation: () => true,
            },
         }}
         onSuccess={async () => {
            setIsHydrated(true);
            const cache = await persister.restoreClient();
            if (cache) {
               const jsonString = JSON.stringify(cache || {});
               const bytes = new TextEncoder().encode(jsonString).length;
               console.log(`📦 Cache size: ${(bytes / 1024).toFixed(2)} KB`);
            }
         }}
         client={queryClient}
      >
         <HeroUIProvider>
            <BrowserRouter>{isHydrated && children}</BrowserRouter>
         </HeroUIProvider>
      </PersistQueryClientProvider>
   );
}
