import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const home = fs.readFileSync(path.join(dist, "index.html"), "utf8");

test("home page has one h1, canonical metadata and crawlable FAQs", () => {
  assert.equal((home.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(home, /<link rel="canonical" href="https:\/\/herohomegroups\.in\/">/);
  assert.match(home, /Hero Homes Sector MU, Greater Noida \| Price &amp; Floor Plans/);
  assert.match(home, /name="robots" content="index, follow"/);
  assert.match(home, /UPRERAPRJ414014\/10\/2026/);
  assert.match(home, /153\.84–212\.68 sq m/);
  assert.match(home, /Where is Hero Homes Sector MU located/);
  assert.match(home, /<summary>/);
  assert.doesNotMatch(home, /type="checkbox"[^>]*checked/);
});

test("public copy leaves out unverified commercial claims", () => {
  const banned = ["Aawasyam", "dream home", "guaranteed", "536 units", "1.82"];
  for (const phrase of banned) {
    assert.equal(home.includes(phrase), false, phrase);
  }
});

test("robots and sitemap expose the intended URLs only", () => {
  const robots = fs.readFileSync(path.join(dist, "robots.txt"), "utf8");
  const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
  assert.match(robots, /Allow: \//);
  assert.doesNotMatch(robots, /Disallow: \//);
  assert.match(sitemap, /https:\/\/herohomegroups\.in\/</);
  assert.match(sitemap, /https:\/\/herohomegroups\.in\/privacy</);
  assert.match(sitemap, /https:\/\/herohomegroups\.in\/terms</);
  assert.doesNotMatch(sitemap, /404/);
});

test("fonts and stylesheet are local", () => {
  assert.match(home, /poppins-400\.woff2/);
  assert.match(fs.readFileSync(path.join(dist, "assets", "styles.css"), "utf8"), /font-family:\s*Poppins/);
  for (const weight of [400, 500, 600, 700]) {
    assert.equal(fs.existsSync(path.join(dist, "assets", "fonts", `poppins-${weight}.woff2`)), true);
  }
});
