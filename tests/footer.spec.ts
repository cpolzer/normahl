import { test, expect, BASE } from './fixtures';

test.describe('Footer', () => {
  test('five labelled media icons incl. feed', async ({ page }) => {
    await page.goto(BASE);
    const links = page.locator('.footer-social a');
    await expect(links).toHaveCount(5);
    for (const a of await links.all()) {
      await expect(a).toHaveAttribute('aria-label', /.+/);
      await expect(a.locator('svg')).toHaveAttribute('aria-hidden', 'true');
    }
    const feed = page.locator('.footer-social a[href$="konzerte/feed.xml"]');
    await expect(feed).toHaveAttribute('href', `${BASE}konzerte/feed.xml`);
    await expect(feed).toHaveAttribute('aria-label', 'Konzert-Feed (Atom)');
  });
});

test.describe('Icons', () => {
  test('header and footer use the same icon for each brand', async ({ page }) => {
    await page.goto(BASE);
    for (const label of ['Facebook', 'Instagram', 'YouTube', 'Spotify']) {
      const header = await page.locator(`.nav-social a[aria-label="${label}"] path`).getAttribute('d');
      const footer = await page.locator(`.footer-social a[aria-label="${label}"] path`).getAttribute('d');
      expect(header, label).toBe(footer);
    }
  });
});
