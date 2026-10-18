import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateLead } from "./leads.mjs";
import { sendLeadMail, smtpSettings } from "./smtp.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function deliverLead(lead, env) {
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

export async function processEnquiry(body, env) {
  const result = validateLead(body);
  if (!result.ok) {
    console.info(`enquiry_rejected ${result.code || "validation"}`);
    return {
      status: 400,
      body: { ok: false, code: result.code || "validation", errors: result.errors }
    };
  }

  try {
    const sink = await deliverLead(result.lead, env);
    console.info(`enquiry_accepted sink=${sink} type=${result.lead.enquiry_type}`);
    return { status: 200, body: { ok: true, sink } };
  } catch (error) {
    if (error.code === "not_configured") {
      console.info("enquiry_unconfigured");
      return { status: 503, body: { ok: false, code: "not_configured" } };
    }
    console.info(`enquiry_failed code=${error.code || "delivery"}`);
    return { status: 502, body: { ok: false, code: "delivery_failed" } };
  }
}
