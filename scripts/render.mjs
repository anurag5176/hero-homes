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
  calendar: '<rect x="4" y="5" width="16" height="15" rx="1.5"/><path d="M8 3.5V6M16 3.5V6M4 10h16"/>'
};

const amenityIcons = {
  Restaurant: "utensils",
  Gym: "gym",
  "Biophilic lounge": "leaf",
  "Banquet hall with courtyard": "banquet",
  "Meditation centre": "calm",
  "Spa and salon": "spa",
  "Children’s play": "kids",
  "Library and art corner": "book",
  "Swimming pool": "spa",
  "Mini theatre": "banquet",
  "Sports courts": "gym",
  "Landscaped gardens": "leaf"
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

function formMarkup({ id, enquiry, section, title, intro }) {
  return `<form class="enquiry" id="${id}" data-enquiry="${enquiry}" data-section="${section}" novalidate>
    <div class="form-brand">${logo("logo logo-form")}</div>
    <h2 class="form-title">${escapeHtml(title)}</h2>
    <p class="form-intro">${escapeHtml(intro)}</p>
    <div class="dock-fields">
      <div class="field">
        <label for="${id}-name">Full name</label>
        <input id="${id}-name" name="name" type="text" autocomplete="name" maxlength="80" required>
        <p class="field-error" data-error-for="name"></p>
      </div>
      <div class="field">
        <label for="${id}-phone">Mobile number</label>
        <input id="${id}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="16" required>
        <p class="field-error" data-error-for="phone"></p>
      </div>
    </div>
    <input type="hidden" name="configuration" value="">
    <input type="hidden" name="contact_method" value="">
    <div class="consent">
      <input id="${id}-consent" name="consent" type="checkbox" value="yes">
      <div>
        <label for="${id}-consent">I agree to be contacted about Leafsong Retreat in Sector MU on this number.</label>
        <a href="/privacy">Privacy policy</a>
        <p class="field-error" data-error-for="consent"></p>
      </div>
    </div>
    <div class="hp" aria-hidden="true">
      <label for="${id}-company">Company website</label>
      <input id="${id}-company" name="company" type="text" tabindex="-1" autocomplete="off">
    </div>
    <input type="hidden" name="enquiry_type" value="${enquiry}">
    <input type="hidden" name="section" value="${section}">
    <button class="btn btn-accent btn-block" type="submit">${escapeHtml(title)}</button>
    <p class="form-status" role="status" aria-live="polite"></p>
  </form>`;
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
        <a href="/#homes">Floor plans</a>
        <a href="/#location">Location</a>
        <a href="/#pricing">Price</a>
      </nav>
      <div class="header-actions">
        ${callCapsule()}
        ${
          active === "home"
            ? `<button class="btn header-cta" type="button" data-enquiry="brochure" data-section="header" data-target="form-dock">Request brochure</button>`
            : `<a class="btn header-cta" href="/#pricing">Request brochure</a>`
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
        <h2>Hero Homes</h2>
        <p>Leafsong Retreat at Plot GH-02, Sector MU, Greater Noida. A 3 BHK project of Hero Realty Private Limited, presented on this page by an authorised channel partner.</p>
      </div>
      <div>
        <h2>Navigation</h2>
        <ul>
          <li><a href="/#overview">About</a></li>
          <li><a href="/#pricing">Price</a></li>
          <li><a href="/#homes">Floor plans</a></li>
          <li><a href="/#amenities">Amenities</a></li>
          <li><a href="/#location">Location</a></li>
          <li><a href="/#faq">FAQs</a></li>
        </ul>
      </div>
      <div>
        <h2>Homes</h2>
        <ul>
          <li><a href="/#homes">3 BHK + 2 toilets, 1,650 sq. ft.</a></li>
          <li><a href="/#homes">3 BHK + 3 toilets, 1,850 sq. ft.</a></li>
          <li><a href="/#homes">3 BHK + servant room, 2,200 sq. ft.</a></li>
          <li><a href="/#pricing">Price list</a></li>
        </ul>
      </div>
      <div>
        <h2>Project</h2>
        <ul class="footer-facts">
          <li>${icon("pin")}<span>${escapeHtml(p.address)}</span></li>
          ${phone ? `<li>${icon("phone")}<span>${phone}</span></li>` : ""}
          <li>${icon("sheet")}<span>UP RERA ${escapeHtml(p.rera)}</span></li>
          <li>${icon("plan")}<span>Developer: Hero Realty Private Limited</span></li>
        </ul>
      </div>
    </div>
    <div class="wrap footer-base" id="disclaimer">
      <p class="footer-disclaimer"><strong>Disclaimer.</strong> This website is published by an authorised channel partner for enquiries about Leafsong Retreat by Hero Homes, Sector MU. It is not the developer’s website, and nothing on it is an offer, an allotment, or a contract. The starting price of ${escapeHtml(p.startingPrice)} and the introductory basic sale price of ${escapeHtml(p.bsp)} until ${escapeHtml(p.bspUntil)} are indications. They can change, and GST and other charges are extra. Sizes, plans, and possession dates are subject to the developer’s current documents. Images on this page are design renders. The project is registered with UP RERA as ${escapeHtml(p.rera)}. That registration can be checked on the UP RERA portal.</p>
      <div class="footer-end">
        <p class="footer-copy">© 2026 Authorised channel partner for Hero Homes, Sector MU. Leafsong Retreat is a project of Hero Realty Private Limited.</p>
        <nav class="footer-links" aria-label="Legal">
          <a href="/privacy">Privacy policy</a>
          <a href="/terms">Terms</a>
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
        name: "Hero Homes Sector MU project information",
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
        name: p.marketedName,
        url: p.officialUrl,
        description:
          "3 BHK homes at Leafsong Retreat in Sector MU, Greater Noida. Starting price ₹1.80 Cr.",
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

function head({ title, description, path, robots = "index, follow" }) {
  const url = new URL(path, site.domain).href;
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
  <meta property="og:site_name" content="Hero Homes Sector MU">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${url}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
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
  const distanceRows = site.distances
    .map(
      ([place, distance]) =>
        `<tr><td>${escapeHtml(place)}</td><td>${escapeHtml(distance)}</td></tr>`
    )
    .join("");
  const homeCards = site.homes
    .map(
      ([name, size, note, price], index) => `<article class="plan card reveal">
          <div>
            <h3 class="plan-title">${iconPlate("home")}<span>${escapeHtml(name)}</span></h3>
            <div class="plan-meta">
              <div><span>Size</span><strong>${escapeHtml(size)}</strong></div>
              <div><span>Starting price</span><strong>${escapeHtml(price)}</strong></div>
            </div>
            <p>${escapeHtml(note)}</p>
          </div>
          <figure class="shot shot-locked" data-slot="plan-${index}">
            <div class="shot-frame"></div>
            <button class="btn plan-download" type="button" data-enquiry="floor_plan" data-configuration="3 BHK" data-section="homes" data-target="form-dock">Download floor plan</button>
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

  return `${head({ title: site.title, description: site.description, path: "/" })}
<body class="has-dock">
  ${header("home")}
  <div class="page-shell">
  <main id="content" class="story">
    <section class="hero screen" id="enquire">
      <div class="hero-media" aria-hidden="true"></div>
      <div class="wrap">
        <p class="kicker reveal">Leafsong Retreat · Sector MU</p>
        <h1 class="reveal">Hero Homes Sector MU, Greater Noida</h1>
        <p class="lede reveal">Premium 3 BHK residences on ${escapeHtml(p.land)}. Homes start at ${escapeHtml(p.startingPrice)}. Introductory price ${escapeHtml(p.bsp)} until ${escapeHtml(p.bspUntil)}.</p>
        <dl class="hero-facts reveal">
          <div>${iconPlate("pin")}<div><dt>Location</dt><dd>${escapeHtml(p.location)}</dd></div></div>
          <div>${iconPlate("home")}<div><dt>Homes</dt><dd>3 BHK · 1,650–2,200 sq. ft.</dd></div></div>
          <div>${iconPlate("price")}<div><dt>Starting price</dt><dd>${escapeHtml(p.startingPrice)}</dd></div></div>
          <div>${iconPlate("towers")}<div><dt>Scale</dt><dd>3 towers · ${escapeHtml(p.land)}</dd></div></div>
          <div>${iconPlate("sheet")}<div><dt>RERA</dt><dd>${escapeHtml(p.rera)}</dd></div></div>
          <div>${iconPlate("calendar")}<div><dt>Possession</dt><dd>${escapeHtml(p.possession)}</dd></div></div>
        </dl>
      </div>
    </section>

    <section class="section" id="overview">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>About Hero Homes in Sector MU</h2>
          <p>Leafsong Retreat is our residential address in Sector MU, Greater Noida. Three 30-storey towers rise over a pedestrian podium, with a clubhouse of ${escapeHtml(p.clubhouse)} and planted open space across ${escapeHtml(p.land)}.</p>
        </div>
        <div class="split">
          ${shot("overview")}
          <div class="prose card reveal">
            <h3>A 3 BHK community</h3>
            <p>The homes run from 1,650 sq. ft. to 2,200 sq. ft., inside ${escapeHtml(p.areaLabel)}. Families get three bedrooms, with a choice of two bathrooms, three bathrooms, or a servant room.</p>
            <p>Possession is ${escapeHtml(p.possession)}. The project is registered with UP RERA as ${escapeHtml(p.rera)}.</p>
          </div>
        </div>
        <div class="actions">
          <button class="btn" type="button" data-enquiry="project_details" data-section="overview" data-target="form-dock">Request project details</button>
        </div>
      </div>
    </section>

    <section class="section" id="homes">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Hero Homes 3 BHK floor plans</h2>
          <p>Three layouts, from a 1,650 sq. ft. home to a 2,200 sq. ft. home with a servant room. Sizes sit inside ${escapeHtml(p.areaLabel)}.</p>
        </div>
        <div class="plan-list">${homeCards}</div>
      </div>
    </section>

    <section class="section" id="amenities">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Amenities at Hero Homes Sector MU</h2>
          <p>A ${escapeHtml(p.clubhouse)} clubhouse, a swimming pool, fitness and play, set in landscaped open space on a vehicle-free podium.</p>
        </div>
        ${shot("amenities", "shot-wide")}
        <div class="amenities">${amenityItems}</div>
      </div>
    </section>

    <section class="section" id="location">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Hero Homes Sector MU location</h2>
          <p>${escapeHtml(p.address)}. Sector MU connects to Pari Chowk, Knowledge Park, the Noida–Greater Noida Expressway and the wider road to Jewar.</p>
        </div>
        <div class="split">
          <iframe class="map-embed" title="Leafsong Retreat by Hero Homes, Sector MU, Greater Noida" src="${p.mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
          <div class="table-wrap card reveal">
            <table>
              <thead>
                <tr><th scope="col">Nearby</th><th scope="col">Distance</th></tr>
              </thead>
              <tbody>${distanceRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="pricing">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Hero Homes Sector MU price list</h2>
          <p>Homes start at ${escapeHtml(p.startingPrice)}. The introductory basic sale price is ${escapeHtml(p.bsp)} until ${escapeHtml(p.bspUntil)}.</p>
        </div>
        <div class="card price-card reveal">
          <div class="table-wrap">
            <table>
              <caption>Introductory basic sale price ${escapeHtml(p.bsp)} until ${escapeHtml(p.bspUntil)}. GST, parking, floor charges, lease rent and deposits are extra.</caption>
              <thead>
                <tr>
                  <th scope="col">Home</th>
                  <th scope="col">Size</th>
                  <th scope="col">Starting price</th>
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
          <div class="actions">
            <button class="btn" type="button" data-enquiry="price_list" data-section="pricing" data-target="form-dock">Get the latest price list</button>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="suitability">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Who Hero Homes Sector MU is for</h2>
          <p>Families who want a 3 BHK in Greater Noida, with a clubhouse, open space and a registered project.</p>
        </div>
        <div class="suit">
          <article class="card reveal">
            ${iconPlate("family")}
            <h3>Families</h3>
            <p>Three bedrooms from 1,650 sq. ft., with play areas, a pool and schools within a short drive of Sector MU.</p>
          </article>
          <article class="card reveal">
            ${iconPlate("map")}
            <h3>Greater Noida</h3>
            <p>Plot GH-02, Sector MU, with Pari Chowk, Knowledge Park and the expressway close by.</p>
          </article>
          <article class="card reveal">
            ${iconPlate("sheet")}
            <h3>A clear price</h3>
            <p>Start at ${escapeHtml(p.startingPrice)}, then take the cost sheet for the layout, the floor and the charges that sit outside the basic price.</p>
          </article>
          <article class="card reveal">
            ${iconPlate("plan")}
            <h3>A registered home</h3>
            <p>UP RERA ${escapeHtml(p.rera)}, with possession in ${escapeHtml(p.possession)}.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section" id="process">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Move in, step by step</h2>
        </div>
        <ol class="steps">
          <li>Tell us the 3 BHK you want and we send the price list and floor plan.</li>
          <li>We walk you through GST, parking and any floor charge on that home.</li>
          <li>You choose the tower and floor that are open.</li>
          <li>We arrange a site visit at Sector MU.</li>
          <li>You book under UP RERA ${escapeHtml(p.rera)}, with possession in ${escapeHtml(p.possession)}.</li>
        </ol>
        <div class="actions">
          <button class="btn" type="button" data-enquiry="site_visit" data-section="process" data-target="form-dock">Arrange a site visit</button>
        </div>
      </div>
    </section>

    <section class="section" id="faq">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Frequently asked questions</h2>
        </div>
        <div class="faq">${faqItems}</div>
      </div>
    </section>

    <section class="section" id="visit">
      <div class="wrap">
        <div class="section-head reveal">
          <h2>Get the latest Hero Homes details</h2>
          <p>Leave your name and number. We will call you with the price list, the floor plan and a time to visit Sector MU.</p>
        </div>
        <div class="split">
          ${shot("visit")}
          <div class="card reveal prose">
            <p>Call or WhatsApp ${escapeHtml(phoneLabel(site.operator.phone))} if you would rather speak now. Possession is ${escapeHtml(p.possession)}.</p>
            <div class="actions">
              <button class="btn" type="button" data-enquiry="advisor" data-section="visit" data-target="form-dock">Speak to the project advisor</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <aside class="dock" id="lead-dock" aria-label="Enquiry">
    ${formMarkup({
      id: "form-dock",
      enquiry: "project_details",
      section: "dock",
      title: "Request a call",
      intro: "Name and mobile number. We will call you about Leafsong Retreat."
    })}
  </aside>
  </div>
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
    <h2>Who operates the site</h2>
    <p>${site.operator.legalName ? escapeHtml(site.operator.legalName) + " operates this website." : "The legal name of the website operator has not been published yet. Until it is, the enquiry form is not a production lead channel."}</p>
    <h2>What is collected</h2>
    <p>If you submit the form, the site receives your name, Indian mobile number, consent, optional configuration and contact preference, the enquiry type, the section you used, and campaign parameters already present in the page address (UTM fields, landing path and referrer).</p>
    <p>The form does not ask for PAN, Aadhaar, income or payment details.</p>
    <h2>Why it is collected</h2>
    <p>The details are used to respond to your enquiry about ${escapeHtml(p.marketedName)} in ${escapeHtml(p.location)}. Consent is required and is not pre-selected. You can read the project information on this page without submitting the form.</p>
    <h2>Where it goes</h2>
    <p>Enquiries are emailed through the mail account configured on the server. If mail is not configured, the form states that the enquiry was not saved. The app password stays on the server. Details are not placed in public pages or in frontend code.</p>
    <h2>How long it is kept</h2>
    <p>The operator should keep enquiry records only as long as needed to respond and to meet a legal duty, then delete them. A retention period will be published when the operating business is named.</p>
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
