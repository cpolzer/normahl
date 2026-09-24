import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.normahl.de',
  // GitHub Pages serves under /normahl/; the SFTP webspace build sets BASE_PATH=/
  base: process.env.BASE_PATH || '/normahl/',
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  devToolbar: {
    enabled: false,
  },
});
