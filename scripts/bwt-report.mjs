// Weekly Bing Webmaster Tools snapshot: traffic, queries, pages and crawl health.
//
//   node scripts/bwt-report.mjs            # last 7 days
//   node scripts/bwt-report.mjs --days 28  # custom window
//
// Complements scripts/gsc-report.mjs: Bing powers Bing, Yahoo, DuckDuckGo and
// Copilot/ChatGPT search, so it shows demand Google's numbers hide.
//
// Needs BWT_API_KEY in .env (Bing Webmaster Tools > Settings > API access >
// API key). BWT_SITE_URL is optional and defaults to the www host, which must
// match the property exactly as verified in Bing.
//
// Note: the query and page endpoints ignore date ranges; Bing returns a rolling
// window of roughly six months. Only the traffic and crawl series are daily, so
// only those are compared week over week.

import { readEnv } from './ga.mjs';
import { main } from './run.mjs';

const env = readEnv();
const API_KEY = env.BWT_API_KEY;
const SITE = env.BWT_SITE_URL || 'https://www.resolveit.nl';

const daysArg = process.argv.indexOf('--days');
const days = daysArg > -1 ? Number(process.argv[daysArg + 1]) : 7;

async function bwt(method) {
  if (!API_KEY) {
    throw new Error(
      'BWT_API_KEY ontbreekt in .env. Haal de sleutel op in Bing Webmaster Tools:\n' +
      '  Instellingen (tandwiel rechtsboven) > API-toegang > API-sleutel',
    );
  }
  const url = `https://ssl.bing.com/webmaster/api.svc/json/${method}` +
    `?siteUrl=${encodeURIComponent(SITE)}&apikey=${encodeURIComponent(API_KEY)}`;
  const res = await fetch(url);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`${method} gaf geen JSON terug (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok || data.ErrorCode) {
    throw new Error(`${method} mislukt: ${data.Message || `${res.status} ${res.statusText}`}`);
  }
  return data.d || [];
}

// Bing serialiseert datums als /Date(1754524800000)/
const parseDate = (s) => new Date(Number(String(s).replace(/[^0-9]/g, '')));
const fmt = (d) => d.toISOString().slice(0, 10);
const sum = (rows, key) => rows.reduce((t, r) => t + (r[key] || 0), 0);
const pct = (v) => `${(v * 100).toFixed(1)}%`;

// Vergelijk de laatste `days` dagen met de `days` daarvoor.
function split(rows) {
  const sorted = [...rows].sort((a, b) => parseDate(a.Date) - parseDate(b.Date));
  return { current: sorted.slice(-days), previous: sorted.slice(-days * 2, -days) };
}

function delta(now, before) {
  if (!before) return now ? ' (nieuw)' : '';
  const change = ((now - before) / before) * 100;
  const arrow = change >= 0 ? '+' : '';
  return ` (${arrow}${change.toFixed(0)}% t.o.v. vorige periode)`;
}

main(async () => {
  const [traffic, queries, pages, crawl] = await Promise.all([
    bwt('GetRankAndTrafficStats'),
    bwt('GetQueryStats'),
    bwt('GetPageStats'),
    bwt('GetCrawlStats'),
  ]);

  const out = [];
  const t = split(traffic);
  const period = t.current.length
    ? `${fmt(parseDate(t.current[0].Date))} t/m ${fmt(parseDate(t.current[t.current.length - 1].Date))}`
    : 'geen data';
  out.push(`# Bing Webmaster-rapport ${SITE}, ${period}\n`);

  const clicks = sum(t.current, 'Clicks');
  const impressions = sum(t.current, 'Impressions');
  const prevClicks = sum(t.previous, 'Clicks');
  const prevImpressions = sum(t.previous, 'Impressions');
  out.push(
    `Kliks: ${clicks}${delta(clicks, prevClicks)} | ` +
    `Vertoningen: ${impressions}${delta(impressions, prevImpressions)} | ` +
    `CTR: ${impressions ? pct(clicks / impressions) : '0.0%'}\n`,
  );

  const topQueries = [...queries]
    .sort((a, b) => (b.Impressions || 0) - (a.Impressions || 0))
    .slice(0, 25);
  out.push('## Zoektermen (top 25, rollend venster van Bing)');
  if (topQueries.length === 0) out.push('- (nog geen zoektermdata)');
  for (const r of topQueries) {
    const ctr = r.Impressions ? pct(r.Clicks / r.Impressions) : '0.0%';
    const pos = r.AvgImpressionPosition ? `, positie ${Number(r.AvgImpressionPosition).toFixed(1)}` : '';
    out.push(`- "${r.Query}": ${r.Clicks || 0} kliks / ${r.Impressions || 0} vertoningen (CTR ${ctr}${pos})`);
  }

  const topPages = [...pages]
    .sort((a, b) => (b.Impressions || 0) - (a.Impressions || 0))
    .slice(0, 15);
  out.push('\n## Pagina’s (top 15)');
  if (topPages.length === 0) out.push('- (nog geen paginadata)');
  for (const r of topPages) {
    const ctr = r.Impressions ? pct(r.Clicks / r.Impressions) : '0.0%';
    const path = String(r.Query || r.Url || '').replace(/^https?:\/\/(www\.)?resolveit\.nl/, '') || '/';
    out.push(`- ${path}: ${r.Clicks || 0} kliks / ${r.Impressions || 0} vertoningen (CTR ${ctr})`);
  }

  // Kansen: veel vertoningen, nauwelijks kliks. Bing geeft geen positiefilter
  // dat met Search Console te vergelijken is, dus filteren we puur op CTR.
  const opp = topQueries
    .filter((r) => (r.Impressions || 0) >= 20 && (r.Clicks || 0) / (r.Impressions || 1) < 0.03)
    .slice(0, 10);
  out.push('\n## Kansen (veel vertoningen, weinig kliks)');
  if (opp.length === 0) out.push('- (geen duidelijke kansen in deze periode)');
  for (const r of opp) {
    const pos = r.AvgImpressionPosition ? `, positie ${Number(r.AvgImpressionPosition).toFixed(1)}` : '';
    out.push(`- "${r.Query}": ${r.Impressions} vertoningen, CTR ${pct((r.Clicks || 0) / r.Impressions)}${pos}`);
  }

  const c = split(crawl);
  out.push('\n## Indexering en crawl');
  if (c.current.length === 0) {
    out.push('- (nog geen crawldata)');
  } else {
    const laatste = c.current[c.current.length - 1];
    out.push(`- In de index: ${laatste.InIndex ?? 'onbekend'} pagina’s`);
    out.push(`- Gecrawld deze periode: ${sum(c.current, 'CrawledPages')} pagina’s`);
    const errors4xx = sum(c.current, 'Code4xx');
    const errors5xx = sum(c.current, 'Code5xx');
    const blocked = sum(c.current, 'BlockedByRobotsTxt');
    out.push(`- Fouten: ${errors4xx}x 4xx, ${errors5xx}x 5xx, ${blocked}x geblokkeerd door robots.txt`);
    if (errors4xx + errors5xx > 0) out.push('  Let op: crawlfouten kosten indexering, controleer welke URL’s dit betreft in Bing Webmaster Tools.');
  }

  console.log(out.join('\n'));
});
