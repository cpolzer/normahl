import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.normahl.de',
  base: '/normahl',
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
});
