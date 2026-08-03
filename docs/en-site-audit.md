# Resolve IT EN website audit and optimisation plan

Scope: https://www.resolveit.nl/en, audited against the live site and the Astro codebase (August 2026).
Positioning direction: "The Salesforce partner that connects CRM with the rest of your business."

Legend used throughout:
- **Confirmed**: observed directly in the code or on the live site.
- **[Verify]**: likely issue or claim that needs checking before acting.
- **[Verification required]**: a claim or statistic that must not be published until evidence exists.

---

## A. Executive assessment

| Dimension | Score | Rationale |
| --- | --- | --- |
| Positioning | 5/10 | Confirmed: the hero H1 is "Harness the power of Salesforce" and the supporting line is "engine for growth: implementation, integration, training and consultancy". Nothing distinguishes Resolve IT from any other partner. The actual differentiator (own products connecting Salesforce to Exact, Stripe, SharePoint, Business Central) only appears from the Billing Platform spotlight halfway down. |
| Clarity | 6/10 | Individual sections are clear and well written. The page as a whole gives services, products, industries and clients near-equal weight, so a first-time visitor has no obvious path. |
| Trust | 7/10 | Strong raw material: 15 detailed cases with client logos, a 5-star AppExchange rating, Gold Consultancy and ISV partner badges, a client logo wall. But the logo wall sits in section 8 of the homepage, and the case quotes are placeholder texts that still need client sign-off before they may count as evidence. |
| User experience | 7/10 | Clean design, consistent components (ServiceDetail, product pages, case template), working language toggle, good cookie flow. Weaknesses are choice overload in the nav dropdowns and no guided path by customer problem. |
| Conversion | 5/10 | Confirmed: the hero CTAs are "Our products" and "Ask a question"; the nav CTA is "Book a meeting" (straight to Calendly); the strip uses "Book a meeting" + "Ask a question"; product sections add "Request a demo". Four competing verbs, and the highest-intent action (book) is absent from the hero. Contact page makes no promise about who responds or how fast. |
| Copywriting | 6/10 | Tone is professional and mostly free of hype, and FAQ answers are genuinely informative. But generic consultancy phrases remain ("Tailored solutions", "unlock the full potential", "truly works"), and the strongest concrete facts (own AppExchange products, 340+ projects, named case results) are underused in headings. |
| SEO | 7/10 | Confirmed solid foundation: canonical www, hreflang nl-NL/en/x-default, Organization + WebSite + Breadcrumb structured data, sitemap with 199 URLs, 46 EN blog articles, 301 host consolidation. Weaknesses: Dutch URL slugs under /en/ (diensten, producten, over-ons), the EN home title "Harness the Power of Salesforce" carries no keyword intent, and stat counters render "0" in static HTML. |
| Mobile experience | 7/10 | Responsive grids and a mobile nav exist and the cookie banner behaves. [Verify] real-device testing of the hero (tall stacked content), the marquee bands and the team carousel; not tested on physical devices in this audit. |
| Technical performance | 8/10 | Static Astro output, few dependencies, lazy-loaded images, prefers-reduced-motion respected in global.css and the reveal script. Costs: Calendly CSS+JS loaded on every page, Google Fonts render-blocking, several animated blur layers, and mixed client logo formats/sizes. |

Overall: a technically healthy, well-built site whose weakest layer is the commercial one: positioning, CTA hierarchy and the placement of proof. That is good news, because those are copy and layout changes, not rebuilds.

---

## B. Prioritised action plan

### Critical (fix immediately)

1. **Rewrite the homepage hero (positioning + CTA).**
   Why: the five-second test fails; the headline fits any Salesforce partner and neither hero button is the booking action.
   Solution: deliverable C below is paste-ready.
   Impact: high. Effort: small.

2. **One CTA hierarchy across the site.**
   Why: "Our products", "Ask a question", "Book a meeting", "Request a demo" and "Plan a conversation" compete. Visitors should never have to weigh CTAs against each other.
   Solution: Primary = "Book a 30-minute consultation" (Calendly). Secondary = "View customer cases". Product pages keep "Request a demo" as their local primary, with the consultation CTA as secondary. Replace "Ask a question" everywhere with a plain link to the contact page in body copy, not a button.
   Impact: high. Effort: small (wording sweep; the buttons already exist).

