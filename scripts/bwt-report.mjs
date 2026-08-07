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
// Every endpoint returns one row per day per item over a rolling window of
// roughly six months, so the window is cut locally and compared with the
// equally long window before it. Bing lags a few days; the report anchors on
// the newest date the API actually returns rather than on today.

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

// Bing serialiseert datums als /Date(1744009200000-0700)/: epoch in millis,
// gevolgd door een tijdzone-offset die we negeren.
const parseDate = (s) => {
  const m = String(s).match(/\/Date\((-?\d+)/);
  return m ? new Date(Number(m[1])) : null;
};
const fmt = (d) => d.toISOString().slice(0, 10);
const sum = (rows, key) => rows.reduce((t, r) => t + (r[key] || 0), 0);
const pct = (v) => `${(v * 100).toFixed(1)}%`;

// Anker op de nieuwste dag die Bing teruggeeft, niet op vandaag: de data loopt
// een paar dagen achter en een leeg staartje zou de vergelijking vertekenen.
function windows(all) {
  const dated = all
    .map((r) => ({ ...r, _d: parseDate(r.Date) }))
    .filter((r) => r._d);
  const end = new Date(Math.max(...dated.map((r) => r._d.getTime())));
  const startCurrent = new Date(end.getTime() - (days - 1) * 86400_000);
  const startPrevious = new Date(startCurrent.getTime() - days * 86400_000);
  return {
    end,
    start: startCurrent,
    current: dated.filter((r) => r._d >= startCurrent && r._d <= end),
    previous: dated.filter((r) => r._d >= startPrevious && r._d < startCurrent),
  };
}

// Tel dagrijen per zoekterm of pagina op tot een totaal over de periode.
function aggregate(rows, keyField) {
  const byKey = new Map();
  for (const r of rows) {
    const key = r[keyField];
    if (!key) continue;
    const acc = byKey.get(key) || { key, clicks: 0, impressions: 0, posSum: 0, posWeight: 0 };
    acc.clicks += r.Clicks || 0;
    acc.impressions += r.Impressions || 0;
    // Positie is een dagwaarde; weeg mee met vertoningen voor een eerlijk gemiddelde.
    if (r.AvgImpressionPosition > 0 && r.Impressions > 0) {
      acc.posSum += r.AvgImpressionPosition * r.Impressions;
      acc.posWeight += r.Impressions;
    }
    byKey.set(key, acc);
  }
  return [...byKey.values()]
    .map((a) => ({ ...a, position: a.posWeight ? a.posSum / a.posWeight : null }))
    .sort((a, b) => b.impressions - a.impressions);
}

function delta(now, before) {
  if (!before) return now ? ' (nieuw)' : '';
  const change = ((now - before) / before) * 100;
  return ` (${change >= 0 ? '+' : ''}${change.toFixed(0)}% t.o.v. vorige periode)`;
}

const line = (label, a) => {
  const ctr = a.impressions ? pct(a.clicks / a.impressions) : '0.0%';
  const pos = a.position ? `, positie ${a.position.toFixed(1)}` : '';
  return `- ${label}: ${a.clicks} kliks / ${a.impressions} vertoningen (CTR ${ctr}${pos})`;
};

main(async () => {
  const [traffic, queries, pages, crawl] = await Promise.all([
    bwt('GetRankAndTrafficStats'),
    bwt('GetQueryStats'),
    bwt('GetPageStats'),
    bwt('GetCrawlStats'),
  ]);

  const out = [];
  const t = windows(traffic);
  out.push(`# Bing Webmaster-rapport ${SITE}, ${fmt(t.start)} t/m ${fmt(t.end)}\n`);

  const clicks = sum(t.current, 'Clicks');
  const impressions = sum(t.current, 'Impressions');
  out.push(
    `Kliks: ${clicks}${delta(clicks, sum(t.previous, 'Clicks'))} | ` +
    `Vertoningen: ${impressions}${delta(impressions, sum(t.previous, 'Impressions'))} | ` +
    `CTR: ${impressions ? pct(clicks / impressions) : '0.0%'}\n`,
  );

  const q = windows(queries);
  const topQueries = aggregate(q.current, 'Query');
  out.push('## Zoektermen (top 25)');
  if (topQueries.length === 0) out.push('- (geen zoektermdata in deze periode)');
  for (const a of topQueries.slice(0, 25)) out.push(line(`"${a.key}"`, a));

  const p = windows(pages);
  const topPages = aggregate(p.current, 'Query');
  out.push('\n## Pagina’s (top 15)');
  if (topPages.length === 0) out.push('- (geen paginadata in deze periode)');
  for (const a of topPages.slice(0, 15)) {
    const path = a.key.replace(/^https?:\/\/(www\.)?resolveit\.nl/, '') || '/';
    out.push(line(path, a));
  }

  // Kansen: vaak getoond, zelden geklikt, en dicht genoeg bij de top om te winnen.
  const opp = topQueries
    .filter((a) => a.impressions >= 20 && a.clicks / a.impressions < 0.03 &&
      a.position && a.position > 3 && a.position <= 20)
    .slice(0, 10);
  out.push('\n## Kansen (veel vertoningen, weinig kliks, positie 3-20)');
  if (opp.length === 0) out.push('- (geen duidelijke kansen in deze periode)');
  for (const a of opp) {
    out.push(`- "${a.key}": ${a.impressions} vertoningen, positie ${a.position.toFixed(1)}, CTR ${pct(a.clicks / a.impressions)}`);
  }

  // Oude URL's die Bing nog toont: teken dat de herindexering na de migratie loopt.
  const legacy = topPages.filter((a) => /\/(nl|en)\/|\/products\/|\/integrations\//.test(a.key));
  if (legacy.length > 0) {
    out.push('\n## Oude URL’s nog in de Bing-resultaten');
    for (const a of legacy.slice(0, 10)) {
      out.push(`- ${a.key.replace(/^https?:\/\/(www\.)?resolveit\.nl/, '')}: ${a.impressions} vertoningen`);
    }
  }

  const c = windows(crawl);
  out.push('\n## Indexering en crawl');
  if (c.current.length === 0) {
    out.push('- (geen crawldata in deze periode)');
  } else {
    const laatste = c.current[c.current.length - 1];
    out.push(`- In de index: ${laatste.InIndex ?? 'onbekend'} pagina’s`);
    out.push(`- Gecrawld: ${sum(c.current, 'CrawledPages')} pagina’s, ${sum(c.current, 'Code2xx')}x 2xx, ${sum(c.current, 'Code301')}x 301, ${sum(c.current, 'Code302')}x 302`);
    const e4 = sum(c.current, 'Code4xx');
    const e5 = sum(c.current, 'Code5xx');
    const blocked = sum(c.current, 'BlockedByRobotsTxt');
    const timeouts = sum(c.current, 'ConnectionTimeout') + sum(c.current, 'DnsFailures');
    out.push(`- Fouten: ${e4}x 4xx, ${e5}x 5xx, ${blocked}x geblokkeerd door robots.txt, ${timeouts}x timeout of DNS-fout`);
    out.push(`- Inkomende links volgens Bing: ${laatste.InLinks ?? 'onbekend'}`);
    if (e4 + e5 > 0) {
      out.push('  Let op: crawlfouten kosten indexering. Zoek de betreffende URL’s op in Bing Webmaster Tools onder Site Explorer.');
    }
  }

  console.log(out.join('\n'));
});
