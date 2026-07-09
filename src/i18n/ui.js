// Lightweight i18n for the NL (default, at root) / EN (under /en) site.
// Dutch lives at "/", English at "/en/...". The toggle swaps between them.

export const defaultLang = 'nl';

// External booking + CRM form endpoints (from the original resolveit.nl site).
export const calendlyUrl = 'https://calendly.com/rick-resolveit/30min?hide_gdpr_banner=1';
// Pardot (Account Engagement) forms — connected to the CRM.
export const pardotForms = {
  contact: 'https://go.resolveit.nl/l/981612/2026-02-17/dkd5xv',
  demoExact: 'https://go.resolveit.nl/l/981612/2025-02-24/dj4jfz',
  demoSharepoint: 'https://go.resolveit.nl/l/981612/2024-11-28/dhk2fq',
  demoKvk: 'https://go.resolveit.nl/l/981612/2025-01-14/dhtj46',
  demoBilling: 'https://go.resolveit.nl/l/981612/2024-11-28/dhk2ft',
  askIntercom: 'https://go.resolveit.nl/l/981612/2025-01-14/dhtj5h',
  askBusinessCentral: 'https://go.resolveit.nl/l/981612/2026-07-09/dkskm9',
  // TODO: replace with the dedicated Pardot form for the whitepaper download.
  whitepaperPartnerkeuze: 'https://go.resolveit.nl/l/981612/2026-02-17/dkd5xv',
};

// Paths that have an English version. The language toggle only switches to the
// EN equivalent when the current NL path is listed here; otherwise it falls
// back to the EN homepage. This keeps navigation unbroken during rollout.
export const translatedPaths = new Set([
  '/',
  '/oplossingen',
  '/diensten', '/diensten/implementatie', '/diensten/consultancy',
  '/diensten/development', '/diensten/training',
  '/diensten/agentforce', '/diensten/managed-services',
  '/diensten/marketing-cloud', '/diensten/experience-cloud', '/diensten/data-cloud',
  '/diensten/intercom-fin-ai',
  '/voor-wie', '/voor-wie/backoffice-services', '/voor-wie/saas',
  '/voor-wie/professional-services', '/voor-wie/manufacturing', '/voor-wie/recruitment',
  '/voor-wie/energie-utilities', '/voor-wie/media-communicatie', '/voor-wie/overige-sectoren',
  '/producten', '/producten/ai-prompt-builder', '/producten/billing-module', '/producten/kvk-integratie', '/producten/signflow',
  '/producten/exact-online', '/producten/business-central', '/producten/sharepoint', '/producten/sharepoint/installatie',
  '/over-ons', '/jobs',
  '/cases', '/cases/gospooky', '/cases/opple-lighting', '/cases/gkazas', '/cases/zyfer', '/cases/talpa-studios', '/cases/multa-casting', '/cases/mybusinessmedia',
  '/cases/marketresponse', '/cases/solvid-ondernemen', '/cases/payplaza',
  '/algemene-voorwaarden', '/privacybeleid', '/cookiebeleid',
  '/blog',
  '/blog/automatische-incasso-met-stripe', '/blog/bedrijfsdata-met-een-druk-op-de-knop',
  '/blog/bedrijfsgegevens-actueel-kvk', '/blog/bedrijfsprocessen-automatiseren',
  '/blog/bestaande-bedrijfsdata-verrijken', '/blog/bestandsmigratie-sharepoint',
  '/blog/billing-platform-klanttevredenheid', '/blog/billing-platform-koppelen-aan-je-erp',
  '/blog/crm-als-groeiversneller', '/blog/datasolver-automatische-checks',
  '/blog/de-juiste-crm-partner-kiezen', '/blog/drie-componenten-succesvol-crm',
  '/blog/duurzame-toekomst-b2b', '/blog/e-facturatie-belgie-2026-peppol',
  '/blog/eindgebruikers-salesforce-laten-omarmen', '/blog/europese-btw-nummers-valideren-vies',
  '/blog/exact-connector-5-features', '/blog/exact-golden-luca-award-2025',
  '/blog/facturen-in-de-juiste-taal', '/blog/facturen-versturen-vanuit-salesforce',
  '/blog/factureren-vanuit-salesforce-mogelijkheden', '/blog/geautomatiseerde-betalingsherinneringen',
  '/blog/hoe-resolve-it-u-laat-slagen', '/blog/hoe-vaak-wordt-data-gesynchroniseerd',
  '/blog/kiezen-voor-efficiency', '/blog/klantdata-op-een-plek-exact-online',
  '/blog/kvk-sbi-updates', '/blog/marktsegmentatie-sbi-codes',
  '/blog/peppol-id-opzoeken-salesforce', '/blog/rapportages-en-dashboards-billing-platform',
  '/blog/salesforce-agentforce', '/blog/salesforce-api-maatwerk-integraties',
  '/blog/salesforce-connectors', '/blog/salesforce-datamigratie-best-practices',
  '/blog/salesforce-einstein-gpt', '/blog/salesforce-implementatie-checklist',
  '/blog/salesforce-koppelen-aan-exact-online', '/blog/sharepoint-salesforce-koppelen',
  '/blog/van-losse-systemen-naar-een-bron', '/blog/veilige-gestructureerde-data',
  '/blog/vijf-stappen-slimme-salesforce-integraties', '/blog/voordelen-van-salesforce',
  '/blog/waarom-onafhankelijk-salesforce-advies', '/blog/wat-verwachten-salesforce-audit',
  '/blog/welke-data-salesforce-exact-synchroniseren',
  '/contact',
]);

