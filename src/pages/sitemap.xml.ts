import type { APIRoute } from 'astro';
import site from '../data/site.json';
import { canonical } from '../lib/urls';

const paths = ['/', '/konzerte/', '/presse/', ...(site.showNews ? ['/news/'] : []), '/impressum/', '/datenschutz/'];

export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(p => `  <url><loc>${canonical(p, '/')}</loc></url>`).join('\n')}
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
