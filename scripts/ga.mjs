// Shared Google Analytics Data API helpers.
//
// Authenticates as a service account (JSON key referenced from .env via
// GA_SERVICE_ACCOUNT_KEY) using a self-signed JWT, no npm dependencies.
// The service account must be added as Viewer on the GA4 property
// (Admin > Property access management).

import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function readEnv() {
  const env = {};
  const raw = readFileSync(resolve(projectRoot, '.env'), 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

export function loadServiceAccount() {
  const env = readEnv();
  const keyPath = env.GA_SERVICE_ACCOUNT_KEY;
  if (!keyPath) throw new Error('GA_SERVICE_ACCOUNT_KEY ontbreekt in .env');
  return {
    key: JSON.parse(readFileSync(resolve(projectRoot, keyPath), 'utf8')),
    propertyId: env.GA_PROPERTY_ID,
  };
}

const b64url = (input) =>
  Buffer.from(typeof input === 'string' ? input : JSON.stringify(input))
    .toString('base64url');

let cachedToken = null;

export async function getAccessToken(scope = 'https://www.googleapis.com/auth/analytics.readonly') {
  if (cachedToken && cachedToken.expires > Date.now() + 60_000 && cachedToken.scope === scope) {
    return cachedToken.token;
  }
  const { key } = loadServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  const header = b64url({ alg: 'RS256', typ: 'JWT' });
  const claims = b64url({
    iss: key.client_email,
    scope,
    aud: key.token_uri,
    iat: now,
    exp: now + 3600,
  });
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const signature = signer.sign(key.private_key).toString('base64url');
  const assertion = `${header}.${claims}.${signature}`;

  const res = await fetch(key.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Token ophalen mislukt: ${data.error_description || JSON.stringify(data)}`);
  cachedToken = { token: data.access_token, expires: Date.now() + data.expires_in * 1000, scope };
  return data.access_token;
}

// Run a GA4 Data API report. body = { dateRanges, dimensions, metrics, ... }
export async function runReport(body) {
  const { propertyId } = loadServiceAccount();
  const token = await getAccessToken();
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json();
  if (!res.ok) {
    const msg = data.error?.message || JSON.stringify(data);
    if (data.error?.status === 'PERMISSION_DENIED') {
      throw new Error(
        `Geen toegang tot de GA4-property. Voeg het service account toe als Viewer:\n` +
        `  GA4 > Beheer > Toegangsbeheer voor property > + > Gebruikers toevoegen\n` +
        `  e-mail: ${loadServiceAccount().key.client_email}\n(${msg})`,
      );
    }
    throw new Error(`GA4 runReport mislukt: ${msg}`);
  }
  return data;
}

// Convert a runReport response to an array of plain row objects.
export function rows(report) {
  const dims = (report.dimensionHeaders || []).map((h) => h.name);
  const mets = (report.metricHeaders || []).map((h) => h.name);
  return (report.rows || []).map((r) => {
    const o = {};
    dims.forEach((d, i) => (o[d] = r.dimensionValues[i].value));
    mets.forEach((m, i) => (o[m] = Number(r.metricValues[i].value)));
    return o;
  });
}
