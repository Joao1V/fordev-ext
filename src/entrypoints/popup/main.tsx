import React from 'react';
import { createRoot } from 'react-dom/client';
import '@/assets/tailwind.css';
import App from './App.tsx';
import { Providers } from '@/components/providers.tsx';

const domNode = document.getElementById('root');
const root = createRoot(domNode!);


root.render(
   <Providers>
      <App />
   </Providers>,
);
