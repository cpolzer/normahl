export const SITE = 'https://www.normahl.de';

/**
 * Absolute www.normahl.de URL for `path`, stripping the build's base path
 * (`/normahl/` on GitHub Pages, `/` on the webspace). Directory-style paths
 * get a trailing slash to match Astro's `directory` build format.
 * `path` must be a bare pathname (no query string or hash).
 */
export function canonical(path: string, base: string = import.meta.env.BASE_URL): string {
  const b = base.endsWith('/') ? base : `${base}/`;
  let p = '/' + path.replace(/^\/+/, '');
  if (`${p}/` === b) p = '/';
  else if (p.startsWith(b)) p = p.slice(b.length - 1);
  const last = p.split('/').pop() ?? '';
  if (!p.endsWith('/') && !last.includes('.')) p += '/';
  return new URL(p, SITE).href;
}
