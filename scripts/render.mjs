import { site, faqs } from "../content/site.mjs";

const p = site.project;

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const iconPaths = {
  pin: '<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/>',
  home: '<path d="M4 11.2 12 4l8 7.2V20H4z"/><path d="M10 20v-6h4v6"/>',
  plan: '<rect x="5" y="3.5" width="14" height="17" rx="1"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  towers: '<path d="M3 21h18"/><path d="M6 21V9h5v12"/><path d="M13 21V4h5v17"/>',
  price: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5v9M9.6 9.8c.5-.9 1.6-1.4 2.4-1.4 1.4 0 2.2.7 2.2 1.6s-.9 1.5-2.2 1.5-2.2.6-2.2 1.6.8 1.6 2.2 1.6c.9 0 1.9-.4 2.4-1.2"/>',
  utensils: '<path d="M6 3v8a2 2 0 0 0 2 2v8"/><path d="M6 7h2"/><path d="M16 3v18"/><path d="M16 8c2 0 3-1.2 3-2.5S18 3 16 3"/>',
  gym: '<path d="M7 9v6M17 9v6M4 10.5v3M20 10.5v3M9 12h6M9.5 8.5v7M14.5 8.5v7"/>',
  leaf: '<path d="M5 19C5 11 11 5 19 5 19 13 13 19 5 19z"/><path d="M8 16c2.2-2.2 5-5 8-8"/>',
  banquet: '<path d="M4 10h16v8H4z"/><path d="M8 10V7h8v3"/><path d="M4 14h16"/>',
  calm: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18"/>',
  spa: '<path d="M12 20.5c3.6-2.7 5.5-5.6 5.5-8.7A5.5 5.5 0 0 0 12 6.3a5.5 5.5 0 0 0-5.5 5.5c0 3.1 1.9 6 5.5 8.7z"/>',
  kids: '<circle cx="8" cy="8" r="2"/><circle cx="16" cy="8.4" r="1.7"/><path d="M4.2 19c.6-2.5 2.4-3.6 4-3.6s3.3 1.1 3.8 3.6"/><path d="M12.2 19c.5-2 1.7-2.9 3.2-2.9s2.6.9 3.1 2.9"/>',
  book: '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5z"/><path d="M5 5.5A2.5 2.5 0 0 1 7.5 8H19"/>',
  family: '<circle cx="9" cy="8" r="2"/><circle cx="16" cy="9" r="1.6"/><path d="M4.5 19c.5-2.5 2.3-3.6 4.5-3.6s4 1.1 4.5 3.6"/><path d="M13 19c.4-1.9 1.6-2.8 3.1-2.8 1.4 0 2.6.9 3 2.8"/>',
  map: '<path d="M9 4.5 3.5 6.5v13L9 17.5 15 19.5 20.5 17.5v-13L15 6.5z"/><path d="M9 4.5v13M15 6.5v13"/>',
  sheet: '<rect x="5" y="3.5" width="14" height="17" rx="1"/><path d="M8 8h8M8 12h8M8 16h4"/>',
  phone: '<path d="M8 3.8h2.2l1 2.6-1.5.9a9.6 9.6 0 0 0 4.6 4.6l.9-1.5 2.6 1V18a1.5 1.5 0 0 1-1.7 1.5A12.2 12.2 0 0 1 6.5 5.5 1.5 1.5 0 0 1 8 3.8z"/>',
  user: '<circle cx="12" cy="8" r="3"/><path d="M5.5 19.2c.8-2.8 2.9-4.2 6.5-4.2s5.7 1.4 6.5 4.2"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="1.5"/><path d="M8 3.5V6M16 3.5V6M4 10h16"/>'
};

const amenityIcons = {
  Clubhouse: "home",
  Gymnasium: "gym",
  "Swimming Pool": "spa",
  Restaurant: "utensils",
  "Biophilic Lounge": "leaf",
  "Banquet Hall with Courtyard": "banquet",
  "Meditation Centre": "calm",
  "Spa and Salon": "spa",
  "Children's Play Areas": "kids",
  "Library and Art Corner": "book",
  "Mini Theatre": "banquet",
  "Sports Courts and Landscaped Gardens": "leaf"
};

function icon(name) {
  return `<svg class="icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || ""}</svg>`;
}

function iconPlate(name) {
  return `<span class="icon-plate">${icon(name)}</span>`;
}

function logo(className = "logo") {
  return `<img class="${className}" src="/assets/herologo.webp" width="240" height="240" alt="Hero Homes">`;
}

