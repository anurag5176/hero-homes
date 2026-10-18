import { defineConfig } from "@playwright/test";

const port = 4188;

export default defineConfig({
  testDir: "tests",
  testMatch: /e2e\.spec\.js/,
  timeout: 30_000,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    headless: true
  },
  webServer: {
    command: `npm run build && SMTP_HOST= SMTP_USER= SMTP_PASS= SMTP_FROM= SMTP_TO= LEAD_LOCAL_STORE=true LEAD_STORE_PATH=data/leads/e2e.jsonl PORT=${port} node scripts/server.mjs`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: false,
    timeout: 60_000
  }
});
