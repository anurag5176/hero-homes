import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateLead } from "./leads.mjs";
import { sendLeadMail, smtpSettings } from "./smtp.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

function leadMode(env = process.env) {
  if (smtpSettings(env)) return "smtp";
  if (env.LEAD_WEBHOOK_URL) return "webhook";
  if (env.LEAD_LOCAL_STORE === "true") return "local";
  return "unconfigured";
}

function send(res, status, body, headers = {}) {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": typeof body === "string" ? "text/html; charset=utf-8" : "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cache-Control": "no-store",
    ...headers
  });
  res.end(payload);
}

function safePath(requestPath) {
  let decoded = requestPath;
  try {
    decoded = decodeURIComponent(requestPath);
  } catch {
    return null;
  }
  const relative = decoded.replace(/^\/+/, "");
  const full = path.normalize(path.join(dist, relative));
  if (!full.startsWith(`${dist}${path.sep}`)) return null;
  return full;
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 20_000) {
      const error = new Error("too_large");
      error.code = "too_large";
      throw error;
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

async function deliver(lead, env) {
  if (smtpSettings(env)) {
    await sendLeadMail(lead, env);
    return "smtp";
  }

  if (env.LEAD_WEBHOOK_URL) {
    const headers = { "Content-Type": "application/json" };
    if (env.LEAD_WEBHOOK_TOKEN) headers.Authorization = `Bearer ${env.LEAD_WEBHOOK_TOKEN}`;
    const response = await fetch(env.LEAD_WEBHOOK_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(lead)
    });
    if (!response.ok) {
      const error = new Error("webhook_failed");
      error.code = "webhook_failed";
      throw error;
    }
    return "webhook";
  }

  if (env.LEAD_LOCAL_STORE === "true") {
    const file = path.resolve(root, env.LEAD_STORE_PATH || "data/leads/enquiries.jsonl");
    await fs.promises.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    await fs.promises.appendFile(file, `${JSON.stringify(lead)}\n`, { mode: 0o600 });
    return "local";
  }

  const error = new Error("not_configured");
  error.code = "not_configured";
  throw error;
}

export function createApp(options = {}) {
  const env = options.env || process.env;
  const hits = options.hits || new Map();
  const limit = options.limit ?? 8;
  const windowMs = options.windowMs ?? 15 * 60 * 1000;

  return http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", "http://localhost");
    const pathname = url.pathname;

    if (req.method === "GET" && pathname === "/api/health") {
      send(res, 200, { ok: true, leadSink: leadMode(env) });
      return;
    }

    if (pathname === "/api/enquiry") {
      if (req.method !== "POST") {
        send(res, 405, { ok: false, code: "method" });
        return;
      }
      const ip = req.socket.remoteAddress || "unknown";
      const now = Date.now();
      const recent = (hits.get(ip) || []).filter((time) => now - time < windowMs);
      if (recent.length >= limit) {
        send(res, 429, { ok: false, code: "rate_limited" });
        return;
      }
      recent.push(now);
      hits.set(ip, recent);

      let body;
      try {
        body = await readBody(req);
      } catch (error) {
        const code = error.code === "too_large" ? "too_large" : "invalid_json";
        send(res, 400, { ok: false, code });
        return;
      }

      const result = validateLead(body);
      if (!result.ok) {
        console.info(`enquiry_rejected ${result.code || "validation"}`);
        send(res, 400, { ok: false, code: result.code || "validation", errors: result.errors });
        return;
      }

      try {
        const sink = await deliver(result.lead, env);
        console.info(`enquiry_accepted sink=${sink} type=${result.lead.enquiry_type}`);
        send(res, 200, { ok: true, sink });
      } catch (error) {
        if (error.code === "not_configured") {
          console.info("enquiry_unconfigured");
          send(res, 503, { ok: false, code: "not_configured" });
          return;
        }
        console.info(`enquiry_failed code=${error.code || "delivery"}`);
        send(res, 502, { ok: false, code: "delivery_failed" });
      }
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      send(res, 405, { ok: false, code: "method" });
      return;
    }

    if (pathname === "/privacy/") {
      res.writeHead(301, { Location: "/privacy" });
      res.end();
      return;
    }
    if (pathname === "/terms/") {
      res.writeHead(301, { Location: "/terms" });
      res.end();
      return;
    }
    if (pathname === "/index.html") {
      res.writeHead(301, { Location: "/" });
      res.end();
      return;
    }

    const routes = {
      "/": path.join(dist, "index.html"),
      "/privacy": path.join(dist, "privacy", "index.html"),
      "/terms": path.join(dist, "terms", "index.html"),
      "/robots.txt": path.join(dist, "robots.txt"),
      "/sitemap.xml": path.join(dist, "sitemap.xml")
    };

    let file = routes[pathname] || null;
    let status = file || pathname.startsWith("/assets/") ? 200 : 404;
    if (!file && pathname.startsWith("/assets/")) file = safePath(pathname);
    if (!file || !file.startsWith(dist) || !fs.existsSync(file)) {
      file = path.join(dist, "404.html");
      status = 404;
    }

    if (!fs.existsSync(file)) {
      send(res, 500, "<!doctype html><title>Setup</title><p>Build the site with npm run build.</p>");
      return;
    }
    const ext = path.extname(file);
    const headers = {
      "Content-Type": types[ext] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    };
    if (ext === ".html" || ext === ".css" || ext === ".js") headers["Cache-Control"] = "no-cache";
    if (ext === ".woff2") headers["Cache-Control"] = "public, max-age=86400";
    res.writeHead(status, headers);
    if (req.method === "HEAD") res.end();
    else fs.createReadStream(file).pipe(res);
  });
}

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) {
  loadEnvFile(path.join(root, ".env"));
  const port = Number(process.env.PORT || 4173);
  const server = createApp();
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. The site is already running at http://localhost:${port}`);
      process.exit(1);
    }
    throw error;
  });
  server.listen(port, () => {
    console.log(`Serving on http://localhost:${port} (lead sink: ${leadMode()})`);
  });
}