function formDirect() {
  if (!site.operator.phone) return "";
  const tel = phoneTel(site.operator.phone);
  const wa = `91${phoneDigits(site.operator.phone)}`;
  const text = encodeURIComponent("Hello, I am enquiring about Hero Homes in Sector MU, Greater Noida.");
  return `<div class="form-direct">
    <a href="tel:${escapeHtml(tel)}">${icon("phone")}<span>Call Now</span></a>
    <a href="https://wa.me/${wa}?text=${text}" target="_blank" rel="noopener noreferrer"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2A8.7 8.7 0 0 0 4.55 16.3L3.4 20.6l4.4-1.15A8.7 8.7 0 1 0 12 3.2zm5.02 12.25c-.21.6-1.22 1.13-1.7 1.15-.43.02-.85.2-2.88-.6-2.42-.97-3.96-3.37-4.08-3.53-.12-.16-.99-1.32-.99-2.52s.62-1.78.85-2.03c.2-.23.46-.29.62-.29h.44c.14 0 .33-.05.52.4.2.47.69 1.64.75 1.76.06.12.1.26.02.41-.08.16-.12.26-.23.4-.12.13-.24.3-.35.41-.11.12-.23.24-.1.46.14.23.61 1.01 1.32 1.63.9.81 1.67 1.07 1.91 1.19.24.11.37.1.51-.06.14-.16.59-.69.75-.93.16-.24.31-.2.52-.12.22.08 1.35.64 1.58.75.23.12.38.17.44.27.06.1.06.57-.15 1.16z"/></svg><span>WhatsApp</span></a>
  </div>`;
}

function formMarkup({ id, enquiry, section, title, intro, button, direct = true, compact = false }) {
  const brand = compact
    ? `<p class="form-title">${escapeHtml(title)}</p>`
    : `<div class="form-brand">${logo("logo logo-form")}<p class="form-title">${escapeHtml(title)}</p></div>`;
  const lead = intro ? `<p class="form-intro">${escapeHtml(intro)}</p>` : "";
  return `<form class="enquiry" id="${id}" data-enquiry="${enquiry}" data-section="${section}" novalidate>
    ${brand}
    ${lead}
    <div class="field">
      <label class="visually-hidden" for="${id}-name">Full name</label>
      <div class="field-icon">
        ${icon("user")}
        <input id="${id}-name" name="name" type="text" autocomplete="name" maxlength="80" placeholder="Full name" required>
      </div>
      <p class="field-error" data-error-for="name"></p>
    </div>
    <div class="field">
      <label class="visually-hidden" for="${id}-phone">Mobile number</label>
      <div class="field-icon">
        ${icon("phone")}
        <input id="${id}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="16" placeholder="Mobile number" required>
      </div>
      <p class="field-error" data-error-for="phone"></p>
    </div>
    <input type="hidden" name="configuration" value="">
    <input type="hidden" name="contact_method" value="">
    <div class="consent">
      <input id="${id}-consent" name="consent" type="checkbox" value="yes">
      <div>
        <label for="${id}-consent">I agree to be contacted about Hero Homes Sector MU on this number. <a href="/privacy">Privacy policy</a>.</label>
        <p class="field-error" data-error-for="consent"></p>
      </div>
    </div>
    <div class="hp" aria-hidden="true">
      <label for="${id}-company">Company website</label>
      <input id="${id}-company" name="company" type="text" tabindex="-1" autocomplete="off">
    </div>
    <input type="hidden" name="enquiry_type" value="${enquiry}">
    <input type="hidden" name="section" value="${section}">
    <button class="btn btn-accent btn-block" type="submit">${escapeHtml(button || title)}</button>
    <p class="form-status" role="status" aria-live="polite"></p>
    ${direct ? formDirect() : ""}
  </form>`;
}

