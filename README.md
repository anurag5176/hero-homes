# Hero Homes, Sector MU

Independent project page for Leafsong Retreat in Sector MU, Greater Noida. It is not the official Hero Homes website.

## Run

```bash
npm install
npm run build
npm start
```

Open http://localhost:4173

The enquiry form stays unconnected until a lead destination is set. Copy `.env.example` to `.env` and fill in the mail account. `npm start` reads `.env`. A variable already set in the shell is left as it is. `.env` is not committed.

```bash
cp .env.example .env
npm start
```

Mail is sent with SMTP AUTH LOGIN and the account’s app password. For Gmail, use `smtp.gmail.com`, port `587`, `SMTP_SECURE=false`, and a 16-character app password from the Google account (spaces in the password are fine). `SMTP_FROM` should be the same address as `SMTP_USER`. `SMTP_TO` is the inbox that receives every form on the page.

A webhook (`LEAD_WEBHOOK_URL`) or a local file (`LEAD_LOCAL_STORE=true`) is used only when the SMTP fields are left empty. If nothing is configured, the form says the enquiry was not saved.

## Checks

```bash
npm test
npx playwright test
```

Playwright needs Chromium (`npx playwright install chromium`). Browser tests launch it outside a restricted sandbox.

Project facts live in `content/site.mjs`. Change them there, then rebuild.

Research and the launch checklist are in `docs/RESEARCH.md` and `docs/DELIVERY.md`.
