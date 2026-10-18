import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
spawnSync("node", ["scripts/build.mjs"], { cwd: root, stdio: "inherit" });
const out = path.join(root, "qa", "screenshots");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const port = 4183;
const server = spawn("node", ["scripts/server.mjs"], {
  cwd: root,
  env: { ...process.env, PORT: String(port), LEAD_LOCAL_STORE: "true", LEAD_STORE_PATH: "data/leads/capture.jsonl" },
  stdio: "ignore"
});

function waitForServer() {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/`);
        if (response.ok) return resolve();
      } catch {
        /* retry */
      }
      if (Date.now() - started > 15000) return reject(new Error("server did not start"));
      setTimeout(tick, 200);
    };
    tick();
  });
}

const viewports = [
  ["desktop-1440", 1440, 900],
  ["desktop-1280", 1280, 800],
  ["tablet-1024", 1024, 768],
  ["tablet-768", 768, 1024],
  ["mobile-390", 390, 844],
  ["mobile-360", 360, 800]
];

const sections = ["enquire", "facts", "overview", "homes", "amenities", "location", "pricing", "faq", "visit"];

await waitForServer();
const browser = await chromium.launch();
const notes = [];

try {
  for (const [name, width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height } });
    const logs = [];
    page.on("pageerror", (error) => logs.push(error.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") logs.push(msg.text());
    });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(out, `${name}-hero.png`) });
    await page.screenshot({ path: path.join(out, `${name}-full.png`), fullPage: true });
    for (const id of sections) {
      await page.evaluate((sectionId) => {
        document.getElementById(sectionId).scrollIntoView({ block: "start" });
      }, id);
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(out, `${name}-${id}.png`) });
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    notes.push(`${name} overflow=${overflow}px console=${logs.join(" | ") || "none"}`);
    await page.close();
  }

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await mobile.locator("#faq").scrollIntoViewIfNeeded();
  await mobile.locator("[data-mobile-bar] button").click();
  await mobile.screenshot({ path: path.join(out, "mobile-390-dialog.png") });
  await mobile.locator("#form-dialog button[type=submit]").click();
  await mobile.screenshot({ path: path.join(out, "mobile-390-errors.png") });
  await mobile.locator("#form-dialog input[name=name]").fill("Meera Shah");
  await mobile.locator("#form-dialog input[name=phone]").fill("9876543210");
  await mobile.locator("#form-dialog input[name=consent]").check();
  await mobile.locator("#form-dialog button[type=submit]").click();
  await mobile.waitForSelector("#form-dialog .form-status.is-success");
  await mobile.screenshot({ path: path.join(out, "mobile-390-success.png") });
  await mobile.close();

  const failPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await failPage.route("**/api/enquiry", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, code: "not_configured" })
    })
  );
  await failPage.goto(`http://127.0.0.1:${port}/#pricing`, { waitUntil: "networkidle" });
  const form = failPage.locator("#form-price");
  await form.locator("input[name=name]").fill("Meera Shah");
  await form.locator("input[name=phone]").fill("9876543210");
  await form.locator("input[name=consent]").check();
  await form.locator("button[type=submit]").click();
  await failPage.waitForSelector("#form-price .form-status.is-warning");
  await failPage.screenshot({ path: path.join(out, "desktop-1280-not-configured.png") });
  await failPage.close();
} finally {
  await browser.close();
  server.kill();
}

fs.writeFileSync(path.join(root, "qa", "capture-notes.txt"), `${notes.join("\n")}\n`);
console.log(notes.join("\n"));
