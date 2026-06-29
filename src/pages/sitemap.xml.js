// Custom sitemap with hreflang alternates + lastmod. Built from translatedPaths
// (the full bilingual route list), so every NL page and its /en/ counterpart is
// listed with rel="alternate" links — important after the language flip.
// Blog URLs get their post pubDate as lastmod; other pages get the build date.
export const prerender = true;

import { getCollection } from 'astro:content';
import { translatedPaths } from '../i18n/ui.js';

const SITE = 'https://www.resolveit.nl';

// Single-language pages (no /en/ counterpart) — listed without hreflang alternates.
const standalonePaths = ['/improve-customer-experience-where-it-matters-most'];

const nlUrl = (p) => SITE + (p === '/' ? '' : p);
const enUrl = (p) => SITE + '/en' + (p === '/' ? '' : p);
const isoDay = (d) => d.toISOString().slice(0, 10);

export async function GET() {
  const buildDate = isoDay(new Date());

  // Map blog collection slugs -> pubDate (YYYY-MM-DD) for accurate lastmod.
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const dateBySlug = new Map(posts.map((p) => [p.slug, isoDay(p.data.pubDate)]));

  const lastmodFor = (p, en) => {
    if (p.startsWith('/blog/')) {
      const slug = p.slice('/blog/'.length);
      return (en ? dateBySlug.get('en/' + slug) : dateBySlug.get(slug)) || buildDate;
    }
    return buildDate;
  };

  const bilingualEntry = (loc, p, en) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmodFor(p, en)}</lastmod>
    <xhtml:link rel="alternate" hreflang="nl-NL" href="${nlUrl(p)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl(p)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${nlUrl(p)}"/>
  </url>`;

  const standaloneEntry = (p) => `  <url>
    <loc>${SITE + p}</loc>
    <lastmod>${buildDate}</lastmod>
  </url>`;

  const urls = [
    ...[...translatedPaths].flatMap((p) => [
      bilingualEntry(nlUrl(p), p, false),
      bilingualEntry(enUrl(p), p, true),
    ]),
    ...standalonePaths.map(standaloneEntry),
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
