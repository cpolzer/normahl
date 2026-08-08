import { test, expect } from '@playwright/test';

const BASE = '/normahl/';

// Skip auth gate — set the sessionStorage token before each test
test.beforeEach(async ({ page, context }) => {
  // We need the hash to be set in storage before navigation.
  // Use a dummy non-empty value so the guard doesn't redirect when
  // PUBLIC_PASSWORD_HASH is undefined (dev build without env var).
  await context.addInitScript(() => {
    sessionStorage.setItem('normahl_auth', '__bypass_for_test__');
  });
  // If the site has no password set (local preview build), the guard
  // checks `if (passwordHash && ...)` and skips — so tests pass either way.
});

test.describe('Header', () => {
  test('logo is visible', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('.logo-img')).toBeVisible();
  });

  test('nav links visible on desktop/tablet', async ({ page, viewport }) => {
    if ((viewport?.width ?? 0) < 641) test.skip();
    await page.goto(BASE);
    await expect(page.locator('.nav-link', { hasText: 'Konzerte' })).toBeVisible();
    await expect(page.locator('.nav-link', { hasText: 'Presse' })).toBeVisible();
  });

  test('mobile toggle button visible on mobile', async ({ page, viewport }) => {
    if ((viewport?.width ?? 9999) >= 641) test.skip();
    await page.goto(BASE);
    await expect(page.locator('.mobile-toggle')).toBeVisible();
  });

  test('mobile menu opens on toggle click', async ({ page, viewport }) => {
    if ((viewport?.width ?? 9999) >= 641) test.skip();
    await page.goto(BASE);
    await page.locator('.mobile-toggle').click();
    await expect(page.locator('.main-nav')).toHaveClass(/open/);
  });

  test('mobile nav items are left-aligned', async ({ page, viewport }) => {
    if ((viewport?.width ?? 9999) >= 641) test.skip();
    await page.goto(BASE);
    await page.locator('.mobile-toggle').click();
    await expect(page.locator('.main-nav')).toHaveClass(/open/);
    const navList = page.locator('.nav-list');
    const textAlign = await navList.evaluate(el => getComputedStyle(el).textAlign);
    expect(textAlign).toBe('left');
  });

  test('mobile nav items are not obscured by config bar', async ({ page, viewport }) => {
    if ((viewport?.width ?? 9999) >= 641) test.skip();
    await page.goto(BASE);
    const configBar = page.locator('#config-bar');
    if (await configBar.count() === 0) return;
    // Config bar must sit below the header (z-index 100) so mobile nav covers it
    const configZIndex = await configBar.evaluate(el => parseInt(getComputedStyle(el).zIndex) || 0);
    expect(configZIndex).toBeLessThan(100);
  });

  test('social icons visible on desktop', async ({ page, viewport }) => {
    if ((viewport?.width ?? 0) < 641) test.skip();
    await page.goto(BASE);
    await expect(page.locator('.nav-social')).toBeVisible();
  });
});

test.describe('Hero', () => {
  test('hero section renders', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('.hero')).toBeVisible();
  });

  test('hero logo visible', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('.hero-logo')).toBeVisible();
  });

  test('hero action buttons present', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('.hero-actions .btn')).toHaveCount(3);
  });
});

test.describe('Concerts section', () => {
  test('concerts heading visible', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('#konzerte')).toBeVisible();
  });

  test('at least one concert card rendered', async ({ page }) => {
    await page.goto(BASE);
    const cards = page.locator('.concert-card');
    await expect(cards.first()).toBeVisible();
  });

  test('"Alle Konzerte" link present', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(`a[href$="konzerte"]`).last()).toBeVisible();
  });
});

test.describe('Konzerte page', () => {
  test('loads and shows upcoming concerts', async ({ page }) => {
    await page.goto(`${BASE}konzerte`);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('table, .concert-row').first()).toBeVisible();
  });

  test('year tabs present for past concerts', async ({ page }) => {
    await page.goto(`${BASE}konzerte`);
    await expect(page.locator('.year-btn').first()).toBeVisible();
  });
});

test.describe('Presse page', () => {
  test('loads with press sections', async ({ page }) => {
    await page.goto(`${BASE}presse`);
    await expect(page.locator('#bilder')).toBeVisible();
    await expect(page.locator('#promo')).toBeVisible();
    await expect(page.locator('#druck')).toBeVisible();
  });

  test('press images render', async ({ page }) => {
    await page.goto(`${BASE}presse`);
    const imgs = page.locator('.press-gallery .press-image img');
    await expect(imgs.first()).toBeVisible();
  });
});

test.describe('Footer', () => {
  test('all four footer columns present', async ({ page }) => {
    await page.goto(BASE);
    const cols = page.locator('.footer-col');
    await expect(cols).toHaveCount(4);
  });

  test('social icons in footer', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('.footer-social a')).toHaveCount(4);
  });

  test('impressum and datenschutz links present', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('a[href$="impressum"]')).toBeVisible();
    await expect(page.locator('a[href$="datenschutz"]')).toBeVisible();
  });
});
