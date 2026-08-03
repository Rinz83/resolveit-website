// Ping IndexNow (Bing, and via Bing also ChatGPT/Copilot search) with all
// site URLs so new or changed pages get indexed within hours instead of weeks.
// Google ignores IndexNow; for Google use the sitemap + Search Console.
//
//   node scripts/indexnow.mjs            # submit every URL from the sitemap
//   node scripts/indexnow.mjs --dry-run  # show what would be submitted
//   node scripts/indexnow.mjs /blog/x /  # submit specific paths only
//
// The key file must be publicly reachable at https://www.resolveit.nl/<KEY>.txt
// (it lives in public/, so it deploys with the site). The key is public by
// design; it only proves the submitter controls the host.

import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from './run.mjs';

const HOST = 'www.resolveit.nl';
const SITEMAP = `https://${HOST}/sitemap.xml`;

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const keyFile = readdirSync(resolve(projectRoot, 'public'))
  .find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('Geen IndexNow-sleutelbestand (<hex>.txt) gevonden in public/');
const KEY = readFileSync(resolve(projectRoot, 'public', keyFile), 'utf8').trim();

const dryRun = process.argv.includes('--dry-run');
const pathArgs = process.argv.slice(2).filter((a) => a.startsWith('/'));

main(async () => {
  let urls;
  if (pathArgs.length > 0) {
    urls = pathArgs.map((p) => `https://${HOST}${p}`);
  } else {
    const xml = await (await fetch(SITEMAP)).text();
    urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (urls.length === 0) throw new Error(`Geen URL's gevonden in ${SITEMAP}`);
  }

  console.log(`${urls.length} URL's${dryRun ? ' (dry-run, niets verstuurd)' : ''}`);
  if (dryRun) { urls.forEach((u) => console.log(`  ${u}`)); return; }

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${keyFile}`,
      urlList: urls,
    }),
  });
  // 200 = verwerkt, 202 = geaccepteerd (sleutel wordt nog gevalideerd)
  if (res.status === 200 || res.status === 202) {
    console.log(`IndexNow: ${res.status} ${res.statusText}. ${urls.length} URL's aangemeld.`);
  } else {
    throw new Error(`IndexNow-ping mislukt: ${res.status} ${res.statusText} ${await res.text()}`);
  }
});