function enquireDialog() {
  return `<dialog id="enquiry-dialog" aria-labelledby="enquiry-dialog-title">
    <form class="enquiry enquiry-popup" id="form-popup" data-enquiry="project_details" data-section="popup" novalidate>
      <div class="dialog-head">
        <p id="enquiry-dialog-title">Enquire Now</p>
        <button class="icon-btn" type="button" data-close-dialog aria-label="Close">×</button>
      </div>
      <div class="dialog-body">
        <p class="form-intro">Share your name and mobile number.</p>
        <div class="field">
          <label class="visually-hidden" for="form-popup-name">Full name</label>
          <div class="field-icon">
            ${icon("user")}
            <input id="form-popup-name" name="name" type="text" autocomplete="name" maxlength="80" placeholder="Full name" required>
          </div>
          <p class="field-error" data-error-for="name"></p>
        </div>
        <div class="field">
          <label class="visually-hidden" for="form-popup-phone">Mobile number</label>
          <div class="field-icon">
            ${icon("phone")}
            <input id="form-popup-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="16" placeholder="Mobile number" required>
          </div>
          <p class="field-error" data-error-for="phone"></p>
        </div>
        <input type="hidden" name="configuration" value="">
        <input type="hidden" name="contact_method" value="">
        <div class="consent">
          <input id="form-popup-consent" name="consent" type="checkbox" value="yes">
          <div>
            <label for="form-popup-consent">I agree to be contacted about Hero Homes Sector MU on this number. <a href="/privacy">Privacy policy</a>.</label>
            <p class="field-error" data-error-for="consent"></p>
          </div>
        </div>
        <div class="hp" aria-hidden="true">
          <label for="form-popup-company">Company website</label>
          <input id="form-popup-company" name="company" type="text" tabindex="-1" autocomplete="off">
        </div>
        <input type="hidden" name="enquiry_type" value="project_details">
        <input type="hidden" name="section" value="popup">
        <button class="btn btn-accent btn-block" type="submit">Enquire Now</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </div>
    </form>
  </dialog>`;
}

function phoneDigits(value) {
  return String(value || "")
    .replace(/\D/g, "")
    .replace(/^91/, "")
    .replace(/^0/, "");
}

function phoneTel(value) {
  const digits = phoneDigits(value);
  return digits.length === 10 ? `+91${digits}` : String(value || "").replace(/[^\d+]/g, "");
}

