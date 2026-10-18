import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderHome, renderPrivacy, renderTerms, renderNotFound, renderRobots, renderLlms, renderSitemap } from "./render.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

function write(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

fs.rmSync(dist, { recursive: true, force: true });
write(path.join(dist, "index.html"), renderHome());
write(path.join(dist, "privacy", "index.html"), renderPrivacy());
write(path.join(dist, "terms", "index.html"), renderTerms());
write(path.join(dist, "404.html"), renderNotFound());
write(path.join(dist, "robots.txt"), renderRobots());
write(path.join(dist, "llms.txt"), renderLlms());
write(path.join(dist, "sitemap.xml"), renderSitemap());

const assetDir = path.join(dist, "assets");
fs.mkdirSync(path.join(assetDir, "fonts"), { recursive: true });
fs.copyFileSync(path.join(root, "src", "styles.css"), path.join(assetDir, "styles.css"));
fs.copyFileSync(path.join(root, "src", "site.js"), path.join(assetDir, "site.js"));
fs.copyFileSync(path.join(root, "src", "assets", "herologo.webp"), path.join(assetDir, "herologo.webp"));
fs.copyFileSync(path.join(root, "src", "assets", "herologo.png"), path.join(assetDir, "herologo.png"));
fs.copyFileSync(path.join(root, "src", "assets", "hero.jpg"), path.join(assetDir, "hero.jpg"));
for (const weight of [400, 500, 600, 700]) {
  const name = `poppins-${weight}.woff2`;
  fs.copyFileSync(path.join(root, "src", "fonts", name), path.join(assetDir, "fonts", name));
}

const version = Date.now().toString(36);
function stamp(file) {
  const html = fs.readFileSync(file, "utf8").replaceAll("/assets/", `/assets/`).replace(
    /(\/assets\/[^"'?]+\.(?:css|js|svg|png|jpg|woff2|webp))/g,
    `$1?v=${version}`
  );
  fs.writeFileSync(file, html);
}
stamp(path.join(dist, "index.html"));
stamp(path.join(dist, "privacy", "index.html"));
stamp(path.join(dist, "terms", "index.html"));
stamp(path.join(dist, "404.html"));

console.log("Built dist/");
