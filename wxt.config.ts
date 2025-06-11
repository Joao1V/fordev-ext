import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
   srcDir: 'src',
   modules: ['@wxt-dev/module-react'],
   outDir: 'dist',
   manifest: {
      name: 'FOR Devs',
      description: 'Gerador de CPF, CNPJ e CEP, AutoFill de Forms',
      permissions: ['storage', 'tabs', 'activeTab', 'scripting'],
      host_permissions: ['<all_urls>'],
   },

   dev: {
      server: {
         port: 5175,
      },
   },
   vite: () => ({
      plugins: [tailwindcss()],
   }),
});
