# Research record

Checked 18 October 2026. Status words: VERIFIED, DEVELOPER-PUBLISHED, INDICATIVE, UNCONFIRMED, EXCLUDED.

The UP RERA verify page at https://www.up-rera.in/verify requires a captcha, so the Form C for this registration was not opened. Figures printed by Hero Homes are not treated as a substitute for that certificate.

## Identity

| Fact | Status | Source | Decision |
| --- | --- | --- | --- |
| Marketed name Leafsong Retreat, Sector MU, Greater Noida | DEVELOPER-PUBLISHED | https://www.herohomes.in/projects/apartments/greater-noida-uttar-pradesh/leafsong-retreat-sec-mu | Used, attributed to Hero Homes |
| Brand Hero Homes, company Hero Realty Private Limited | VERIFIED as the brand owner | https://www.herohomes.in/ and https://www.herocorp.com/our-business/hero-homes/ | Used. This site does not claim to be that company |
| 3 BHK | DEVELOPER-PUBLISHED | Same project page, visible summary | Used |
| Area 153.84–212.68 sq m | DEVELOPER-PUBLISHED | Visible project summary | Used. Area type is not stated |
| Schema also says 1,650–2,000 sq ft | DISCREPANCY | JSON-LD on the same page (`minValue` 1650, `maxValue` 2000, unit FTK) | EXCLUDED. 212.68 sq m is about 2,289 sq ft, so the schema upper bound does not match the visible range |
| Approximate conversion 1,656–2,289 sq ft | Derived | 1 sq m = 10.7639 sq ft, from the visible range only | Shown as a conversion, not as a developer figure |
| Three 30-storey towers over three basements | DEVELOPER-PUBLISHED | Project overview copy | Used as the developer’s description, not as a sanctioned-plan extract |
| Clubhouse 2,322.58 sq m | DEVELOPER-PUBLISHED | Same overview | Used the same way |
| Address Plot GH-02, Sector MU, Greater Noida, Uttar Pradesh 201308 | DEVELOPER-PUBLISHED | Structured data on the project page | Used, with the map pin the same page publishes: https://maps.app.goo.gl/FP2FEDd6VSZesMX6A |
| RERA number UPRERAPRJ414014/10/2026 | DEVELOPER-PUBLISHED | Footer text on the project page | Printed, with a link to https://www.up-rera.in/ . Not confirmed from Form C |
| Launch date 9 October 2026 | DEVELOPER-PUBLISHED | Same footer text (`09.10.2026`) | Printed |
| Collection account 99999077771405, IFSC HDFC0004393, HDFC Bank, Express Trade Tower 2, Sector 132, Noida | DEVELOPER-PUBLISHED | Same footer text | Printed as what Hero Homes prints. Match it to the certificate |
| Promoter Hero Realty Private Limited on the RERA record | INDICATIVE | https://upreratracker.com/leafsong-retreat-upreraprj414014-10-2026/ says the dashboard copy it read on 10 October 2026 names that promoter, registration date 8 October 2026, start 1 October 2026, completion 10 August 2031. The tracker says its full summary was not mirrored | Completion date is not stated as fact. FAQ tells the reader to open the portal |
| Price | UNCONFIRMED | Developer schema says “Contact for Pricing”. Channel pages quote different BSP and unit prices | EXCLUDED. Page says request the written list |
| Separate layout sizes such as 1,650 / 1,850 / 2,200 sq ft, 536 units, 4.5 acres | UNCONFIRMED | Channel pages, not the developer summary | EXCLUDED |
| Floor-plan file on the developer CMS | DEVELOPER-PUBLISHED as a file titled Floor Plan | Page data references `/uploads/FP_3_BHK_9b17de24d5.pdf` | Not copied onto this site. Visitors are asked to request the approved plan |
| Brochure file attached in that same CMS dropdown | EXCLUDED | The file name is a Palatial brochure, a different Hero Homes project | Not linked |
| Metro or expressway drive time | UNCONFIRMED | Not stated on the developer page reviewed | EXCLUDED |
| Distances to schools, hospitals and malls | DEVELOPER-PUBLISHED | Neighbourhood list on the project page. Page `updatedAt` in the CMS payload is 16 October 2026 | A short table is shown and labelled as copied, not measured here |
| Amenities: restaurant, gym, biophilic lounge, banquet hall with courtyard, meditation centre, spa and salon, indoor and outdoor children’s play, library and art corner | DEVELOPER-PUBLISHED | Visible amenity list | Named, and described as a list rather than a sanctioned specification |
| Swimming pool, jogging track, EV charging | UNCONFIRMED for this page | Present in structured data and, for the pool, in gallery labels, but not in the visible amenity list | EXCLUDED from the amenity list so a template field is not repeated as a specification |
| CIN on the Hero corporate page | EXCLUDED | https://www.herocorp.com/our-business/hero-homes/ shows a CIN beside a Hero Corporate Service contact block. It is not clearly the CIN of Hero Realty Private Limited | Not published |
| Hero customer-care number 1800 103 9212 | DEVELOPER-PUBLISHED on herohomes.in | Not used as this website’s click-to-call number | Visitors are sent to the official project page for the developer’s own contact route |

## Brand

Official stylesheet tokens read from herohomes.in on 18 October 2026:

- Paper `#fffcf7`
- Sand `#ece7dd`
- Brown `#39271d` and `#3b2519`
- Ink `#231f20`
- The official site loads Lato, not Poppins

This page uses those colours and Poppins, as specified for this build. The official logo file was not embedded. Permission to use the logo and project renders on an independent site is not established. No project photograph is shown.

## Search notes

Reviewed https://developers.google.com/search/docs/fundamentals/seo-starter-guide and https://web.dev/articles/vitals (page updated 31 October 2024). Core Web Vitals thresholds stated there are LCP within 2.5 seconds, INP within 200 milliseconds, and CLS of 0.1 or less, at the 75th percentile of real visits. A local timing run is not that measurement.

Competitor and channel pages were read only to see which claims conflict. Their prices, unit counts and sales lines were not reused. Repeated gaps: the area type, a dated cost sheet, and a Form C the buyer can open.

## Later pages worth writing, once the facts exist

- A price page fed by a written cost sheet.
- One page per approved layout, with carpet area taken from the plan.
- A location note with distances measured from the confirmed gate, including metro and expressway only after that measurement.
- A construction note when Hero Homes publishes one for this project.
