import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "playwright-report/results.json" }],
    process.env.CI ? ["github"] : ["list"],
  ],
  use: {
    baseURL: process.env.APP_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        locale: "pt-BR",
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        locale: "pt-BR",
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        locale: "pt-BR",
      },
    },
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
        locale: "pt-BR",
      },
    },
    {
      name: "Mobile Safari",
      use: {
        ...devices["iPhone 13"],
        locale: "pt-BR",
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
