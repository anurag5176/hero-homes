const titles = {
  project_details: "Get Project Details",
  price_list: "Get Price List",
  brochure: "Request Project Brochure",
  floor_plan: "Get 3 BHK Floor Plan",
  payment_plan: "Get Hero Homes Payment Plan",
  site_visit: "Schedule a Site Visit",
  advisor: "Speak to the project advisor"
};

const phonePattern = /^(?:\+91|91|0)?[6-9]\d{9}$/;

function digits(value) {
  return String(value || "").replace(/[\s-]/g, "");
}

function validPhone(value) {
  return phonePattern.test(digits(value));
}

function readCampaign() {
  const params = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  const data = {};
  keys.forEach((key) => {
    data[key] = (params.get(key) || "").slice(0, 200);
  });
  data.landing_path = `${window.location.pathname}${window.location.search}`.slice(0, 500);
  data.referrer = (document.referrer || "").slice(0, 500);
  return data;
}

const campaign = readCampaign();

function setStatus(form, kind, message) {
  const status = form.querySelector(".form-status");
  status.className = `form-status${kind ? ` is-${kind}` : ""}`;
  status.textContent = message || "";
}

function clearErrors(form) {
  form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
  form.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
  });
}

function showError(form, name, message) {
  const field = form.elements[name];
  const error = form.querySelector(`[data-error-for="${name}"]`);
  if (field && field.type !== "checkbox") field.setAttribute("aria-invalid", "true");
  if (field && field.type === "checkbox") field.setAttribute("aria-invalid", "true");
  if (error) error.textContent = message;
}

function applyContext(form, { type, configuration, section, label }) {
  if (type && (titles[type] || label)) {
    form.elements.enquiry_type.value = type;
    const text = label || titles[type];
    const title = form.querySelector(".form-title");
    const button = form.querySelector("[type=submit]");
    if (title) title.textContent = text;
    if (button && form.dataset.state !== "success") button.textContent = text;
  }
  if (configuration && form.elements.configuration) {
    const field = form.elements.configuration;
    if (field.options) {
      const exists = Array.from(field.options).some((option) => option.value === configuration);
      if (exists) field.value = configuration;
    } else {
      field.value = configuration;
    }
  }
  if (section) form.elements.section.value = section;
}

function payloadFrom(form) {
  const data = {
    name: form.elements.name.value.trim(),
    phone: digits(form.elements.phone.value),
    consent: form.elements.consent.checked,
    configuration: form.elements.configuration.value,
    contact_method: form.elements.contact_method.value,
    enquiry_type: form.elements.enquiry_type.value,
    section: form.elements.section.value,
    company: form.elements.company.value,
    ...campaign
  };
  return data;
}

function validate(form) {
  clearErrors(form);
  const data = payloadFrom(form);
  let valid = true;
  if (data.name.length < 2) {
    showError(form, "name", "Enter your full name.");
    valid = false;
  }
  if (!validPhone(data.phone)) {
    showError(form, "phone", "Enter a 10-digit Indian mobile number.");
    valid = false;
  }
  if (!data.consent) {
    showError(form, "consent", "Confirm that we may contact you about this project.");
    valid = false;
  }
  return valid;
}

async function submitForm(form) {
  if (!validate(form)) {
    setStatus(form, "error", "Check the highlighted fields and try again.");
    const first = form.querySelector("[aria-invalid='true']");
    if (first) first.focus();
    return;
  }

  const button = form.querySelector("[type=submit]");
  button.disabled = true;
  setStatus(form, "", "Sending your enquiry…");

  try {
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payloadFrom(form))
    });
    let body = {};
    try {
      body = await response.json();
    } catch {
      body = {};
    }

    if (response.ok && body.ok) {
      form.dataset.state = "success";
      form.querySelectorAll(".field, .consent, .btn, .form-intro, .hp").forEach((el) => {
        el.hidden = true;
      });
      const type = titles[form.elements.enquiry_type.value] || "your enquiry";
      setStatus(
        form,
        "success",
        `Your enquiry has been recorded (${type}). The project desk will contact you on the mobile number you entered. This is not a booking or a price guarantee.`
      );
      return;
    }

    if (body.errors) {
      Object.entries(body.errors).forEach(([name, message]) => showError(form, name, message));
    }

    if (response.status === 503 || body.code === "not_configured") {
      setStatus(
        form,
        "warning",
        "The enquiry desk is not connected yet, so these details were not saved and nobody was notified. You can try again after it is connected, or use the official Hero Homes project page."
      );
      return;
    }

    if (response.status === 429) {
      setStatus(form, "error", "Too many attempts from this connection. Wait a few minutes and try again.");
      return;
    }

    setStatus(
      form,
      "error",
      "The enquiry was not saved. Your entries are still in the form. Check the fields and try again."
    );
  } catch {
    setStatus(
      form,
      "error",
      "The enquiry could not be sent. Your entries are still in the form. Check your connection and try again."
    );
  } finally {
    if (form.dataset.state !== "success") button.disabled = false;
  }
}

function bindForm(form) {
  form.elements.enquiry_type.value = form.dataset.enquiry || "project_details";
  form.elements.section.value = form.dataset.section || "page";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitForm(form);
  });
}

function focusLead(type, configuration, section, target, label) {
  const form = document.getElementById(target || "form-dock");
  if (!form) return;
  applyContext(form, { type, configuration, section, label });
  const name = form.elements.name;
  if (name && !name.hidden) name.focus({ preventScroll: true });
}

function sizeDock() {
  const header = document.querySelector(".site-header");
  if (header) document.documentElement.style.setProperty("--header", `${header.offsetHeight}px`);
  const dock = document.getElementById("lead-dock");
  const wide = window.matchMedia("(min-width: 1024px)").matches;
  if (!dock || wide) {
    document.documentElement.style.setProperty("--dock-space", "0px");
    return;
  }
  document.documentElement.style.setProperty("--dock-space", `${dock.offsetHeight}px`);
}

function init() {
  document.querySelectorAll(".enquiry").forEach(bindForm);

  document.querySelectorAll("[data-enquiry]").forEach((control) => {
    if (control.classList.contains("enquiry")) return;
    control.addEventListener("click", () => {
      const type = control.getAttribute("data-enquiry");
      const configuration = control.getAttribute("data-configuration") || "";
      const section = control.getAttribute("data-section") || "page";
      const target = control.getAttribute("data-target") || "form-dock";
      const label = control.getAttribute("data-label") || "";
      focusLead(type, configuration, section, target, label);
    });
  });

  const dialog = document.getElementById("enquiry-dialog");
  if (dialog) {
    dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  const focusable = "input, select, textarea";
  document.addEventListener("focusin", (event) => {
    if (event.target.matches(focusable)) document.body.classList.add("input-focused");
  });
  document.addEventListener("focusout", () => {
    window.setTimeout(() => {
      const active = document.activeElement;
      if (!active || !active.matches(focusable)) document.body.classList.remove("input-focused");
    }, 30);
  });

  sizeDock();
  window.addEventListener("resize", sizeDock);
  window.addEventListener("load", sizeDock);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeDock);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      const shrunk = window.innerHeight - window.visualViewport.height > 140;
      document.body.classList.toggle("keyboard-open", shrunk);
    });
  }
}

init();
