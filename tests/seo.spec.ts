import { test, expect, BASE } from './fixtures';

const PAGES = ['', 'konzerte/', 'presse/', 'impressum/', 'datenschutz/'];

test.describe('Head links', () => {
  for (const p of PAGES) {
    test(`canonical + feed link on /${p}`, async ({ page }) => {
      await page.goto(BASE + p);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.normahl.de/${p}`);
      await expect(page.locator('link[rel="alternate"][type="application/atom+xml"]'))
        .toHaveAttribute('href', `${BASE}konzerte/feed.xml`);
    });
  }

  test('login page is noindex', async ({ page }) => {
    await page.goto(BASE + 'login/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });
});

test.describe('Endpoints', () => {
  test('feed is well-formed Atom with canonical URLs', async ({ page, request }) => {
    const res = await request.get(`${BASE}konzerte/feed.xml`);
    expect(res.ok()).toBe(true);
    const xml = await res.text();
    await page.goto(BASE);
    const root = await page.evaluate((x) => {
      const doc = new DOMParser().parseFromString(x, 'application/xml');
      if (doc.querySelector('parsererror')) return 'parsererror';
      return `${doc.documentElement.namespaceURI} ${doc.documentElement.localName}`;
    }, xml);
    expect(root).toBe('http://www.w3.org/2005/Atom feed');
    expect(xml).toContain('<link rel="self" type="application/atom+xml" href="https://www.normahl.de/konzerte/feed.xml"/>');
    expect(xml).not.toContain('/normahl/');
  });

  test('sitemap lists public pages with canonical URLs', async ({ request }) => {
    const xml = await (await request.get(`${BASE}sitemap.xml`)).text();
    for (const p of PAGES) expect(xml).toContain(`<loc>https://www.normahl.de/${p}</loc>`);
    expect(xml).not.toContain('login');
    expect(xml).not.toContain('/normahl/');
  });

  test('robots.txt points to sitemap', async ({ request }) => {
    const txt = await (await request.get(`${BASE}robots.txt`)).text();
    expect(txt).toContain('User-agent: *');
    expect(txt).toContain('Sitemap: https://www.normahl.de/sitemap.xml');
  });
});
