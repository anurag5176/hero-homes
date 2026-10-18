import net from "node:net";
import tls from "node:tls";

const labels = {
  project_details: "Project details",
  price_list: "Price list",
  brochure: "Brochure",
  floor_plan: "Floor plan",
  payment_plan: "Payment plan",
  site_visit: "Site visit",
  advisor: "Advisor"
};

function clean(value) {
  return String(value ?? "").trim();
}

export function smtpSettings(env = process.env) {
  const host = clean(env.SMTP_HOST);
  const user = clean(env.SMTP_USER);
  const pass = clean(env.SMTP_PASS).replace(/\s+/g, "");
  const to = clean(env.SMTP_TO);
  const from = clean(env.SMTP_FROM) || user;
  const port = Number(env.SMTP_PORT || 587);
  const secure = env.SMTP_SECURE === "true" || port === 465;
  if (!host || !user || !pass || !to || !from || !Number.isInteger(port)) return null;
  return { host, port, secure, user, pass, from, to };
}

export function leadMessage(lead, settings) {
  const type = labels[lead.enquiry_type] || lead.enquiry_type;
  const lines = [
    `Enquiry: ${type}`,
    `Name: ${lead.name}`,
    `Mobile: +91 ${lead.phone}`,
    `Configuration: ${lead.configuration || "Not specified"}`,
    `Contact preference: ${lead.contact_method || "Not specified"}`,
    `Section: ${lead.section || "Not specified"}`,
    `Received: ${lead.received_at}`,
    `Landing path: ${lead.landing_path || "Not specified"}`,
    `Referrer: ${lead.referrer || "Not specified"}`,
    `UTM source: ${lead.utm_source || ""}`,
    `UTM medium: ${lead.utm_medium || ""}`,
    `UTM campaign: ${lead.utm_campaign || ""}`,
    `UTM term: ${lead.utm_term || ""}`,
    `UTM content: ${lead.utm_content || ""}`
  ];
  const subject = `Hero Homes enquiry: ${type} — ${lead.name}`;
  const body = lines.join("\r\n");
  const headers = [
    `From: ${settings.from}`,
    `To: ${settings.to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit"
  ];
  const data = `${headers.join("\r\n")}\r\n\r\n${body.replace(/^\./gm, "..")}\r\n.`;
  return { subject, data };
}

function once(socket, event) {
  return new Promise((resolve, reject) => {
    const fail = (error) => {
      socket.off(event, ok);
      reject(error);
    };
    const ok = () => {
      socket.off("error", fail);
      resolve();
    };
    socket.once(event, ok);
    socket.once("error", fail);
  });
}

function openReader(socket) {
  let buffer = "";
  let waiter = null;
  function onData(chunk) {
    buffer += chunk.toString("utf8");
    drain();
  }
  function onError(error) {
    error.code = "smtp_failed";
    if (waiter) waiter.reject(error);
  }
  function drain() {
    if (!waiter) return;
    const lines = buffer.split(/\r?\n/);
    const remainder = buffer.endsWith("\n") ? "" : lines.pop() ?? "";
    const complete = lines.filter(Boolean);
    const last = complete.at(-1) || "";
    if (!/^\d{3} /.test(last)) return;
    buffer = remainder;
    const current = waiter;
    waiter = null;
    current.resolve({ code: Number(last.slice(0, 3)), text: complete.join("\n") });
  }
  socket.on("data", onData);
  socket.on("error", onError);
  return {
    stop() {
      socket.off("data", onData);
      socket.off("error", onError);
    },
    read() {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(Object.assign(new Error("smtp_timeout"), { code: "smtp_failed" }));
        }, 20_000);
        waiter = {
          resolve: (reply) => {
            clearTimeout(timer);
            resolve(reply);
          },
          reject: (error) => {
            clearTimeout(timer);
            reject(error);
          }
        };
        drain();
      });
    }
  };
}

function expect(reply, codes) {
  if (!codes.includes(reply.code)) {
    const error = new Error("smtp_failed");
    error.code = "smtp_failed";
    throw error;
  }
}

async function command(socket, reader, line) {
  const pending = reader.read();
  socket.write(`${line}\r\n`);
  return pending;
}

async function authenticate(socket, reader, settings) {
  let reply = await command(socket, reader, "EHLO herohomesgroups.in");
  expect(reply, [250]);
  if (!settings.secure && /STARTTLS/i.test(reply.text)) {
    reply = await command(socket, reader, "STARTTLS");
    expect(reply, [220]);
    reader.stop();
    socket = tls.connect({ socket, servername: settings.host });
    await once(socket, "secureConnect");
    reader = openReader(socket);
    reply = await command(socket, reader, "EHLO herohomesgroups.in");
    expect(reply, [250]);
  }
  reply = await command(socket, reader, "AUTH LOGIN");
  expect(reply, [334]);
  reply = await command(socket, reader, Buffer.from(settings.user).toString("base64"));
  expect(reply, [334]);
  reply = await command(socket, reader, Buffer.from(settings.pass).toString("base64"));
  expect(reply, [235]);
  return { socket, reader };
}

export async function sendLeadMail(lead, env = process.env) {
  const settings = smtpSettings(env);
  if (!settings) {
    const error = new Error("not_configured");
    error.code = "not_configured";
    throw error;
  }
  const message = leadMessage(lead, settings);
  let socket = settings.secure
    ? tls.connect({ host: settings.host, port: settings.port, servername: settings.host })
    : net.connect({ host: settings.host, port: settings.port });
  let reader = openReader(socket);
  if (settings.secure) await once(socket, "secureConnect");
  else await once(socket, "connect");
  try {
    expect(await reader.read(), [220]);
    ({ socket, reader } = await authenticate(socket, reader, settings));
    expect(await command(socket, reader, `MAIL FROM:<${settings.from}>`), [250]);
    expect(await command(socket, reader, `RCPT TO:<${settings.to}>`), [250, 251]);
    expect(await command(socket, reader, "DATA"), [354]);
    expect(await command(socket, reader, message.data), [250]);
    await command(socket, reader, "QUIT");
  } catch (error) {
    socket.destroy();
    if (!error.code) error.code = "smtp_failed";
    throw error;
  } finally {
    socket.end();
  }
}
