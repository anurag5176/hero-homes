import { test, expect } from "@playwright/test";

const widths = [360, 390, 480, 768, 900, 1024, 1280, 1440];

async function noOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
}

test("primary paths, validation, success, failure and anchors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/?utm_source=qa&utm_medium=test&utm_campaign=sector-mu");
  await expect(page.locator("h1")).toHaveText("Hero Homes Sector MU, Greater Noida");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://herohomegroups.in/");

  await page.getByRole("button", { name: "Request brochure" }).click();
  await expect(page.locator("#form-dock input[name=enquiry_type]")).toHaveValue("brochure");

  await page.getByRole("button", { name: "Download floor plan" }).first().click();
  const form = page.locator("#form-dock");
  await expect(form.locator("input[name=enquiry_type]")).toHaveValue("floor_plan");
  await expect(form.locator("input[name=configuration]")).toHaveValue("3 BHK");

  await form.locator("button[type=submit]").click();
  await expect(form.getByText("Enter your full name.")).toBeVisible();
  await form.locator("input[name=name]").fill("Meera Shah");
  await form.locator("input[name=phone]").fill("12345");
  await form.locator("button[type=submit]").click();
  await expect(form.getByText("Enter a 10-digit Indian mobile number.")).toBeVisible();
  await form.locator("input[name=phone]").fill("9876543210");
  await form.locator("button[type=submit]").click();
  await expect(form.getByText("Confirm that we may contact you about this project.")).toBeVisible();

  await page.route("**/api/enquiry", (route) =>
    route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, code: "delivery_failed" })
    })
  );
  await form.locator("input[name=consent]").check();
  await form.locator("button[type=submit]").click();
  await expect(form.getByText(/not saved/)).toBeVisible();
  await expect(form.locator("input[name=name]")).toHaveValue("Meera Shah");

  await page.getByRole("button", { name: "Request project details" }).click();
  await page.unroute("**/api/enquiry");
  const [request] = await Promise.all([
    page.waitForRequest("**/api/enquiry"),
    form.locator("button[type=submit]").click()
  ]);
  const sent = request.postDataJSON();
  expect(sent.utm_source).toBe("qa");
  expect(sent.utm_campaign).toBe("sector-mu");
  expect(sent.enquiry_type).toBe("project_details");
  await expect(form.getByText(/has been recorded/)).toBeVisible();

  const summary = page.locator("#faq summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#faq details").first()).toHaveAttribute("open", "");

  const response = await page.goto("/sitemap.xml");
  expect(response.status()).toBe(200);
  const robots = await page.goto("/robots.txt");
  expect(robots.status()).toBe(200);
  const missing = await page.goto("/missing-page");
  expect(missing.status()).toBe(404);

  expect(errors).toEqual([]);
});

test("layouts stay within the viewport", async ({ page }) => {
  await page.goto("/");
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 800 ? 800 : 900 });
    expect(await noOverflow(page), `overflow at ${width}`).toBe(true);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const desktopHero = await page.evaluate(() => {
    const hero = document.querySelector(".hero").getBoundingClientRect();
    const header = document.querySelector(".site-header").getBoundingClientRect();
    return { height: hero.height, top: hero.top, bottom: hero.bottom, header: header.bottom, view: window.innerHeight };
  });
  expect(desktopHero.top).toBeGreaterThanOrEqual(desktopHero.header - 1);
  expect(desktopHero.bottom).toBeLessThanOrEqual(desktopHero.view + 1);
  expect(desktopHero.height).toBeLessThanOrEqual(desktopHero.view - desktopHero.header + 2);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const mobileHero = await page.evaluate(() => {
    const hero = document.querySelector(".hero").getBoundingClientRect();
    const header = document.querySelector(".site-header").getBoundingClientRect();
    const dock = document.querySelector("#lead-dock").getBoundingClientRect();
    return {
      bottom: hero.bottom,
      dockTop: dock.top,
      view: window.innerHeight,
      header: header.bottom
    };
  });
  expect(mobileHero.bottom).toBeLessThanOrEqual(mobileHero.dockTop + 2);
  expect(mobileHero.bottom).toBeLessThanOrEqual(mobileHero.view + 1);
  await page.goto("/#homes");
  const clearance = await page.evaluate(() => {
    const heading = document.querySelector("#homes h2").getBoundingClientRect().top;
    const header = document.querySelector(".site-header").getBoundingClientRect().bottom;
    return heading - header;
  });
  expect(clearance).toBeGreaterThanOrEqual(-1);
});

test("mobile sticky enquire stays usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const dock = page.locator("#lead-dock");
  await expect(dock).toBeVisible();
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await expect(dock).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const covered = await page.evaluate(() => {
    const footer = document.querySelector("#site-footer").getBoundingClientRect();
    const dockBox = document.querySelector("#lead-dock").getBoundingClientRect();
    return footer.bottom > dockBox.top + 2;
  });
  expect(covered).toBe(false);
  await dock.locator("input[name=name]").fill("Meera Shah");
  await expect(dock.locator("input[name=name]")).toHaveValue("Meera Shah");
});
