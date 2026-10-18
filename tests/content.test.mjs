import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const home = fs.readFileSync(path.join(dist, "index.html"), "utf8");

test("home page has one h1, canonical metadata and crawlable FAQs", () => {
  assert.equal((home.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(home, /<h1 class="reveal"><span class="hero-mark">Hero<\/span> Homes<br> Sector MU,<br> Greater Noida<\/h1>/);
  assert.match(home, /<link rel="canonical" href="https:\/\/www\.herohomesgroups\.in\/">/);
  assert.match(home, /<title>Hero Homes Greater Noida \| Price, Floor Plans &amp; Payment Plans<\/title>/);
  assert.match(home, /og:title" content="Hero Homes Greater Noida \| 3 BHK Homes in Sector MU"/);
  assert.match(home, /name="robots" content="index, follow"/);
  assert.match(home, /rel="icon" href="\/favicon\.ico"/);
  assert.match(home, /rel="icon" href="\/favicon\.png" type="image\/png" sizes="240x240"/);
  assert.match(home, /rel="apple-touch-icon" href="\/favicon\.png"/);
  assert.match(home, /property="og:image" content="https:\/\/www\.herohomesgroups\.in\/favicon\.png"/);
  assert.equal(fs.existsSync(path.join(dist, "favicon.ico")), true);
  assert.equal(fs.existsSync(path.join(dist, "favicon.png")), true);
  assert.doesNotMatch(home, /favicon\.(?:ico|png)\?/);
  assert.match(home, /UPRERAPRJ414014\/10\/2026/);
  assert.match(home, /Where is Hero Homes located in Greater Noida/);
  assert.match(home, /<summary>/);
  assert.doesNotMatch(home, /type="checkbox"[^>]*checked/);
  assert.doesNotMatch(home, /\d{1,2}%/);

  const headings = [...home.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((match) => match[1]);
  assert.deepEqual(headings, [
    "About Hero Homes Greater Noida",
    "Hero Homes Floor Plans",
    "Hero Homes Amenities",
    "Hero Homes Sector MU Location",
    "Hero Homes Price List",
    "Find Your Ideal Home at Hero Homes",
    "Your Journey to a Hero Homes Residence",
    "Hero Homes FAQs",
    "Explore Hero Homes Greater Noida"
  ]);

  const visibleQuestions = [...home.matchAll(/<summary>(.*?)<\/summary>/g)].map((match) => match[1]);
  const data = JSON.parse(home.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const faq = data["@graph"].find((node) => node["@type"] === "FAQPage");
  assert.deepEqual(
    faq.mainEntity.map((item) => item.name),
    visibleQuestions
  );
  assert.deepEqual(
    faq.mainEntity.map((item) => item.acceptedAnswer.text),
    [...home.matchAll(/<summary>.*?<\/summary><p>(.*?)<\/p>/g)].map((match) => match[1])
  );
});

test("public copy leaves out unverified commercial claims", () => {
  const banned = ["Aawasyam", "dream home", "guaranteed", "536 units", "1.82"];
  for (const phrase of banned) {
    assert.equal(home.includes(phrase), false, phrase);
  }
});

test("robots and sitemap expose the intended URLs only", () => {
  assert.doesNotMatch(home, /google-site-verification/);
  const robots = fs.readFileSync(path.join(dist, "robots.txt"), "utf8");
  const llms = fs.readFileSync(path.join(dist, "llms.txt"), "utf8");
  const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
  assert.match(robots, /Allow: \//);
  assert.doesNotMatch(robots, /Disallow: \//);
  assert.match(robots, /Sitemap: https:\/\/www\.herohomesgroups\.in\/sitemap\.xml/);
  assert.match(llms, /Leafsong Retreat/);
  assert.match(llms, /UPRERAPRJ414014\/10\/2026/);
  assert.doesNotMatch(llms, /HDFC|153\.84/);
  assert.match(sitemap, /https:\/\/www\.herohomesgroups\.in\/</);
  assert.match(sitemap, /https:\/\/www\.herohomesgroups\.in\/privacy</);
  assert.match(sitemap, /https:\/\/www\.herohomesgroups\.in\/terms</);
  assert.doesNotMatch(sitemap, /404/);
});

test("fonts and stylesheet are local", () => {
  assert.match(home, /poppins-400\.woff2/);
  assert.match(fs.readFileSync(path.join(dist, "assets", "styles.css"), "utf8"), /font-family:\s*Poppins/);
  for (const weight of [400, 500, 600, 700]) {
    assert.equal(fs.existsSync(path.join(dist, "assets", "fonts", `poppins-${weight}.woff2`)), true);
  }
});
