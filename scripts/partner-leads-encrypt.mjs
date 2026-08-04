// Encrypt the partner leads export for the /partner/leads page.
//
// The repo is PUBLIC, so lead data (names, e-mail addresses) must never be
// committed in readable form. The daily refresh writes a plain export to
// secrets/partner-leads.json (gitignored), and this script encrypts it with
// AES-256-GCM into src/data/partner-leads.enc.json, which IS committed and
// deploys with the site. Only the serverless API route can decrypt it, using
// the same PARTNER_LEADS_KEY that lives in .env locally and in the Vercel
// environment variables. Rotating the key means re-running this script and
// updating the Vercel env var together.
//
//   node scripts/partner-leads-encrypt.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCipheriv, randomBytes } from 'node:crypto';
import { main } from './run.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const readEnv = () => {
  const env = {};
  for (const line of readFileSync(resolve(projectRoot, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
};

main(async () => {
  const key = readEnv().PARTNER_LEADS_KEY;
  if (!key || key.length !== 64) {
    throw new Error('PARTNER_LEADS_KEY ontbreekt in .env of is geen 64-tekens hex-sleutel');
  }

  const plainPath = resolve(projectRoot, 'secrets', 'partner-leads.json');
  const plain = readFileSync(plainPath, 'utf8');
  JSON.parse(plain); // fail early on malformed input

  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);

  const outPath = resolve(projectRoot, 'src', 'data', 'partner-leads.enc.json');
  writeFileSync(outPath, JSON.stringify({
    v: 1,
    alg: 'aes-256-gcm',
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    data: encrypted.toString('base64'),
  }) + '\n');

  console.log(`Versleuteld: ${plain.length} bytes -> ${outPath}`);
});
