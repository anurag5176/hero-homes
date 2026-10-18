const enquiryTypes = new Set([
  "project_details",
  "price_list",
  "brochure",
  "floor_plan",
  "payment_plan",
  "site_visit",
  "advisor"
]);

const configurations = new Set([
  "",
  "3 BHK",
  "3 BHK + 2 Toilets",
  "3 BHK + 3 Toilets",
  "3 BHK + Servant Room"
]);
const contactMethods = new Set(["", "call", "whatsapp", "no_preference"]);

const phonePattern = /^(?:\+91|91|0)?[6-9]\d{9}$/;

function clean(value, max) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function normalisePhone(value) {
  const compact = String(value ?? "").replace(/[\s-]/g, "");
  if (!phonePattern.test(compact)) return "";
  const digits = compact.replace(/\D/g, "");
  return digits.slice(-10);
}

export function validateLead(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, errors: { form: "The enquiry could not be read." } };
  }

  if (clean(body.company, 200)) {
    return { ok: false, errors: { form: "The enquiry could not be submitted." }, code: "rejected" };
  }

  const errors = {};
  const name = clean(body.name, 80);
  if (name.length < 2 || !/^[\p{L}][\p{L} .'-]{1,79}$/u.test(name)) {
    errors.name = "Enter your full name.";
  }

  const phone = normalisePhone(body.phone);
  if (!phone) errors.phone = "Enter a 10-digit Indian mobile number.";

  const consent = body.consent === true || body.consent === "yes";
  if (!consent) errors.consent = "Confirm that we may contact you about this project.";

  const enquiryType = enquiryTypes.has(body.enquiry_type) ? body.enquiry_type : "";
  if (!enquiryType) errors.enquiry_type = "Choose what you would like help with.";

  const configuration = configurations.has(body.configuration) ? body.configuration : "";
  if (body.configuration && !configuration) {
    errors.configuration = "Choose a listed configuration.";
  }

  const contactMethod = contactMethods.has(body.contact_method) ? body.contact_method : "";
  if (body.contact_method && !contactMethod) {
    errors.contact_method = "Choose a listed contact method.";
  }

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    lead: {
      name,
      phone,
      consent: true,
      enquiry_type: enquiryType,
      configuration,
      contact_method: contactMethod,
      section: clean(body.section, 80),
      utm_source: clean(body.utm_source, 200),
      utm_medium: clean(body.utm_medium, 200),
      utm_campaign: clean(body.utm_campaign, 200),
      utm_term: clean(body.utm_term, 200),
      utm_content: clean(body.utm_content, 200),
      landing_path: clean(body.landing_path, 500),
      referrer: clean(body.referrer, 500),
      received_at: new Date().toISOString()
    }
  };
}
