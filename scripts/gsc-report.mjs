// Weekly Search Console snapshot: queries, pages, CTR and positions.
//
//   node scripts/gsc-report.mjs            # last 7 days
//   node scripts/gsc-report.mjs --days 28  # custom window
//
// Uses the same service account as scripts/ga.mjs; the account is a
// (restricted) user on the sc-domain:resolveit.nl property.
// Note: Search Console data lags roughly 2 days behind.

import { getAccessToken } from './ga.mjs';
import { main } from './run.mjs';

const SITE = 'sc-domain:resolveit.nl';

const daysArg = process.argv.indexOf('--days');
const days = daysArg > -1 ? Number(process.argv[daysArg + 1]) : 7;

const fmt = (d) => d.toISOString().slice(0, 10);
const end = new Date(Date.now() - 2 * 86400_000); // data lags ~2 days
const start = new Date(end.getTime() - (days - 1) * 86400_000);

async function query(body) {
  const token = await getAccessToken('https://www.googleapis.com/auth/webmasters.readonly');
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: fmt(start), endDate: fmt(end), ...body }),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`Search Console query mislukt: ${data.error?.message || JSON.stringify(data)}`);
  return data.rows || [];
}

main(async () => {
  const [totals, queries, pages] = await Promise.all([
    query({}),
    query({ dimensions: ['query'], rowLimit: 25 }),
    query({ dimensions: ['page'], rowLimit: 15 }),
  ]);

  const t = totals[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const pct = (v) => `${(v * 100).toFixed(1)}%`;
  const out = [];
  out.push(`# Search Console-rapport resolveit.nl, ${fmt(start)} t/m ${fmt(end)}\n`);
  out.push(`Kliks: ${t.clicks} | Vertoningen: ${t.impressions} | CTR: ${pct(t.ctr)} | Gem. positie: ${t.position.toFixed(1)}\n`);

  out.push('## Zoektermen (top 25)');
  for (const r of queries) {
    out.push(`- "${r.keys[0]}": ${r.clicks} kliks / ${r.impressions} vertoningen (CTR ${pct(r.ctr)}, positie ${r.position.toFixed(1)})`);
  }

  out.push('\n## Pagina’s (top 15)');
  for (const r of pages) {
    out.push(`- ${r.keys[0].replace('https://www.resolveit.nl', '')}: ${r.clicks} kliks / ${r.impressions} vertoningen (CTR ${pct(r.ctr)}, positie ${r.position.toFixed(1)})`);
  }

  // Opportunities: shown often, clicked rarely, ranking just off page 1.
  const opp = (await query({ dimensions: ['query'], rowLimit: 250 }))
    .filter((r) => r.impressions >= 20 && r.position > 5 && r.position <= 20 && r.ctr < 0.03)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);
  out.push('\n## Kansen (veel vertoningen, weinig kliks, positie 5-20)');
  if (opp.length === 0) out.push('- (geen duidelijke kansen in deze periode)');
  for (const r of opp) {
    out.push(`- "${r.keys[0]}": ${r.impressions} vertoningen, positie ${r.position.toFixed(1)}, CTR ${pct(r.ctr)}`);
  }

  console.log(out.join('\n'));
});
