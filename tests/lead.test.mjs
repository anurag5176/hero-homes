import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import net from "node:net";
import { validateLead } from "../scripts/leads.mjs";
import { createApp } from "../scripts/server.mjs";
import { leadMessage, smtpSettings } from "../scripts/smtp.mjs";

function validBody(overrides = {}) {
  return {
    name: "Meera Shah",
    phone: "9876543210",
    consent: true,
    enquiry_type: "price_list",
    configuration: "3 BHK",
    contact_method: "call",
    section: "pricing",
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "sector-mu",
    landing_path: "/?utm_source=google",
    referrer: "https://www.google.com/",
    company: "",
    ...overrides
  };
}

function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => resolve(server));
  });
}

async function post(server, body) {
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await response.json();
  return { status: response.status, json };
}

test("rejects a missing consent choice and a short mobile number", () => {
  const consent = validateLead(validBody({ consent: false }));
  assert.equal(consent.ok, false);
  assert.match(consent.errors.consent, /contact/i);

  const phone = validateLead(validBody({ phone: "12345" }));
  assert.equal(phone.ok, false);
  assert.match(phone.errors.phone, /10-digit/);
});

test("accepts a normalised Indian mobile number and campaign fields", () => {
  const result = validateLead(validBody({ phone: "+91 98765-43210" }));
  assert.equal(result.ok, true);
  assert.equal(result.lead.phone, "9876543210");
  assert.equal(result.lead.utm_source, "google");
  assert.equal(result.lead.enquiry_type, "price_list");
  assert.equal(result.lead.configuration, "3 BHK");
});

test("does not save a honeypot submission", () => {
  const result = validateLead(validBody({ company: "https://spam.example" }));
  assert.equal(result.ok, false);
  assert.equal(result.code, "rejected");
});

test("returns not configured when no lead destination is set", async () => {
  const server = await listen(createApp({ env: {} }));
  try {
    const { status, json } = await post(server, validBody());
    assert.equal(status, 503);
    assert.equal(json.code, "not_configured");
  } finally {
    server.close();
  }
});

test("stores a lead locally and keeps the campaign fields", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hero-leads-"));
  const file = path.join(dir, "enquiries.jsonl");
  const server = await listen(
    createApp({ env: { LEAD_LOCAL_STORE: "true", LEAD_STORE_PATH: file } })
  );
  try {
    const first = await post(server, validBody());
    assert.equal(first.status, 200);
    assert.equal(first.json.ok, true);
    const saved = fs.readFileSync(file, "utf8").trim().split("\n").map((line) => JSON.parse(line));
    assert.equal(saved.length, 1);
    assert.equal(saved[0].phone, "9876543210");
    assert.equal(saved[0].utm_campaign, "sector-mu");
    assert.equal(saved[0].name.includes("9876"), false);
  } finally {
    server.close();
  }
});

test("a failed delivery can be retried", async () => {
  let calls = 0;
  const webhook = http.createServer((req, res) => {
    calls += 1;
    if (calls === 1) {
      res.writeHead(500);
      res.end("no");
      return;
    }
    res.writeHead(200);
    res.end("ok");
  });
  await new Promise((resolve) => webhook.listen(0, "127.0.0.1", resolve));
  const { port } = webhook.address();
  const server = await listen(
    createApp({ env: { LEAD_WEBHOOK_URL: `http://127.0.0.1:${port}/hook` } })
  );
  try {
    const failed = await post(server, validBody({ enquiry_type: "floor_plan" }));
    assert.equal(failed.status, 502);
    const retried = await post(server, validBody({ enquiry_type: "floor_plan" }));
    assert.equal(retried.status, 200);
    assert.equal(retried.json.sink, "webhook");
  } finally {
    server.close();
    webhook.close();
  }
});

test("partial smtp settings leave the form unconfigured", async () => {
  const settings = smtpSettings({
    SMTP_HOST: "smtp.gmail.com",
    SMTP_USER: "desk@example.com",
    SMTP_PASS: "abcd efgh ijkl mnop"
  });
  assert.equal(settings, null);
  const server = await listen(createApp({ env: { SMTP_HOST: "smtp.gmail.com", SMTP_USER: "desk@example.com" } }));
  try {
    const result = await post(server, validBody());
    assert.equal(result.status, 503);
    assert.equal(result.json.code, "not_configured");
  } finally {
    server.close();
  }
});

test("an enquiry is mailed with the app password", async () => {
  const password = "abcd efgh ijkl mnop";
  const stripped = password.replace(/\s+/g, "");
  const seen = [];
  const smtp = net.createServer((socket) => {
    socket.write("220 ready\r\n");
    let buffer = "";
    let dataMode = false;
    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      while (buffer.includes("\n")) {
        const index = buffer.indexOf("\n");
        const line = buffer.slice(0, index).replace(/\r$/, "");
        buffer = buffer.slice(index + 1);
        seen.push(line);
        if (dataMode) {
          if (line === ".") {
            dataMode = false;
            socket.write("250 queued\r\n");
          }
          continue;
        }
        if (/^EHLO/i.test(line)) socket.write("250-hello\r\n250 AUTH LOGIN\r\n");
        else if (/^AUTH LOGIN/i.test(line)) socket.write("334 VXNlcm5hbWU6\r\n");
        else if (line === Buffer.from("desk@example.com").toString("base64")) socket.write("334 UGFzc3dvcmQ6\r\n");
        else if (line === Buffer.from(stripped).toString("base64")) socket.write("235 ok\r\n");
        else if (/^MAIL FROM/i.test(line)) socket.write("250 ok\r\n");
        else if (/^RCPT TO/i.test(line)) socket.write("250 ok\r\n");
        else if (/^DATA/i.test(line)) {
          dataMode = true;
          socket.write("354 go\r\n");
        } else if (/^QUIT/i.test(line)) socket.write("221 bye\r\n");
      }
    });
  });
  await new Promise((resolve) => smtp.listen(0, "127.0.0.1", resolve));
  const port = smtp.address().port;
  const server = await listen(
    createApp({
      env: {
        SMTP_HOST: "127.0.0.1",
        SMTP_PORT: String(port),
        SMTP_SECURE: "false",
        SMTP_USER: "desk@example.com",
        SMTP_PASS: password,
        SMTP_TO: "leads@example.com"
      }
    })
  );
  try {
    const result = await post(server, validBody({ enquiry_type: "brochure" }));
    assert.equal(result.status, 200);
    assert.equal(result.json.sink, "smtp");
    const transcript = seen.join("\n");
    assert.match(transcript, /Meera Shah/);
    assert.match(transcript, /\+91 9876543210/);
    assert.match(transcript, /Hero Homes enquiry: Brochure/);
    assert.equal(transcript.includes(password), false);
    assert.equal(transcript.includes(stripped), false);
    assert.match(transcript, new RegExp(Buffer.from(stripped).toString("base64")));
    const draft = leadMessage(
      { ...validBody(), phone: "9876543210", received_at: "2026-10-18T00:00:00.000Z" },
      { from: "desk@example.com", to: "leads@example.com" }
    );
    assert.equal(draft.data.includes(stripped), false);
  } finally {
    server.close();
    smtp.close();
  }
});

test("rate limits repeated posts", async () => {
  const server = await listen(createApp({ env: {}, limit: 2, windowMs: 60_000 }));
  try {
    assert.equal((await post(server, validBody())).status, 503);
    assert.equal((await post(server, validBody())).status, 503);
    const limited = await post(server, validBody());
    assert.equal(limited.status, 429);
  } finally {
    server.close();
  }
});
