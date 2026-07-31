// Shared helpers for the LinkedIn Community Management integration.
//
// Credentials live in .env (gitignored) and are read directly rather than via a
// dependency, so these scripts run with plain `node` and no install step.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENV_PATH = join(ROOT, '.env');

// LinkedIn requires a dated version header on every /rest/ call. Bumping this
// is the documented way to opt into a newer API surface.
export const LINKEDIN_VERSION = '202506';

export async function readEnv() {
  const raw = await readFile(ENV_PATH, 'utf8');
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

/**
 * Upsert keys in .env while preserving comments, ordering and unrelated lines.
 * Existing keys are rewritten in place; new keys are appended.
 */
export async function writeEnv(updates) {
  const raw = await readFile(ENV_PATH, 'utf8');
  const lines = raw.split(/\r?\n/);
  const remaining = { ...updates };

  const rewritten = lines.map((line) => {
    const m = line.match(/^([A-Z0-9_]+)=/);
    if (m && Object.prototype.hasOwnProperty.call(remaining, m[1])) {
      const key = m[1];
      const value = remaining[key];
      delete remaining[key];
      return `${key}=${value}`;
    }
    return line;
  });

  const added = Object.entries(remaining).map(([k, v]) => `${k}=${v}`);
  if (added.length) {
    // Keep exactly one blank line before the appended block.
    while (rewritten.length && rewritten[rewritten.length - 1] === '') rewritten.pop();
    rewritten.push('', ...added, '');
  }

  await writeFile(ENV_PATH, rewritten.join('\n'), 'utf8');
}

export function requireEnv(env, keys) {
  const missing = keys.filter((k) => !env[k]);
  if (missing.length) {
    throw new Error(
      `Ontbrekende variabelen in .env: ${missing.join(', ')}.\n` +
        'Zie .env.example en docs/linkedin-integratie.md.'
    );
  }
}

async function postForm(url, params) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`LinkedIn ${res.status}: ${body}`);
  return JSON.parse(body);
}

export function exchangeCode({ code, clientId, clientSecret, redirectUri }) {
  return postForm('https://www.linkedin.com/oauth/v2/accessToken', {
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
  });
}

export function refreshToken({ refreshToken: token, clientId, clientSecret }) {
  return postForm('https://www.linkedin.com/oauth/v2/accessToken', {
    grant_type: 'refresh_token',
    refresh_token: token,
    client_id: clientId,
    client_secret: clientSecret,
  });
}

/**
 * Access tokens last ~60 days. Refresh a little early so a run that starts just
 * before expiry does not fail halfway through.
 */
export async function getValidAccessToken(env) {
  requireEnv(env, ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET', 'LINKEDIN_ACCESS_TOKEN']);

  const expiresAt = Number(env.LINKEDIN_TOKEN_EXPIRES_AT || 0);
  const dayMs = 24 * 60 * 60 * 1000;
  const stillValid = expiresAt && Date.now() < expiresAt - dayMs;
  if (stillValid) return env.LINKEDIN_ACCESS_TOKEN;

  if (!env.LINKEDIN_REFRESH_TOKEN) {
    throw new Error(
      'Het access token is (bijna) verlopen en er is geen refresh token opgeslagen.\n' +
        'Doorloop de autorisatie opnieuw: node scripts/linkedin-auth.mjs <code>'
    );
  }

  const tokens = await refreshToken({
    refreshToken: env.LINKEDIN_REFRESH_TOKEN,
    clientId: env.LINKEDIN_CLIENT_ID,
    clientSecret: env.LINKEDIN_CLIENT_SECRET,
  });

  await persistTokens(tokens);
  return tokens.access_token;
}

export async function persistTokens(tokens) {
  const updates = {
    LINKEDIN_ACCESS_TOKEN: tokens.access_token,
    LINKEDIN_TOKEN_EXPIRES_AT: String(Date.now() + Number(tokens.expires_in) * 1000),
  };
  if (tokens.refresh_token) updates.LINKEDIN_REFRESH_TOKEN = tokens.refresh_token;
  await writeEnv(updates);
}

export async function apiGet(path, accessToken) {
  const res = await fetch(`https://api.linkedin.com/rest/${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'LinkedIn-Version': LINKEDIN_VERSION,
      'X-Restli-Protocol-Version': '2.0.0',
    },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`LinkedIn GET ${path} ${res.status}: ${body}`);
  return JSON.parse(body);
}

export async function apiPost(path, accessToken, payload) {
  const res = await fetch(`https://api.linkedin.com/rest/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'LinkedIn-Version': LINKEDIN_VERSION,
      'X-Restli-Protocol-Version': '2.0.0',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`LinkedIn POST ${path} ${res.status}: ${body}`);
  // Created posts return their URN in a header, with an empty body.
  return { id: res.headers.get('x-restli-id'), body };
}

/** Organizations the authorised member administers. */
export async function listAdministeredOrganizations(accessToken) {
  const data = await apiGet(
    'organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED' +
      '&projection=(elements*(organization~(id,localizedName,vanityName)))',
    accessToken
  );
  return (data.elements || []).map((el) => {
    const org = el['organization~'] || {};
    return {
      urn: el.organization,
      id: org.id,
      name: org.localizedName,
      vanityName: org.vanityName,
    };
  });
}
