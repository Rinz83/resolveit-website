// Combine raw Salesforce SOQL results into secrets/partner-leads.json, the
// plain input for scripts/partner-leads-encrypt.mjs. Part of the daily
// partner-leads refresh.
//
//   node scripts/partner-leads-transform.mjs --leads a.json [--leads b.json ...] [--tasks t.json] [--events e.json]
//
// Lead queries can come back chunked (done: false), so multiple lead files
// (fetched with OFFSET) are merged and deduplicated on Id. Tasks and Events
// are separate flat queries on WhoId, joined here per lead.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from './run.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const parseArgs = () => {
  const files = { leads: [], tasks: [], events: [] };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    if (!(key in files) || !argv[i + 1]) {
      throw new Error('Gebruik: node scripts/partner-leads-transform.mjs --leads a.json [--leads b.json] [--tasks t.json] [--events e.json]');
    }
    files[key].push(argv[i + 1]);
  }
  if (files.leads.length === 0) throw new Error('Minimaal één --leads bestand is verplicht');
  return files;
};

const readRecords = (paths) => paths.flatMap((p) => {
  const raw = JSON.parse(readFileSync(p, 'utf8'));
  if (!Array.isArray(raw.records)) throw new Error(`Geen records-array in ${p}`);
  return raw.records;
});

main(async () => {
  const files = parseArgs();

  const leadRecords = new Map();
  for (const r of readRecords(files.leads)) leadRecords.set(r.Id, r);

  const activitiesByLead = new Map();
  const addActivity = (whoId, act) => {
    if (!activitiesByLead.has(whoId)) activitiesByLead.set(whoId, []);
    activitiesByLead.get(whoId).push(act);
  };
  for (const t of readRecords(files.tasks)) {
    addActivity(t.WhoId, {
      subject: t.Subject || '(zonder onderwerp)',
      date: t.ActivityDate,
      type: t.TaskSubtype === 'Email' ? 'E-mail' : t.TaskSubtype === 'Call' ? 'Telefoon' : 'Taak',
      open: t.Status ? t.Status !== 'Completed' : false,
    });
  }
  for (const e of readRecords(files.events)) {
    addActivity(e.WhoId, {
      subject: e.Subject || '(zonder onderwerp)',
      date: e.ActivityDate,
      type: 'Afspraak',
      open: false,
    });
  }

  const leads = [...leadRecords.values()]
    .sort((a, b) => String(b.CreatedDate).localeCompare(String(a.CreatedDate)))
    .map((r) => ({
      name: [r.FirstName, r.LastName].filter(Boolean).join(' '),
      company: r.Company,
      email: r.Email,
      phone: r.Phone || '',
      address: [r.Street, [r.PostalCode, r.City].filter(Boolean).join(' '), r.Country]
        .filter(Boolean).join(', '),
      status: r.IsConverted ? 'Geconverteerd' : r.Status,
      converted: !!r.IsConverted,
      source: r.LeadSource || r.pi__utm_source__c || '',
      utmSource: r.pi__utm_source__c || '',
      utmMedium: r.pi__utm_medium__c || '',
      utmCampaign: r.pi__utm_campaign__c || '',
      campaign: r.pi__utm_campaign__c || '',
      product: r.Product__c || '',
      gclid: r.GCLID__c || '',
      // Lead heeft (nog) geen msclkid-veld in Salesforce; zodra dat bestaat en
      // door Pardot gevuld wordt, hier de veldnaam invullen.
      msclkid: r.MSCLKID__c || '',
      description: r.Description || '',
      comments: [r.pi__comments__c, r.pi__notes__c].filter(Boolean).join('\n\n'),
      score: r.pi__score__c,
      grade: r.pi__grade__c || '',
      lastActivity: r.pi__last_activity__c || (r.LastActivityDate ? `${r.LastActivityDate}T00:00:00Z` : null),
      created: r.CreatedDate,
      activities: (activitiesByLead.get(r.Id) || [])
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))),
    }));

  const outPath = resolve(projectRoot, 'secrets', 'partner-leads.json');
  writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), leads }, null, 1));
  const withActs = leads.filter((l) => l.activities.length > 0).length;
  console.log(`${leads.length} leads (${withActs} met activiteiten) -> ${outPath}`);
});
