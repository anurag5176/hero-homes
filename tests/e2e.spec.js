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

  await page.getByRole("button", { name: "Request Project Brochure" }).click({ force: true });
  const form = page.locator("#form-popup");
  await expect(page.locator("#enquiry-dialog")).toHaveJSProperty("open", true);
  await expect(form.locator("input[name=enquiry_type]")).toHaveValue("brochure");
  await expect(form.getByRole("button", { name: "Enquire Now" })).toBeVisible();

  await page.getByRole("button", { name: "Get 3 BHK Floor Plan" }).first().evaluate((node) => node.click());
  await expect(form.locator("input[name=enquiry_type]")).toHaveValue("floor_plan");
  await expect(form.locator("input[name=configuration]")).toHaveValue("3 BHK + 2 Toilets");

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

  await page.locator("#contact").getByRole("button", { name: "Get Project Details" }).evaluate((node) => node.click());
  await page.unroute("**/api/enquiry");
  const [request] = await Promise.all([
    page.waitForRequest("**/api/enquiry"),
    form.locator("button[type=submit]").click()
  ]);
  const sent = request.postDataJSON();
  expect(sent.utm_source).toBe("qa");
  expect(sent.utm_campaign).toBe("sector-mu");
  expect(sent.enquiry_type).toBe("project_details");
  await expect(form.getByText(/reach out to you shortly/)).toBeVisible();
  await page.keyboard.press("Escape");

  const summary = page.locator("#faq summary").first();
  await summary.scrollIntoViewIfNeeded();
  if (await page.locator("#enquiry-dialog").evaluate((node) => node.open)) {
    await page.keyboard.press("Escape");
  }
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
  const desktopFit = await page.evaluate(() => {
    const hero = document.querySelector(".hero").getBoundingClientRect();
    const copy = document.querySelector(".hero-copy").getBoundingClientRect();
    const card = document.querySelector(".hero-card").getBoundingClientRect();
    const strip = document.querySelector(".hero-strip").getBoundingClientRect();
    return {
      copy: hero.bottom - copy.bottom,
      card: strip.top - card.bottom,
      strip: hero.bottom - strip.bottom
    };
  });
  expect(desktopFit.copy).toBeGreaterThanOrEqual(-1);
  expect(desktopFit.card).toBeGreaterThanOrEqual(-1);
  expect(desktopFit.strip).toBeGreaterThanOrEqual(-1);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const mobileOrder = await page.evaluate(() => {
    const top = (selector) => document.querySelector(selector).getBoundingClientRect().top;
    return {
      headline: top("h1"),
      image: top(".hero-media"),
      form: top(".hero-card"),
      strip: top(".hero-strip")
    };
  });
  expect(mobileOrder.headline).toBeLessThan(mobileOrder.image);
  expect(mobileOrder.image).toBeLessThan(mobileOrder.form);
  expect(mobileOrder.form).toBeLessThan(mobileOrder.strip);
  await page.goto("/#homes");
  const clearance = await page.evaluate(() => {
    const heading = document.querySelector("#homes h2").getBoundingClientRect().top;
    const header = document.querySelector(".site-header").getBoundingClientRect().bottom;
    return heading - header;
  });
  expect(clearance).toBeGreaterThanOrEqual(-1);
});

test("mobile enquiry card sits in the hero and can be filled", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const dock = page.locator(".hero-card");
  await expect(dock).toBeVisible();
  await expect(dock.getByRole("heading", { level: 1 })).toHaveCount(0);
  const placed = await page.evaluate(() => getComputedStyle(document.querySelector(".hero-card")).position);
  expect(placed).not.toBe("fixed");
  await dock.locator("input[name=name]").fill("Meera Shah");
  await expect(dock.locator("input[name=name]")).toHaveValue("Meera Shah");
  await page.locator("#faq").scrollIntoViewIfNeeded();
  const footerClear = await page.evaluate(() => {
    const footer = document.querySelector("#site-footer").getBoundingClientRect();
    return footer.height > 0 && footer.width > 0;
  });
  expect(footerClear).toBe(true);
});
