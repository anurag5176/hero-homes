import { processEnquiry } from "../scripts/enquiry.mjs";

const hits = new Map();
const limit = 8;
const windowMs = 15 * 60 * 1000;

function clientAddress(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (value) return String(value).split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function tooMany(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function readBody(req) {
  const body = req.body;
  if (body && typeof body === "object" && !Buffer.isBuffer(body)) return body;
  if (typeof body === "string" && body.trim()) return JSON.parse(body);
  if (Buffer.isBuffer(body) && body.length) return JSON.parse(body.toString("utf8"));
  return {};
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, code: "method" });
    return;
  }

  if (tooMany(clientAddress(req))) {
    res.status(429).json({ ok: false, code: "rate_limited" });
    return;
  }

  let body;
  try {
    body = readBody(req);
  } catch {
    res.status(400).json({ ok: false, code: "invalid_json" });
    return;
  }

  const outcome = await processEnquiry(body, process.env);
  res.status(outcome.status).json(outcome.body);
}