3. **Stop rendering counters as "0" in HTML.**
   Confirmed: `<span data-count="340" data-suffix="+">0</span>` ships "0 Projects" to crawlers and no-JS users, on the home pages and about pages in both languages.
   Solution: render the final value server-side and animate only as an enhancement (code in deliverable H1).
   Impact: medium for SEO and resilience, high for credibility in cached previews. Effort: small.

4. **Case quotes: publish only verified ones.**
   Confirmed constraint from the project itself: the client quotes in the case studies were drafted internally and still need client approval. Until then they are unsupported claims in exactly the place where trust matters most.
   Solution: get sign-off per quote, or temporarily hide the quote block (it is already conditional in the template).
   Impact: high (risk removal). Effort: small technically; the work is outreach.

5. **"+45% efficiency, average result" floating badge.** [Verification required]
   Confirmed present on both home pages. If this number cannot be substantiated with a defined measurement, replace it with a verifiable fact, e.g. "340+ projects delivered" or a named case result ("PayPlaza: 75% time saved on onboarding").
   Impact: medium. Effort: small.

### High impact (complete next)

6. **Move proof up the homepage.** Client logo wall and partner credentials belong directly under the hero, before the services grid. The logos exist; this is reordering sections.
   Impact: high. Effort: small.

7. **Add a problem-led "solution paths" section.** Four cards: Implement Salesforce / Improve what you have / Connect Salesforce to finance and operations / Automate with AI, each mapping to an existing page (implementation, consultancy, products+development, agentforce). Copy in deliverable C.
   Impact: high. Effort: medium (one new section, links to existing pages).

8. **Feature one case with numbers on the homepage.** Recommended: PayPlaza (75% time saving, 50+ partners, 20,000+ POS locations) as the lead, Marie-Stella-Maris as the brand-name alternate. Both already have full case pages and logos.
   Impact: high. Effort: small.

9. **Contact page conversion frame.** Add who responds, response time, what happens next (three steps), and that the first conversation is exploratory and non-binding. Response-time promise needs an internal decision: [Verification required] that one business day is actually achievable.
   Impact: medium-high. Effort: small.

10. **EN home page title and meta description.** Replace "Harness the Power of Salesforce | Resolve IT" with a keyword-bearing title (deliverable G). Same for the services and products overview titles ("Our services", "Products" carry no intent).
    Impact: medium-high for SEO. Effort: small.

11. **Label the statistics consistently.** "340+ projects" vs "300+ projects" history, "10+ experts" vs "10+ certified experts", "Gold Partner" vs "Certified Partner" vs "Gold Consultancy Partner". Pick one label per fact and reuse it verbatim: "340+ completed projects", "10+ certified Salesforce experts", "Salesforce Gold Consultancy Partner", "Salesforce ISV Partner", "Fin Gold Partner". The about-page hero badge still says "Certified Partner" while the homepage pill says "Gold Partner". Confirmed inconsistency.
    Impact: medium. Effort: small.

### Supporting improvements (afterwards)

12. **Generic phrase sweep** (list and replacements in section E notes): "Tailored solutions for your specific situation", "unlock the full potential", "truly works", "engine for growth".
13. **Calendly assets on demand**: load widget.css/js only when a Calendly link is present or on first click (H4).
14. **Client logo hygiene**: convert remaining JPEG/PNG logos (mokma.jpeg confirmed) to compressed PNG/SVG with consistent bounding boxes, as was already done for MSM and MYbusinessmedia.
15. **English URL slugs for new pages only.** Do not rename existing /en/diensten/... URLs (they are indexed, internally consistent and hreflang-linked; a rename creates a redirect web for marginal gain). New EN pages should use English slugs.
16. **Blog overview curation**: 46 articles listed newest-first with no topic grouping. Add category filters (categories already exist in frontmatter) and a "start here" strip linking the four commercial clusters (billing, Exact integration, implementation partner choice, AI).
17. **Add FAQPage structured data** to service and product FAQs (H3).
18. **Alt-text pass**: client tiles have alts (confirmed), but several decorative images use empty alts correctly while some content images could be more descriptive. Low priority.

