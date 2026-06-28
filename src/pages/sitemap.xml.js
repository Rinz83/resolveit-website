// Custom sitemap with hreflang alternates. Built from translatedPaths (the
// full bilingual route list), so every NL page and its /en/ counterpart is
// listed with rel="alternate" links — important after the language flip.
export const prerender = true;

import { translatedPaths } from '../i18n/ui.js';

const SITE = 'https://www.resolveit.nl';

const nlUrl = (p) => SITE + (p === '/' ? '' : p);
const enUrl = (p) => SITE + '/en' + (p === '/' ? '' : p);

export function GET() {
  const paths = [...translatedPaths];

  const entryFor = (loc, p) => `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="nl-NL" href="${nlUrl(p)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl(p)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${nlUrl(p)}"/>
  </url>`;

  const urls = paths
    .flatMap((p) => [entryFor(nlUrl(p), p), entryFor(enUrl(p), p)])
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
