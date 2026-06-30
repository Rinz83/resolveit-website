// Single source of truth for the "Voor wie?" sectors / focus areas.
// Used by the homepage, the /voor-wie overview, the nav dropdown and footer,
// so icons and labels stay consistent everywhere.
// Icons: 24x24 line-art, stroke=currentColor (green) with a #6c4494 (purple) accent.

export const sectors = [
  {
    slug: 'backoffice-services',
    href: '/voor-wie/backoffice-services',
    label: 'Backoffice Services',
    desc: 'Billing Platform, Datasolver, Influx Exact Connector en SharePoint geïntegreerd vanuit Salesforce.',
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 12l9 4.5 9-4.5" stroke="#6c4494" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 16.5 12 21l9-4.5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  },
  {
    slug: 'saas',
    href: '/voor-wie/saas',
    label: 'SaaS',
    desc: 'Abonnementenbeheer en MRR via het Billing Platform, plus integraties en AI Prompt Builder.',
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9.5a3.5 3.5 0 0 1 .5 6.96" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12v6m0-6-2 2m2-2 2 2" stroke="#6c4494" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    slug: 'professional-services',
    href: '/voor-wie/professional-services',
    label: 'Professional Services',
    desc: 'Projecten en uren direct gekoppeld aan facturatie via het Billing Platform en Influx Exact Connector.',
    svg: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M3 12h18" stroke="#6c4494" stroke-width="1.6"/><circle cx="12" cy="13.5" r="1.4" fill="#6c4494"/></svg>`,
  },
  {
    slug: 'manufacturing',
    href: '/voor-wie/manufacturing',
    label: 'Manufacturing',
    desc: 'ERP-koppeling, orderbeheer en facturatie via het Billing Platform en Influx Exact Connector.',
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M3 20V10l5 3V10l5 3V6l5 4v10H3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="7" cy="17" r="1.2" fill="#6c4494"/><circle cx="12" cy="17" r="1.2" fill="#6c4494"/><circle cx="17" cy="17" r="1.2" fill="#6c4494"/></svg>`,
  },
  {
    slug: 'recruitment',
    href: '/voor-wie/recruitment',
    label: 'Recruitment',
    desc: 'Kandidatenflows en plaatsingen direct gekoppeld aan facturatie via het Billing Platform en Datasolver.',
    svg: `<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.2" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="17.5" cy="7" r="2.2" stroke="#6c4494" stroke-width="1.6"/><path d="M15 13.2c2.4-.6 5 .9 5 3.8" stroke="#6c4494" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  },
  {
    slug: 'energie-utilities',
    href: '/voor-wie/energie-utilities',
    label: 'Energie & Utilities',
    desc: 'Contractbeheer, terugkerende facturatie via het Billing Platform en bedrijfsdatakwaliteit via Datasolver.',
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M13 3 5 13h6l-1 8 8-10h-6l1-8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="#6c4494" stroke-width="1.2" stroke-dasharray="2 3" opacity="0.5"/></svg>`,
  },
  {
    slug: 'media-communicatie',
    href: '/voor-wie/media-communicatie',
    label: 'Media & Communicatie',
    desc: 'Abonnementen en terugkerende facturatie via het Billing Platform, advertentiesales en Datasolver.',
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 9v6l11 4V5L4 9z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M18 8a5 5 0 0 1 0 8" stroke="#6c4494" stroke-width="1.6" stroke-linecap="round"/><path d="M4 12H2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  },
  {
    slug: 'overige-sectoren',
    href: '/voor-wie/overige-sectoren',
    label: 'Overige sectoren',
    desc: 'Maatwerk implementatie, integraties en producten voor elke branche.',
    svg: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" stroke="#6c4494" stroke-width="1.4"/></svg>`,
  },
];