---

## C. Homepage rewrite (paste-ready, British English)

**SEO title** (≤60 chars):
`Salesforce Partner for Implementation & Integration`

**Meta description** (≤155 chars):
`Resolve IT implements Salesforce and connects it to Exact, Stripe, SharePoint and more with our own AppExchange products. Gold Partner, 340+ projects.`

**Hero eyebrow:**
`Salesforce Gold Consultancy Partner · since 2019`

**H1:**
`Salesforce, connected to the rest of your business`

**Supporting paragraph:**
`Most partners stop at CRM. We implement Salesforce and connect it to your invoicing, accounting, documents and operations, using products we built and maintain ourselves. One system of record, from first contact to paid invoice.`

**Primary CTA:** `Book a 30-minute consultation`
**Secondary CTA:** `View customer cases`

**Hero stats (rendered, not counted from 0):**
`340+ completed projects · 10+ certified Salesforce experts · 5★ AppExchange rating`

**Trust section (directly under hero):**
Heading: `Trusted by organisations across the Netherlands and Belgium`
Sub: `From scale-ups to established names such as Talpa Studios, Marie-Stella-Maris and PayPlaza.`
(Reuse the existing logo carousel here, moved up. Keep the partner badges: Salesforce Gold Consultancy Partner, Salesforce ISV Partner, Fin Gold Partner.)

**Customer problem section:**
Heading: `Does this sound familiar?`
- `Salesforce is live, but invoicing still happens in another system, by hand.`
- `Your team works around Salesforce instead of in it.`
- `Reports never quite match what finance sees in Exact.`
- `Every new integration turns into a custom development project.`
Closing line: `These are the problems we solve every week. Usually with products that already exist.`

**Solution paths section:**
Heading: `Choose your starting point`
1. **Implement Salesforce** — `A first implementation or a fresh start, live within weeks, with adoption built in.` → /en/diensten/implementatie
2. **Improve what you have** — `An independent audit of your set-up, with quick wins first and a roadmap after.` → /en/diensten/consultancy
3. **Connect Salesforce to finance and operations** — `Exact Online, Business Central, Stripe, SharePoint and more, using our own maintained connectors.` → /en/producten
4. **Automate with AI** — `Agentforce and Fin agents that resolve routine work, with guardrails you control.` → /en/diensten/agentforce

**Featured case section:**
Eyebrow: `Customer case · PayPlaza`
Heading: `75% less time per onboarding, 50+ partners, 20,000+ POS locations`
Body: `PayPlaza automated its customer onboarding on Salesforce with Resolve IT. What used to be manual checklist work now runs as one governed process.`
CTA: `Read the PayPlaza case` → /en/cases/payplaza · secondary link `All cases` → /en/cases

**Products section:**
Heading: `Our own products on the AppExchange`
Sub: `Built and maintained by the same team that implements them. No abandoned custom code.`
(Keep the existing product cards: Billing Platform, Influx Exact Connector, Influx Business Central Connector, SharePoint Connector, Datasolver, SignFlow, AI Prompt Builder. CTA per card: `View product`.)

**Working process section:**
Heading: `How an engagement works`
1. `Introduction (30 minutes): you describe the situation, we say honestly whether we can help.`
2. `Assessment: we review your set-up and data before proposing anything.`
3. `Delivery in short cycles: working software every sprint, hours reported transparently.`
4. `After go-live: training, documentation and support from the people who built it.`

**Why Resolve IT section:**
Heading: `Why organisations pick us`
- `Direct access to senior consultants; no account-manager layer.`
- `Our integrations are supported by the team that built them.`
- `No unnecessary custom development: if a product exists, we use it.`
- `Knowledge transfer is part of every project, so you are not dependent on us.`

