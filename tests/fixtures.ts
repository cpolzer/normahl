import { test as base, expect } from '@playwright/test';

export const BASE = '/normahl/';

// AuthGuard redirects to /login when the build has PUBLIC_PASSWORD_HASH set.
// Local/test builds have no hash, so the guard is a no-op; the dummy session
// token below is kept for parity with the original per-file setup.
export const test = base.extend<{ bypassAuth: void }>({
  bypassAuth: [
    async ({ context }, use) => {
      await context.addInitScript(() => sessionStorage.setItem('normahl_auth', '__bypass_for_test__'));
      await use();
    },
    { auto: true },
  ],
});

export { expect };
