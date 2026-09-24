import type { APIRoute } from 'astro';
import { canonical } from '../lib/urls';

// /login is kept out of the index via <meta name="robots" content="noindex">,
// not Disallow: a disallowed page can't be crawled, so its noindex is never seen.
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${canonical('/sitemap.xml', '/')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
