import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import { fileURLToPath } from 'node:url';

// 301-redirects from the ORIGINAL resolveit.nl URLs to the new structure, so
// existing Google rankings and backlinks keep working after migration.
//
// The original site was ENGLISH at the root with Dutch under /nl/. The new site
// is DUTCH at the root with English under /en/. So:
//   • original English (root) pages  → new English pages under /en/...
//   • original Dutch  (/nl/) pages   → new Dutch pages at the root
// Paths that are unchanged AND now serve a live new page (e.g. /cases, /blog,
// /contact, /voor-wie/manufacturing, /blog/salesforce-connectors) are NOT
// redirected — they simply serve the new page (language may have flipped;
// hreflang handles that).
const redirects = {
  // ---- English originals → /en/ ----------------------------------------
  '/about-us': '/en/over-ons',
  '/services': '/en/diensten',
  '/diensten/salesforce-implementation-onboarding': '/en/diensten/implementatie',
  '/diensten/salesforce-audit-and-consultancy': '/en/diensten/consultancy',
  '/diensten/salesforce-integration-and-development': '/en/diensten/development',
  '/diensten/salesforce-training-and-best-practices': '/en/diensten/training',
  '/for-who': '/en/voor-wie',
  '/voor-wie/energy-utilities': '/en/voor-wie/energie-utilities',
  '/voor-wie/media-communications': '/en/voor-wie/media-communicatie',
  '/voor-wie/other-industries': '/en/voor-wie/overige-sectoren',
  '/voor-wie/software-as-a-service-saas': '/en/voor-wie/saas',
  '/products': '/en/producten',
  '/products/billing-module': '/en/producten/billing-module',
  '/products/billing-module-2': '/en/producten/billing-module',
  '/products/datasolver-integration': '/en/producten/kvk-integratie',
  '/products/exact-online': '/en/producten/exact-online',
  '/products/sharepoint-salesforce-integration-module': '/en/producten/sharepoint',
  '/case/marketresponse': '/en/cases/marketresponse',
  '/case/mybusinessmedia': '/en/cases/mybusinessmedia',
  '/make-an-appointement': '/en/contact',
  '/cookie-policy': '/en/cookiebeleid',
  '/privacy-policy': '/en/privacybeleid',
  '/general-terms-and-conditions': '/en/algemene-voorwaarden',

  // English blog posts → /en/blog/<new slug>
  '/blog/5-essential-features-of-the-exact-online-connector': '/en/blog/exact-connector-5-features',
  '/blog/all-your-customer-data-in-one-place-with-our-salesforce-exact-online-module': '/en/blog/klantdata-op-een-plek-exact-online',
  '/blog/automating-business-processes': '/en/blog/bedrijfsprocessen-automatiseren',
  '/blog/building-sustainable-futures-how-b2b-companies-can-lead-the-shift-to-a-greener-economy': '/en/blog/duurzame-toekomst-b2b',
  '/blog/can-the-billing-module-connect-to-my-erp-system': '/en/blog/billing-platform-koppelen-aan-je-erp',
  '/blog/company-data-in-salesforce-at-the-touch-of-a-button': '/en/blog/bedrijfsdata-met-een-druk-op-de-knop',
  '/blog/crm-partner': '/en/blog/de-juiste-crm-partner-kiezen',
  '/blog/e-invoicing-in-belgium-2026-peppol-compliant-with-salesforce-exact-online': '/en/blog/e-facturatie-belgie-2026-peppol',
  '/blog/enrich-existing-company-data-in-salesforce': '/en/blog/bestaande-bedrijfsdata-verrijken',
  '/blog/five-steps-to-smart-salesforce-integrations-that-truly-automate-your-business': '/en/blog/vijf-stappen-slimme-salesforce-integraties',
  '/blog/from-fragmented-systems-to-a-single-source-of-truth-with-salesforce-integrations': '/en/blog/van-losse-systemen-naar-een-bron',
  '/blog/get-the-end-user-to-embrace-salesforce': '/en/blog/eindgebruikers-salesforce-laten-omarmen',
  '/blog/golden-luca-award': '/en/blog/exact-golden-luca-award-2025',
  '/blog/how-datasolvers-automated-checks-keep-your-crm-up-to-date': '/en/blog/datasolver-automatische-checks',
  '/blog/how-does-file-migration-work': '/en/blog/bestandsmigratie-sharepoint',
  '/blog/how-does-language-recognition-work-for-invoices-in-the-billing-module': '/en/blog/facturen-in-de-juiste-taal',
  '/blog/how-does-the-automated-payment-collection-process-work-in-the-billing-module': '/en/blog/automatische-incasso-met-stripe',
  '/blog/how-often-is-data-synchronized': '/en/blog/hoe-vaak-wordt-data-gesynchroniseerd',
  '/blog/how-our-integration-ensures-secure-and-structured-data': '/en/blog/veilige-gestructureerde-data',
  '/blog/how-resolve-it-will-help-you-succeed': '/en/blog/hoe-resolve-it-u-laat-slagen',
  '/blog/in-todays-digital-world-why-not-choose-efficiency': '/en/blog/kiezen-voor-efficiency',
  '/blog/integrating-sharepoint-and-salesforce-a-seamless-connection': '/en/blog/sharepoint-salesforce-koppelen',
  '/blog/is-it-possible-to-send-invoices-from-salesforce': '/en/blog/facturen-versturen-vanuit-salesforce',
  '/blog/kamer-van-koophandel-sbi-updates': '/en/blog/kvk-sbi-updates',
  '/blog/keep-your-company-information-up-to-date-with-current-data-from-the-chamber-of-commerce-trade-register': '/en/blog/bedrijfsgegevens-actueel-kvk',
  '/blog/looking-up-a-peppol-identification-number-from-salesforce': '/en/blog/peppol-id-opzoeken-salesforce',
  '/blog/make-your-business-processes-more-intelligent-with-salesforces-agentforce': '/en/blog/salesforce-agentforce',
  '/blog/optimize-your-market-segmentation-by-automatically-integrating-sbi-codes-and-trade-names-into-salesforce': '/en/blog/marktsegmentatie-sbi-codes',
  '/blog/salesforce-api-how-to-extend-your-salesforce-platform-with-custom-integrations': '/en/blog/salesforce-api-maatwerk-integraties',
  '/blog/salesforce-data-migration-best-practices-for-a-smooth-transition': '/en/blog/salesforce-datamigratie-best-practices',
  '/blog/the-3-components-of-a-successful-crm': '/en/blog/drie-componenten-succesvol-crm',
  '/blog/the-benefits-of-salesforce-heres-why-its-the-crm-solution-for-your-business': '/en/blog/voordelen-van-salesforce',
  '/blog/the-impact-of-our-billing-module-on-customer-satisfaction': '/en/blog/billing-platform-klanttevredenheid',
  '/blog/validating-european-vat-numbers-in-salesforce-with-vies': '/en/blog/europese-btw-nummers-valideren-vies',
  '/blog/what-can-you-expect-from-our-salesforce-audit': '/en/blog/wat-verwachten-salesforce-audit',
  '/blog/what-data-do-you-synchronize-between-salesforce-and-exact-online': '/en/blog/welke-data-salesforce-exact-synchroniseren',
  '/blog/what-features-are-available-when-i-start-invoicing-from-salesforce': '/en/blog/factureren-vanuit-salesforce-mogelijkheden',
  '/blog/what-is-the-automated-invoice-reminder-system-in-the-billing-module': '/en/blog/geautomatiseerde-betalingsherinneringen',
  '/blog/what-reporting-options-are-included-in-the-billing-module': '/en/blog/rapportages-en-dashboards-billing-platform',
  '/blog/your-crm-as-a-growth-accelerator': '/en/blog/crm-als-groeiversneller',
  // (note: /blog/salesforce-connectors and /blog/salesforce-einstein-gpt are
  //  unchanged slugs — the English versions now live at /en/blog/<same slug>,
  //  while /blog/<slug> serves the new Dutch post. No redirect needed.)

  // ---- Dutch originals (/nl/) → new Dutch pages at the root ------------
  '/nl': '/',
  '/nl/afspraak-maken': '/contact',
  '/nl/over-ons': '/over-ons',
  '/nl/diensten': '/diensten',
  '/nl/diensten/salesforce-implementatie-en-onboarding': '/diensten/implementatie',
  '/nl/diensten/salesforce-audit-en-consultancy': '/diensten/consultancy',
  '/nl/diensten/salesforce-integratie-en-ontwikkeling': '/diensten/development',
  '/nl/diensten/salesforce-training-en-best-practices': '/diensten/training',
  '/nl/producten': '/producten',
  '/nl/producten/billing-module': '/producten/billing-module',
  '/nl/producten/datasolver-integratie': '/producten/kvk-integratie',
  '/nl/producten/exact-online': '/producten/exact-online',
  '/nl/producten/sharepoint-salesforce-integratie': '/producten/sharepoint',
  '/nl/voor-wie': '/voor-wie',
  '/nl/voor-wie/energie-voorzieningen': '/voor-wie/energie-utilities',
  '/nl/voor-wie/maakindustrie': '/voor-wie/manufacturing',
  '/nl/voor-wie/media-communicatie': '/voor-wie/media-communicatie',
  '/nl/voor-wie/other-industries': '/voor-wie/overige-sectoren',
  '/nl/voor-wie/professionele-dienstverlening': '/voor-wie/professional-services',
  '/nl/voor-wie/recruitment': '/voor-wie/recruitment',
  '/nl/voor-wie/software-as-a-service-saas': '/voor-wie/saas',
  '/nl/cases': '/cases',
  '/nl/case/marketresponse': '/cases/marketresponse',
  '/nl/case/multa-casting': '/cases/multa-casting',
  '/nl/case/een-systeem-en-platform-om-interne-medewerkers-te-begeleiden-2': '/cases/solvid-ondernemen',
  '/nl/jobs': '/jobs',
  '/nl/contact': '/contact',
  '/nl/algemene-voorwaarden': '/algemene-voorwaarden',
  '/nl/privacy-policy': '/privacybeleid',
  '/nl/cookiebeleid-eu': '/cookiebeleid',

  // Dutch blog posts → /blog/<new slug>
  '/nl/blog': '/blog',
  '/nl/blog/5-onmisbare-functionaliteiten-van-de-exact-online-connector': '/blog/exact-connector-5-features',
  '/nl/blog/al-je-klantdata-op-een-plek-met-onze-salesforce-exact-online-module': '/blog/klantdata-op-een-plek-exact-online',
  '/nl/blog/bedrijfsdata-in-salesforce-met-een-druk-op-de-knop': '/blog/bedrijfsdata-met-een-druk-op-de-knop',
  '/nl/blog/bedrijfsprocessen-automatiseren': '/blog/bedrijfsprocessen-automatiseren',
  '/nl/blog/bestaande-bedrijfsdata-verrijken-in-salesforce': '/blog/bestaande-bedrijfsdata-verrijken',
  '/nl/blog/bouwen-aan-duurzame-toekomsten-hoe-b2b-bedrijven-de-verschuiving-naar-een-groener-economie-kunnen-leiden': '/blog/duurzame-toekomst-b2b',
  '/nl/blog/crm-data-kwaliteit-kvk-salesforce': '/blog/bedrijfsgegevens-actueel-kvk',
  '/nl/blog/crm-partner': '/blog/de-juiste-crm-partner-kiezen',
  '/nl/blog/de-3-onderdelen-van-een-succesvol-crm': '/blog/drie-componenten-succesvol-crm',
  '/nl/blog/de-invloed-van-onze-facturatiemodule-op-klanttevredenheid': '/blog/billing-platform-klanttevredenheid',
  '/nl/blog/de-voordelen-van-salesforce-hierom-is-het-de-crm-oplossing-voor-jouw-bedrijf': '/blog/voordelen-van-salesforce',
  '/nl/blog/e-facturatie-belgie-2026-peppol-compliant-met-salesforce-exact-online': '/blog/e-facturatie-belgie-2026-peppol',
  '/nl/blog/europese-btw-nummers-valideren-in-salesforce-met-vies': '/blog/europese-btw-nummers-valideren-vies',
  '/nl/blog/gouden-luca-award': '/blog/exact-golden-luca-award-2025',
  '/nl/blog/hoe-de-automatische-controle-van-datasolver-je-crm-scherp-houdt': '/blog/datasolver-automatische-checks',
  '/nl/blog/hoe-onze-integratie-zorgt-voor-veilige-en-gestructureerde-data': '/blog/veilige-gestructureerde-data',
  '/nl/blog/hoe-resolve-it-jou-helpt-slagen': '/blog/hoe-resolve-it-u-laat-slagen',
  '/nl/blog/hoe-vaak-worden-de-gegevens-gesynchroniseerd': '/blog/hoe-vaak-wordt-data-gesynchroniseerd',
  '/nl/blog/hoe-werkt-bestandsmigratie-in-de-salespoint-module': '/blog/bestandsmigratie-sharepoint',
  '/nl/blog/hoe-werkt-het-geautomatiseerde-betalingsincasso-proces-in-de-billing-module': '/blog/automatische-incasso-met-stripe',
  '/nl/blog/hoe-werkt-taalherkenning-voor-facturen-in-de-billing-module': '/blog/facturen-in-de-juiste-taal',
  '/nl/blog/houd-je-bedrijfsinformatie-up-to-date-met-actuele-gegevens-uit-het-kvk-handelsregister': '/blog/bedrijfsgegevens-actueel-kvk',
  '/nl/blog/in-vijf-stappen-naar-slimme-salesforce-integraties-die-echt-automatiseren': '/blog/vijf-stappen-slimme-salesforce-integraties',
  '/nl/blog/is-het-mogelijk-om-facturen-te-versturen-vanuit-salesforce': '/blog/facturen-versturen-vanuit-salesforce',
  '/nl/blog/jouw-crm-als-groeiversneller': '/blog/crm-als-groeiversneller',
  '/nl/blog/kamer-van-koophandel-sbi-updates': '/blog/kvk-sbi-updates',
  '/nl/blog/kan-de-billing-module-verbinding-maken-met-mijn-erp-systeem': '/blog/billing-platform-koppelen-aan-je-erp',
  '/nl/blog/maak-je-bedrijfsprocessen-intelligenter-met-salesforces-agentforce': '/blog/salesforce-agentforce',
  '/nl/blog/optimaliseer-je-marktsegmentatie-door-sbi-codes-en-handelsnamen-automatisch-te-integreren-in-salesforce': '/blog/marktsegmentatie-sbi-codes',
  '/nl/blog/peppol-identificatienummer-opzoeken-vanuit-salesforce': '/blog/peppol-id-opzoeken-salesforce',
  '/nl/blog/salesforce-api-hoe-je-jouw-salesforce-platform-kunt-uitbreiden-met-custom-integraties': '/blog/salesforce-api-maatwerk-integraties',
  '/nl/blog/salesforce-connectors': '/blog/salesforce-connectors',
  '/nl/blog/salesforce-data-migration-best-practices-voor-een-soepele-overgang': '/blog/salesforce-datamigratie-best-practices',
  '/nl/blog/salesforce-einstein-gpt': '/blog/salesforce-einstein-gpt',
  '/nl/blog/sharepoint-en-salesforce-integreren-een-naadloze-koppeling': '/blog/sharepoint-salesforce-koppelen',
  '/nl/blog/van-versnipperde-systemen-naar-een-single-source-of-truth-met-salesforce-integraties': '/blog/van-losse-systemen-naar-een-bron',
  '/nl/blog/waarom-zou-je-in-de-digitale-wereld-van-vandaag-niet-kiezen-voor-efficientie': '/blog/kiezen-voor-efficiency',
  '/nl/blog/wat-is-het-geautomatiseerde-factuur-herinneringssysteem-in-de-billing-module': '/blog/geautomatiseerde-betalingsherinneringen',
  '/nl/blog/wat-kun-je-verwachten-van-onze-salesforce-audit': '/blog/wat-verwachten-salesforce-audit',
  '/nl/blog/welke-functies-zijn-beschikbaar-als-ik-begin-met-factureren-vanuit-salesforce': '/blog/factureren-vanuit-salesforce-mogelijkheden',
  '/nl/blog/welke-gegevens-synchroniseer-je-tussen-salesforce-en-exact-online': '/blog/welke-data-salesforce-exact-synchroniseren',
  '/nl/blog/welke-rapportagemogelijkheden-zijn-inbegrepen-bij-de-billing-module': '/blog/rapportages-en-dashboards-billing-platform',
  '/nl/blog/zorg-dat-de-eindgebruiker-salesforce-omarmt': '/blog/eindgebruikers-salesforce-laten-omarmen',
};

// Force 301 (permanent) for every redirect so search engines transfer ranking.
const redirectsConfig = Object.fromEntries(
  Object.entries(redirects).map(([from, to]) => [from, { status: 301, destination: to }])
);

// Deployed to Vercel. Pages are prerendered static HTML by default; only the
// CMS OAuth endpoints (src/pages/api/*) run as serverless functions. The Vercel
// adapter emits the redirects below as real 301s (good for SEO).
export default defineConfig({
  site: 'https://www.resolveit.nl',
  output: 'hybrid',
  adapter: vercel(),
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  srcDir: fileURLToPath(new URL('./src', import.meta.url)),
  redirects: redirectsConfig,
});