**Final CTA:**
Heading: `See what connected Salesforce looks like for your organisation`
Body: `A 30-minute conversation, no obligations. You leave with a practical next step, whether that involves us or not.`
Primary: `Book a 30-minute consultation` · Secondary: `View customer cases`

---

## D. Navigation recommendation

Desktop (7 items max):

| Label | Target | Notes |
| --- | --- | --- |
| Services | /en/diensten (dropdown) | Order dropdown by demand: Implementation, Audit & Consultancy, Integrations & Development, Managed Services, AI (Agentforce & Fin), Training. Merge "Agentforce & AI" and "Fin AI (Intercom)" into one "AI" entry with both pages beneath it. |
| Products | /en/producten (dropdown) | Lead with Billing Platform and Exact Connector (the differentiators), then the rest. |
| Cases | /en/cases | Promote above "Who we help": proof beats taxonomy. |
| Who we help | /en/voor-wie (dropdown) | Rename from "For who?" if that wording is used anywhere; sector list unchanged. |
| Pricing or Approach | optional future page | Only if created; do not add an empty stub. |
| About | /en/over-ons | |
| Blog | /en/blog | |
| CTA button | Calendly | Relabel from "Book a meeting" to "Book a consultation" for consistency with the new hierarchy. |

Mobile: same order, accordion dropdowns (already implemented), CTA button pinned at the end of the menu (already implemented). Drop "Solutions" (/en/oplossingen) from the main nav and let the homepage problem section carry that role; keep the page reachable from the footer. [Verify] traffic to /en/oplossingen before removing.

---

## E. Page-by-page recommendations

### 1. Homepage (/en)
- Intention: orientation; "is this the partner for us?"
- Main problem: generic hero, proof too late, no problem-led path.
- Structure and copy: deliverable C.
- H1: `Salesforce, connected to the rest of your business`
- Primary CTA: `Book a 30-minute consultation`

### 2. Services overview (/en/diensten)
- Intention: "what can they do for us?"
- Main problem: title "Our services" and H1 "Everything for lasting Salesforce success" are generic; the eight cards have equal weight.
- Structure: intro naming the four paths (implement, improve, connect, automate) → cards grouped under those paths → stats band (already present, fix counters) → case strip → CTA.
- H1: `Salesforce services: implement, improve, connect, automate`
- Title tag: `Salesforce Consultancy Services | Resolve IT`
- Primary CTA: `Book a 30-minute consultation`

### 3. Products overview (/en/producten)
- Intention: "do they have something ready-made for my problem?"
- Main problem: solid page, but leads with the product names instead of the problems they remove.
- Structure: reframe intro: `Every product below exists because we kept rebuilding the same integration for customers. Now you install it.` Add one measurable proof line per card where a case exists (Billing → Follo/ParkBee, Exact → MarketResponse 4 administrations, SharePoint → Talpa).
- H1: `Ready-made Salesforce extensions, built by the team that supports them`
- Title tag: `Salesforce Products & Connectors (AppExchange) | Resolve IT`
- Primary CTA per card: `View product`; page-level: `Request a demo`.

### 4. Exact Online Connector (/en/producten/exact-online)
- Intention: high, specific: "connect Salesforce and Exact".
- Main problem: page is strong (FAQ, cases, Peppol). Ensure the multi-administration FAQ (MarketResponse, 4 administrations) stays prominent; it answers the most common objection.
- H1 keeps product name + outcome: `Influx: Salesforce and Exact Online, permanently in sync`
- Title tag: `Salesforce Exact Online Integration (Influx Connector) | Resolve IT`
- Primary CTA: `Request a demo`. Add secondary: `Read the MarketResponse case`.

### 5. Billing Platform (/en/producten/billing-module)
- Intention: "invoice and collect from Salesforce".
- Main problem: feature-led lists; pricing presentation absent. [Verify] whether pricing tiers may be published; Datasolver already shows tiers, so the pattern exists.
- Structure: outcome lead (`From order to paid invoice without leaving Salesforce`), then the three case-backed proof points (Follo: subscriptions and receivables; ParkBee: contracts and Stripe collection; MarketResponse: Exact combination), then features, then FAQ, then demo CTA.
- Title tag: `Salesforce Billing & Subscription Management | Billing Platform`
- Primary CTA: `Request a demo`.

