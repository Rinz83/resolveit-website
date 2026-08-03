// Weekly GA4 snapshot: traffic, sources, landing pages and key events.
//
//   node scripts/ga-report.mjs            # last 7 days
//   node scripts/ga-report.mjs --days 28  # custom window
//
// Prints a markdown report to stdout so it can be piped into a file or
// read by the weekly analysis task.

import { runReport, rows } from './ga.mjs';
import { main } from './run.mjs';

const daysArg = process.argv.indexOf('--days');
const days = daysArg > -1 ? Number(process.argv[daysArg + 1]) : 7;
const range = [{ startDate: `${days}daysAgo`, endDate: 'today' }];

const KEY_EVENTS = [
  'generate_lead', 'form_start', 'begin_appointment', 'schedule_appointment',
  'view_contact', 'BL_Calendly_klik', 'L_Klik_naar_contact', 'L_Telefoon_klik',
  'L_Mail_klik', 'L_Sollicitatie_start', 'L_Kwalitatieve_websitebezoeker_30_seconden',
];

main(async () => {
  const [totals, sources, landing, events, devices] = await Promise.all([
    runReport({
      dateRanges: range,
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'engagementRate' }, { name: 'averageSessionDuration' }],
    }),
    runReport({
      dateRanges: range,
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'engagementRate' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    }),
    runReport({
      dateRanges: range,
      dimensions: [{ name: 'landingPage' }],
      metrics: [{ name: 'sessions' }, { name: 'engagementRate' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 15,
    }),
    runReport({
      dateRanges: range,
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: { fieldName: 'eventName', inListFilter: { values: KEY_EVENTS } },
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    }),
    runReport({
      dateRanges: range,
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }, { name: 'engagementRate' }],
    }),
  ]);

  const t = rows(totals)[0] || {};
  const pct = (v) => `${Math.round((v || 0) * 100)}%`;
  const out = [];
  out.push(`# GA4-rapport resolveit.nl, laatste ${days} dagen\n`);
  out.push(`Sessies: ${t.sessions ?? 0} | Gebruikers: ${t.totalUsers ?? 0} | Engagement: ${pct(t.engagementRate)} | Gem. sessieduur: ${Math.round(t.averageSessionDuration ?? 0)}s\n`);

  out.push('## Kanalen');
  for (const r of rows(sources)) out.push(`- ${r.sessionDefaultChannelGroup}: ${r.sessions} sessies (engagement ${pct(r.engagementRate)})`);

  out.push('\n## Landingspagina’s (top 15)');
  for (const r of rows(landing)) out.push(`- ${r.landingPage}: ${r.sessions} sessies (engagement ${pct(r.engagementRate)})`);

  out.push('\n## Conversie-events');
  const ev = rows(events);
  if (ev.length === 0) out.push('- (nog geen key events geregistreerd in deze periode)');
  for (const r of ev) out.push(`- ${r.eventName}: ${r.eventCount}`);

  out.push('\n## Apparaten');
  for (const r of rows(devices)) out.push(`- ${r.deviceCategory}: ${r.sessions} sessies (engagement ${pct(r.engagementRate)})`);

  console.log(out.join('\n'));
});
