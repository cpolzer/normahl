import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'tablet',  use: { ...devices['Desktop Chrome'], viewport: { width: 768,  height: 1024 } } },
    { name: 'mobile',  use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: 'http://localhost:4321/normahl/',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