function phoneLabel(value) {
  const digits = phoneDigits(value);
  if (digits.length !== 10) return String(value || "");
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

function callCapsule() {
  if (!site.operator.phone) return "";
  return `<a class="call-capsule" href="tel:${escapeHtml(phoneTel(site.operator.phone))}">${escapeHtml(phoneLabel(site.operator.phone))}</a>`;
}

function contactRail() {
  if (!site.operator.phone) return "";
  const label = phoneLabel(site.operator.phone);
  const tel = phoneTel(site.operator.phone);
  const wa = `91${phoneDigits(site.operator.phone)}`;
  const text = encodeURIComponent(
    "Hello, I am enquiring about Hero Homes Leafsong Retreat in Sector MU, Greater Noida."
  );
  return `<div class="contact-rail">
    <a class="rail-btn rail-call" href="tel:${escapeHtml(tel)}" aria-label="Call ${escapeHtml(label)}">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3.8h2.6l1.1 2.8-1.7 1a11.2 11.2 0 0 0 5.4 5.4l1-1.7 2.8 1.1V15a1.8 1.8 0 0 1-2 1.8A13.6 13.6 0 0 1 6.2 5.8 1.8 1.8 0 0 1 8 3.8z"/></svg>
    </a>
    <a class="rail-btn rail-wa" href="https://wa.me/${wa}?text=${text}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ${escapeHtml(label)}">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2A8.7 8.7 0 0 0 4.55 16.3L3.4 20.6l4.4-1.15A8.7 8.7 0 1 0 12 3.2zm5.02 12.25c-.21.6-1.22 1.13-1.7 1.15-.43.02-.85.2-2.88-.6-2.42-.97-3.96-3.37-4.08-3.53-.12-.16-.99-1.32-.99-2.52s.62-1.78.85-2.03c.2-.23.46-.29.62-.29h.44c.14 0 .33-.05.52.4.2.47.69 1.64.75 1.76.06.12.1.26.02.41-.08.16-.12.26-.23.4-.12.13-.24.3-.35.41-.11.12-.23.24-.1.46.14.23.61 1.01 1.32 1.63.9.81 1.67 1.07 1.91 1.19.24.11.37.1.51-.06.14-.16.59-.69.75-.93.16-.24.31-.2.52-.12.22.08 1.35.64 1.58.75.23.12.38.17.44.27.06.1.06.57-.15 1.16z"/></svg>
    </a>
  </div>`;
}

function header(active) {
  return `<a class="skip" href="#content">Skip to content</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="/">
        ${logo()}
        <span class="brand-place">Greater Noida</span>
      </a>
      <nav class="nav" aria-label="Page">
        <a href="/#overview">About</a>
        <a href="/#homes">Floor Plans</a>
        <a href="/#amenities">Amenities</a>
        <a href="/#location">Location</a>
        <a href="/#pricing">Price</a>
        <a href="/#contact">Contact</a>
      </nav>
      <div class="header-actions">
        ${callCapsule()}
        ${
          active === "home"
            ? `<button class="btn header-cta" type="button" data-enquiry="brochure" data-section="header" data-target="form-dock">Download Brochure</button>`
            : `<a class="btn header-cta" href="/#enquire">Download Brochure</a>`
        }
      </div>
    </div>
  </header>`;
}

function footer() {
  const phone = site.operator.phone
    ? `<a href="tel:${escapeHtml(phoneTel(site.operator.phone))}">${escapeHtml(phoneLabel(site.operator.phone))}</a>`
    : "";
  return `<footer class="site-footer" id="site-footer">
    <div class="wrap footer-grid">
      <div class="footer-brand">
        ${logo("logo logo-footer")}
        <p class="footer-kicker">Authorised channel partner</p>
        <p class="footer-title">Hero Homes Greater Noida</p>
        <p>Explore 3 BHK residences at Hero Homes Sector MU, Greater Noida. View floor plans, pricing, amenities and location details.</p>
      </div>
      <div>
        <p class="footer-heading">Quick Links</p>
        <ul>
          <li><a href="/#overview">About Hero Homes</a></li>
          <li><a href="/#homes">Hero Homes Floor Plans</a></li>
          <li><a href="/#pricing">Hero Homes Price List</a></li>
          <li><a href="/#amenities">Amenities</a></li>
          <li><a href="/#location">Location</a></li>
          <li><a href="/#faq">FAQs</a></li>
          <li><a href="/#contact">Contact</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-heading">Project Details</p>
        <ul class="footer-facts">
          <li>${icon("plan")}<span>Project: ${escapeHtml(p.marketedName)}</span></li>
          <li>${icon("pin")}<span>Location: ${escapeHtml(p.address)}</span></li>
          <li>${icon("home")}<span>Developer: ${escapeHtml(p.developer)}</span></li>
          <li>${icon("sheet")}<span>UP RERA: ${escapeHtml(p.rera)}</span></li>
        </ul>
      </div>
      <div>
        <p class="footer-heading">Contact</p>
        <ul class="footer-facts">
          ${phone ? `<li>${icon("phone")}<span>${phone}</span></li>` : ""}
          <li>${icon("map")}<span><a href="${escapeHtml(p.officialUrl)}">Official project website</a></span></li>
          <li>${icon("sheet")}<span><a href="${escapeHtml(p.reraPortal)}">UP RERA</a></span></li>
        </ul>
      </div>
    </div>
    <div class="wrap footer-base" id="disclaimer">
      <p class="footer-disclaimer">This website is published by an authorised channel partner for enquiries about Leafsong Retreat by Hero Homes. It is not the developer's website. Prices, payment terms, availability and project details are subject to applicable terms and official project documents. Images may be illustrative renders. The project is registered with UP RERA under ${escapeHtml(p.rera)}.</p>
      <div class="footer-end">
        <p class="footer-copy">© 2026 Authorised channel partner for Hero Homes, Sector MU. Leafsong Retreat is a project of Hero Realty Private Limited.</p>
        <nav class="footer-links" aria-label="Legal">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms &amp; Conditions</a>
          <a href="#disclaimer">Disclaimer</a>
        </nav>
      </div>
    </div>
  </footer>`;
}

function shot(slot, className = "") {
  return `<figure class="shot ${className}" data-slot="${escapeHtml(slot)}">
    <div class="shot-frame"></div>
  </figure>`;
}
function structuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.domain}/#website`,
        url: `${site.domain}/`,
        name: "Hero Homes Greater Noida",
        description: site.description,
        inLanguage: "en-IN"
      },
      {
        "@type": "WebPage",
        "@id": `${site.domain}/#webpage`,
        url: `${site.domain}/`,
        name: site.title,
        description: site.description,
        isPartOf: { "@id": `${site.domain}/#website` },
        about: { "@id": `${site.domain}/#project` },
        inLanguage: "en-IN"
      },
      {
        "@type": "ApartmentComplex",
        "@id": `${site.domain}/#project`,
        name: "Hero Homes Greater Noida",
        alternateName: p.marketedName,
        url: `${site.domain}/`,
        sameAs: p.officialUrl,
        description: site.description,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Plot GH-02, Sector MU",
          addressLocality: "Greater Noida",
          addressRegion: "Uttar Pradesh",
          postalCode: "201308",
          addressCountry: "IN"
        },
        brand: { "@type": "Brand", name: p.brand },
        identifier: {
          "@type": "PropertyValue",
          name: "UP RERA registration number printed by Hero Homes",
          value: p.rera
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${site.domain}/#faq`,
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a }
        }))
      }
    ]
  };
  return JSON.stringify(graph);
}

