import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.normahl.de',
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
});
