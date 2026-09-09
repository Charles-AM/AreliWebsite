import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        payment: resolve(__dirname, 'payment.html'),
        admin: resolve(__dirname, 'areli-atelier-7k3p.html'),
      },
    },
  },
});