function head({ title, description, path, robots = "index, follow", ogTitle, ogDescription }) {
  const url = new URL(path, site.domain).href;
  const socialTitle = ogTitle || title;
  const socialDescription = ogDescription || description;
  return `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_IN">
  <meta property="og:site_name" content="Hero Homes Greater Noida">
  <meta property="og:title" content="${escapeHtml(socialTitle)}">
  <meta property="og:description" content="${escapeHtml(socialDescription)}">
  <meta property="og:url" content="${url}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(socialTitle)}">
  <meta name="twitter:description" content="${escapeHtml(socialDescription)}">
  <meta name="theme-color" content="#ffffff">
  <link rel="icon" href="/assets/herologo.png" type="image/png" sizes="240x240">
  <link rel="apple-touch-icon" href="/assets/herologo.png">
  <link rel="preload" href="/assets/fonts/poppins-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/poppins-600.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/poppins-700.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/styles.css">
</head>`;
}

export function renderHome() {
  const planLabels = ["Get 3 BHK Floor Plan", "Get 3 BHK Floor Plan", "Get Floor Plan & Price"];
  const highlights = [
    ["Location", "Sector MU, Greater Noida"],
    ["Project", p.marketedName],
    ["Configurations", "3 BHK residences"],
    ["Advertised sizes", "1,650–2,200 sq. ft."],
    ["Development area", `Approximately ${p.land}`],
    ["Residential towers", "3"],
    ["Clubhouse", `Approximately ${p.clubhouse}`],
    ["Starting price", p.startingPrice],
    ["UP RERA registration", p.rera],
    ["Possession timeline", p.possession]
  ];
  const highlightItems = highlights
    .map(
      ([label, value]) =>
        `<tr><th scope="row">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`
    )
    .join("");
  const placeGroups = site.places
    .map(([group, items]) => {
      const rows = items
        .map(([place, distance]) => `<tr><th scope="row">${escapeHtml(place)}</th><td>${distance ? escapeHtml(distance) : ""}</td></tr>`)
        .join("");
      return `<tr class="place-band"><th colspan="2" scope="colgroup">${escapeHtml(group)}</th></tr>${rows}`;
    })
    .join("");
  const homeCards = site.homes
    .map(
      ([name, size, note, price], index) => `<article class="plan card reveal">
          <div>
            <h3 class="plan-title">${iconPlate("home")}<span>${escapeHtml(name)} Floor Plan</span></h3>
            <div class="plan-meta">
              <div><span>Size</span><strong>${escapeHtml(size)}</strong></div>
              <div><span>${price.startsWith("₹") ? "Starting Price" : "Price"}</span><strong>${escapeHtml(price)}</strong></div>
            </div>
            <p>${escapeHtml(note)}</p>
          </div>
          <figure class="shot shot-locked" data-slot="plan-${index}">
            <div class="shot-frame"></div>
            <button class="btn plan-download" type="button" data-enquiry="floor_plan" data-configuration="${escapeHtml(name)}" data-label="${escapeHtml(planLabels[index])}" data-section="homes" data-target="form-dock">${escapeHtml(planLabels[index])}</button>
          </figure>
        </article>`
    )
    .join("");
  const amenityItems = site.amenities
    .map(
      ([name, text]) =>
        `<article class="amenity card reveal">${iconPlate(amenityIcons[name] || "home")}<div><h3>${escapeHtml(name)}</h3><p>${escapeHtml(text)}</p></div></article>`
    )
    .join("");
  const faqItems = faqs
    .map(
      (item) =>
        `<details class="reveal"><summary>${escapeHtml(item.q)}</summary><p>${escapeHtml(item.a)}</p></details>`
    )
    .join("");

  return `${head({
    title: site.title,
    description: site.description,
    path: "/",
    ogTitle: site.ogTitle,
    ogDescription: site.ogDescription
  })}
<body class="has-dock">
  ${header("home")}
  <main id="content">
    <section class="hero screen" id="enquire">
      <div class="hero-media" aria-hidden="true"></div>
      <div class="hero-layout">
        <div class="hero-copy">
          <p class="kicker reveal">Premium residences</p>
          <h1 class="reveal"><span class="hero-mark">Hero</span> Homes<br> Sector MU,<br> Greater Noida</h1>
          <p class="lede reveal">A thoughtfully planned community with spacious 3 BHK residences, modern amenities and a connected address in the heart of Greater Noida.</p>
          <ul class="hero-points reveal">
            <li>${iconPlate("home")}<span>Spacious 3 BHK Homes</span></li>
            <li>${iconPlate("towers")}<span>3 Towers on 4.5 Acres</span></li>
            <li>${iconPlate("leaf")}<span>Modern Lifestyle Amenities</span></li>
          </ul>
        </div>
        <aside class="hero-card" aria-label="Enquiry">
          ${formMarkup({
            id: "form-hero",
            enquiry: "project_details",
            section: "hero",
            title: "Enquire now",
            button: "Submit",
            intro: "",
            direct: false,
            compact: true
          })}
        </aside>
      </div>
      <dl class="hero-strip">
        <div>${iconPlate("pin")}<div><dt>Location</dt><dd>Sector MU, Greater Noida</dd></div></div>
        <div>${iconPlate("home")}<div><dt>Homes</dt><dd>3 BHK, 1,650–2,200 sq. ft.</dd></div></div>
        <div class="strip-price">${iconPlate("price")}<div><dt>Starting price</dt><dd>${escapeHtml(p.startingPrice)}<small>Introductory price ${escapeHtml(p.bsp)} until ${escapeHtml(p.bspUntil)}.</small></dd></div></div>
        <div class="strip-rera">${iconPlate("sheet")}<div><dt>RERA registration</dt><dd>${escapeHtml(p.rera)}</dd></div></div>
        <div>${iconPlate("calendar")}<div><dt>Possession</dt><dd>${escapeHtml(p.possession)}</dd></div></div>
      </dl>
    </section>
    <div class="page-shell">
    <div class="story">
    <section class="section" id="overview">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>About Hero Homes Greater Noida</h2>
          <p>Hero Homes brings premium residential living to Sector MU, Greater Noida, with a collection of spacious 3 BHK residences, landscaped surroundings and lifestyle amenities.</p>
          <p>Set across approximately ${escapeHtml(p.land)}, the development comprises three residential towers and a clubhouse designed to bring recreation, wellness and social spaces closer to home.</p>
          <p>Whether you are looking for a spacious family home or comparing premium apartments in Greater Noida, Hero Homes offers multiple 3 BHK configurations to explore.</p>
        </div>
        <div class="split">
          ${shot("overview")}
          <div class="card highlight-card reveal">
            <h3>Hero Homes Project Highlights</h3>
            <table class="spec-table">
              <tbody>${highlightItems}</tbody>
            </table>
          </div>
        </div>
        <div class="actions">
          <button class="btn" type="button" data-enquiry="brochure" data-section="overview" data-target="form-dock">Request Project Brochure</button>
        </div>
      </div>
    </section>

    <section class="section" id="homes">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Hero Homes Floor Plans</h2>
          <p>Explore Hero Homes floor plans designed for different family requirements. Choose from three advertised 3 BHK configurations, with options for two toilets, three toilets or an additional servant room.</p>
          <p>Compare the available layouts, apartment sizes and pricing to find the configuration that suits your needs.</p>
        </div>
        <div class="plan-list">${homeCards}</div>
        <p class="section-close">Compare Hero Homes floor plans and get the latest details for your preferred configuration.</p>
      </div>
    </section>

    <section class="section" id="amenities">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Hero Homes Amenities</h2>
          <p>Experience a residential environment that brings together recreation, wellness and landscaped open spaces. The planned amenities at Hero Homes are designed to complement everyday routines, family time and community living.</p>
        </div>
        ${shot("amenities", "shot-wide")}
        <div class="amenities">${amenityItems}</div>
        <div class="actions">
          <button class="btn" type="button" data-enquiry="brochure" data-label="Request Amenities Brochure" data-section="amenities" data-target="form-dock">Request Amenities Brochure</button>
        </div>
      </div>
    </section>

    <section class="section" id="location">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Hero Homes Sector MU Location</h2>
          <p>Hero Homes is located in Sector MU, Greater Noida, with access to key destinations across the city and the wider NCR region.</p>
          <p>The location connects residents to educational institutions, healthcare facilities, shopping destinations, recreational spaces and important road corridors.</p>
        </div>
        <div class="split">
          <iframe class="map-embed" title="Hero Homes, Sector MU, Greater Noida" src="${p.mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
          <div class="card place-card reveal">
            <h3>Connectivity and Nearby Destinations</h3>
            <table class="spec-table">
              <thead>
                <tr><th scope="col">Destination</th><th scope="col">Distance</th></tr>
              </thead>
              <tbody>${placeGroups}</tbody>
            </table>
            <p class="address-line"><strong>Project Address:</strong> ${escapeHtml(p.address)}.</p>
          </div>
        </div>
        <div class="actions">
          <button class="btn" type="button" data-enquiry="project_details" data-label="Get Location Details" data-section="location" data-target="form-dock">Get Location Details</button>
        </div>
      </div>
    </section>

    <section class="section" id="pricing">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Hero Homes Price List</h2>
          <p>Explore the Hero Homes price list for the available 3 BHK configurations in Sector MU, Greater Noida.</p>
          <p>The starting price is ${escapeHtml(p.startingPrice)} for the advertised 1,650 sq. ft. 3 BHK + 2 toilets configuration. Pricing for other configurations is available on request.</p>
        </div>
        <div class="card price-card reveal">
          <div class="table-wrap">
            <table>
              <caption>The basic sale price is exclusive of applicable additional charges, which may include GST, parking, floor charges, lease rent and deposits.</caption>
              <thead>
                <tr>
                  <th scope="col">Configuration</th>
                  <th scope="col">Size</th>
                  <th scope="col">Starting Price</th>
                </tr>
              </thead>
              <tbody>
                ${site.homes
                  .map(
                    ([name, size, , price]) =>
                      `<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(size)}</td><td>${escapeHtml(price)}</td></tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <p class="section-close">Get the latest Hero Homes price list to understand the cost of your preferred configuration.</p>
          <div class="actions">
            <button class="btn" type="button" data-enquiry="price_list" data-label="Get Complete Price List" data-section="pricing" data-target="form-dock">Get Complete Price List</button>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="suitability">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Find Your Ideal Home at Hero Homes</h2>
        </div>
        <div class="suit">
          <article class="card reveal">
            ${iconPlate("family")}
            <h3>Spacious Family Living</h3>
            <p>Explore three-bedroom residences with different layouts to accommodate your family's space and privacy requirements.</p>
          </article>
          <article class="card reveal">
            ${iconPlate("home")}
            <h3>More Room for Everyday Living</h3>
            <p>Compare the larger advertised configurations, including the option with a separate servant room.</p>
          </article>
          <article class="card reveal">
            ${iconPlate("leaf")}
            <h3>Lifestyle and Recreation</h3>
            <p>Explore the clubhouse, recreational facilities and landscaped spaces planned within the residential community.</p>
          </article>
          <article class="card reveal">
            ${iconPlate("map")}
            <h3>A Greater Noida Address</h3>
            <p>Consider Sector MU for access to Greater Noida's educational, healthcare, shopping and road-connectivity network.</p>
          </article>
          <article class="card reveal">
            ${iconPlate("sheet")}
            <h3>A Clearer Purchase Decision</h3>
            <p>Compare floor plans, pricing, payment terms and additional charges before selecting your preferred home.</p>
          </article>
        </div>
        <div class="actions">
          <a class="btn" href="#homes">Explore Available Configurations</a>
        </div>
      </div>
    </section>

    <section class="section" id="process">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Your Journey to a Hero Homes Residence</h2>
        </div>
        <ol class="steps">
          <li><div><h3>Explore the Floor Plans</h3><p>Choose the 3 BHK configuration that fits your space requirements and budget.</p></div></li>
          <li><div><h3>Get the Price List</h3><p>Receive the current pricing and configuration details for your preferred home.</p></div></li>
          <li><div><h3>Understand the Payment Plan</h3><p>Review the applicable payment schedule, booking terms and additional charges.</p></div></li>
          <li><div><h3>Arrange a Site Visit</h3><p>Explore the Sector MU location and learn more about the project.</p></div></li>
          <li><div><h3>Take the Next Step</h3><p>Discuss the available units, applicable terms and booking process with the project team.</p></div></li>
        </ol>
        <div class="actions">
          <button class="btn" type="button" data-enquiry="site_visit" data-section="process" data-target="form-dock">Schedule a Site Visit</button>
        </div>
      </div>
    </section>

    <section class="section" id="faq">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Hero Homes FAQs</h2>
        </div>
        <div class="faq">${faqItems}</div>
      </div>
    </section>

    <section class="section" id="contact">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Explore Hero Homes Greater Noida</h2>
          <p>Find your preferred 3 BHK configuration at Hero Homes Sector MU. Get the floor plans, price list and payment plan details to take the next step towards your new home.</p>
        </div>
        <figure class="visit-card reveal">
          <div class="shot-frame" aria-hidden="true"></div>
          <div class="visit-overlay">
            <p>Prefer to speak directly? Call or WhatsApp <a href="tel:${escapeHtml(phoneTel(site.operator.phone))}">${escapeHtml(phoneLabel(site.operator.phone))}</a>.</p>
            <button class="btn btn-accent" type="button" data-enquiry="project_details" data-section="contact">Get Project Details</button>
          </div>
        </figure>
      </div>
    </section>
    </div>
    <aside class="dock" id="lead-dock" aria-label="Enquiry">
      ${formMarkup({
        id: "form-dock",
        enquiry: "project_details",
        section: "dock",
        title: "Get the latest details",
        button: "Get Project Details",
        direct: false,
        intro: "Share your details and our team will call you with the price list, floor plans and payment options for Hero Homes Sector MU."
      })}
    </aside>
    </div>
  </main>
  ${enquireDialog()}
  ${footer()}
  ${contactRail()}
  <script type="application/ld+json">${structuredData()}</script>
  <script src="/assets/site.js" defer></script>
