# Delivery

## What is built

A single project page, plus privacy, terms and a 404 page. The stack is static HTML generated from `content/site.mjs`, with a small Node server for files and `POST /api/enquiry`. There is no frontend framework and no third-party script.

```bash
npm install
npm run build
npm start
```

Production build: `npm run build`. It completed without errors.

Canonical host is `https://herohomesgroups.in/`. Point the domain at this Node process, or at a host that can run it, and redirect HTTP and any other hostname to that HTTPS origin. Do not deploy the `qa/` or `data/leads/` folders.

## Lead capture

The browser posts JSON to `/api/enquiry`. The server checks the name, a 10-digit Indian mobile number, an unticked-by-default consent box, the enquiry type and the optional configuration. A honeypot field and an in-memory rate limit sit in front of delivery.

Enquiry types stored with the lead: `project_details`, `price_list`, `brochure`, `floor_plan`, `payment_plan`, `site_visit`, `advisor`. A floor-plan action stores the configuration named on that plan. The payment-plan section does not state instalment percentages. UTM parameters, the landing path and the referrer are stored when present.

Every enquiry button posts to that same endpoint. Delivery, in order:

- SMTP when `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` and `SMTP_TO` are set. The password is an app password, sent with AUTH LOGIN over STARTTLS on port 587, or implicit TLS when `SMTP_SECURE=true` or the port is 465. `SMTP_FROM` defaults to `SMTP_USER`. Copy `.env.example` to `.env`; `npm start` loads it. The password is not written into the message or the logs.
- `LEAD_WEBHOOK_URL` posts the lead to that URL when SMTP is not configured. `LEAD_WEBHOOK_TOKEN` is sent as a bearer token if set.
- `LEAD_LOCAL_STORE=true` appends one JSON line under `data/leads/`. That is a single-server store, not a CRM.
- If none of these is set, the API returns 503 `not_configured`. The page says the details were not saved. It does not show a success message.

`GET /api/health` reports `leadSink` as `smtp`, `webhook`, `local` or `unconfigured`.

Call and WhatsApp appear only after `operator.phone` or `operator.whatsapp` is filled in `content/site.mjs` and the site is rebuilt. A WhatsApp click is only a link. It is not counted as a lead.

## SEO

- Title: Hero Homes Greater Noida | Price, Floor Plans & Payment Plans
- Open Graph title: Hero Homes Greater Noida | 3 BHK Homes in Sector MU
- One H1: Hero Homes Greater Noida
- Canonical `https://herohomesgroups.in/`
- `robots.txt` allows crawling and points at the sitemap
- Sitemap lists `/`, `/privacy` and `/terms` only
- FAQ answers are in the HTML
- Structured data: WebSite, WebPage, ApartmentComplex, FAQPage. No rating, review, price or offer
- The 404 response is HTTP 404 and `noindex`

## Checks run on 18 October 2026

- `npm test`: 11 passed. Covers validation, consent, bad numbers, honeypot, local save, webhook failure and retry, rate limit, canonical, banned claims, sitemap and fonts.
- `npx playwright test`: 3 passed. Covers the price button, floor-plan context, field errors, consent, success, failed delivery with values kept, retry, FAQ keyboard, campaign parameters, sitemap, robots, 404, overflow from 360px to 1440px, anchor clearance under the header, and the mobile enquire bar.
- Screenshots in `qa/screenshots/` at 1440×900, 1280×800, 1024×768, 768×1024, 390×844 and 360×800, including the hero, sections, the mobile form, errors, success and the unconfigured state. No horizontal overflow and no console errors in that capture.
- Local lab timing on `http://127.0.0.1:4184` at a 390px viewport: HTML about 36 KB, CSS about 15 KB, script about 9 KB, four Poppins files about 8 KB each. DOMContentLoaded was about 91 ms and the layout-shift observer recorded 0 during that load. That is a localhost run. It is not a field Core Web Vitals score. Largest Contentful Paint was not returned by that short observation. Thresholds from web.dev remain 2.5 s LCP, 200 ms INP and 0.1 CLS at the 75th percentile.
- Text contrast for the ink, muted copy, brown buttons and footer was calculated above 6:1.

## Before paid traffic

Do not send traffic for lead capture until a real destination has accepted a test lead.

Still needed from the business:

- Legal name of the site operator
- The mobile number and WhatsApp number that should receive buyers
- CRM or webhook URL, and a successful test into that system
- Written permission for the Hero Homes logo and project images
- Approved floor plans and a current written price sheet
- Confirmation of the plot, the area type, and the Form C on https://www.up-rera.in/verify
- Whether this site is an authorised channel partner, and any agent registration number that must be shown
- Analytics, if any, and the consent text that goes with it

Until those exist, the page already says the operator is unnamed, the phone is not configured, and the enquiry desk may be disconnected.