### 6. Cases overview (/en/cases)
- Intention: validation.
- Main problem: cards show sector + client + one line; results are invisible until click.
- Change: add the headline metric to each card (the data already contains result stats). Order: put the metric-rich flagship cases first (PayPlaza, Marie-Stella-Maris, Talpa, Staff Capital) instead of purely by recency. Keep the logo tiles (already unified).
- H1: `Customer cases: measurable results on Salesforce`
- Primary CTA (page end): `Book a 30-minute consultation`.

### 7. Individual case template (/en/cases/[slug])
- Intention: "prove it".
- Present and good: challenge, approach phases, stack with product links, results stats, related cases with logos.
- Add: a one-line "Systems connected" summary near the top (the stack pills already exist in the sidebar; surface the three most important in the intro), and end every case with the consultation CTA plus the most relevant product link (largely present).
- Quotes: only after client sign-off (see B4).

### 8. About (/en/over-ons)
- Intention: "who are these people; can we trust them?"
- Main problem: counters render 0 (fix); hero badge says "Certified Partner" while elsewhere "Gold" (unify); values section uses four generic virtues.
- Change: replace two of the four value cards with verifiable statements: `Direct access to seniors: the consultant in the sales call is the consultant on the project` and `Knowledge transfer included: documentation and training are part of delivery`. Keep the timeline and team carousel; they are effective.
- H1: `The team that connects Salesforce to the rest of your business`
- Primary CTA: `Meet us: book a 30-minute introduction`.

### 9. Contact (/en/contact)
- Intention: act.
- Main problem: no expectation management.
- Copy (paste-ready):
  - Intro: `Tell us what you want to improve or connect. A Salesforce consultant will respond within one business day and advise on the most practical next step.` [Verification required: confirm the one-business-day promise internally]
  - Process block: `1. We review your situation. 2. We schedule a 30-minute introduction. 3. You receive an initial recommendation, scope or relevant demo.`
  - Reassurance: `The first conversation is exploratory and non-binding.`
- Keep the direct channels and Calendly card; they are good. H1 stays close to `How can we help you?`.

### 10. Blog overview (/en/blog)
- Intention: research.
- Main problem: H1 "Insights & tips" is generic; 46 posts, no grouping.
- Change: H1 `Salesforce knowledge base: billing, integrations and implementation`; add category filter chips from existing frontmatter categories; add a pinned strip of the four commercial articles (partner choice whitepaper page, Exact integration explainer, billing automation, AI in practice).

---

## F. Reusable page templates

**Service page** (matches ServiceDetail component):
1. Eyebrow (service family) · H1 as outcome, not discipline · intro naming who it is for
2. Three hero stats, rendered statically
3. "What it is" with 3 or 4 checkable claims (no adjectives without evidence)
4. Deliverables grid (4 items: icon, noun, one concrete sentence)
5. Approach in 4 numbered steps (anchor id="aanpak", already implemented)
6. Why us: 3 verifiable statements
7. Case strip: 1 or 2 linked cases with a number each
8. FAQ (4 to 6 questions, answers may link internally; FAQPage schema)
9. Final CTA: consultation primary, cases secondary

**Product page:**
1. H1: product name + outcome · sub naming the systems it connects
2. Proof bar: install count or named customers [Verification required where unknown]
3. Problem before / after (two short columns)
4. Benefits (max 4) then features (grouped, collapsible)
5. Pricing or "from" price if publishable, otherwise "Request pricing" [Verify per product]
6. Implementation: what it takes to go live, in days, and who does what
7. Customer quote with case link (verified quotes only)
8. Comparison: this product vs custom development (cost of ownership, maintenance, upgrades)
9. FAQ + demo CTA