</body>
</html>`;
}

function legalPage({ title, description, path, body }) {
  return `${head({ title, description, path })}
<body>
  ${header("legal")}
  <main id="content" class="section legal">
    <div class="wrap">
      <h1>${escapeHtml(title)}</h1>
      ${body}
    </div>
  </main>
  ${footer()}
  ${contactRail()}
</body>
</html>`;
}

export function renderPrivacy() {
  return legalPage({
    title: "Privacy policy",
    description: "How this Hero Homes Sector MU project page handles enquiry details.",
    path: "/privacy",
    body: `<p>This page explains what happens to the name and mobile number you submit on ${escapeHtml(site.domain.replace("https://", ""))}.</p>
    <h2>Who publishes this page</h2>
    <p>This website is published by an authorised channel partner for enquiries about ${escapeHtml(p.marketedName)} by Hero Homes at ${escapeHtml(p.location)}. It is not the website of ${escapeHtml(p.developer)}.</p>
    <h2>What is collected</h2>
    <p>If you submit an enquiry, the site receives your name, Indian mobile number and consent. It also receives the kind of enquiry you opened, the part of the page you used, a configuration when you request a specific floor plan, and any campaign details already present in the page address, such as UTM fields, the landing path and the referrer.</p>
    <p>The form does not ask for PAN, Aadhaar, income or payment details. Closing the enquiry window does not send anything.</p>
    <h2>Why it is collected</h2>
    <p>The details are used so the project desk can contact you about ${escapeHtml(p.marketedName)} in ${escapeHtml(p.location)} with the information you asked for. Consent is required and is not pre-selected. You can read the project information without submitting the form.</p>
    <h2>Where it goes</h2>
    <p>A submitted enquiry is emailed to the project desk. The mail password stays on the server and is not shown on the page. If mail is not connected, the form says the enquiry was not saved and that nobody was notified.</p>
    <p>Call and WhatsApp buttons open your phone or WhatsApp to +91 98187 35258. Those conversations are not stored by this website.</p>
    <h2>How long it is kept</h2>
    <p>Enquiry records are kept only as long as needed to respond to you and to meet a legal duty, and are then deleted.</p>
    <h2>If you want to stop contact</h2>
    <p>Call +91 98187 35258 and ask not to be contacted about this enquiry.</p>
    <p>Reviewed ${escapeHtml(site.reviewed)}.</p>`
  });
}

export function renderTerms() {
  return legalPage({
    title: "Terms",
    description: "Terms for this authorised channel partner page for Hero Homes Sector MU.",
    path: "/terms",
    body: `<p>By using this website you agree to the points below.</p>
    <h2>What this website is</h2>
    <p>This website is an authorised channel partner page for Hero Homes Sector MU, Leafsong Retreat, in Greater Noida. It is not the website of Hero Realty Private Limited.</p>
    <h2>No offer</h2>
    <p>Nothing on this page is an offer, allotment or invitation that creates a contract. Prices, plans, charges and dates must come from a current written document and from the UP RERA record.</p>
    <h2>Accuracy</h2>
    <p>Project details, prices and dates can change. The price list we share is the one to use for the home you are considering.</p>
    <h2>Enquiries</h2>
    <p>Submitting the form is a request for contact. It is not a booking. If the lead desk is not configured, the site will say so and will not treat the attempt as a saved enquiry.</p>
    <p>Reviewed ${escapeHtml(site.reviewed)}.</p>`
  });
}

export function renderNotFound() {
  return `${head({
    title: "Page not found | Hero Homes Sector MU",
    description: "This address is not part of the Hero Homes Sector MU project page.",
    path: "/404",
    robots: "noindex, follow"
  })}
<body>
  ${header("legal")}
  <main id="content" class="section legal">
    <div class="wrap">
      <h1>This page is not available</h1>
      <p>The address does not match a page on this site. The project information is on the home page.</p>
      <div class="hero-actions">
        <a class="btn" href="/">Back to the project page</a>
      </div>
    </div>
  </main>
  ${footer()}
  ${contactRail()}
</body>
</html>`;
}

export function renderRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`;
}

export function renderSitemap() {
  const urls = ["/", "/privacy", "/terms"];
  const body = urls
    .map(
      (path) => `  <url><loc>${new URL(path, site.domain).href}</loc></url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