export function getLangFromUrl(pathname) {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'nl';
}

// Given the current pathname, return the path in the other language.
export function altLangPath(pathname) {
  const lang = getLangFromUrl(pathname);
  if (lang === 'en') {
    // EN -> NL: strip the /en prefix (NL has the full site)
    const nl = pathname.replace(/^\/en/, '') || '/';
    return nl;
  }
  // NL -> EN: only if a translation exists, else EN home
  const clean = pathname.replace(/\/$/, '') || '/';
  return translatedPaths.has(clean) ? (clean === '/' ? '/en' : `/en${clean}`) : '/en';
}

// Prefix an internal link for the active language.
export function localize(path, lang) {
  if (lang !== 'en') return path;
  if (path === '/') return '/en';
  return path.startsWith('/en') ? path : `/en${path}`;
}

export const ui = {
  nl: {
    'nav.diensten': 'Diensten',
    'nav.oplossingen': 'Oplossingen',
    'nav.producten': 'Producten',
    'nav.voorwie': 'Voor wie?',
    'nav.overons': 'Over ons',
    'nav.cases': 'Cases',
    'nav.blog': 'Blog',
    'nav.vacatures': 'Vacatures',
    'nav.contact': 'Contact',
    'nav.afspraak': 'Maak een afspraak',
    'footer.tagline': 'Resolve IT helpt organisaties het volledige potentieel van Salesforce te benutten, van implementatie tot integratie, training en consultancy.',
    'footer.services': 'Diensten',
    'footer.sectoren': 'Sectoren',
    'footer.bedrijf': 'Bedrijf',
    'footer.contact': 'Service & Contact',
    'footer.rights': 'Alle rechten voorbehouden.',
    'lang.label': 'EN',
  },
  en: {
    'nav.diensten': 'Services',
    'nav.oplossingen': 'Solutions',
    'nav.producten': 'Products',
    'nav.voorwie': 'Industries',
    'nav.overons': 'About us',
    'nav.cases': 'Cases',
    'nav.blog': 'Blog',
    'nav.vacatures': 'Careers',
    'nav.contact': 'Contact',
    'nav.afspraak': 'Book a meeting',
    'footer.tagline': 'Resolve IT helps organisations unlock the full potential of Salesforce, from implementation to integration, training and consultancy.',
    'footer.services': 'Services',
    'footer.sectoren': 'Industries',
    'footer.bedrijf': 'Company',
    'footer.contact': 'Service & Contact',
    'footer.rights': 'All rights reserved.',
    'lang.label': 'NL',
  },
};

export function useTranslations(lang) {
  return (key) => ui[lang][key] || ui[defaultLang][key] || key;
}