**Case study:**
1. Client, sector, logo · H1: result or transformation in one line
2. "Systems connected" line + stack pills
3. The situation before (the problem in the customer's terms)
4. What we implemented (phases)
5. Measurable results (3 stats max, each labelled)
6. Verified quote (optional)
7. Related product and service links · related cases with logos
8. CTA: consultation

**Industry page:**
1. H1: sector + the specific operational problem
2. Three sector pains in the sector's own vocabulary
3. Relevant cases from that sector (with numbers)
4. Relevant products and services
5. FAQ with sector-specific questions · CTA

**Blog article:**
1. H1 = the question people search · answer in the first 120 words
2. Subheads as questions where natural · one internal link per 200 words, to service or product pages, not only to other posts
3. Author + date (present) · category (present)
4. End: one relevant next step (service, product or case), never a generic contact block only

---

## G. SEO plan

**Primary keyword groups (EN, high intent first):**

| Group | Intent | Landing page | Status |
| --- | --- | --- | --- |
| salesforce implementation partner (netherlands) | commercial | /en/diensten/implementatie | exists; sharpen title |
| salesforce exact online integration | commercial | /en/producten/exact-online | exists; strongest asset |
| salesforce billing / subscription management salesforce | commercial | /en/producten/billing-module | exists |
| salesforce business central integration | commercial | /en/producten/business-central | exists |
| salesforce sharepoint integration | commercial | /en/producten/sharepoint | exists |
| salesforce audit / health check | commercial | /en/diensten/consultancy | exists; consider "Salesforce audit" in title |
| salesforce managed services | commercial | /en/diensten/managed-services | exists |
| agentforce implementation partner | emerging commercial | /en/diensten/agentforce | exists; early-mover advantage |
| fin ai / intercom fin implementation | emerging commercial | /en/diensten/intercom-fin-ai | exists; few competitors rank yet |
| stripe salesforce integration | commercial | billing-module (section) | content gap: consider dedicated section or article |

**Recommended titles and descriptions (top pages):**
- /en → title and description: see deliverable C.
- /en/diensten → `Salesforce Consultancy Services | Resolve IT` / `Implementation, audits, integrations, managed services and AI. Salesforce Gold Consultancy Partner with 340+ completed projects.`
- /en/producten → `Salesforce Products & Connectors (AppExchange) | Resolve IT` / `Billing Platform, Exact Online and Business Central connectors, SharePoint integration and more. Built and supported by Resolve IT.`
- /en/producten/exact-online → `Salesforce Exact Online Integration (Influx) | Resolve IT` / `Sync accounts, invoices and payments between Salesforce and Exact Online. Supports multiple administrations and Peppol e-invoicing.`
- /en/producten/billing-module → `Salesforce Billing & Subscriptions | Billing Platform` / `Invoice, manage subscriptions and collect payments via Stripe, inside Salesforce. Connected to Exact Online and Business Central.`
- /en/cases → `Salesforce Customer Cases & Results | Resolve IT` / `How Talpa, PayPlaza, Marie-Stella-Maris and others run on Salesforce. Real projects with measurable results.`

**Content gaps (article or page topics):**
1. "Salesforce and Exact Online: 7 decisions before you integrate" (feeds the connector page)
2. "Subscription billing in Salesforce: native options vs Billing Platform" (comparison intent)
3. "What a Salesforce audit covers, with a sample findings report" (align with the consultancy page; the NL blog exists, EN equivalent [Verify])
4. "Agentforce vs Fin: which AI agent fits which use case" (FAQ already exists on the Agentforce page; expand to article)
5. "Migrating from HubSpot to Salesforce" (the MSM case proves the credential; no page targets it)
6. Service-area/geo: one page targeting "Salesforce partner Netherlands" in English for international buyers evaluating Dutch partners.

**Internal linking opportunities (confirmed patterns exist; extend):**
- Every product page → 1 case + 1 service (largely done); every case → products in stack (done via stackLinks); blog articles → product pages (inconsistent; sweep the 46 EN posts, many link only to /en/contact).
- Add the four "solution path" homepage cards; they create crawl paths from the strongest page to the four money pages.

**Housekeeping:**
- hreflang: correct (confirmed). Canonicals: correct on www (confirmed).
- Keep Dutch slugs under /en/ (see B15); the hreflang pairs make intent clear to Google, and stability beats slug aesthetics.
- Add FAQPage schema (H3) and a `Product` schema on product pages with aggregateRating only if the AppExchange rating can be tied to the specific product [Verification required].

---

## H. Technical implementation list (developer-ready)

**H1. Static counter values (critical, small).**
In `src/pages/{index,en/index,over-ons,en/over-ons}.astro`, render the target value and let JS only animate:
```html
<!-- before -->
<span data-count="340" data-suffix="+">0</span>
<!-- after -->
<span data-count="340" data-suffix="+">340+</span>
```
And in the counter script in `Layout.astro`, start by resetting to 0 only when the element is about to animate (inside the IntersectionObserver callback), so no-JS and crawler views keep `340+`.

**H2. CTA sweep (critical, small).**
- `src/i18n/ui.js`: `'nav.afspraak': 'Book a consultation'` (EN) and `'Plan een gesprek'` (NL) so nav matches the hierarchy.
- Hero buttons in `en/index.astro` and `index.astro`: primary → Calendly URL, label per deliverable C; secondary → `/en/cases`.
- Replace `Ask a question` buttons with text links in body copy.

**H3. FAQPage structured data (supporting, small).**
In `ServiceDetail.astro` and the product pages' FAQ section:
```astro
<script type="application/ld+json" set:html={JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question', name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
  })),
})} is:inline />
```

**H4. Calendly on demand (supporting, medium).**
Remove the global `<link>`/`<script>` for Calendly from `Layout.astro`; inject both on first click of an `a[href*="calendly.com"]` (the click handler already exists) and then call `initPopupWidget`. Saves ~60 KB CSS+JS on every non-converting pageview.

**H5. Fonts (supporting, small).**
Add `font-display: swap` is already implied via Google Fonts `display=swap` (confirmed in the URL). Optionally self-host Manrope woff2 to drop two third-party connections. Low priority.

**H6. Logo hygiene (supporting, small).**
Convert `public/images/clients/mokma.jpeg` and any remaining oversized PNGs to trimmed, compressed PNG (pattern already applied to marie-stella-maris.png and mybusinessmedia.png). Target ≤30 KB per logo.

**H7. Homepage section order (high, medium).**
In `en/index.astro` (and NL twin): move the client carousel section directly after the hero; insert the problem + solution-path sections (deliverable C) before services; insert the featured-case section (reuse `.case-feature` styles from cases.astro) after solution paths.

**H8. Cases overview metric line (high, small).**
`cases.astro` card body: add `<span class="case-card-metric">{c.results?.[0]?.stat} {c.results?.[0]?.label}</span>` guarded for cases without stats. [Verify field name against `src/data/cases.js` before implementing.]

**H9. Accessibility checks (supporting, small).**
- Replace emoji-as-icon in contact cards with `aria-hidden="true"` spans plus visible labels (labels already present; add the attribute).
- Confirm focus styles on `.btn` variants against the dark hero background.
- The marquee bands are `aria-hidden="true"` (confirmed for integrations); apply the same to the client carousel if it repeats logo alts twice.

**H10. Do not do.**
- Do not rename /en/... slugs (B15).
- Do not re-attach the GTM container; all tags are first-party in the layout now, and doubling them would double-fire conversions.
- Do not add animation to the new sections; reuse the existing `.reveal` pattern, which already respects prefers-reduced-motion.

---

## What already works and should be kept

- The case library (15 cases with logos, stack links, related cases) is the strongest asset; competitors rarely publish this depth.
- The FAQ answers across service and product pages are genuinely informative and interlinked.
- The technical foundation (hreflang, canonicals, structured data, sitemap, consent mode, first-party tracking) is above average and needs no rework.
- The product pages' cross-linking pattern (quotes → cases, stack pills → products) should be extended, not replaced.
- The visual system (cards, dark sections, badges) is consistent; the recommendations above are copy and ordering changes within it.
