// Server endpoint for the partner leads page (/partner/leads).
//
// POST { code } -> the decrypted leads JSON when the code matches, 401
// otherwise. The code check and the decryption both happen server-side: the
// browser never receives the data (or the key) without a valid code. The
// encrypted payload is produced by scripts/partner-leads-encrypt.mjs and
// committed as src/data/partner-leads.enc.json; PARTNER_LEADS_KEY and
// PARTNER_LEADS_CODE live in the Vercel environment variables.
export const prerender = false;

import { createDecipheriv, timingSafeEqual } from 'node:crypto';
import encPayload from '../../data/partner-leads.enc.json';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  // Never index this endpoint, and never cache the response anywhere shared.
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'no-store',
};

const codeMatches = (given, expected) => {
  const a = Buffer.from(String(given ?? ''));
  const b = Buffer.from(String(expected ?? ''));
  return a.length === b.length && timingSafeEqual(a, b);
};

export async function POST({ request }) {
  const key = process.env.PARTNER_LEADS_KEY ?? import.meta.env.PARTNER_LEADS_KEY;
  const code = process.env.PARTNER_LEADS_CODE ?? import.meta.env.PARTNER_LEADS_CODE;
  if (!key || !code) {
    return new Response(JSON.stringify({ error: 'Niet geconfigureerd' }), { status: 503, headers: HEADERS });
  }

  let body;
  try { body = await request.json(); } catch { body = {}; }

  if (!codeMatches(body.code, code)) {
    // A flat delay keeps rapid guessing slow without needing shared state.
    await new Promise((r) => setTimeout(r, 750));
    return new Response(JSON.stringify({ error: 'Onjuiste code' }), { status: 401, headers: HEADERS });
  }

  try {
    const decipher = createDecipheriv(
      'aes-256-gcm',
      Buffer.from(key, 'hex'),
      Buffer.from(encPayload.iv, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(encPayload.tag, 'base64'));
    const plain = Buffer.concat([
      decipher.update(Buffer.from(encPayload.data, 'base64')),
      decipher.final(),
    ]).toString('utf8');
    return new Response(plain, { status: 200, headers: HEADERS });
  } catch {
    return new Response(JSON.stringify({ error: 'Ontsleutelen mislukt (sleutel en databestand lopen uiteen)' }), { status: 500, headers: HEADERS });
  }
}
